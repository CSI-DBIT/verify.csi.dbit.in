const mongoose = require("mongoose");
const memberSchema = new mongoose.Schema({
    email: String,
    name: String,
    rollNo: Number,
    branch: Number,
    currentAY: Number,
    studentId: Number,
    startDate: String,
    duration: Number, 
    endDate: String,
  });

  module.exports = memberSchema;