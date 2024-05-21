const EventDetail = require("../../models/EventDetail");
exports.editEvent = async (eventCode, eventData) => {
  try {
    if (!eventCode) {
      return { success: false, message: "Event Code is required" };
    }
    // Check if the member exists
    const existingEvent = await EventDetail.findOne({ eventCode });
    if (!existingEvent) {
      return { success: false, message: "Event not found" };
    }
    const {
      name,
      category,
      typeOfEvent,
      branchesAllowed,
      academicYearAllowed,
      isMemberOnly,
      endDate,
      lastEdited,
    } = eventData;
    await EventDetail.findOneAndUpdate(
      { eventCode: eventCode },
      {
        $set: {
          name: String(name),
          category: Number(category),
          typeOfEvent: Number(typeOfEvent),
          branchesAllowed: Number(branchesAllowed),
          academicYearAllowed: Number(academicYearAllowed),
          isMemberOnly: Boolean(isMemberOnly),
          endDate: new Date(endDate),
          lastEdited: new Date(lastEdited),
        },
        $inc: { editCount: 1 },
      }
    );
    return { success: true, message: "Event updated successfully" };
  } catch (error) {
    console.error("Edit event Error",error);
    return { success: false, message: "Internal server error" };
  }
};
