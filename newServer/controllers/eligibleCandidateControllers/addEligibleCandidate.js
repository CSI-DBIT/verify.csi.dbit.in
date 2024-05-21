const { generateCertificateCode } = require("../../utils");
const EligibleCandidates = require("../../models/EligibleCandidates");
const MemberDetail = require("../../models/MemberDetail");
exports.addEligibleCandidate = async (candidateData) => {
  try {
    const {
      eventCode,
      name,
      email,
      mobileNumber,
      branch,
      currentAcademicYear,
      lastEdited,
    } = candidateData;

    // genereate unique certificate code
    let uniqueCertificateCode = generateCertificateCode();
    // Check if the generated unique certificate code already exists in the database
    let retries = 0;
    const maxRetries = 5; // Maximum number of retries

    // Check if the generated unique certificate code already exists in the database
    let existingCertificateCode = await EligibleCandidates.findOne({
      "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
    });
    console.log(existingCertificateCode);
    while (existingCertificateCode) {
      retries++;
      if (retries > maxRetries) {
        return {
          success: false,
          message: "Failed to generate a unique certificate code",
        };
      }
      uniqueCertificateCode = generateCertificateCode(); // Generate a new code
      existingCertificateCode = await EligibleCandidates.findOne({
        "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
      }); // Check again
    }

    // Check if the candidate already exists in the memberDetails database
    let isMember = false;
    const existingMember = await MemberDetail.findOne({
      email: email,
      isDeleted: false,
    });
    if (existingMember) {
      // Check if the current date is less than startDate + duration
      const { startDate, duration } = existingMember;
      const endDate = new Date(
        startDate.getTime() + duration * 365 * 24 * 60 * 60 * 1000
      ); // Adding duration to startDate
      if (new Date() < endDate) {
        // If member exists and current date is within validity period, set isMember to true
        console.log("Existing member within validity period");
        isMember = true;
      } else {
        console.log("Existing member, but membership has expired");
      }
    }

    // Check if a document with the specified event code already exists
    const eligibleCandidatesData = await EligibleCandidates.findOne({
      eventCode,
    });

    const newCandidate = {
      name,
      email,
      mobileNumber,
      branch,
      currentAcademicYear,
      isMember,
      uniqueCertificateCode,
    };

    if (eligibleCandidatesData) {
      // Check if the candidate already exists in the eligibleCandidates array
      const candidateExists = eligibleCandidatesData.eligibleCandidates.some(
        (candidate) => candidate.email === email && !candidate.isDeleted
      );

      if (candidateExists) {
        return {
          success: false,
          message: "Candidate already exists for the event",
        };
      }
      // If document exists, update it by adding the new candidate
      eligibleCandidatesData.eligibleCandidates.push(newCandidate);
      console.log("pushed new candidate", newCandidate);
      eligibleCandidatesData.lastEdited = new Date(lastEdited);
      await eligibleCandidatesData.save();
      return {
        success: true,
        message: "Candidate added to existing Event",
      };
    } else {
      // If document doesn't exist, create a new one
      const newEvent = await EligibleCandidates.create({
        eventCode: eventCode,
        eligibleCandidates: [newCandidate],
        lastEdited: new Date(lastEdited),
      });
      return {
        success: ture,
        message: "New event created with the candidate",
        data: newEvent,
      };
    }
  } catch (error) {
    console.error("Error adding eligible candidates:", error);
    return { success: false, message: "Internal server error" };
  }
};
