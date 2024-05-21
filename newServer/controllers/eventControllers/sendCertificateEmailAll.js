const EventDetail = require("../../models/EventDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");
const {
  generateCertificateEmailAllContent,
} = require("../../emails/certificateEmailTemplate");
const { sendEmail } = require("../../utils");

exports.sendCertificateEmailAll = async (eventCode, candidateEmailData) => {
  try {
    const { candidateEmails, currentDate } = candidateEmailData;
    console.log(candidateEmails, currentDate);
    // Validate event code
    if (!eventCode || !candidateEmails) {
      return { success: false, message: "Event code is required" };
    }

    // Fetch event details
    const eventDetails = await EventDetail.findOne({ eventCode });
    console.log(eventDetails);
    if (!eventDetails) {
      return { success: false, message: "Event not found" };
    }

    // Send emails to candidates
    for (const candidateEmail of candidateEmails) {
      const userDetails = await getUserDetails(eventCode, candidateEmail);
      console.log(userDetails);
      if (
        (userDetails.certificateFilePath !== "" ||
          userDetails.certificateFilePath !== null) &&
        userDetails.emailSentCount === 0
      ) {
        const { html } = await generateCertificateEmailAllContent(
          eventDetails,
          userDetails
        );

        const emailOptions = {
          subject: `${eventDetails.name} Certificate`,
          to: candidateEmail,
          from: process.env.EMAIL,
          html: html,
          attachments: [
            {
              filename: `${eventDetails.name}_${userDetails.uniqueCertificateCode}.pdf`,
              path: `${process.env.SERVER_URL}/${userDetails.certificateFilePath}`,
            },
          ],
        };

        const emailResult = await sendEmail(emailOptions);
        if (emailResult.success) {
          await updateUserDetails(eventCode, candidateEmail, currentDate);
          console.log(`Email sent to ${candidateEmail}`);
        }
      } else {
        console.log(
          `Email not sent to ${candidateEmail} as emailSentCount is not zero`
        );
      }
    }

    return { success: true, message: "Emails sent to all 📥" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};

const getUserDetails = async (eventCode, userEmail) => {
  try {
    const eligibleCandidates = await EligibleCandidates.findOne({ eventCode });

    if (!eligibleCandidates) {
      throw new Error("Event not found");
    }

    const candidate = eligibleCandidates.eligibleCandidates.find(
      (candidate) => candidate.email === userEmail
    );

    if (!candidate) {
      throw new Error("Candidate not found for the provided email");
    }

    return {
      name: candidate.name,
      uniqueCertificateCode: candidate.uniqueCertificateCode,
      certificateFilePath: candidate.uniqueCertificateUrl,
      emailSentCount: candidate.emailSentCount,
    };
  } catch (error) {
    throw new Error(`Error fetching user details: ${error.message}`);
  }
};

const updateUserDetails = async (eventCode, userEmail, currentDate) => {
  try {
    const eligibleCandidates = await EligibleCandidates.findOne({ eventCode });

    if (!eligibleCandidates) {
      throw new Error("Event not found");
    }

    const candidate = eligibleCandidates.eligibleCandidates.find(
      (candidate) => candidate.email === userEmail
    );

    if (!candidate) {
      throw new Error("Candidate not found for the provided email");
    }

    candidate.emailSentCount += 1;
    candidate.editCount += 1;
    candidate.lastEdited = new Date(currentDate);
    eligibleCandidates.lastEdited = new Date(currentDate);
    eligibleCandidates.editCount += 1;

    await eligibleCandidates.save();
  } catch (error) {
    throw new Error(`Error updating user details: ${error.message}`);
  }
};
