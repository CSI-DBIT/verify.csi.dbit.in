// import libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const { v4: uuidv4 } = require("uuid");
const xlsx = require("xlsx");
require("dotenv").config();
const cron = require("node-cron");

// importing files
const db = require("./db");
const MemberDetail = require("./models/memberSchema");
const CertificateDetail = require("./models/certificateSchema");
const EventDetail = require("./models/eventSchema");
const { generateCertificateCode, generateEventCode } = require("./utils");
const EligibleCandidates = require("./models/certificateEligibleCandidates");

const app = express();

// Multer storages
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./certificates");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const memberExcel = multer.memoryStorage();
const eligibleCandidatesExcel = multer.memoryStorage();

// Multer milldewares
const memberExcelupload = multer({ storage: memberExcel });
const eligibleCandidatesExcelupload = multer({
  storage: eligibleCandidatesExcel,
});
const certificateStorageupload = multer({ storage: certificateStorage });

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
    "/api/bulk-upload/certificates",
    certificateStorageupload.array("certificate_files"),
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
              message: "File with the same name already exists.",
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

  .get("/api/get/all-certificate", async (req, res) => {
    try {
      const documents = await CertificateDetail.find({});
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  })

  .get("/api/get/all-certificate/:studentId", async (req, res) => {
    try {
      const documents = await CertificateDetail.find({
        studentId: req.params.studentId,
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  })
  .post(
    "/api/bulk-upload/member-details",
    memberExcelupload.single("bulk_upload_memberDetails_excel"),
    async (req, res) => {
      try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Validate data before insertion
        if (!Array.isArray(data) || data.length === 0) {
          return res
            .status(400)
            .json({ error: "Invalid data format or empty data array" });
        }

        // Check if fields in the Excel file match the schema (excluding these fields)
        const memberSchemaPaths = Object.keys(MemberDetail.schema.paths).filter(
          (path) =>
            path !== "__v" &&
            path !== "_id" &&
            path !== "dateOfCreation" &&
            path !== "isDeleted" &&
            path !== "lastDeleted" &&
            path !== "lastEdited" &&
            path !== "lastRevoked" &&
            path !== "deleteCount" &&
            path !== "revokeCount" &&
            path !== "editCount"
        );
        for (const item of data) {
          const itemKeys = Object.keys(item);
          const unknownColumns = itemKeys.filter(
            (key) => !memberSchemaPaths.includes(key)
          );
          if (unknownColumns.length > 0) {
            return res.status(400).json({
              error: `Unknown Columns in Excel data: ${unknownColumns.join(
                ", "
              )}`,
            });
          }

          const missingColumns = memberSchemaPaths.filter(
            (path) => !itemKeys.includes(path)
          );
          if (missingColumns.length > 0) {
            return res.status(400).json({
              error: `Missing Columns or Cells in Excel data: ${missingColumns.join(
                ", "
              )}`,
            });
          }
        }
        // Convert startDate and dateOfCreation to Date objects
        data = data.map((item) => {
          if (item.startDate && !isNaN(Date.parse(item.startDate))) {
            item.startDate = new Date(item.startDate);
          }
          if (item.dateOfCreation && !isNaN(Date.parse(item.dateOfCreation))) {
            item.dateOfCreation = new Date(item.dateOfCreation);
          } else {
            // Set dateOfCreation to today's date if it's not present in the Excel sheet
            item.dateOfCreation = new Date(item.startDate);
          }
          return item;
        });
        console.log(data);
        // Validate each item in the array against the MemberDetail schema
        for (const item of data) {
          try {
            await MemberDetail.validate(item);
          } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
          }
        }
        // If validation passes, insert data into the database
        await MemberDetail.insertMany(data, { ordered: true });
        res.status(200).json({ message: "Data uploaded successfully" });
      } catch (error) {
        console.error(error);
        if (error.code === 11000) {
          // Extract the duplicated key and its value from the error
          const duplicatedKey = Object.keys(error.keyPattern)[0];
          const duplicatedValue = error.keyValue[duplicatedKey];

          return res.status(400).json({
            error: `Duplicate key error. The key "${duplicatedKey}" with value "${duplicatedValue}" already exists.`,
          });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  )

  .get("/api/get/all-members", async (req, res) => {
    try {
      const documents = await MemberDetail.find({ isDeleted: false });
      res.json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .get("/api/get/single-member", async (req, res) => {
    try {
      // Get studentId from query parameters
      const studentId = req.query.studentId;
      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }
      const documents = await MemberDetail.find({ studentId: studentId });
      res.json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .get("/api/get/deleted-members", async (req, res) => {
    try {
      const documents = await MemberDetail.find({ isDeleted: true });
      res.json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  .post("/api/member/add", async (req, res) => {
    try {
      const {
        name,
        email,
        mobileNumber,
        gender,
        studentId,
        branch,
        currentAcademicYear,
        currentSemester,
        duration,
        startDate,
      } = req.body;
      console.log(
        name,
        email,
        mobileNumber,
        gender,
        studentId,
        branch,
        currentAcademicYear,
        currentSemester,
        duration,
        startDate
      );
      // Validate required fields
      if (
        !name ||
        !email ||
        !mobileNumber ||
        !gender ||
        !studentId ||
        !branch ||
        !currentAcademicYear ||
        !currentSemester ||
        !duration ||
        !startDate
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      // Check for invalid numeric values
      if (
        isNaN(Number(mobileNumber)) ||
        isNaN(Number(gender)) ||
        isNaN(Number(studentId)) ||
        isNaN(Number(branch)) ||
        isNaN(Number(currentAcademicYear)) ||
        isNaN(Number(currentSemester)) ||
        isNaN(Number(duration))
      ) {
        return res.status(400).json({ error: "Invalid numeric values" });
      }

      // Create a new MemberDetail instance
      const newMember = new MemberDetail({
        name: String(name),
        email: String(email),
        mobileNumber: Number(mobileNumber),
        gender: Number(gender),
        studentId: Number(studentId),
        branch: Number(branch),
        currentAcademicYear: Number(currentAcademicYear),
        currentSemester: Number(currentSemester),
        duration: Number(duration),
        startDate: Date.parse(startDate),
        dateOfCreation: Date.parse(startDate),
      });
      // Save the new member to the database
      await newMember.save();
      console.log(newMember);
      // Send a success response
      res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        // Extract the duplicated key and its value from the error
        const duplicatedKey = Object.keys(error.keyPattern)[0];
        const duplicatedValue = error.keyValue[duplicatedKey];

        return res.status(400).json({
          error: `Duplicate key error. The key "${duplicatedKey}" with value "${duplicatedValue}" already exists.`,
        });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  })

  .post("/api/member/edit", async (req, res) => {
    try {
      // Get studentId from query parameters
      const studentId = req.query.studentId;
      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }
      // Check if the member exists
      const existingMember = await MemberDetail.findOne({ studentId });
      if (!existingMember) {
        return res.status(404).json({ error: "Member not found" });
      }
      const {
        name,
        email,
        mobileNumber,
        gender,
        branch,
        currentAcademicYear,
        currentSemester,
        duration,
        startDate,
        lastEdited,
      } = req.body;
      await MemberDetail.findOneAndUpdate(
        { studentId },
        {
          $set: {
            name: String(name),
            email: String(email),
            mobileNumber: Number(mobileNumber),
            gender: Number(gender),
            branch: Number(branch),
            currentAcademicYear: Number(currentAcademicYear),
            currentSemester: Number(currentSemester),
            duration: Number(duration),
            startDate: new Date(startDate),
            lastEdited: new Date(lastEdited),
          },
          $inc: { editCount: 1 },
        }
      );
      res.status(200).json({ message: "Member updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .put("/api/member/delete", async (req, res) => {
    try {
      // Get studentId from query parameters
      const studentId = req.query.studentId;
      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      // Extract lastDeleted from request body
      const { lastDeleted } = req.body;
      if (!lastDeleted) {
        return res.status(400).json({ error: "Last Deleted date is required" });
      }

      // Update isDeleted to true and increment deleteCount by 1
      await MemberDetail.findOneAndUpdate(
        { studentId },
        {
          $set: { isDeleted: true, lastDeleted: new Date(lastDeleted) },
          $inc: { deleteCount: 1 },
        }
      );
      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .put("/api/member/revoke", async (req, res) => {
    try {
      // Get studentId from query parameters
      const studentId = req.query.studentId;
      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      // Extract lastRevoked from request body
      const { lastRevoked } = req.body;
      if (!lastRevoked) {
        return res.status(400).json({ error: "Last Revoked date is required" });
      }

      // Update isDeleted to false, set lastRevoked, and increment revokeCount by 1
      await MemberDetail.findOneAndUpdate(
        { studentId },
        {
          $set: { isDeleted: false, lastRevoked: new Date(lastRevoked) },
          $inc: { revokeCount: 1 },
        }
      );

      res.status(200).json({ message: "Member revoked successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .get("/api/get/all-events", async (req, res) => {
    try {
      // Find all events
      const events = await EventDetail.find({ isDeleted: false });
      // Send all events as response
      res.status(200).json({ events });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .post("/api/event/add", async (req, res) => {
    try {
      const {
        name,
        category,
        typeOfEvent,
        branchesAllowed,
        isBranchSpecific,
        academicYearAllowed,
        isAcademicYearSpecific,
        isMemberOnly,
        dateOfCompletion,
        dateOfCreation,
      } = req.body;

      console.log(
        name,
        category,
        typeOfEvent,
        branchesAllowed,
        isBranchSpecific,
        academicYearAllowed,
        isAcademicYearSpecific,
        isMemberOnly,
        dateOfCompletion,
        dateOfCreation
      );

      // Validate required fields
      if (
        !name ||
        !category ||
        !typeOfEvent ||
        !branchesAllowed ||
        !isBranchSpecific ||
        !academicYearAllowed ||
        !isAcademicYearSpecific ||
        !isMemberOnly ||
        !dateOfCompletion ||
        !dateOfCreation
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check for invalid numeric values
      if (
        isNaN(Number(category)) ||
        isNaN(Number(typeOfEvent)) ||
        isNaN(Number(branchesAllowed)) ||
        isNaN(Number(academicYearAllowed))
      ) {
        return res.status(400).json({ error: "Invalid numeric values" });
      }

      let uniqueEventCode = generateEventCode();

      // Check if the generated event code already exists in the database
      let retries = 0;
      const maxRetries = 5; // Maximum number of retries

      // Check if the generated event code already exists in the database
      let existingEvent = await EventDetail.findOne({
        eventCode: uniqueEventCode,
      });
      console.log(existingEvent);
      while (existingEvent) {
        retries++;
        if (retries > maxRetries) {
          return res
            .status(500)
            .json({ error: "Failed to generate a unique event code" });
        }
        uniqueEventCode = generateEventCode(); // Generate a new code
        existingEvent = await EventDetail.findOne({
          eventCode: uniqueEventCode,
        }); // Check again
      }

      // Create a new EventDetail instance with the generated unique code
      const newEvent = new EventDetail({
        eventCode: uniqueEventCode,
        name: String(name),
        category: Number(category),
        typeOfEvent: Number(typeOfEvent),
        branchesAllowed: Number(branchesAllowed),
        isBranchSpecific: isBranchSpecific,
        academicYearAllowed: Number(academicYearAllowed),
        isAcademicYearSpecific: isAcademicYearSpecific,
        isMemberOnly: isMemberOnly,
        dateOfCompletion: new Date(dateOfCompletion),
        dateOfCreation: new Date(dateOfCreation),
      });

      // Save the new event to the database
      console.log(newEvent);
      await newEvent.save();

      // Send a success response
      res
        .status(200)
        .json({ message: "Event added successfully", event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .get("/api/event/details", async (req, res) => {
    // get event details using event code passed in query
    try {
      const { eventCode } = req.query;
      // Validate event code
      if (!eventCode) {
        return res.status(400).json({ error: "Event code is required" });
      }
      // Find event details based on event code
      const event = await EventDetail.findOne({ eventCode: eventCode });
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      // Send event details as response
      res.status(200).json({ event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .post("/api/eligible-candidates/add", async (req, res) => {
    try {
      const {
        eventCode,
        name,
        email,
        mobileNumber,
        branch,
        currentAcademicYear,
        lastEdited,
      } = req.body;

      // Check if the candidate already exists in the memberDetails database
      const existingMember = await MemberDetail.findOne({
        email: email,
        mobileNumber: mobileNumber,
      });
      const uniqueCertificateCode = generateCertificateCode();
      let isMember = false;
      if (existingMember) {
        // If member exists, set isMember to true and generate a unique certificate code
        console.log("existing member");
        isMember = true;
      }

      // Check if a document with the specified event code already exists
      const existingEvent = await EligibleCandidates.findOne({ eventCode });

      const newCandidate = {
        name,
        email,
        mobileNumber,
        branch,
        currentAcademicYear,
        isMember,
        uniqueCertificateCode,
      };

      if (existingEvent) {
        // If document exists, update it by adding the new candidate
        existingEvent.eligibleCandidates.push(newCandidate);
        console.log("pushed new candidate", newCandidate);
        existingEvent.lastEdited = new Date(lastEdited);
        await existingEvent.save();
        res.status(201).json({
          message: "Candidate added to existing Event",
          result: existingEvent,
        });
      } else {
        // If document doesn't exist, create a new one
        const newEvent = await EligibleCandidates.create({
          eventCode: eventCode,
          eligibleCandidates: [newCandidate],
          lastEdited: new Date(lastEdited),
        });
        res.status(201).json({
          message: "New event created with the candidate",
          result: newEvent,
        });
      }
    } catch (error) {
      console.error("Error adding eligible candidates:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .post(
    "/api/bulk-upload/eligible-candidates",
    eligibleCandidatesExcelupload.single(
      "bulk_upload_eligible_candidates_excel"
    ),
    async (req, res) => {
      try {
        const { eventCode, lastEdited } = req.body;
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Validate data before insertion
        if (!Array.isArray(data) || data.length === 0) {
          return res
            .status(400)
            .json({ error: "Invalid data format or empty data array" });
        }
        // Check if fields in the Excel file match the schema (excluding these fields)
        const eligibleCandidatesSchemaPaths = Object.keys(
          EligibleCandidates.schema.paths.eligibleCandidates.schema.paths
        ).filter(
          (path) =>
            path !== "__v" &&
            path !== "_id" &&
            path !== "isMember" &&
            path !== "uniqueCertificateCode"
        );
        console.log(eligibleCandidatesSchemaPaths);

        for (const item of data) {
          const itemKeys = Object.keys(item);
          const unknownColumns = itemKeys.filter(
            (key) => !eligibleCandidatesSchemaPaths.includes(key)
          );
          if (unknownColumns.length > 0) {
            return res.status(400).json({
              error: `Unknown Columns in Excel data: ${unknownColumns.join(
                ", "
              )}`,
            });
          }

          const missingColumns = eligibleCandidatesSchemaPaths.filter(
            (path) => !itemKeys.includes(path)
          );
          if (missingColumns.length > 0) {
            return res.status(400).json({
              error: `Missing Columns or Cells in Excel data: ${missingColumns.join(
                ", "
              )}`,
            });
          }
        }
        // Transform data to match the EligibleCandidates schema
        const transformedData = await Promise.all(
          data.map(async (item) => {
            const existingMember = await MemberDetail.findOne({
              email: item.email,
              mobileNumber: item.mobileNumber,
            });

            return {
              name: item.name,
              email: item.email,
              mobileNumber: item.mobileNumber,
              branch: item.branch,
              currentAcademicYear: item.currentAcademicYear,
              isMember: !!existingMember, // Set to true if member exists, otherwise false
              uniqueCertificateCode: generateCertificateCode(),
            };
          })
        );
        console.log(transformedData);
        // Check if a document with the specified event code already exists
        const existingEvent = await EligibleCandidates.findOne({ eventCode });
        if (existingEvent) {
          // If document exists, update it by adding the new eligible candidates
          existingEvent.eligibleCandidates.push(...transformedData);
          existingEvent.lastEdited = new Date(lastEdited);
          await existingEvent.save();
          res.status(200).json({
            message: "Eligible candidates added to existing event",
            result: existingEvent,
          });
        } else {
          // If document doesn't exist, create a new one
          const newEvent = await EligibleCandidates.create({
            eventCode: eventCode,
            eligibleCandidates: transformedData,
            lastEdited: new Date(lastEdited),
          });
          res.status(200).json({
            message: "New event created with eligible candidates",
            result: newEvent,
          });
        }
      } catch (error) {
        console.error(error);
        if (error.code === 11000) {
          // Extract the duplicated key and its value from the error
          const duplicatedKey = Object.keys(error.keyPattern)[0];
          const duplicatedValue = error.keyValue[duplicatedKey];

          return res.status(400).json({
            error: `Duplicate key error. The key "${duplicatedKey}" with value "${duplicatedValue}" already exists.`,
          });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  )
  .get("/api/get/eligible-candidates", async (req, res) => {
    // get eligible candidates using event code passed in query
    try {
      const { eventCode } = req.query;
      // Validate event code
      if (!eventCode) {
        return res.status(400).json({ error: "Event code is required" });
      }
      // Find event details based on event code
      const eventinfo = await EligibleCandidates.findOne({
        eventCode: eventCode,
      });
      if (!eventinfo) {
        return res.status(404).json({ error: "No Eligible Candidates Added" });
      }
      // Send event details as response
      res.status(200).json({ eventinfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Define a cron job to run every June
cron.schedule("0 0 1 6 *", async () => {
  try {
    // Increment current academic year for all members
    await MemberDetail.updateMany({}, { $inc: { currentAcademicYear: 1 } });
    console.log("Current academic year incremented for all members");
  } catch (error) {
    console.error("Error incrementing academic year:", error);
  }
});
// Define a cron job to run every June and December
cron.schedule("0 0 1 6,12 *", async () => {
  try {
    // Increment current academic year for all members
    await MemberDetail.updateMany({}, { $inc: { currentSemester: 1 } });
    console.log("Current semester incremented for all members");
  } catch (error) {
    console.error("Error incrementing semester:", error);
  }
});

// Connect to the MongoDB database using the `db` object
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
  // Start the server after successfully connecting to the database
  app.listen(process.env.PORT, () => {
    console.log(
      `Server is running on port http://localhost:${process.env.PORT}`
    );
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close(() => {
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  });
});
