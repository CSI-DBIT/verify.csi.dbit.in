const EligibleCandidates = require("../../models/EligibleCandidates");
exports.uploadCandidateCertificate = async (
  candidate_certificate,
  candidate_data
) => {
  try {
    const { email, isMember, eventCode, uniqueCertificateCode, currentDate } =
      candidate_data;

    console.log(
      candidate_certificate,
      email,
      isMember,
      eventCode,
      uniqueCertificateCode,
      currentDate
    );
    await EligibleCandidates.findOneAndUpdate(
      {
        eventCode: eventCode,
        "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
      },
      {
        $set: {
          "eligibleCandidates.$[elem].uniqueCertificateUrl":
            candidate_certificate.path,
          lastEdited: new Date(currentDate),
        },
        $inc: { "eligibleCandidates.$[elem].editCount": 1, editCount: 1 },
      },
      {
        new: true,
        arrayFilters: [{ "elem.uniqueCertificateCode": uniqueCertificateCode }],
      }
    );
    return { success: true, message: "Certificates uploaded successfully👍" };
  } catch (error) {
    return { success: false, message: "Internal Server Error" };
  }
};
