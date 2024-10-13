import * as React from "react";
import { Tailwind, Section, Text, Button, Img } from "@react-email/components";

const CertificateCode = ({
  eventDetails,
  userDetails,
  serverUrl,
  clientUrl,
}) => {
  return (
    <Tailwind>
      <Section className="flex justify-center items-center w-full min-h-screen bg-zinc-900 text-white font-sans">
        <Section className="max-w-md w-full bg-zinc-800 rounded-lg shadow-lg p-6">
          {/* Logo Section */}
          <Section className="flex justify-center mb-6">
            <Img
              src={`${serverUrl}/public/images/verify.dev_light_name_logo.png`} // Use the correct variable here
              alt="Event Logo"
              className="h-24 w-auto"
            />
          </Section>

          {/* Title and Salutation */}
          <Text className="text-2xl font-bold text-white capitalize mb-4 text-center">
            {eventDetails.name} Certificate
          </Text>
          <Text className="text-zinc-300 mb-4">Dear {userDetails.name},</Text>

          {/* Participation Message */}
          <Text className="text-zinc-400 mb-4">
            Congratulations! You have successfully participated in{" "}
            <strong className="text-white">{eventDetails.name}</strong> held on{" "}
            {new Date(eventDetails.startDate).toLocaleDateString()}.
          </Text>

          {/* Certificate Code Section */}
          <Text className="text-zinc-200 mb-2">
            <strong>As promised, here is your unique certificate code:</strong>
          </Text>
          <Section className="bg-zinc-700 p-4 rounded-lg text-center text-xl font-bold text-white mb-4">
            {userDetails.uniqueCertificateCode}
          </Section>

          {/* Verification Section */}
          <Text className="text-zinc-300 mb-4 flex flex-col">
            <span>
              To verify your certificate, please visit the link below:
            </span>
            <Button
              href={`${clientUrl}/certificate/verify/${userDetails.uniqueCertificateCode}`}
              className="bg-blue-600 rounded-lg text-center px-4 py-2 font-medium leading-4 text-white mt-2 hover:bg-blue-700"
            >
              View Certificate
            </Button>
          </Text>

          {/* Closing Message */}
          <Text className="text-zinc-400 mb-6">
            Thank you for your participation and dedication. We hope to see you
            again at our future events.
          </Text>

          {/* Footer Section */}
          <Section className="bg-zinc-700 p-4 rounded-lg text-xs text-zinc-400">
            <div className="flex justify-center items-center">
              <Img
                src={`${serverUrl}/public/images/verifyInitialLogo.png`} // Use the correct variable here
                alt="Verify Logo"
                className="h-12 mr-2" // Added margin to the right for spacing
              />
              <Text className="text-center">
                <strong>
                  Best regards, <br />
                  Verify@Dev
                </strong>
              </Text>
            </div>
          </Section>
        </Section>
      </Section>
    </Tailwind>
  );
};

CertificateCode.PreviewProps = {
  eventDetails: {
    name: "Web Development Bootcamp",
    startDate: "2024-10-01",
  },
  userDetails: {
    name: "Rahul",
    uniqueCertificateCode: "1234efht56",
  },
  serverUrl: "http://localhost:3000",
  clientUrl: "http://localhost:3000",
};

export default CertificateCode;
