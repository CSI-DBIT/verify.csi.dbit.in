const EventDetail = require("../../models/EventDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");
exports.deleteEvent = async (eventCode, deleteData) => {
  try {
    if (!eventCode) {
      return { success: false, message: "Event Code is required" };
    }

    // Extract lastDeleted from request body
    const { lastDeleted } = deleteData;
    if (!lastDeleted) {
      return { success: false, message: "Last Deleted date is required" };
    }

    // Update isDeleted to true and increment deleteCount by 1
    await EventDetail.findOneAndUpdate(
      { eventCode },
      {
        $set: { isDeleted: true, lastDeleted: new Date(lastDeleted) },
        $inc: { deleteCount: 1 },
      }
    );
    await EligibleCandidates.findOneAndUpdate(
      { eventCode },
      {
        $set: { isDeleted: true, lastDeleted: new Date(lastDeleted) },
      }
    );
    return { success: true, message: "Event deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
