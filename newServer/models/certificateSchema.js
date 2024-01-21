const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    unique: true,
    required: true,
  },
  studentId: {
    type: Number,
    required: true,
  },
  serverPath: {
    type: String,
    unique: true,
    required: true,
  },
  certificate_name: {
    type: String,
    unique: true,
    required: true,
  },
  dateOfIssuing: {
    type: Date,
    required: true,
  },
});
const CertificateDetail = mongoose.model("certificateDetails", certificateSchema);

module.exports = CertificateDetail;
