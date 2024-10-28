import { Elysia } from "elysia";
import { prisma } from "../configs/prisma.config";
import {
  addSocialUrlSchema,
  createMembershipSchema,
  updateMemberSchema,
  updateSocialUrlSchema,
} from "../configs/schemas";
import { jwtMemberAccessTokenConfig } from "../configs/jwt.config";

export const membersController = (app: Elysia) =>
  app.group("/member", (app) =>
    app
      .use(jwtMemberAccessTokenConfig)
      .derive(async ({ headers, jwt_member_access_token }) => {
        const auth_header = headers["authorization"];
        const bearers_token =
          auth_header && auth_header.startsWith("Bearer ")
            ? auth_header.slice(7)
            : null;
        if (!bearers_token) return { member: null };
        const member = await jwt_member_access_token.verify(bearers_token);
        return { member };
      })
      // Validating required properties using Guard schema
      .guard(
        {
          beforeHandle({ member, set }) {
            if (!member) return (set.status = "Unauthorized");
          },
        },
        (app) =>
          app.group("/:memberId", (app) =>
            app
              .get("", async ({ params }) => {
                const { memberId } = params;

                try {
                  // Fetch the member details
                  const member = await prisma.member.findUnique({
                    where: { memberId },
                    include: {
                      memberships: {
                        include: {
                          organization: true, // Include organization details
                        },
                      },
                    },
                  });

                  if (!member) {
                    return {
                      message: "Member not found!",
                      status: 404,
                    };
                  }

                  // Fetch events attended by the member
                  const eventsAttended = await prisma.event.findMany({
                    where: {
                      participants: {
                        some: {
                          email: member.email, // Matching by email
                        },
                      },
                    },
                    include: {
                      category: true, // Include event category
                    },
                  });

                  // Fetch certificates received by the member for attended events
                  const certificates = await prisma.certificate.findMany({
                    where: {
                      participant: {
                        some: {
                          email: member.email, // Matching by email
                        },
                      },
                    },
                  });

                  // Extract organization details from memberships
                  const organizations = member.memberships.map(
                    (membership) => membership.organization
                  );

                  return {
                    member,
                    eventsAttended,
                    certificates,
                    organizations,
                  };
                } catch (error) {
                  return {
                    message: "Unable to fetch member details!",
                    status: 500,
                  };
                }
              })
              .guard(
                {
                  body: updateMemberSchema,
                },
                (app) =>
                  app.patch("", async ({ params, body }) => {
                    const { memberId } = params;
                    try {
                      const updatedMember = await prisma.member.update({
                        where: { memberId },
                        data: {
                          ...body,
                        },
                      });

                      return {
                        message: "Member updated successfully!",
                        member: updatedMember,
                      };
                    } catch (error) {
                      return {
                        message: "Unable to update member info!",
                        status: 500,
                      };
                    }
                  })
              )
              // Social URL Routes
              .group("/social-urls", (app) =>
                app
                  // Get social URLs of an organization
                  .get("", async ({ set, params }) => {
                    try {
                      const { memberId } = params;

                      const socialUrls = await prisma.socialUrl.findMany({
                        where: { memberId: memberId, deletedAt: null },
                      });

                      set.status = 200;
                      return socialUrls;
                    } catch (e) {
                      console.error(e); // Log error
                      set.status = 500;
                      return {
                        message: "Unable to retrieve social URLs!",
                        status: 500,
                      };
                    }
                  })

                  // Add new social URLs
                  .guard(
                    {
                      body: addSocialUrlSchema,
                    },
                    (app) =>
                      app.post("", async ({ params, body, set }) => {
                        try {
                          const { memberId } = params;
                          const { urls } = body; // Array of { urlId, url }

                          const newSocialUrls = await Promise.all(
                            urls.map(async ({ platform, url }) => {
                              return await prisma.socialUrl.create({
                                data: {
                                  platform,
                                  url,
                                  memberId: memberId,
                                },
                              });
                            })
                          );

                          set.status = 201;
                          return newSocialUrls;
                        } catch (e) {
                          console.error(e); // Log error
                          set.status = 500;
                          return {
                            message: "Unable to add new social URLs!",
                            status: 500,
                          };
                        }
                      })
                  )

                  // Update existing social URLs
                  .guard(
                    {
                      body: updateSocialUrlSchema,
                    },
                    (app) =>
                      app.patch("", async ({ body, set }) => {
                        try {
                          const { urls } = body; // Array of { urlId, url }

                          const updatedUrls = await Promise.all(
                            urls.map(async ({ urlId, url }) => {
                              return await prisma.socialUrl.update({
                                where: { urlId, deletedAt: null }, // Ensure URL isn't deleted
                                data: { url },
                              });
                            })
                          );

                          set.status = 200;
                          return updatedUrls;
                        } catch (e) {
                          console.error(e); // Log error
                          set.status = 500;
                          return {
                            message: "Unable to update social URLs!",
                            status: 500,
                          };
                        }
                      })
                  )

                  // Delete a social URL by ID
                  .delete("/:urlId", async ({ params, set }) => {
                    try {
                      const { urlId } = params;

                      await prisma.socialUrl.update({
                        where: { urlId, deletedAt: null }, // Ensure URL isn't already deleted
                        data: { deletedAt: new Date() },
                      });

                      set.status = 200;
                      return {
                        message: "Social URL deleted successfully",
                        status: 200,
                      };
                    } catch (e) {
                      console.error(e); // Log error
                      set.status = 500;
                      return {
                        message: "Unable to delete social URL!",
                        status: 500,
                      };
                    }
                  })
              )
              .guard(
                {
                  body: createMembershipSchema,
                },
                (app) =>
                  app.post("/join", async ({ body, set, params }) => {
                    const { memberId } = params;
                    const { organizationId } = body;

                    try {
                      const existingOrganization =
                        await prisma.organization.findUnique({
                          where: {
                            orgId: organizationId,
                          },
                        });

                      if (!existingOrganization) {
                        set.status = 409; // not found
                        return {
                          message: "Organization not found!",
                        };
                      }

                      // Check if the member is already a member of the organization
                      const existingMembership =
                        await prisma.membership.findFirst({
                          where: {
                            memberId,
                            organizationId: existingOrganization.orgId,
                          },
                        });

                      if (existingMembership) {
                        set.status = 409; // Conflict
                        return {
                          message: "Already a member of this organization!",
                        };
                      }

                      // Create the new membership
                      const newMembership = await prisma.membership.create({
                        data: {
                          memberId: memberId, // Use the correct member ID
                          organizationId: existingOrganization.orgId,
                        },
                      });

                      set.status = 201; // Created
                      return {
                        message: "Membership created successfully!",
                        membership: newMembership,
                      };
                    } catch (error) {
                      console.error(error);
                      set.status = 500;
                      return {
                        message: "Unable to join organization!",
                      };
                    }
                  })
              )
          )
      )
  );
