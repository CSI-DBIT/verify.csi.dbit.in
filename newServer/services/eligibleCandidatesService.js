const EligibleCandidates = require("../models/EligibleCandidates");

const fetchEligibleCandidates = async (email) => {
  try {
    const eligibleCandidates = await EligibleCandidates.find({
      "eligibleCandidates.email": email,
    });
    return eligibleCandidates;
  } catch (error) {
    console.error("Error fetching eligible candidates:", error);
    throw error;
  }
};

module.exports = {
  fetchEligibleCandidates,
};
