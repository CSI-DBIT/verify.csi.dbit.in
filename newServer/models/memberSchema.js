const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  studentId: {
    type: Number,
    unique: true,
    required: true,
  },
  branch: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  dateOfCreation: {
    type: Date,
    required: true
  },
});

const MemberDetail = mongoose.model('memberDetails', memberSchema);
module.exports = MemberDetail;