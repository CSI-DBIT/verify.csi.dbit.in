const MemberDetail = require("../../models/MemberDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");

// Function to validate member data
const validateMemberData = (data) => {
  const {
    name,
    email,
    mobileNumber,
    gender,
    studentId,
    branch,
    currentAcademicYear,
    currentSemester,
    duration,
    startDate,
    currentDate,
  } = data;

  // Validate required fields
  if (
    !name ||
    !email ||
    !mobileNumber ||
    !gender ||
    !studentId ||
    !branch ||
    !currentAcademicYear ||
    !currentSemester ||
    !duration ||
    !currentDate ||
    !startDate
  ) {
    return { success: false, message: "All fields are required" };
  }
  // Check for invalid numeric values
  if (
    isNaN(Number(mobileNumber)) ||
    isNaN(Number(gender)) ||
    isNaN(Number(studentId)) ||
    isNaN(Number(branch)) ||
    isNaN(Number(currentAcademicYear)) ||
    isNaN(Number(currentSemester)) ||
    isNaN(Number(duration))
  ) {
    return { success: false, message: "Invalid numeric values" };
  }
  return { success: true };
};

// Function to create a new MemberDetail instance
const createMemberInstance = (data) => {
  const {
    name,
    email,
    mobileNumber,
    gender,
    studentId,
    branch,
    currentAcademicYear,
    currentSemester,
    duration,
    startDate,
    currentDate,
  } = data;

  return new MemberDetail({
    name: String(name),
    email: String(email),
    mobileNumber: Number(mobileNumber),
    gender: Number(gender),
    studentId: Number(studentId),
    branch: Number(branch),
    currentAcademicYear: Number(currentAcademicYear),
    currentSemester: Number(currentSemester),
    duration: Number(duration),
    startDate: new Date(startDate),
    dateOfCreation: new Date(currentDate),
  });
};

// Function to add a new member
exports.addMember = async (data) => {
  const validation = validateMemberData(data);
  if (!validation.success) {
    return validation;
  }

  try {
    // Check if the member already exists
    const existingMember = await MemberDetail.findOne({
      email: data.email,
    });

    if (existingMember) {
      return {
        success: false,
        message: "Member with the same email already exists",
      };
    }

    // Create a new member instance
    const newMember = createMemberInstance(data);
    await newMember.save();

    // Update eligible candidates if member is added successfully
    await EligibleCandidates.updateMany(
      {
        "eligibleCandidates.email": data.email,
      },
      {
        $set: {
          "eligibleCandidates.$.isMember": true,
          "eligibleCandidates.$.lastEdited": new Date(data.currentDate),
          lastEdited: new Date(data.currentDate),
        },
        $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
      }
    );

    return { success: true, message: "Member added successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
