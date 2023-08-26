// import libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// importing files 
const db = require('./db');
// import schemas
const memberSchema = require("./models/memberSchema");

// Databse Connection
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const MemberDetail = mongoose.model('memberdetails', memberSchema);
app.post('/api/student', async (req, res) => {
  const studentId = req.body.studentId;
  try {
    const document = await MemberDetail.findOne({
      "studentId": studentId
    });
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
