import * as React from "react";
import { Tailwind, Section, Text, Button, Img } from "@react-email/components";
import { FooterSection } from "./FooterSection";

const EventFeedbackEmail = ({ eventDetails, userDetails, feedbackUrl, serverUrl }) => {
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
            We’d Love Your Feedback
          </Text>
          <Text className="text-zinc-300 mb-4">Dear {userDetails.name},</Text>
          <Text className="text-zinc-400 mb-4">
            Thank you for joining us at {eventDetails.name}! We hope you enjoyed it.
          </Text>
          <Text className="text-zinc-400 mb-4">
            Please take a moment to share your experience:
          </Text>
          <Button
            href={feedbackUrl}
            className="bg-green-600 rounded-lg text-center px-4 py-2 font-medium text-white mt-4 hover:bg-green-700"
          >
            Give Feedback
          </Button>
          <FooterSection serverUrl={serverUrl} />
        </Section>
      </Section>
    </Tailwind>
  );
};

EventFeedbackEmail.PreviewProps = {
    eventDetails: {
      name: "Web Development Bootcamp",
    },
    userDetails: {
      name: "Rahul",
    },
    feedbackUrl: "http://localhost:3000/feedback",
    serverUrl: "http://localhost:4000",
  };
  

export default EventFeedbackEmail;
