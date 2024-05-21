const MemberDetail = require("../../models/MemberDetail");

exports.bulkUpload = async (data) => {
  try {
    // Validate data before insertion
    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: false,
        message: "Invalid data format or empty data array",
      };
    }

    // Check if fields in the data match the schema (excluding these fields)
    const memberSchemaPaths = Object.keys(MemberDetail.schema.paths).filter(
      (path) =>
        path !== "__v" &&
        path !== "_id" &&
        path !== "dateOfCreation" &&
        path !== "isDeleted" &&
        path !== "lastDeleted" &&
        path !== "lastEdited" &&
        path !== "lastRevoked" &&
        path !== "deleteCount" &&
        path !== "revokeCount" &&
        path !== "editCount"
    );

    const duplicates = [];

    for (const item of data) {
      const itemKeys = Object.keys(item);
      const unknownColumns = itemKeys.filter(
        (key) => !memberSchemaPaths.includes(key)
      );
      if (unknownColumns.length > 0) {
        return {
          success: false,
          message: `Unknown Columns in data: ${unknownColumns.join(", ")}`,
        };
      }

      const missingColumns = memberSchemaPaths.filter(
        (path) => !itemKeys.includes(path)
      );
      if (missingColumns.length > 0) {
        return {
          success: false,
          message: `Missing Columns or Cells in data: ${missingColumns.join(
            ", "
          )}`,
        };
      }
    }

    // Convert startDate and dateOfCreation to Date objects
    data = data.map((item) => {
      if (item.startDate && !isNaN(Date.parse(item.startDate))) {
        item.startDate = new Date(item.startDate);
      }
      if (item.dateOfCreation && !isNaN(Date.parse(item.dateOfCreation))) {
        item.dateOfCreation = new Date(item.dateOfCreation);
      } else {
        // Set dateOfCreation to today's date if it's not present in the data
        item.dateOfCreation = new Date(item.startDate);
      }
      return item;
    });

    // Validate each item in the array against the MemberDetail schema
    for (const item of data) {
      try {
        await MemberDetail.validate(item);
      } catch (validationError) {
        return { success: false, message: validationError.message };
      }
    }

    // Check for duplicates
    for (const item of data) {
      const existingMember = await MemberDetail.findOne(item);
      if (existingMember) {
        duplicates.push(existingMember.email);
      }
    }

    // If duplicates found, send response with duplicate key and value
    if (duplicates.length > 0) {
      return {
        success: false,
        message: "Member already present",
        duplicates: duplicates,
      };
    }

    // If validation passes and no duplicates, insert data into the database
    await MemberDetail.insertMany(data, { ordered: true });
    return { success: true, message: "Data uploaded successfully" };
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return { success: false, message: "Duplicate key error." };
    } else {
      return { success: false, message: "Internal server error" };
    }
  }
};
