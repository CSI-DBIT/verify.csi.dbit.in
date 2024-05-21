const EligibleCandidates = require("../../models/EligibleCandidates");
const EventDetail = require("../../models/EventDetail");
exports.getEligibleCandidateCertificate = async (uniqueCertificateCode) => {
  try {
    console.log(uniqueCertificateCode);
    const candidate = await EligibleCandidates.findOne({
      "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
    });
    console.log(candidate);

    if (!candidate) {
      return { success: false, message: "Invalid cretificate code" };
    }
    const eventDetails = await EventDetail.findOne({
      eventCode: candidate.eventCode,
    });

    const certificateDetails = candidate.eligibleCandidates.find(
      (c) => c.uniqueCertificateCode === uniqueCertificateCode
    );
    console.log(certificateDetails, eventDetails);
    // Return the candidate details
    return {
      success: true,
      message: "successfully fetched event and certificate details",
      data: { certificateDetails, eventDetails },
    };
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
