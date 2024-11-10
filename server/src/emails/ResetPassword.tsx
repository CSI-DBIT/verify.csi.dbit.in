import * as React from "react";
import { Tailwind, Section, Text, Button, Img } from "@react-email/components";
import { FooterSection } from "./FooterSection";
import { EmailService } from "../services/email.service";

const ResetPasswordEmail = ({ userDetails, resetLink, serverUrl }) => {
  return (
    <Tailwind>
      <Section className="flex justify-center items-center w-full min-h-screen bg-zinc-800 text-white font-sans">
        <Section className="max-w-md w-full bg-zinc-900 rounded-lg shadow-lg p-6">
          {/* Logo Section */}
          <Section className="flex justify-center mb-6">
            <Img
              src={`${serverUrl}/public/images/verifydev_light_name_logo.png`}
              alt="Logo"
              className="h-24 w-auto"
            />
          </Section>

          {/* Title and Salutation */}
          <Text className="text-2xl font-bold text-white capitalize mb-4 text-center">
            Password Reset Request
          </Text>
          <Text className="text-zinc-300 mb-4">Dear {userDetails.name},</Text>

          {/* Message Body */}
          <Text className="text-zinc-400 mb-4">
            We received a request to reset your password. If this was you,
            please click the button below to reset your password. This link will
            expire in 15 minutes.
          </Text>

          {/* Reset Password Button */}
          <Section className="w-auto">
            <Button
              href={resetLink}
              className="bg-blue-600 rounded-lg text-center px-4 py-2 font-medium text-white mt-4 hover:bg-blue-700"
            >
              Reset Password
            </Button>
          </Section>

          {/* Closing Message */}
          <Text className="text-zinc-400 mt-6">
            If you did not request a password reset, please ignore this email or
            contact support if you have any concerns.
          </Text>

          <FooterSection serverUrl={serverUrl} />
        </Section>
      </Section>
    </Tailwind>
  );
};

// Send reset email
export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  await EmailService.sendEmail({
    from: "Acme <support@yourdomain.com>",
    to: email,
    subject: "Password Reset Request",
    component: (
      <ResetPasswordEmail
        userDetails={undefined}
        resetLink={undefined}
        serverUrl={undefined}
      />
    ),
  });
};

ResetPasswordEmail.PreviewProps = {
  userDetails: {
    name: "Rahul",
  },
  resetLink: "http://localhost:3000/reset-password?token=your_reset_token",
  serverUrl: "http://localhost:4000",
};

export default ResetPasswordEmail;
