const multer = require("multer");

const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./certificates");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const candidate_certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./candidate_certificates");
  },
  filename: (req, file, cb) => {
    const { uniqueCertificateCode } = req.body;
    const fileName = `${uniqueCertificateCode}_${file.originalname
      .replace(/\s+/g, "_")
      .toLowerCase()}`;
    cb(null, fileName);
  },
});

const certificateStorageupload = multer({ storage: certificateStorage });
const candidate_certificateStorageupload = multer({
  storage: candidate_certificateStorage,
});

module.exports = {
  certificateStorageupload,
  candidate_certificateStorageupload,
};
