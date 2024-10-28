import * as React from "react";
import { Tailwind, Section, Text, Button, Img } from "@react-email/components";
import { FooterSection } from "./FooterScetion";

const JoinedOrganizationEmail = ({ organizationDetails, userDetails, serverUrl, clientUrl }) => {
  return (
    <Tailwind>
      <Section className="flex justify-center items-center w-full min-h-screen bg-zinc-800 text-white font-sans">
        <Section className="max-w-md w-full bg-zinc-900 rounded-lg shadow-lg p-6">
          <Section className="flex justify-center mb-6">
            <Img
              src={`${serverUrl}/public/images/verifydev_light_name_logo.png`}
              alt="Logo"
              className="h-24 w-auto"
            />
          </Section>
          <Text className="text-2xl font-bold text-white capitalize mb-4 text-center">
            Welcome to {organizationDetails.name}!
          </Text>
          <Text className="text-zinc-300 mb-4">Dear {userDetails.name},</Text>
          <Text className="text-zinc-400 mb-4">
            You have successfully joined {organizationDetails.name}. We’re excited to have you as a member.
          </Text>
          <Button
            href={`${clientUrl}/organization/${organizationDetails.id}`}
            className="bg-blue-600 rounded-lg text-center px-4 py-2 font-medium text-white mt-4 hover:bg-blue-700"
          >
            View Organization
          </Button>
          <FooterSection serverUrl={serverUrl} />
        </Section>
      </Section>
    </Tailwind>
  );
};

JoinedOrganizationEmail.PreviewProps = {
    organizationDetails: {
      name: "Tech Innovators",
      id: "org123",
    },
    userDetails: {
      name: "Rahul",
    },
    serverUrl: "http://localhost:4000",
    clientUrl: "http://localhost:3000",
  };
  

export default JoinedOrganizationEmail;
