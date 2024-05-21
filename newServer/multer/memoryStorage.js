const multer = require("multer");

const memberExcel = multer.memoryStorage();
const eligibleCandidatesExcel = multer.memoryStorage();

const memberExcelupload = multer({ storage: memberExcel });
const eligibleCandidatesExcelupload = multer({
  storage: eligibleCandidatesExcel,
});

module.exports = { memberExcelupload, eligibleCandidatesExcelupload };
