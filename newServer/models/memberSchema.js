const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.Number,
    unique: true,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  duration: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  startDate: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  isDeleted: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  dateOfCreation: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
});

const MemberDetail = mongoose.model("memberDetails", memberSchema);
module.exports = MemberDetail;
