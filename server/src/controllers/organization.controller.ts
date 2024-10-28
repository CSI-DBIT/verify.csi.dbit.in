import { Elysia } from "elysia";
import { prisma } from "../configs/prisma.config";
import { jwtOrgAccessTokenConfig } from "../configs/jwt.config";
import {
  addEventCategorySchema,
  addEventSchema,
  addSocialUrlSchema,
  updatedOrganizationSchema,
  updateEventCategorySchema,
  updateEventSchema,
  updateMembershipSchema,
  updateSocialUrlSchema,
} from "../configs/schemas";

export const organizationController = (app: Elysia) =>
  app.group("/organization", (app) =>
    app
      .use(jwtOrgAccessTokenConfig)
      .derive(async ({ headers, jwt_org_access_token }) => {
        const auth_header = headers["authorization"];
        const bearer_token =
          auth_header && auth_header.startsWith("Bearer ")
            ? auth_header.slice(7)
            : null;
        if (!bearer_token) return { organization: null };
        const organization = await jwt_org_access_token.verify(bearer_token);
        return { organization };
      })
      .guard(
        {
          beforeHandle({ organization, set }) {
            if (!organization) return (set.status = "Unauthorized");
          },
        },
        (app) =>
          // Fetch organization information by orgId
          app.group("/:orgId", (app) =>
            app
              .get("", async ({ set, params }) => {
                try {
                  const { orgId } = params;
                  if (!orgId) {
                    set.status = 422;
                    return {
                      message: "Required params not found",
                      status: 422,
                    };
                  }

                  const organization = await prisma.organization.findUnique({
                    where: { orgId },
                  });

                  if (!organization) {
                    set.status = 404;
                    return {
                      message: `Organization with id: ${orgId} was not found`,
                      status: 404,
                    };
                  }
                  set.status = 200;
                  return organization;
                } catch (e) {
                  set.status = 500;
                  return {
                    message: "Unable to retrieve the resource!",
                    status: 500,
                  };
                }
              })

              // Update organization information by id
              .guard(
                {
                  body: updatedOrganizationSchema,
                },
                (app) =>
                  app.patch("", async ({ params, body, set }) => {
                    try {
                      const { orgId } = params;

                      const updatedOrganization =
                        await prisma.organization.update({
                          where: { orgId },
                          data: {
                            ...body,
                          },
                        });

                      set.status = 200;
                      return updatedOrganization;
                    } catch (e) {
                      set.status = 500;
                      return {
                        message: "Unable to update resource!",
                        status: 500,
                      };
                    }
                  })
              )

              // Membership Routes
              .group("/membership", (app) =>
                app
                  // Get all memberships of an organization
                  .get("", async ({ set, params }) => {
                    try {
                      const { orgId } = params;

                      const memberships = await prisma.membership.findMany({
                        where: { organizationId: orgId, deletedAt: null },
                        include: {
                          member: true, // Include member details if needed
                        },
                      });

                      set.status = 200;
                      return memberships;
                    } catch (e) {
                      set.status = 500;
                      return {
                        message: "Unable to retrieve memberships!",
                        status: 500,
                      };
                    }
                  })

                  // Update a membership
                  .guard(
                    {
                      body: updateMembershipSchema, // Schema for validating membership update
                    },
                    (app) =>
                      app.patch(
                        "/:membershipId",
                        async ({ params, body, set }) => {
                          try {
                            const { membershipId } = params;
                            const { status } = body; // Example field that can be updated

                            const updatedMembership =
                              await prisma.membership.update({
                                where: { id: membershipId },
                                data: {
                                  status, // Only update the status for example, add other fields as needed
                                },
                              });

                            set.status = 200;
                            return updatedMembership;
                          } catch (e) {
                            set.status = 500;
                            return {
                              message: "Unable to update membership!",
                              status: 500,
                            };
                          }
                        }
                      )
                  )

                  // Delete a membership by ID
                  .delete("/:membershipId", async ({ params, set }) => {
                    try {
                      const { membershipId } = params;

                      await prisma.membership.update({
                        where: { id: membershipId },
                        data: {
                          deletedAt: new Date(),
                        },
                      });

                      set.status = 200;
                      return {
                        message: "Membership deleted successfully",
                        status: 200,
                      };
                    } catch (e) {
                      set.status = 500;
                      return {
                        message: "Unable to delete membership!",
                        status: 500,
                      };
                    }
                  })
              )

              // Event Routes
              .group("/events", (app) =>
                app
                  // Get all events of an organization
                  .get("", async ({ set, params }) => {
                    try {
                      const { orgId } = params;

                      const events = await prisma.event.findMany({
                        where: { organizationId: orgId, deletedAt: null },
                        include: {
                          category: true,
                          participants: {
                            include: {
                              certificate: true,
                            },
                          },
                        },
                      });

                      set.status = 200;
                      return events;
                    } catch (e) {
                      console.error(e); // Log error
                      set.status = 500;
                      return {
                        message: "Unable to retrieve events!",
                        status: 500,
                      };
                    }
                  })

                  // Create a new event for an organization
                  .guard(
                    {
                      body: addEventSchema,
                    },
                    (app) =>
                      app.post("", async ({ params, body, set }) => {
                        try {
                          const { orgId } = params;
                          const {
                            eventName,
                            description,
                            eventBannerImg,
                            categoryId,
                            isMemberOnly,
                            eventDate,
                          } = body;

                          const newEvent = await prisma.event.create({
                            data: {
                              eventName,
                              description,
                              eventBannerImg,
                              categoryId,
                              isMemberOnly,
                              eventDate,
                              organizationId: orgId,
                            },
                          });

                          set.status = 201;
                          return newEvent;
                        } catch (e) {
                          console.error(e); // Log error
                          set.status = 500;
                          return {
                            message: "Unable to add new event!",
                            status: 500,
                          };
                        }
                      })
                  )

                  // Update an existing event
                  .guard(
                    {
                      body: updateEventSchema,
                    },
                    (app) =>
                      app.patch("/:eventId", async ({ params, body, set }) => {
                        try {
                          const { eventId } = params;
                          const {
                            eventName,
                            description,
                            eventBannerImg,
                            categoryId,
                            isMemberOnly,
                            eventDate,
                          } = body;

                          // Check if the event exists
                          const eventExists = await prisma.event.findUnique({
                            where: { eventId, deletedAt: null },
                          });
                          if (!eventExists) {
                            set.status = 404;
                            return {
                              message: "Event not found!",
                              status: 404,
                            };
                          }

                          const updatedEvent = await prisma.event.update({
                            where: { eventId },
                            data: {
                              eventName,
                              description,
                              eventBannerImg,
                              categoryId,
                              isMemberOnly,
                              eventDate,
                            },
                          });

                          set.status = 200;
                          return updatedEvent;
                        } catch (e) {
                          console.error(e); // Log error
                          set.status = 500;
                          return {
                            message: "Unable to update event!",
                            status: 500,
                          };
                        }
                      })
                  )

                  // Delete an event by ID
                  .delete("/:eventId", async ({ params, set }) => {
                    try {
                      const { eventId } = params;

                      // Check if the event exists
                      const eventExists = await prisma.event.findUnique({
                        where: { eventId, deletedAt: null },
                      });
                      if (!eventExists) {
                        set.status = 404;
                        return {
                          message: "Event not found!",
                          status: 404,
                        };
                      }

                      await prisma.event.update({
                        where: { eventId },
                        data: { deletedAt: new Date() },
                      });

                      set.status = 200;
                      return {
                        message: "Event deleted successfully",
                        status: 200,
                      };
                    } catch (e) {
                      console.error(e); // Log error
                      set.status = 500;
                      return {
                        message: "Unable to delete event!",
                        status: 500,
                      };
                    }
                  })
              )

              // Event categories Routes
              .group("/event-categories", (app) =>
                app
                  // Get event categories of an organization
                  .get("", async ({ set, params }) => {
                    try {
                      const { orgId } = params;

                      const eventCategories =
                        await prisma.eventCategory.findMany({
                          where: { organizationId: orgId, deletedAt: null },
                        });

                      set.status = 200;
                      return eventCategories;
                    } catch (e) {
                      console.error(e); // Log error
                      set.status = 500;
                      return {
                        message: "Unable to retrieve event categories!",
                        status: 500,
                      };
                    }
                  })

                  // Add new event categories
                  .guard(
                    {
                      body: addEventCategorySchema,
                    },
                    (app) =>
                      app.post("", async ({ params, body, set }) => {
                        try {
                          const { orgId } = params;
                          const { names } = body;

                          const newCategories = await Promise.all(
                            names.map(async (name) => {
                              return await prisma.eventCategory.create({
                                data: {
                                  name,
                                  organizationId: orgId,
                                },
                              });
                            })
                          );

                          set.status = 201;
                          return newCategories;
                        } catch (e) {
                          console.error(e); // Log error
                          set.status = 500;
                          return {
                            message: "Unable to add new event categories!",
                            status: 500,
                          };
                        }
                      })
                  )

                  // Update existing event categories
                  .guard(
                    {
                      body: updateEventCategorySchema,
                    },
                    (app) =>
                      app.patch("", async ({ body, set }) => {
                        try {
                          const { categories } = body;

                          const updatedCategories = await Promise.all(
                            categories.map(async (category) => {
                              return await prisma.eventCategory.update({
                                where: {
                                  categoryId: category.categoryId,
                                  deletedAt: null,
                                }, // Check for deletedAt
                                data: { name: category.name },
                              });
                            })
                          );

                          set.status = 200;
                          return updatedCategories;
                        } catch (e) {
                          console.error(e); // Log error
                          set.status = 500;
                          return {
                            message: "Unable to update event categories!",
                            status: 500,
                          };
                        }
                      })
                  )

                  // Delete an event category by ID
                  .delete("/:categoryId", async ({ params, set }) => {
                    try {
                      const { categoryId } = params;

                      await prisma.eventCategory.update({
                        where: { categoryId, deletedAt: null }, // Ensure not already deleted
                        data: { deletedAt: new Date() },
                      });

                      set.status = 200;
                      return {
                        message: "Event Category deleted successfully",
                        status: 200,
                      };
                    } catch (e) {
                      console.error(e); // Log error
                      set.status = 500;
                      return {
                        message: "Unable to delete event category!",
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
                      const { orgId } = params;

                      const socialUrls = await prisma.socialUrl.findMany({
                        where: { organizationId: orgId, deletedAt: null },
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
                          const { orgId } = params;
                          const { urls } = body; // Array of { platform, url }

                          const newSocialUrls = await Promise.all(
                            urls.map(async ({ platform, url }) => {
                              return await prisma.socialUrl.create({
                                data: {
                                  platform,
                                  url,
                                  organizationId: orgId,
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
          )
      )
  );
