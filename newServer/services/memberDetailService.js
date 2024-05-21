const MemberDetail = require("../models/MemberDetail");

const fetchMemberDetails = async (studentId) => {
  try {
    const memberDetails = await MemberDetail.findOne({
      studentId,
      isDeleted: false,
    });
    return memberDetails;
  } catch (error) {
    console.error("Error fetching member details:", error);
    throw error;
  }
};

module.exports = {
  fetchMemberDetails,
};
