const EventDetail = require("../../models/EventDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");
const {
  generateCertificateEmailAllContent,
} = require("../../emails/certificateEmailTemplate");
const { sendEmail } = require("../../utils");

exports.sendCertificateEmailSingle = async (
  eventCode,
  candidateEmail,
  currentDate
) => {
  try {
    console.log(candidateEmail, currentDate);
    // Validate event code
    if (!eventCode || !candidateEmail) {
      return { success: false, message: "Event code is required" };
    }

    // Fetch event details
    const eventDetails = await EventDetail.findOne({ eventCode });
    console.log(eventDetails);
    if (!eventDetails) {
      return { success: false, message: "Event not found" };
    }
    const { eligibleCandidates, candidate } = await getUserDetails(
      eventCode,
      candidateEmail
    );
    const { html } = await generateCertificateEmailAllContent(
      eventDetails,
      candidate
    );
    const emailOptions = {
      subject: `${eventDetails.name} Certificate`,
      to: candidateEmail,
      from: process.env.EMAIL,
      html: html,
      attachments: [
        {
          filename: `${eventDetails.name}_${candidate.uniqueCertificateCode}.pdf`,
          path: `${process.env.SERVER_URL}/${candidate.uniqueCertificateUrl}`,
        },
      ],
    };
    if (
      (candidate.uniqueCertificateUrl !== "" ||
        candidate.uniqueCertificateUrl !== null) &&
      candidate.emailSentCount === 0
    ) {
      const emailResult = await sendEmail(emailOptions);
      if (emailResult.success) {
        // Update emailSentCount, editCount, and lastEdited fields
        candidate.emailSentCount += 1;
        candidate.editCount += 1;
        candidate.lastEdited = new Date(currentDate);
        eligibleCandidates.lastEdited = new Date(currentDate);
        eligibleCandidates.editCount += 1;

        // Save the updated document
        await eligibleCandidates.save();
        console.log(`Email sent to ${candidateEmail}`);
      }
      return { success: true, message: "Emails sent successfully" };
    } else {
      return {
        success: false,
        message: "Not Uploaded certificate or email already sent",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
const getUserDetails = async (eventCode, candidateEmail) => {
  const eligibleCandidates = await EligibleCandidates.findOne({ eventCode });

  if (!eligibleCandidates) {
    throw new Error("Event not found");
  }

  const candidate = eligibleCandidates.eligibleCandidates.find(
    (candidate) => candidate.email === candidateEmail
  );

  if (!candidate) {
    throw new Error("Candidate not found for the provided email");
  }

  return { eligibleCandidates, candidate };
};
