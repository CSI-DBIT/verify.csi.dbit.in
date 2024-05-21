const MemberDetail = require("../../models/MemberDetail");
exports.getAllMembers = async () => {
  try {
    const documents = await MemberDetail.find({ isDeleted: false });
    return { success: true, message: "All Members Fetched", data: documents };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
