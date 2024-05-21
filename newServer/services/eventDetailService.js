const EventDetail = require("../models/EventDetail");
const memberDetailService = require("./memberDetailService");

const getEventDetails = async (eventCode) => {
  try {
    const eventDetails = await EventDetail.findOne({ eventCode });
    return eventDetails;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};

const fetchCertificatesDetails = async (memberDetails, eligibleCandidates) => {
  try {
    const data = {
      memberDetails: memberDetails,
      certificatesDetails: [],
    };

    for (const eligibleCandidate of eligibleCandidates) {
      const eventDetails = await getEventDetails(eligibleCandidate.eventCode);
      console.log(eventDetails);
      for (const eligibleCandidateData of eligibleCandidate.eligibleCandidates) {
        if (
          eligibleCandidateData.email == memberDetails.email &&
          eligibleCandidateData.uniqueCertificateUrl != ""
        ) {
          data.certificatesDetails.push({
            eventCode: eligibleCandidate.eventCode,
            uniqueCertificateCode: eligibleCandidateData.uniqueCertificateCode,
            uniqueCertificateUrl: eligibleCandidateData.uniqueCertificateUrl,
            emailSentCount: eligibleCandidateData.emailSentCount,
            name: eventDetails.name,
            category: eventDetails.category,
            typeOfEvent: eventDetails.typeOfEvent,
            branchesAllowed: eventDetails.branchesAllowed,
            academicYearAllowed: eventDetails.academicYearAllowed,
            isBranchSpecific: eventDetails.isBranchSpecific,
            isAcademicYearSpecific: eventDetails.isAcademicYearSpecific,
            isMemberOnly: eventDetails.isMemberOnly,
            startDate: eventDetails.startDate,
            endDate: eventDetails.endDate,
            isDeleted: eventDetails.isDeleted,
          });
        }
      }
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching certificates details:", error);
    throw error;
  }
};

module.exports = {
  fetchCertificatesDetails,
};
