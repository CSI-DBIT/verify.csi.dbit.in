import { Elysia } from "elysia";
import {
  comparePassword,
  getExpTimestamp,
  hashPassword,
} from "../configs/utils";
import { prisma } from "../configs/prisma.config";
import { jwtPasswordResetTokenConfig } from "../configs/jwt.config";
import { organizationAuthController } from "./organizationAuth.controller";
import { memberAuthController } from "./memberAuth.controller";

export const authController = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .use(jwtPasswordResetTokenConfig)
      .post(
        "/forgot-password",
        async ({ set, body, jwt_password_reset_token }) => {
          const { email } = body;

          // Check if the email belongs to an organization or a member
          const organization = await prisma.organization.findUnique({
            where: { email },
          });
          const member = !organization
            ? await prisma.member.findUnique({ where: { email } })
            : null;

          if (!organization && !member) {
            set.status = 404;
            return {
              status: 404,
              message: "Email not associated with any account",
            };
          }

          // Create reset token
          const resetToken = await jwt_password_reset_token.sign({
            id: organization ? organization.orgId : member?.memberId,
            role: organization ? "organization" : "member",
            exp: getExpTimestamp("15m"), // Token valid for 15 minutes
          });

          // Send reset email
        //   await sendResetPasswordEmail(email, resetToken);

          return { status: 200, message: "Password reset email sent" };
        }
      )
      .post(
        "/reset-password",
        async ({ set, body, jwt_password_reset_token }) => {
          const { resetToken, newPassword } = body;

          try {
            // Verify the reset token
            const decoded = await jwt_password_reset_token.verify(resetToken);
            if (!decoded || typeof decoded !== "object") {
              set.status = 403;
              return { status: 403, message: "Invalid or expired reset token" };
            }

            const { id, role } = decoded;

            // Find user based on role and ID
            const entity =
              role === "organization"
                ? await prisma.organization.findUnique({ where: { orgId: id } })
                : await prisma.member.findUnique({ where: { memberId: id } });

            if (!entity) {
              set.status = 404;
              return { status: 404, message: "Account not found" };
            }

            // Update password
            const hashedPassword = await hashPassword(newPassword);
            if (role === "organization") {
              await prisma.organization.update({
                where: { orgId: id },
                data: { password: hashedPassword },
              });
            } else if (role === "member") {
              await prisma.member.update({
                where: { memberId: id },
                data: { password: hashedPassword },
              });
            }

            return { status: 200, message: "Password reset successful" };
          } catch (error) {
            set.status = 500;
            return { status: 500, message: "Error resetting password", error };
          }
        }
      )
      .use(organizationAuthController)
      .use(memberAuthController)
  );
