import { Elysia } from "elysia";
import {
  comparePassword,
  getExpTimestamp,
  hashPassword,
} from "../configs/utils";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "../configs/constants";
import {
  loginOrganizationSchema,
  signupOrganizationSchema,
} from "../configs/schemas";
import { prisma } from "../configs/prisma.config";
import {
  jwtOrgAccessTokenConfig,
  jwtOrgRefreshTokenConfig,
} from "../configs/jwt.config";

export const organizationAuthController = (app: Elysia) =>
  app.group("/organization-auth", (app) =>
    app
      .use(jwtOrgAccessTokenConfig)
      .use(jwtOrgRefreshTokenConfig)
      .guard(
        {
          body: signupOrganizationSchema,
        },
        (app) =>
          app.post(
            "/signup",
            async ({
              set,
              body,
              jwt_org_access_token,
              jwt_org_refresh_token,
              cookie: { refresh_token },
            }) => {
              try {
                const { orgName, description, email, password } = body;

                // Check if organization already exists
                const existingOrganization =
                  await prisma.organization.findUnique({
                    where: { email },
                  });

                if (existingOrganization) {
                  set.status = 422;
                  return {
                    message: "Organization with this email already exists!",
                    status: 422,
                  };
                }

                // Hash password and create organization
                const hashedPassword = await hashPassword(password);
                const newOrganization = await prisma.organization.create({
                  data: {
                    orgName,
                    description,
                    email,
                    password: hashedPassword,
                  },
                });

                // Define default event categories
                const defaultCategories = [
                  { name: "Conference" },
                  { name: "Workshop" },
                  { name: "Seminar" },
                  { name: "Networking" },
                  { name: "Webinar" },
                ];

                // Create default event categories for the new organization
                await Promise.all(
                  defaultCategories.map((category) =>
                    prisma.eventCategory.create({
                      data: {
                        name: category.name,
                        organizationId: newOrganization.orgId, // Link the category to the new organization
                      },
                    })
                  )
                );

                // Generate tokens
                const accessToken = await jwt_org_access_token.sign({
                  orgId: newOrganization.orgId,
                  email: newOrganization.email,
                  exp: getExpTimestamp(ACCESS_TOKEN_EXP),
                });
                const refreshToken = await jwt_org_refresh_token.sign({
                  orgId: newOrganization.orgId,
                  email: newOrganization.email,
                  exp: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                // Store refresh token
                await prisma.organization.update({
                  where: { orgId: newOrganization.orgId },
                  data: { refreshToken },
                });

                // Set cookie for refresh token
                refresh_token.set({
                  value: refreshToken,
                  httpOnly: true,
                  maxAge: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                set.status = 201;
                return {
                  message: "Organization added successfully",
                  status: 201,
                  accessToken,
                };
              } catch (error) {
                set.status = 500;
                return {
                  message: "Unable to save entry to the database!",
                  status: 500,
                  error,
                };
              }
            }
          )
      )
      .guard(
        {
          body: loginOrganizationSchema,
        },
        (app) =>
          app.post(
            "/login",
            async ({
              set,
              body,
              jwt_org_access_token,
              jwt_org_refresh_token,
              cookie: { refresh_token },
            }) => {
              try {
                const { email, password } = body;

                // Fetch organization from database
                const organization = await prisma.organization.findUnique({
                  where: { email },
                });

                if (
                  !organization ||
                  !(await comparePassword(password, organization.password))
                ) {
                  set.status = 401;
                  return { status: 401, message: "Invalid credentials" };
                }

                // Generate tokens
                const accessToken = await jwt_org_access_token.sign({
                  orgId: organization.orgId,
                  email: organization.email,
                  exp: getExpTimestamp(ACCESS_TOKEN_EXP),
                });
                const refreshToken = await jwt_org_refresh_token.sign({
                  orgId: organization.orgId,
                  email: organization.email,
                  exp: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                // Update organization refresh token
                await prisma.organization.update({
                  where: { orgId: organization.orgId },
                  data: { refreshToken },
                });

                refresh_token.set({
                  value: refreshToken,
                  httpOnly: true,
                  maxAge: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                set.status = 200;
                return {
                  message: "Organization Login successful!",
                  status: 200,
                  accessToken,
                };
              } catch (error) {
                set.status = 500;
                return { message: "Error logging in", status: 500, error };
              }
            }
          )
      )
      .post(
        "/refresh-token",
        async ({
          cookie: { refresh_token },
          set,
          jwt_org_refresh_token,
          jwt_org_access_token,
        }) => {
          try {
            const refreshToken = refresh_token.value;
            console.log(refreshToken);

            if (!refreshToken) {
              set.status = 403;
              return { status: 403, message: "No refresh token provided" };
            }

            const organizationData = await jwt_org_refresh_token.verify(
              refreshToken
            );
            if (!organizationData || typeof organizationData !== "object") {
              set.status = 403;
              return { status: 403, message: "Invalid refresh token" };
            }

            const organization = await prisma.organization.findUnique({
              where: { orgId: String(organizationData.orgId) },
            });

            if (!organization || organization.refreshToken !== refreshToken) {
              set.status = 403;
              return {
                status: 403,
                message: "Refresh token invalid or expired",
              };
            }

            const newAccessToken = await jwt_org_access_token.sign({
              orgId: organization.orgId,
              email: organization.email,
              exp: getExpTimestamp(ACCESS_TOKEN_EXP),
            });

            const newRefreshToken = await jwt_org_refresh_token.sign({
              orgId: organization.orgId,
              email: organization.email,
              exp: getExpTimestamp(REFRESH_TOKEN_EXP),
            });

            await prisma.organization.update({
              where: { orgId: organization.orgId },
              data: { refreshToken: newRefreshToken },
            });

            refresh_token.set({
              value: newRefreshToken,
              httpOnly: true,
              maxAge: getExpTimestamp(REFRESH_TOKEN_EXP),
            });

            return { status: 200, accessToken: newAccessToken };
          } catch (error) {
            set.status = 500;
            return { status: 500, message: "Error refreshing token", error };
          }
        }
      )
      .post(
        "/logout",
        async ({ cookie: { refresh_token }, jwt_org_refresh_token }) => {
          try {
            const refreshToken = refresh_token.value;

            if (!refreshToken)
              return { status: 400, message: "No refresh token provided" };

            const organizationData = await jwt_org_refresh_token.verify(
              refreshToken
            );
            if (!organizationData || typeof organizationData !== "object") {
              return { status: 403, message: "Invalid refresh token" };
            }

            await prisma.organization.update({
              where: { orgId: String(organizationData.orgId) },
              data: { refreshToken: null },
            });

            refresh_token.set({ value: null, httpOnly: true, maxAge: 0 });

            return { status: 200, message: "Logged out successfully" };
          } catch (error) {
            return { status: 500, message: "Error logging out", error };
          }
        }
      )
  );
