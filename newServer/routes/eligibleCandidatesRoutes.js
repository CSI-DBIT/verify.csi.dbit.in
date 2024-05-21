const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const { candidate_certificateStorageupload } = require("../multer/diskStorage");
const { eligibleCandidatesExcelupload } = require("../multer/memoryStorage");
const certificateUploadController = require("../controllers/eligibleCandidateControllers/certificateUpload");
const certificateDeleteController = require("../controllers/eligibleCandidateControllers/certificateDelete");
const addEligibleCandidateController = require("../controllers/eligibleCandidateControllers/addEligibleCandidate");
const bulkUploadEligibleCandidateController = require("../controllers/eligibleCandidateControllers/bulkUploadEligibleCandidate");
const editEligibleCandidateController = require("../controllers/eligibleCandidateControllers/editEligibleCandidate");
const deleteEligibleCandidateController = require("../controllers/eligibleCandidateControllers/deleteEligibleCandidate");
const getAllEligibleCandidateController = require("../controllers/eligibleCandidateControllers/getAllEligibleCandidate");
const getEligibleCandidateCertificateController = require("../controllers/eligibleCandidateControllers/getEligibleCandidateCertificate");

router.post(
  "/certificate/upload",
  candidate_certificateStorageupload.single("candidate_certificate"),
  async (req, res) => {
    const candidate_certificate = req.file;
    const result = await certificateUploadController.uploadCandidateCertificate(
      candidate_certificate,
      req.body
    );
    res.status(200).json({
      success: result.success,
      message: result.message,
      eventData: result.data,
    });
  }
);
router.put("/certificate/delete", async (req, res) => {
  const result = await certificateDeleteController.deleteCandidateCertificate(
    req.body
  );
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});
router.post("/add", async (req, res) => {
  const result = await addEligibleCandidateController.addEligibleCandidate(
    req.body
  );
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});
router.post(
  "/bulk-upload",
  eligibleCandidatesExcelupload.single("bulk_upload_eligible_candidates_excel"),
  async (req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    let fileData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const result =
      await bulkUploadEligibleCandidateController.bulkUploadEligibleCandidate(
        req.body,
        fileData
      );
    res.status(200).json({
      success: result.success,
      message: result.message,
      eventData: result.data,
    });
  }
);
router.put("/edit", async (req, res) => {
  const uniqueCertCode = req.query.uniqueCertCode;
  const eventCode = req.query.eventCode;
  const result = await editEligibleCandidateController.editEligibleCandidate(
    uniqueCertCode,
    eventCode,
    req.body
  );
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});
router.put("/delete", async (req, res) => {
  const uniqueCertCode = req.query.uniqueCertCode;
  const result =
    await deleteEligibleCandidateController.deleteEligibleCandidate(
      uniqueCertCode,
      req.body
    );
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});
router.get("/get/all", async (req, res) => {
  const { eventCode } = req.query;
  const result =
    await getAllEligibleCandidateController.getAllEligibleCandidate(eventCode);
  res.status(200).json({
    success: result.success,
    message: result.message,
    eligibleCandidates: result.data,
  });
});
router.get("/get/certificate", async (req, res) => {
  const uniqueCertificateCode = req.query.uniqueCertificateCode;
  const result =
    await getEligibleCandidateCertificateController.getEligibleCandidateCertificate(
      uniqueCertificateCode
    );
  res.status(200).json({
    success: result.success,
    message: result.message,
    certificateDetails: result.data.certificateDetails,
    eventDetails: result.data.eventDetails,
  });
});

module.exports = router;
