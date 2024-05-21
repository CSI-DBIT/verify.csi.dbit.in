// Import the required models
const MemberDetail = require("../../models/MemberDetail");
const EligibleCandidates = require("../../models/EligibleCandidates");

// Function to edit a member
exports.editMember = async (studentId, email, updateData) => {
  try {
    // Check if the member exists
    const existingMember = await MemberDetail.findOne({ studentId });
    if (!existingMember) {
      return { success: false, message: "Member not found" };
    }

    // Update the member details
    await MemberDetail.findOneAndUpdate(
      { studentId },
      {
        $set: {
          name: String(updateData.name),
          email: String(updateData.email),
          mobileNumber: Number(updateData.mobileNumber),
          gender: Number(updateData.gender),
          studentId: Number(updateData.studentId),
          branch: Number(updateData.branch),
          currentAcademicYear: Number(updateData.currentAcademicYear),
          currentSemester: Number(updateData.currentSemester),
          duration: Number(updateData.duration),
          startDate: new Date(updateData.startDate),
          lastEdited: new Date(updateData.lastEdited),
        },
        $inc: { editCount: 1 },
      }
    );

    // Calculate membership validity
    const endDate = new Date(
      new Date(updateData.startDate).getTime() +
        Number(updateData.duration) * 365 * 24 * 60 * 60 * 1000
    );
    const isMembershipValid = new Date() < endDate;

    // Update eligible candidates based on membership validity
    await EligibleCandidates.updateMany(
      {
        "eligibleCandidates.email": email,
      },
      {
        $set: {
          "eligibleCandidates.$.name": updateData.name,
          "eligibleCandidates.$.email": updateData.email,
          "eligibleCandidates.$.mobileNumber": updateData.mobileNumber,
          "eligibleCandidates.$.branch": updateData.branch,
          "eligibleCandidates.$.currentAcademicYear":
            updateData.currentAcademicYear,
          "eligibleCandidates.$.isMember": isMembershipValid,
          "eligibleCandidates.$.lastEdited": new Date(updateData.lastEdited),
          lastEdited: new Date(updateData.lastEdited),
        },
        $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
      }
    );

    return { success: true, message: "Member updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal server error" };
  }
};
