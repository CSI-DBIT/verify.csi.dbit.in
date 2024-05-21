const fs = require("fs");
const path = require("path");
const EligibleCandidates = require("../../models/EligibleCandidates");

exports.deleteEligibleCandidate = async (uniqueCertCode, deletingCandidate) => {
  try {
    if (!uniqueCertCode) {
      return { success: false, message: "Certificate UniqueCode is required" };
    }

    // Extract lastDeleted from request body
    const { currentDate } = deletingCandidate;
    if (!currentDate) {
      return { success: false, message: "Last Deleted date is required" };
    }

    // Find the document first to get the uniqueCertificateUrl
    const document = await EligibleCandidates.findOne({
      "eligibleCandidates.uniqueCertificateCode": uniqueCertCode,
    });

    if (!document) {
      return { success: false, message: "Eligible Candidate not found" };
    }

    // Find the candidate within the document
    const candidate = document.eligibleCandidates.find(
      (c) => c.uniqueCertificateCode === uniqueCertCode
    );

    if (!candidate) {
      return { success: false, message: "Eligible Candidate not found" };
    }

    const { uniqueCertificateUrl } = candidate;

    // Update isDeleted to true and clear uniqueCertificateCode and uniqueCertificateUrl
    const updatedDocument = await EligibleCandidates.findOneAndUpdate(
      { "eligibleCandidates.uniqueCertificateCode": uniqueCertCode },
      {
        $set: {
          "eligibleCandidates.$[elem].isDeleted": true,
          lastEdited: new Date(currentDate),
        },
        $inc: { editCount: 1 },
      },
      {
        new: true,
        arrayFilters: [{ "elem.uniqueCertificateCode": uniqueCertCode }],
      }
    );

    if (
      updatedDocument &&
      (uniqueCertificateUrl !== null || uniqueCertificateUrl !== "")
    ) {
      // Get the file path
      const filePath = path.join(__dirname, uniqueCertificateUrl);
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
      }

      // Respond with success message
      return {
        success: true,
        message: "Candidate and certificate deleted successfully",
      };
    } else {
      // Respond with error message if document not found
      return { success: false, message: "Candidate not found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};
