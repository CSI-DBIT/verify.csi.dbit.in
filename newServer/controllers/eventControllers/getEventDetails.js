const EventDetail = require("../../models/EventDetail");
exports.getEventDetails = async (eventCode) => {
  try {
    // Validate event code
    if (!eventCode) {
      return { success: false, message: "Event code is required" };
    }
    // Find event details based on event code
    const event = await EventDetail.findOne({
      eventCode: eventCode,
      isDeleted: false,
    });
    if (!event) {
      return { success: false, message: "Event not found" };
    }
    // Send event details as response
    return { success: true, message: "Event details found", data: event };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
