const EventDetail = require("../../models/EventDetail");
const { generateEventCode } = require("../../utils");
exports.addEvent = async (eventData) => {
  try {
    const {
      name,
      category,
      typeOfEvent,
      branchesAllowed,
      isBranchSpecific,
      academicYearAllowed,
      isAcademicYearSpecific,
      isMemberOnly,
      startDate,
      endDate,
      dateOfCreation,
    } = eventData;

    console.log(
      name,
      category,
      typeOfEvent,
      branchesAllowed,
      isBranchSpecific,
      academicYearAllowed,
      isAcademicYearSpecific,
      isMemberOnly,
      startDate,
      endDate,
      dateOfCreation
    );

    // Validate required fields
    if (
      !name ||
      !category ||
      !typeOfEvent ||
      !branchesAllowed ||
      !isBranchSpecific ||
      !academicYearAllowed ||
      !isAcademicYearSpecific ||
      !isMemberOnly ||
      !startDate ||
      !endDate ||
      !dateOfCreation
    ) {
      return { success: false, message: "All fields are required" };
    }

    // Check for invalid numeric values
    if (
      isNaN(Number(category)) ||
      isNaN(Number(typeOfEvent)) ||
      isNaN(Number(branchesAllowed)) ||
      isNaN(Number(academicYearAllowed))
    ) {
      return { success: false, message: "Invalid numeric values" };
    }

    let uniqueEventCode = generateEventCode();

    // Check if the generated event code already exists in the database
    let retries = 0;
    const maxRetries = 5; // Maximum number of retries

    // Check if the generated event code already exists in the database
    let existingEvent = await EventDetail.findOne({
      eventCode: uniqueEventCode,
    });
    console.log(existingEvent);
    while (existingEvent) {
      retries++;
      if (retries > maxRetries) {
        return {
          success: false,
          message: "Failed to generate a unique event code",
        };
      }
      uniqueEventCode = generateEventCode(); // Generate a new code
      existingEvent = await EventDetail.findOne({
        eventCode: uniqueEventCode,
      }); // Check again
    }

    // Create a new EventDetail instance with the generated unique code
    const newEvent = new EventDetail({
      eventCode: uniqueEventCode,
      name: String(name),
      category: Number(category),
      typeOfEvent: Number(typeOfEvent),
      branchesAllowed: Number(branchesAllowed),
      isBranchSpecific: isBranchSpecific,
      academicYearAllowed: Number(academicYearAllowed),
      isAcademicYearSpecific: isAcademicYearSpecific,
      isMemberOnly: isMemberOnly,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dateOfCreation: new Date(dateOfCreation),
    });

    // Save the new event to the database
    console.log(newEvent);
    await newEvent.save();
    // Send a success response
    return {
      success: true,
      message: "Event added successfully",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
