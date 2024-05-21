const mongoose = require("mongoose");
// Event schema
const eventSchema = new mongoose.Schema({
  eventCode: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  typeOfEvent: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  branchesAllowed: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  academicYearAllowed: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  isBranchSpecific: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  isAcademicYearSpecific: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  isMemberOnly: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  startDate: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  endDate: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  lastEdited: {
    type: mongoose.Schema.Types.Date,
  },
  editCount: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  isDeleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  lastDeleted: {
    type: mongoose.Schema.Types.Date,
  },
  deleteCount: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  dateOfCreation: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
});

const EventDetail = mongoose.model("events", eventSchema);
module.exports = EventDetail;
