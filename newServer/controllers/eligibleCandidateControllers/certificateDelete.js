const path = require("path");
const fs = require("fs");
const EligibleCandidates = require("../../models/EligibleCandidates");
exports.deleteCandidateCertificate = async (candidateData) => {
  try {
    const {
      eventCode,
      uniqueCertificateCode,
      uniqueCertificateUrl,
      currentDate,
      isMember,
    } = candidateData;

    console.log(
      eventCode,
      uniqueCertificateCode,
      uniqueCertificateUrl,
      currentDate,
      isMember
    );

    // Find and update the document in the database
    const updatedDocument = await EligibleCandidates.findOneAndUpdate(
      {
        eventCode: eventCode,
        "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
      },
      {
        $set: {
          "eligibleCandidates.$[elem].uniqueCertificateUrl": "",
          "eligibleCandidates.$[elem].emailSentCount": 0,
          lastEdited: new Date(currentDate),
        },
        $inc: { "eligibleCandidates.$[elem].editCount": 1, editCount: 1 },
      },
      {
        new: true,
        arrayFilters: [{ "elem.uniqueCertificateCode": uniqueCertificateCode }],
      }
    );

    // If the document is updated successfully, proceed to delete the file
    if (updatedDocument) {
      // Get the file path
      const filePath = path.join(__dirname, uniqueCertificateUrl);
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
      }

      // Respond with success message
      return { success: true, message: "Certificate deleted successfully👍" };
    } else {
      // Respond with error message if document not found
      return { success: false, message: "Certificate not found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
