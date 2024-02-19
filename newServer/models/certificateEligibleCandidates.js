const mongoose = require("mongoose");
// certificate eligible Candidate schema
const eligibleCandidateSchema = new mongoose.Schema({
  eventCode: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  eligibleCandidates: [
    {
      name: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
      email: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
      mobileNumber: {
        type: mongoose.Schema.Types.Number,
        required: true,
      },
      branch: {
        type: mongoose.Schema.Types.Number,
        required: true,
      },
      currentAcademicYear: {
        type: mongoose.Schema.Types.Number,
        required: true,
      },
      isMember: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
      },
      uniqueCertificateCode: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
      },
      isDeleted: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
      },
      editCount: {
        type: mongoose.Schema.Types.Number,
        default: 0,
      },
      lastEdited: {
        type: mongoose.Schema.Types.Date,
      },
    },
  ],
  lastEdited: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  editCount: {
    type: mongoose.Schema.Types.Number,
  },
  isDelete: {
    type: mongoose.Schema.Types.Boolean,
  },
  lastDeleted: {
    type: mongoose.Schema.Types.Date,
  },
});

const EligibleCandidates = mongoose.model(
  "eligible-candidates",
  eligibleCandidateSchema
);
module.exports = EligibleCandidates;
