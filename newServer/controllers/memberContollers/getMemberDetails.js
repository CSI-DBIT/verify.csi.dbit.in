const memberDetailService = require("../../services/memberDetailService");
const eligibleCandidatesService = require("../../services/eligibleCandidatesService");
const eventDetailService = require("../../services/eventDetailService");

const getMemberDetails = async (studentId) => {
  try {
    const memberDetails = await memberDetailService.fetchMemberDetails(
      studentId
    );
    console.log(memberDetails);

    if (memberDetails) {
      const eligibleCandidates =
        await eligibleCandidatesService.fetchEligibleCandidates(
          memberDetails.email
        );
      const data = await eventDetailService.fetchCertificatesDetails(
        memberDetails,
        eligibleCandidates
      );
      return { success: true, message: "Member details fetched", data: data };
    } else {
      return {
        success: false,
        message: "Member details not found for the given studentId",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

module.exports = {
  getMemberDetails,
};
