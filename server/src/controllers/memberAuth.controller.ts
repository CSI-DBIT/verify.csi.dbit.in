import { Elysia } from "elysia";
import {
  comparePassword,
  getExpTimestamp,
  hashPassword,
} from "../configs/utils";
import {
  jwtMemberAccessTokenConfig,
  jwtMemberRefreshTokenConfig,
} from "../configs/jwt.config";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "../configs/constants";
import { loginMemberSchema, signupMemberSchema } from "../configs/schemas";
import { prisma } from "../configs/prisma.config";

export const memberAuthController = (app: Elysia) =>
  app.group("/member-auth", (app) =>
    app
      .use(jwtMemberAccessTokenConfig)
      .use(jwtMemberRefreshTokenConfig)
      .guard(
        {
          body: signupMemberSchema,
        },
        (app) =>
          app.post(
            "/signup",
            async ({
              set,
              body,
              jwt_member_access_token,
              jwt_member_refresh_token,
              cookie: { refresh_token },
            }) => {
              try {
                const { memberName, email, password, gender } = body;
                const existingMember = await prisma.member.findUnique({
                  where: { email },
                });
                if (existingMember) {
                  set.status = 422;
                  return {
                    message: "Member with the email already exists!",
                    status: 422,
                  };
                }

                const hashedPassword = await hashPassword(password);
                const newMember = await prisma.member.create({
                  data: {
                    memberName,
                    email,
                    gender: gender,
                    password: hashedPassword,
                  },
                });

                const accessToken = await jwt_member_access_token.sign({
                  memberId: newMember.memberId,
                  email: newMember.email,
                  exp: getExpTimestamp(ACCESS_TOKEN_EXP),
                });
                const refreshToken = await jwt_member_refresh_token.sign({
                  memberId: newMember.memberId,
                  email: newMember.email,
                  exp: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                await prisma.member.update({
                  where: { memberId: newMember.memberId },
                  data: { refreshToken },
                });

                refresh_token.set({
                  value: refreshToken,
                  httpOnly: true,
                  maxAge: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                set.status = 201;
                return {
                  message: "Member registered successfully",
                  status: 201,
                  accessToken,
                };
              } catch (e: any) {
                set.status = 500;
                return {
                  message: "Unable to save member to the database!",
                  status: 500,
                  error_msg: e,
                };
              }
            }
          )
      )
      .guard(
        {
          body: loginMemberSchema,
        },
        (app) =>
          app.post(
            "/login",
            async ({
              set,
              body,
              jwt_member_access_token,
              jwt_member_refresh_token,
              cookie: { refresh_token },
            }) => {
              try {
                const { email, password } = body;
                const member = await prisma.member.findUnique({
                  where: { email },
                });
                if (
                  !member ||
                  !(await comparePassword(password, member.password))
                ) {
                  set.status = 401;
                  return { status: 401, message: "Invalid credentials" };
                }

                const accessToken = await jwt_member_access_token.sign({
                  memberId: member.memberId,
                  email: member.email,
                  exp: getExpTimestamp(ACCESS_TOKEN_EXP),
                });
                const refreshToken = await jwt_member_refresh_token.sign({
                  memberId: member.memberId,
                  email: member.email,
                  exp: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                await prisma.member.update({
                  where: { memberId: member.memberId }, // Adjust according to your Prisma model
                  data: { refreshToken },
                });

                refresh_token.set({
                  value: refreshToken,
                  httpOnly: true,
                  maxAge: getExpTimestamp(REFRESH_TOKEN_EXP),
                });

                set.status = 200;
                return {
                  message: "Login successful!",
                  status: 200,
                  accessToken,
                };
              } catch (e) {
                set.status = 500;
                return {
                  message: "Error logging in",
                  status: 500,
                  error_msg: e,
                };
              }
            }
          )
      )
      .post(
        "/refresh-token",
        async ({
          cookie: { refresh_token },
          set,
          jwt_member_refresh_token,
          jwt_member_access_token,
        }) => {
          try {
            const refreshTokenCookie = refresh_token;
            if (!refreshTokenCookie) {
              set.status = 403;
              return { status: 403, message: "No refresh token provided" };
            }

            const memberData = await jwt_member_refresh_token.verify(
              refreshTokenCookie.value
            );

            if (!memberData || typeof memberData !== "object") {
              set.status = 403;
              return {
                status: 403,
                message: "Refresh token invalid or expired",
              };
            }

            const member = await prisma.member.findUnique({
              where: {
                memberId: String(memberData.memberId),
              },
            });

            if (!member || member.refreshToken !== refreshTokenCookie.value) {
              set.status = 403;
              return { status: 403, message: "Invalid refresh token" };
            }

            const newAccessToken = await jwt_member_access_token.sign({
              memberId: member.memberId,
              email: member.email,
              exp: getExpTimestamp(ACCESS_TOKEN_EXP),
            });

            const newRefreshToken = await jwt_member_refresh_token.sign({
              memberId: member.memberId,
              email: member.email,
              exp: getExpTimestamp(REFRESH_TOKEN_EXP),
            });

            await prisma.member.update({
              where: { memberId: member.memberId },
              data: { refreshToken: newRefreshToken },
            });

            refresh_token.set({
              value: newRefreshToken,
              httpOnly: true,
              maxAge: getExpTimestamp(REFRESH_TOKEN_EXP),
            });

            return { status: 200, accessToken: newAccessToken };
          } catch (e) {
            set.status = 500;
            return {
              status: 500,
              message: "Error refreshing token",
              error: e,
            };
          }
        }
      )
      .post(
        "/logout",
        async ({ cookie: { refresh_token }, jwt_member_refresh_token }) => {
          try {
            const refreshTokenCookie = refresh_token;

            if (!refreshTokenCookie)
              return { status: 400, message: "No refresh token provided" };

            const memberData = await jwt_member_refresh_token.verify(
              refreshTokenCookie.value
            );

            if (!memberData || typeof memberData !== "object") {
              return { status: 403, message: "Invalid refresh token" };
            }

            const member = await prisma.member.findUnique({
              where: {
                memberId: String(memberData.memberId), // Adjust according to your Prisma model
              },
            });

            if (member) {
              await prisma.member.update({
                where: { memberId: member.memberId }, // Adjust according to your Prisma model
                data: { refreshToken: null }, // Invalidate the refresh token
              });
            }

            refresh_token.set({
              value: null,
              httpOnly: true,
              maxAge: 0, // Clear the cookie
            });

            return { status: 200, message: "Logged out successfully" };
          } catch (e) {
            return {
              status: 500,
              message: "Error logging out",
              error: e,
            };
          }
        }
      )
  );
