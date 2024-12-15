import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const TermsAndConditions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const appName = "verify@dev";
  const appUrl = "https://www.verifyatdev.com";
  const contactEmail = "support@verifyatdev.com";

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    {
      title: "1. Definitions",
      content: `Organization: An entity registered on the Platform to manage events, members, and other organizational activities.
Member: An individual user associated with one or more organizations or participating in events.
Participant: A user or attendee of an event, whether they are a member or not.
Platform: The services, features, and functionalities provided by ${appName}, including event management, notifications, and chat features.
Content: Any text, images, messages, or other materials uploaded or shared by users on the Platform.`,
    },
    {
      title: "2. Eligibility",
      content:
        "You must be at least 18 years old to register and use the Platform.\nBy creating an account, you confirm that the information provided is accurate, complete, and up-to-date.",
    },
    {
      title: "3. User Accounts",
      content: `a. Account Creation
- Organizations and Members must register accounts to access features like event management, chat rooms, and notifications.
- Each account is personal and non-transferable.

b. Account Security
- You are responsible for maintaining the confidentiality of your login credentials.
- Notify us immediately if you suspect unauthorized access to your account.`,
    },
    {
      title: "4. Use of the Platform",
      content: `a. Permitted Use
- Organizations can create events, manage participants, and communicate with members.
- Members can participate in events, provide feedback, and interact with organizations.
- All users must comply with applicable laws and these Terms.

b. Prohibited Activities
- Impersonating another user or entity.
- Posting offensive, discriminatory, or illegal content.
- Attempting to hack or disrupt the Platform's functionality.`,
    },
    {
      title: "5. Event Participation and Feedback",
      content:
        "Participation in events is subject to the event organizer's terms.\nParticipants may provide feedback and ratings for events, which must be honest and non-defamatory.\nUsers are prohibited from manipulating ratings or votes.",
    },
    {
      title: "6. Intellectual Property",
      content: `All content on the Platform, including text, graphics, logos, and software, is owned by ${appName} or its licensors.
You retain ownership of content you upload but grant us a non-exclusive, royalty-free license to use, reproduce, and display such content on the Platform.`,
    },
    {
      title: "7. Notifications",
      content:
        "The Platform provides notifications for activities such as event updates, member requests, and reminders.\nNotifications are delivered via the Platform or email. Ensure your contact information is accurate to receive them.",
    },
    {
      title: "8. Privacy and Data Protection",
      content:
        "Your privacy is important to us. Please refer to our Privacy Policy for details on how we collect, use, and protect your data.",
    },
    {
      title: "9. Limitation of Liability",
      content: `${appName} is not responsible for any damages resulting from the use of the Platform, including but not limited to loss of data, revenue, or goodwill.
We do not guarantee the accuracy or reliability of content uploaded by users.`,
    },
    {
      title: "10. Suspension and Termination",
      content:
        "We reserve the right to suspend or terminate your account if you violate these Terms or engage in prohibited activities.\nTerminated accounts may lose access to content and services associated with the account.",
    },
    {
      title: "11. Amendments",
      content:
        "We may update these Terms periodically. Users will be notified of significant changes via the Platform or email.\nContinued use of the Platform constitutes acceptance of the revised Terms.",
    },
    {
      title: "12. Governing Law",
      content:
        "These Terms are governed by and construed in accordance with the laws of California, United States.\nAny disputes shall be resolved exclusively in the courts of California.",
    },
    {
      title: "13. Dispute Resolution",
      content:
        `In the event of any dispute, controversy, or claim arising out of or relating to these Terms, you agree to first contact us at ${contactEmail} to resolve the issue amicably.`,
    },
    {
      title: "14. Indemnification",
      content:
        `You agree to indemnify and hold harmless ${appName}, its affiliates, and its licensors from and against any claims, damages, or liabilities arising from your use of the Platform or breach of these Terms.`,
    },
    {
      title: "15. Contact Us",
      content: `If you have any questions or concerns regarding these Terms, please contact us at:

${appName}
${contactEmail}`,
    },
  ];

  return (
    <div>
        <Navbar />
      <Card className="w-full max-w-4xl mx-auto border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: January 1, 2024</p>
          <p className="mb-6">
            Welcome to {appName}! These Terms and Conditions ("Terms") govern your use of our platform,
            accessible at {appUrl} or through our mobile application ("Platform"). By accessing or using
            the Platform, you agree to comply with these Terms. If you do not agree with these Terms, please
            refrain from using the Platform.
          </p>
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="whitespace-pre-line">{section.content}</p>
                {index < sections.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {showScrollTop && (
        <Button
          className="fixed bottom-4 right-4 rounded-full p-2"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
      <Footer />
    </div>
  );
};
