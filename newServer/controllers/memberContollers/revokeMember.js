const MemberDetail = require("../../models/MemberDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");
exports.revokeMember = async (studentId, revokeData) => {
  try {
    // Get studentId from query parameters
    if (!studentId) {
      return { success: false, message: "Student ID is required" };
    }

    if (!revokeData.currentDate) {
      return { success: false, message: "Last Revoked date is required" };
    }

    // Update isDeleted to false, set lastRevoked, and increment revokeCount by 1
    await MemberDetail.findOneAndUpdate(
      { studentId },
      {
        $set: {
          isDeleted: false,
          lastRevoked: new Date(revokeData.currentDate),
        },
        $inc: { revokeCount: 1 },
      }
    );
    await EligibleCandidates.updateMany(
      {
        "eligibleCandidates.email": revokeData.email,
      },
      {
        $set: {
          "eligibleCandidates.$.isMember": true,
          "eligibleCandidates.$.lastEdited": new Date(revokeData.currentDate),
          lastEdited: new Date(revokeData.currentDate),
        },
        $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
      }
    );

    return { success: true, message: "Member revoked successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
