// import libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
// importing files
const db = require("./db");
const MemberDetail = require("./models/memberSchema");
const CertificateDetail = require("./models/certificateSchema");

const app = express();
const PORT = process.env.PORT;

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./certificates");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app
  .use(cors())
  .use(express.json())
  .use("/certificates", express.static(path.join(__dirname, "certificates")))
  .use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error❌" });
  })

  // api routes
  .get("/", (req, res) => {
    res.send("hello server");
  })

  .post(
    "/api/upload-certificates",
    upload.array("certificate_files"),
    async (req, res) => {
      try {
        const files = req.files;
        const certificateBody = req.body;

        // Iterate through each uploaded file
        for (const file of files) {
          // Check if a file with the same name already exists in the destination directory
          const existingFile = await CertificateDetail.findOne({
            serverPath: path.join("certificates", file.filename),
          });

          if (existingFile) {
            // Handle duplicate file error
            return res.status(400).json({
              message:
                "File with the same name already exists.",
            });
          }

          // Your existing code for generating short ID and extracting details from the file name
          shortid.characters(
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$"
          );

          const generateShortIdForUuid = () => {
            const uuid = uuidv4(file.filename);
            const shortId = shortid.generate(uuid);
            return shortId;
          };

          const shortIdForUuid = generateShortIdForUuid();
          const [studentId, originalCertificateName] =
            file.originalname.split("_");

          const certificate = new CertificateDetail({
            uniqueId: shortIdForUuid,
            studentId: parseInt(studentId, 10),
            serverPath: path.join("certificates", file.filename),
            certificate_name:
              studentId +
              "_" +
              path.parse(originalCertificateName).name.toLowerCase(),
            dateOfIssuing: Date(certificateBody.dateOfIssuing),
          });

          console.log(certificate);
          await certificate.save();
        }
        res
          .status(200)
          .json({ message: "Certificates uploaded successfully👍" });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  )

  .get("/api/get-all-certificate", async (req, res) => {
    try {
      const documents = await CertificateDetail.find({});
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  })

  .get("/api/get-all-certificate/:studentId", async (req, res) => {
    try {
      const documents = await CertificateDetail.find({
        studentId: req.params.studentId,
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  })

// Connect to the MongoDB database using the `db` object
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
  // Start the server after successfully connecting to the database
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close(() => {
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  });
});
