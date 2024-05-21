const MemberDetail = require("../../models/MemberDetail");
exports.getDeletedMembers = async () => {
  try {
    const documents = await MemberDetail.find({ isDeleted: true });
    return { success: true, message: "All Deletd Members Fetched", data: documents };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};