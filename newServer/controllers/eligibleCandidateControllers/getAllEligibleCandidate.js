const EligibleCandidates = require("../../models/EligibleCandidates");
exports.getAllEligibleCandidate = async (eventCode) => {
  try {
    // Validate event code
    if (!eventCode) {
      return { success: false, message: "Event code is required" };
    }

    // Find event details based on event code
    const eventInfo = await EligibleCandidates.findOne({
      eventCode: eventCode,
    });

    if (!eventInfo) {
      return { success: false, message: "No Eligible Candidates Added" };
    }

    // Filter eligible candidates where isDeleted is false
    const eligibleCandidates = eventInfo.eligibleCandidates.filter(
      (candidate) => !candidate.isDeleted
    );

    // Send filtered eligible candidates as response
    return {
      success: true,
      message: "Successfully fetched eligible candidates for the event",
      data: eligibleCandidates,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
