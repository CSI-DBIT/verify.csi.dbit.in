const EligibleCandidates = require("../../models/EligibleCandidates");
const MemberDetail = require("../../models/MemberDetail");
exports.editEligibleCandidate = async (
  uniqueCertCode,
  eventCode,
  editingCandidate
) => {
  try {
    if (!uniqueCertCode) {
      return { success: false, message: "Certificate UniqueCode is required" };
    }
    // Check if the member exists
    const doesEligibleCandidateExist = await EligibleCandidates.findOne({
      "eligibleCandidates.uniqueCertificateCode": uniqueCertCode,
    });
    console.log(doesEligibleCandidateExist);
    if (!doesEligibleCandidateExist) {
      return { success: false, message: "Eligible Candidate not found" };
    }

    const {
      name,
      email,
      mobileNumber,
      branch,
      currentAcademicYear,
      currentDate,
    } = editingCandidate;
    // Check if the email already exists for a different candidate
    const eligibleCandidates = await EligibleCandidates.findOne({
      eventCode: eventCode,
    });
    if (!eligibleCandidates) {
      return { success: false, message: "Eligible Candidate not found" };
    }
    // Check if the email already exists for a different candidate within the event
    const emailExists = eligibleCandidates.eligibleCandidates.find(
      (candidate) =>
        candidate.email === email &&
        candidate.uniqueCertificateCode !== uniqueCertCode &&
        !candidate.isDeleted
    );

    if (emailExists) {
      return {
        success: false,
        message: "Another candidate with the same email already exists",
      };
    }
    // Check if the candidate is still a member
    const existingMember = await MemberDetail.findOne({
      email: email,
      isDeleted: false,
    });
    let isMember = false;
    if (existingMember) {
      const { startDate, duration } = existingMember;
      const endDate = new Date(
        startDate.getTime() + duration * 365 * 24 * 60 * 60 * 1000
      );
      if (new Date() < endDate) {
        isMember = true;
      }
    }
    await EligibleCandidates.findOneAndUpdate(
      {
        eventCode: eventCode,
        "eligibleCandidates.uniqueCertificateCode": uniqueCertCode,
      },
      {
        $set: {
          "eligibleCandidates.$[elem].name": String(name),
          "eligibleCandidates.$[elem].email": String(email),
          "eligibleCandidates.$[elem].mobileNumber": Number(mobileNumber),
          "eligibleCandidates.$[elem].branch": Number(branch),
          "eligibleCandidates.$[elem].currentAcademicYear":
            Number(currentAcademicYear),
          "eligibleCandidates.$[elem].lastEdited": new Date(currentDate),
          "eligibleCandidates.$[elem].isMember": isMember,
          lastEdited: new Date(currentDate),
        },
        $inc: { "eligibleCandidates.$[elem].editCount": 1, editCount: 1 },
      },
      {
        new: true,
        arrayFilters: [{ "elem.uniqueCertificateCode": uniqueCertCode }],
      }
    );
    return {
      success: true,
      message: "Eligible Candidate updated successfully",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
