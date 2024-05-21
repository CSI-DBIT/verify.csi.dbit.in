const MemberDetail = require("../../models/MemberDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");
exports.deleteMember = async (studentId, deleteData) => {
  try {
    // Get studentId from query parameters
    if (!studentId) {
      return { success: false, message: "Student ID is required" };
    }

    if (!deleteData.currentDate) {
      return { success: false, messge: "Last Deleted date is required" };
    }

    // Update isDeleted to true and increment deleteCount by 1
    await MemberDetail.findOneAndUpdate(
      { studentId },
      {
        $set: {
          isDeleted: true,
          lastDeleted: new Date(deleteData.currentDate),
        },
        $inc: { deleteCount: 1 },
      }
    );
    await EligibleCandidates.updateMany(
      {
        "eligibleCandidates.email": deleteData.email,
      },
      {
        $set: {
          "eligibleCandidates.$.isMember": false,
          "eligibleCandidates.$.lastEdited": new Date(deleteData.currentDate),
          lastEdited: new Date(deleteData.currentDate),
        },
        $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
      }
    );
    return { success: true, message: "Member deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
