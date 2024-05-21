const EventDetail = require("../../models/EventDetail");
exports.getAllEvents = async () => {
  try {
    const events = await EventDetail.find({ isDeleted: false });
    return {
      success: true,
      message: "Fetched all events",
      data: events,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "internal server error" };
  }
};
