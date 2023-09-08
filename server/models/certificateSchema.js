const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    studentId: Number,
    tag: [String],
    path: String
});

module.exports = certificateSchema;