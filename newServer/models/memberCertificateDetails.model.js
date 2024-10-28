const mongoose = require("mongoose");

const memberCertificateSchema = new mongoose.Schema({
  uniqueCertificateCode: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  eventCode: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  uniqueCertificateUrl: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  certificate_name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  dateOfIssuing: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
});
const MemberCertificateDetail = mongoose.model(
  "member-certificate-details",
  memberCertificateSchema
);

module.exports = MemberCertificateDetail;
