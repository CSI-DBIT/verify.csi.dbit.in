import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface SlackConfirmEmailProps {
  validationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const SlackConfirmEmail = ({
  validationCode,
}: SlackConfirmEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Body className="bg-white mx-auto">
        <Container className="mx-auto px-20">
          <Section className="mt-8">
            {" "}
            {/* Adjusted margin top for better alignment */}
            <Img
              src={`${baseUrl}/static/slack-logo.png`}
              width="120"
              height="36"
              alt="Slack"
            />
          </Section>
          <Heading className="text-black text-4xl font-bold my-8 py-0 leading-10">
            Confirm your email address
          </Heading>
          <Text className="text-lg leading-7 mb-8">
            Your confirmation code is below - enter it in your open browser
            window and we'll help you get signed in.
          </Text>

          <Section className="bg-gray-100 rounded-md mb-8 p-10">
            <Text className="text-4xl text-center align-middle">
              {validationCode}
            </Text>
          </Section>

          <Text className="text-black text-base leading-6 mb-8">
            If you didn't request this email, there's nothing to worry about,
            you can safely ignore it.
          </Text>

          <Section className="mb-8 px-8 w-full">
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/slack-logo.png`}
                  width="120"
                  height="36"
                  alt="Slack"
                />
              </Column>
              <Column>
                <Section className="flex">
                  <Row>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-twitter.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          className="inline ml-2"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          <Section>
            <Link
              className="text-blue-500 underline"
              href="https://slackhq.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our blog
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-blue-500 underline"
              href="https://slack.com/legal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Policies
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-blue-500 underline"
              href="https://slack.com/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help center
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-blue-500 underline"
              href="https://slack.com/community"
              target="_blank"
              rel="noopener noreferrer"
              data-auth="NotApplicable"
              data-linkindex="6"
            >
              Slack Community
            </Link>
            <Text className="text-gray-500 text-sm leading-5 mt-8">
              ©2022 Slack Technologies, LLC, a Salesforce company. <br />
              500 Howard Street, San Francisco, CA 94105, USA <br />
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

SlackConfirmEmail.PreviewProps = {
  validationCode: "DJZ-TLX",
} as SlackConfirmEmailProps;

export default SlackConfirmEmail;
