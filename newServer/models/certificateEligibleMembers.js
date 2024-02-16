const mongoose = require("mongoose");
// CertificateEligibleMember schema
const CertificateEligibleMemberSchema = new mongoose.Schema({
  eventCode: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  eligibleMembers: [
    {
      name: {
        type: mongoose.Schema.Types.String,
      },
      email: {
        type: mongoose.Schema.Types.String,
      },
      branch: {
        type: mongoose.Schema.Types.Number,
      },
      academicYear: {
        type: mongoose.Schema.Types.Number,
      },
      semester: {
        type: mongoose.Schema.Types.Number,
      },
      isMember: {
        type: mongoose.Schema.Types.Number,
      },
      uniqueCertificateCode: {
        type: mongoose.Schema.Types.String,
        unique: true,
      },
    },
  ],
  dateOfCreation: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
});

const CertificateEligibleMembers = mongoose.model("certificateEligibleMembers", eventSchema);
module.exports = CertificateEligibleMembers;
