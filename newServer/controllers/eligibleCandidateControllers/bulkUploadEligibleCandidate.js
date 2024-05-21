const { generateCertificateCode } = require("../../utils");
const EligibleCandidates = require("../../models/EligibleCandidates");
const MemberDetail = require("../../models/MemberDetail");

exports.bulkUploadEligibleCandidate = async (candidatesData, fileData) => {
  try {
    const { eventCode, lastEdited } = candidatesData;
    // Validate data before insertion
    if (!Array.isArray(fileData) || fileData.length === 0) {
      return {
        success: false,
        message: "Invalid data format or empty data array",
      };
    }
    // Check if fields in the Excel file match the schema (excluding these fields)
    const eligibleCandidatesSchemaPaths = Object.keys(
      EligibleCandidates.schema.paths.eligibleCandidates.schema.paths
    ).filter(
      (path) =>
        path !== "__v" &&
        path !== "_id" &&
        path !== "isMember" &&
        path !== "isDeleted" &&
        path !== "editCount" &&
        path !== "lastEdited" &&
        path !== "uniqueCertificateUrl" &&
        path !== "emailSentCount" &&
        path !== "dateOfIssuing" &&
        path !== "uniqueCertificateCode"
    );
    console.log(eligibleCandidatesSchemaPaths);

    for (const item of fileData) {
      const itemKeys = Object.keys(item);
      const unknownColumns = itemKeys.filter(
        (key) => !eligibleCandidatesSchemaPaths.includes(key)
      );
      if (unknownColumns.length > 0) {
        return {
          success: false,
          message: `Unknown Columns in Excel data: ${unknownColumns.join(
            ", "
          )}`,
        };
      }

      const missingColumns = eligibleCandidatesSchemaPaths.filter(
        (path) => !itemKeys.includes(path)
      );
      if (missingColumns.length > 0) {
        return {
          success: false,
          message: `Missing Columns or Cells in Excel data: ${missingColumns.join(
            ", "
          )}`,
        };
      }
    }
    // Transform data to match the EligibleCandidates schema
    const transformedData = await Promise.all(
      fileData.map(async (item) => {
        const existingMember = await MemberDetail.findOne({
          email: item.email,
          isDeleted: false,
        });
        let isMember = false;
        if (existingMember) {
          // Check if the current date is less than startDate + duration
          const { startDate, duration } = existingMember;
          const endDate = new Date(
            startDate.getTime() + duration * 365 * 24 * 60 * 60 * 1000
          ); // Adding duration to startDate
          if (new Date() < endDate) {
            // If member exists and current date is within validity period, set isMember to true
            console.log("Existing member within validity period");
            isMember = true;
          } else {
            console.log("Existing member, but membership has expired");
          }
        }

        return {
          name: item.name,
          email: item.email,
          mobileNumber: item.mobileNumber,
          branch: item.branch,
          currentAcademicYear: item.currentAcademicYear,
          isMember: isMember, // Set to true if member exists, otherwise false
          uniqueCertificateCode: generateCertificateCode(),
        };
      })
    );
    console.log(transformedData);
    // Check if a document with the specified event code already exists
    const eligibleCandidateData = await EligibleCandidates.findOne({
      eventCode,
    });
    if (eligibleCandidateData) {
      // Remove duplicates based on email within the existing eligible candidates
      const existingEmails = new Set(
        eligibleCandidateData.eligibleCandidates.map((c) => c.email)
      );
      const newCandidates = transformedData.filter(
        (candidate) => !existingEmails.has(candidate.email)
      );

      // Handle duplicate emails within the new candidates
      const newCandidateEmails = new Set();
      const finalNewCandidates = [];

      for (const candidate of newCandidates) {
        if (!newCandidateEmails.has(candidate.email)) {
          newCandidateEmails.add(candidate.email);
          finalNewCandidates.push(candidate);
        }
      }
      // Add the new candidates to the existing event document
      eligibleCandidateData.eligibleCandidates.push(...finalNewCandidates);
      eligibleCandidateData.lastEdited = new Date(lastEdited);
      await eligibleCandidateData.save();
      return {
        success: true,
        message: "Eligible candidates added to existing event",
      };
    } else {
      // Handle duplicate emails within the initial set of candidates for a new event
      const uniqueCandidates = [];
      const emailSet = new Set();

      for (const candidate of transformedData) {
        if (!emailSet.has(candidate.email)) {
          emailSet.add(candidate.email);
          uniqueCandidates.push(candidate);
        }
      }

      // Create a new document for the event
      const newEvent = await EligibleCandidates.create({
        eventCode: eventCode,
        eligibleCandidates: uniqueCandidates,
        lastEdited: new Date(lastEdited),
      });

      return {
        success: true,
        message: "New event created with eligible candidates",
        result: newEvent,
      };
    }
  } catch (error) {
    console.error("error bulk uploading eligible candidates", error);
    return { success: false, message: "Internal server error" };
  }
};
