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
const fs = require("fs");
const QRCode = require("qrcode");
// importing files
const db = require("./db");
const MemberDetail = require("./models/memberSchema");
const CertificateDetail = require("./models/certificateSchema");
const EventDetail = require("./models/eventSchema");
const {
  generateCertificateCode,
  generateEventCode,
  createTransporter,
} = require("./utils");
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
const candidate_certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./candidate_certificates");
  },
  filename: (req, file, cb) => {
    const { eventCode, uniqueCertificateCode } = req.body;
    const fileName = `${uniqueCertificateCode}_${file.originalname}`;
    cb(null, fileName);
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
const candidate_certificateStorageupload = multer({
  storage: candidate_certificateStorage,
});

app
  .use(cors())
  .use(express.json())
  .use("/certificates", express.static(path.join(__dirname, "certificates")))
  .use(
    "/candidate_certificates",
    express.static(path.join(__dirname, "candidate_certificates"))
  )
  .use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error❌" });
  })

  // api routes
  .get("/", (req, res) => {
    res.send("hello server");
  })

  .post(
    "/api/eligible-candidate/certificate/upload",
    candidate_certificateStorageupload.single("candidate_certificate"),
    async (req, res) => {
      try {
        const candidate_certificate = req.file;
        const {
          email,
          isMember,
          eventCode,
          uniqueCertificateCode,
          currentDate,
        } = req.body;

        console.log(
          candidate_certificate,
          email,
          isMember,
          eventCode,
          uniqueCertificateCode,
          currentDate
        );
        await EligibleCandidates.findOneAndUpdate(
          {
            eventCode: eventCode,
            "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
          },
          {
            $set: {
              "eligibleCandidates.$[elem].uniqueCertificateUrl":
                candidate_certificate.path,
              lastEdited: new Date(currentDate),
            },
            $inc: { "eligibleCandidates.$[elem].editCount": 1, editCount: 1 },
          },
          {
            new: true,
            arrayFilters: [
              { "elem.uniqueCertificateCode": uniqueCertificateCode },
            ],
          }
        );
        res
          .status(200)
          .json({ message: "Certificates uploaded successfully👍" });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  )
  .put("/api/eligible-candidate/certificate/delete", async (req, res) => {
    try {
      const {
        eventCode,
        uniqueCertificateCode,
        uniqueCertificateUrl,
        currentDate,
        isMember,
      } = req.body;

      console.log(
        eventCode,
        uniqueCertificateCode,
        uniqueCertificateUrl,
        currentDate,
        isMember
      );

      // Find and update the document in the database
      const updatedDocument = await EligibleCandidates.findOneAndUpdate(
        {
          eventCode: eventCode,
          "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
        },
        {
          $set: {
            "eligibleCandidates.$[elem].uniqueCertificateUrl": "",
            lastEdited: new Date(currentDate),
          },
          $inc: { "eligibleCandidates.$[elem].editCount": 1, editCount: 1 },
        },
        {
          new: true,
          arrayFilters: [
            { "elem.uniqueCertificateCode": uniqueCertificateCode },
          ],
        }
      );

      // If the document is updated successfully, proceed to delete the file
      if (updatedDocument) {
        // Get the file path
        const filePath = path.join(__dirname, uniqueCertificateUrl);
        // Check if the file exists
        if (fs.existsSync(filePath)) {
          // Delete the file
          fs.unlinkSync(filePath);
        }

        // Respond with success message
        res.status(200).json({ message: "Certificate deleted successfully👍" });
      } else {
        // Respond with error message if document not found
        res.status(404).json({ message: "Certificate not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
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

        const duplicates = [];

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

        // Check for duplicates
        for (const item of data) {
          const existingMember = await MemberDetail.findOne(item);
          if (existingMember) {
            duplicates.push(existingMember);
          }
        }

        // If duplicates found, send response with duplicate key and value
        if (duplicates.length > 0) {
          return res.status(400).json({
            error: "Duplicate key error.",
            duplicates: duplicates,
          });
        }

        // If validation passes and no duplicates, insert data into the database
        await MemberDetail.insertMany(data, { ordered: true });
        res.status(200).json({ message: "Data uploaded successfully" });
      } catch (error) {
        console.error(error);
        if (error.code === 11000) {
          return res.status(400).json({
            error: `Duplicate key error.`,
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
        currentDate,
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
        startDate,
        currentDate
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
        !currentDate ||
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
        startDate: new Date(startDate),
        dateOfCreation: new Date(currentDate),
      });
      // Save the new member to the database
      await newMember.save();
      await EligibleCandidates.updateMany(
        {
          "eligibleCandidates.email": email,
          "eligibleCandidates.mobileNumber": mobileNumber,
        },
        {
          $set: {
            "eligibleCandidates.$.isMember": true,
            "eligibleCandidates.$.lastEdited": new Date(currentDate),
            lastEdited: new Date(currentDate),
          },
          $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
        }
      );
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
      console.log(startDate, duration);
      const endDate = new Date(
        new Date(startDate).getTime() +
          Number(duration) * 365 * 24 * 60 * 60 * 1000
      );
      const isMembershipValid = new Date() < endDate;
      if (isMembershipValid) {
        await EligibleCandidates.updateMany(
          {
            "eligibleCandidates.email": email,
            "eligibleCandidates.mobileNumber": mobileNumber,
          },
          {
            $set: {
              "eligibleCandidates.$.isMember": true,
              "eligibleCandidates.$.lastEdited": new Date(lastEdited),
              lastEdited: new Date(lastEdited),
            },
            $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
          }
        );
      } else {
        await EligibleCandidates.updateMany(
          {
            "eligibleCandidates.email": email,
            "eligibleCandidates.mobileNumber": mobileNumber,
          },
          {
            $set: {
              "eligibleCandidates.$.isMember": false,
              "eligibleCandidates.$.lastEdited": new Date(lastEdited),
              lastEdited: new Date(lastEdited),
            },
            $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
          }
        );
      }

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
      const { currentDate, email, mobileNumber } = req.body;
      if (!currentDate) {
        return res.status(400).json({ error: "Last Deleted date is required" });
      }

      // Update isDeleted to true and increment deleteCount by 1
      await MemberDetail.findOneAndUpdate(
        { studentId },
        {
          $set: { isDeleted: true, lastDeleted: new Date(currentDate) },
          $inc: { deleteCount: 1 },
        }
      );
      await EligibleCandidates.updateMany(
        {
          "eligibleCandidates.email": email,
          "eligibleCandidates.mobileNumber": mobileNumber,
        },
        {
          $set: {
            "eligibleCandidates.$.isMember": false,
            "eligibleCandidates.$.lastEdited": new Date(currentDate),
            lastEdited: new Date(currentDate),
          },
          $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
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
      const { currentDate, email, mobileNumber } = req.body;
      if (!currentDate) {
        return res.status(400).json({ error: "Last Revoked date is required" });
      }

      // Update isDeleted to false, set lastRevoked, and increment revokeCount by 1
      await MemberDetail.findOneAndUpdate(
        { studentId },
        {
          $set: { isDeleted: false, lastRevoked: new Date(currentDate) },
          $inc: { revokeCount: 1 },
        }
      );
      await EligibleCandidates.updateMany(
        {
          "eligibleCandidates.email": email,
          "eligibleCandidates.mobileNumber": mobileNumber,
        },
        {
          $set: {
            "eligibleCandidates.$.isMember": true,
            "eligibleCandidates.$.lastEdited": new Date(currentDate),
            lastEdited: new Date(currentDate),
          },
          $inc: { "eligibleCandidates.$.editCount": 1, editCount: 1 },
        }
      );

      res.status(200).json({ message: "Member revoked successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
  //event logic

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
        startDate,
        endDate,
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
        startDate,
        endDate,
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
        !startDate ||
        !endDate ||
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
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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

  .post("/api/event/edit", async (req, res) => {
    try {
      // Get studentId from query parameters
      const eventCode = req.query.eventCode;
      if (!eventCode) {
        return res.status(400).json({ error: "Event Code is required" });
      }
      // Check if the member exists
      const existingEvent = await EventDetail.findOne({ eventCode });
      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      const {
        name,
        category,
        typeOfEvent,
        branchesAllowed,
        academicYearAllowed,
        isMemberOnly,
        endDate,
        lastEdited,
      } = req.body;
      await EventDetail.findOneAndUpdate(
        { eventCode: eventCode },
        {
          $set: {
            name: String(name),
            category: Number(category),
            typeOfEvent: Number(typeOfEvent),
            branchesAllowed: Number(branchesAllowed),
            academicYearAllowed: Number(academicYearAllowed),
            isMemberOnly: Boolean(isMemberOnly),
            endDate: new Date(endDate),
            lastEdited: new Date(lastEdited),
          },
          $inc: { editCount: 1 },
        }
      );
      res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .put("/api/event/delete", async (req, res) => {
    try {
      // Get studentId from query parameters
      const eventCode = req.query.eventCode;
      if (!eventCode) {
        return res.status(400).json({ error: "Event Code is required" });
      }

      // Extract lastDeleted from request body
      const { lastDeleted } = req.body;
      if (!lastDeleted) {
        return res.status(400).json({ error: "Last Deleted date is required" });
      }

      // Update isDeleted to true and increment deleteCount by 1
      await EventDetail.findOneAndUpdate(
        { eventCode },
        {
          $set: { isDeleted: true, lastDeleted: new Date(lastDeleted) },
          $inc: { deleteCount: 1 },
        }
      );
      await EligibleCandidates.findOneAndUpdate(
        { eventCode },
        {
          $set: { isDeleted: true, lastDeleted: new Date(lastDeleted) },
        }
      );
      res.status(200).json({ message: "Event deleted successfully" });
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
      const event = await EventDetail.findOne({
        eventCode: eventCode,
        isDeleted: false,
      });
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
  // .post("/api/event/send-certificate-emails", async (req, res) => {
  //   // get event details using event code passed in query
  //   try {
  //     const eventCode = req.query.eventCode;
  //     const { candidateEmails, currentDate } = req.body;
  //     // Validate event code
  //     if (!eventCode || !candidateEmails) {
  //       return res.status(400).json({ error: "Event code is required" });
  //     }
  //     console.log(candidateEmails,eventCode);
  //     //emailOptions - who sends what to whom
  //     const sendEmail = async (emailOptions) => {
  //       let emailTransporter = await createTransporter();
  //       await emailTransporter.sendMail(emailOptions);
  //     };
  //     const certificateSentMail = () => {
  //       return `<!DOCTYPE html>
  //       <html lang="en">
  //       <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>Confirm your email address</title>
  //         <style>
  //           body {
  //             background-color: #ffffff;
  //             margin: 0 auto;
  //             font-family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
  //           }

  //           .container {
  //             margin: 0 auto;
  //             padding: 0px 20px;
  //           }

  //           .logo-container {
  //             margin-top: 32px;
  //           }

  //           h1 {
  //             color: #1d1c1d;
  //             font-size: 36px;
  //             font-weight: 700;
  //             margin: 30px 0;
  //             padding: 0;
  //             line-height: 42px;
  //           }

  //           .hero-text {
  //             font-size: 20px;
  //             line-height: 28px;
  //             margin-bottom: 30px;
  //           }

  //           .code-box {
  //             background: rgb(245, 244, 245);
  //             border-radius: 4px;
  //             margin-bottom: 30px;
  //             padding: 40px 10px;
  //           }

  //           .confirmation-code-text {
  //             font-size: 30px;
  //             text-align: center;
  //             vertical-align: middle;
  //           }

  //           p {
  //             color: #000;
  //             font-size: 14px;
  //             line-height: 24px;
  //           }

  //           .footer-text {
  //             font-size: 12px;
  //             color: #b7b7b7;
  //             line-height: 15px;
  //             text-align: left;
  //             margin-bottom: 50px;
  //           }

  //           .footer-link {
  //             color: #b7b7b7;
  //             text-decoration: underline;
  //           }

  //           .footer-logos {
  //             margin-bottom: 32px;
  //             padding-left: 8px;
  //             padding-right: 8px;
  //             width: 100%;
  //           }

  //           .social-media-icon {
  //             display: inline;
  //             margin-left: 32px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <div class="logo-container">
  //             <img src="slack-logo.png" alt="Slack" width="120" height="36">
  //           </div>
  //           <h1>Confirm your email address</h1>
  //           <p class="hero-text">
  //             Your confirmation code is below - enter it in your open browser window and we'll help you get signed in.
  //           </p>

  //           <div class="code-box">
  //             <p class="confirmation-code-text">DJZ-TLX</p>
  //           </div>

  //           <p>
  //             If you didn't request this email, there's nothing to worry about, you can safely ignore it.
  //           </p>

  //           <div class="footer-logos">
  //             <img src="slack-logo.png" alt="Slack" width="120" height="36">
  //             <div>
  //               <a href="/">
  //                 <img src="slack-twitter.png" alt="Slack" width="32" height="32" class="social-media-icon">
  //               </a>
  //               <a href="/">
  //                 <img src="slack-facebook.png" alt="Slack" width="32" height="32" class="social-media-icon">
  //               </a>
  //               <a href="/">
  //                 <img src="slack-linkedin.png" alt="Slack" width="32" height="32" class="social-media-icon">
  //               </a>
  //             </div>
  //           </div>

  //           <div>
  //             <a class="footer-link" href="https://slackhq.com" target="_blank" rel="noopener noreferrer">Our blog</a>
  //             &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  //             <a class="footer-link" href="https://slack.com/legal" target="_blank" rel="noopener noreferrer">Policies</a>
  //             &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  //             <a class="footer-link" href="https://slack.com/help" target="_blank" rel="noopener noreferrer">Help center</a>
  //             &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  //             <a class="footer-link" href="https://slack.com/community" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="6">Slack Community</a>
  //             <p class="footer-text">
  //               ©2022 Slack Technologies, LLC, a Salesforce company. <br />
  //               500 Howard Street, San Francisco, CA 94105, USA <br />
  //               <br />
  //               All rights reserved.
  //             </p>
  //           </div>
  //         </div>
  //       </body>
  //       </html>`;
  //     };
  //     sendEmail({
  //       subject: "Test",
  //       to: "omjannu2002@gmail.com",
  //       from: process.env.EMAIL,
  //       html: certificateSentMail(),
  //     });

  //     console.log("email sent");
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // })

  .post("/api/event/send-certificate-emails", async (req, res) => {
    // get event details using event code passed in query
    try {
      const eventCode = req.query.eventCode;
      const { candidateEmails, currentDate } = req.body;
      // Validate event code
      if (!eventCode || !candidateEmails) {
        return res.status(400).json({ error: "Event code is required" });
      }

      // Fetch event details
      const eventDetails = await EventDetail.findOne({ eventCode });

      if (!eventDetails) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Fetch user's details including certificate file path
      const getUserDetails = async (eventCode, userEmail) => {
        try {
          // Find the document with the given eventCode
          const eligibleCandidates = await EligibleCandidates.findOne({
            eventCode,
          });

          if (!eligibleCandidates) {
            throw new Error("Event not found");
          }

          // Find the eligible candidate with the given email
          const candidate = eligibleCandidates.eligibleCandidates.find(
            (candidate) => candidate.email === userEmail
          );

          if (!candidate) {
            throw new Error("Candidate not found for the provided email");
          }

          // Update emailSentCount, editCount, and lastEdited fields
          candidate.emailSentCount += 1;
          candidate.editCount += 1;
          candidate.lastEdited = new Date(currentDate);

          // Save the updated document
          await eligibleCandidates.save();

          // Return the candidate details
          return {
            name: candidate.name,
            uniqueCertificateCode: candidate.uniqueCertificateCode,
            certificateFilePath: candidate.uniqueCertificateUrl,
          };
        } catch (error) {
          throw new Error(`Error fetching user details: ${error.message}`);
        }
      };

      // Email template with user's details
      const generateEmailContent = async (candidateEmail) => {
        const userDetails = await getUserDetails(eventCode, candidateEmail);

        // Read certificate file
        const certificateFile = fs.readFileSync(
          userDetails.certificateFilePath
        );

        return {
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Confirm your email address</title>
              <style>
                body {
                  background-color: #ffffff;
                  margin: 0 auto;
                  font-family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
                }

                .container {
                  margin: 0 auto;
                  padding: 0px 20px;
                }

                .logo-container {
                  margin-top: 32px;
                }

                h1 {
                  color: #1d1c1d;
                  font-size: 36px;
                  font-weight: 700;
                  margin: 30px 0;
                  padding: 0;
                  line-height: 42px;
                }

                .hero-text {
                  font-size: 20px;
                  line-height: 28px;
                  margin-bottom: 30px;
                }

                .code-box {
                  background: rgb(245, 244, 245);
                  border-radius: 4px;
                  margin-bottom: 30px;
                  padding: 40px 10px;
                }

                .confirmation-code-text {
                  font-size: 30px;
                  text-align: center;
                  vertical-align: middle;
                }

                p {
                  color: #000;
                  font-size: 14px;
                  line-height: 24px;
                }

                .footer-text {
                  font-size: 12px;
                  color: #b7b7b7;
                  line-height: 15px;
                  text-align: left;
                  margin-bottom: 50px;
                }

                .footer-link {
                  color: #b7b7b7;
                  text-decoration: underline;
                }

                .footer-logos {
                  margin-bottom: 32px;
                  padding-left: 8px;
                  padding-right: 8px;
                  width: 100%;
                }

                .social-media-icon {
                  display: inline;
                  margin-left: 32px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo-container">
                  <img src="slack-logo.png" alt="Slack" width="120" height="36" />
                </div>
                <h1>Hello ${userDetails.name},</h1>
                <p class="hero-text">
                This is an authentic and verified certificate code for the event ${
                  eventDetails.name
                } conducted on ${eventDetails.startDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}.
                </p>

                <div class="code-box">
                  <p class="confirmation-code-text">${
                    userDetails.uniqueCertificateCode
                  }</p>
                </div>

                <div class="footer-logos">
                  <img src="slack-logo.png" alt="Slack" width="120" height="36" />
                  <div>
                    <a href="/">
                      <img
                        src="slack-twitter.png"
                        alt="Slack"
                        width="32"
                        height="32"
                        class="social-media-icon"
                      />
                    </a>
                    <a href="/">
                      <img
                        src="slack-facebook.png"
                        alt="Slack"
                        width="32"
                        height="32"
                        class="social-media-icon"
                      />
                    </a>
                    <a href="/">
                      <img
                        src="slack-linkedin.png"
                        alt="Slack"
                        width="32"
                        height="32"
                        class="social-media-icon"
                      />
                    </a>
                  </div>
                </div>

                <div>
                  <a
                    class="footer-link"
                    href="https://slackhq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Our blog</a
                  >
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <a
                    class="footer-link"
                    href="https://slack.com/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Policies</a
                  >
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <a
                    class="footer-link"
                    href="https://slack.com/help"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Help center</a
                  >
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <a
                    class="footer-link"
                    href="https://slack.com/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-auth="NotApplicable"
                    data-linkindex="6"
                    >Slack Community</a
                  >
                  <p class="footer-text">
                    ©2022 Slack Technologies, LLC, a Salesforce company. <br />
                    500 Howard Street, San Francisco, CA 94105, USA <br />
                    <br />
                    All rights reserved.
                  </p>
                </div>
              </div>
            </body>
          </html>

          `,
          attachment: {
            filename: `${eventDetails.name}-${userDetails.name}.pdf`,
            content: certificateFile,
          },
        };
      };

      // Email sender function
      const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
      };

      // Send email to each candidate
      for (const candidateEmail of candidateEmails) {
        const { html, attachment } = await generateEmailContent(candidateEmail);

        // Setup email options
        const emailOptions = {
          subject: "Test",
          to: candidateEmail,
          from: process.env.EMAIL,
          html: html,
          attachments: [attachment],
        };

        // Send email
        await sendEmail(emailOptions);
        console.log(`Email sent to ${candidateEmail}`);
      }

      console.log("All emails sent");
      res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .post("/api/event/send-certificate-emails", async (req, res) => {
    try {
      const eventCode = req.query.eventCode;
      const { candidateEmails, currentDate } = req.body;

      // Validate event code and candidate emails
      if (!eventCode || !candidateEmails) {
        return res
          .status(400)
          .json({ error: "Event code and candidate emails are required" });
      }

      // Function to get HTML content for certificate email
      const getCertificateEmailContent = () => {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirm your email address</title>
              <style>
                body {
                  background-color: #ffffff;
                  margin: 0 auto;
                  font-family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
                }
            
                .container {
                  margin: 0 auto;
                  padding: 0px 20px;
                }
            
                .logo-container {
                  margin-top: 32px;
                }
            
                h1 {
                  color: #1d1c1d;
                  font-size: 36px;
                  font-weight: 700;
                  margin: 30px 0;
                  padding: 0;
                  line-height: 42px;
                }
            
                .hero-text {
                  font-size: 20px;
                  line-height: 28px;
                  margin-bottom: 30px;
                }
            
                .code-box {
                  background: rgb(245, 244, 245);
                  border-radius: 4px;
                  margin-bottom: 30px;
                  padding: 40px 10px;
                }
            
                .confirmation-code-text {
                  font-size: 30px;
                  text-align: center;
                  vertical-align: middle;
                }
            
                p {
                  color: #000;
                  font-size: 14px;
                  line-height: 24px;
                }
            
                .footer-text {
                  font-size: 12px;
                  color: #b7b7b7;
                  line-height: 15px;
                  text-align: left;
                  margin-bottom: 50px;
                }
            
                .footer-link {
                  color: #b7b7b7;
                  text-decoration: underline;
                }
            
                .footer-logos {
                  margin-bottom: 32px;
                  padding-left: 8px;
                  padding-right: 8px;
                  width: 100%;
                }
            
                .social-media-icon {
                  display: inline;
                  margin-left: 32px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo-container">
                  <img src="slack-logo.png" alt="Slack" width="120" height="36">
                </div>
                <h1>Confirm your email address</h1>
                <p class="hero-text">
                  Your confirmation code is below - enter it in your open browser window and we'll help you get signed in.
                </p>
            
                <div class="code-box">
                  <p class="confirmation-code-text">DJZ-TLX</p>
                </div>
            
                <p>
                  If you didn't request this email, there's nothing to worry about, you can safely ignore it.
                </p>
            
                <div class="footer-logos">
                  <img src="slack-logo.png" alt="Slack" width="120" height="36">
                  <div>
                    <a href="/">
                      <img src="slack-twitter.png" alt="Slack" width="32" height="32" class="social-media-icon">
                    </a>
                    <a href="/">
                      <img src="slack-facebook.png" alt="Slack" width="32" height="32" class="social-media-icon">
                    </a>
                    <a href="/">
                      <img src="slack-linkedin.png" alt="Slack" width="32" height="32" class="social-media-icon">
                    </a>
                  </div>
                </div>
            
                <div>
                  <a class="footer-link" href="https://slackhq.com" target="_blank" rel="noopener noreferrer">Our blog</a>
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <a class="footer-link" href="https://slack.com/legal" target="_blank" rel="noopener noreferrer">Policies</a>
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <a class="footer-link" href="https://slack.com/help" target="_blank" rel="noopener noreferrer">Help center</a>
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <a class="footer-link" href="https://slack.com/community" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="6">Slack Community</a>
                  <p class="footer-text">
                    ©2022 Slack Technologies, LLC, a Salesforce company. <br />
                    500 Howard Street, San Francisco, CA 94105, USA <br />
                    <br />
                    All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>`;
      };

      // Send email function
      const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
      };

      // Prepare email options
      const emailOptions = {
        subject: "Test",
        to: "omjannu2002@gmail.com", // Change this to candidateEmails
        from: process.env.EMAIL,
        html: getCertificateEmailContent(), // Call the function to get HTML content
      };

      // Send email
      await sendEmail(emailOptions);

      console.log("email sent");
      res.status(200).json({ message: "Email sent successfully" });
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

      // genereate unique certificate code
      let uniqueCertificateCode = generateCertificateCode();
      // Check if the generated unique certificate code already exists in the database
      let retries = 0;
      const maxRetries = 5; // Maximum number of retries

      // Check if the generated unique certificate code already exists in the database
      let existingCertificateCode = await EligibleCandidates.findOne({
        "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
      });
      console.log(existingCertificateCode);
      while (existingCertificateCode) {
        retries++;
        if (retries > maxRetries) {
          return res
            .status(500)
            .json({ error: "Failed to generate a unique certificate code" });
        }
        uniqueCertificateCode = generateCertificateCode(); // Generate a new code
        existingEvent = await EligibleCandidates.findOne({
          "eligibleCandidates.uniqueCertificateCode": uniqueCertificateCode,
        }); // Check again
      }

      // Check if the candidate already exists in the memberDetails database
      let isMember = false;
      const existingMember = await MemberDetail.findOne({
        email: email,
        mobileNumber: mobileNumber,
        isDeleted: false,
      });
      if (existingMember) {
        // Check if the current date is less than startDate + duration
        const { startDate, duration } = existingMember;
        const endDate = new Date(
          startDate.getTime() + duration * 365 * 24 * 60 * 60 * 1000
        ); // Adding duration to startDate
        if (new Date() < endDate) {
          // If member exists and current date is within validity period, set isMember to true
          console.log("Existing member within validity period");
          isMember = true;
        } else {
          console.log("Existing member, but membership has expired");
        }
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
            path !== "isDeleted" &&
            path !== "editCount" &&
            path !== "lastEdited" &&
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
              isDeleted: false,
            });
            let isMember = false;
            if (existingMember) {
              // Check if the current date is less than startDate + duration
              const { startDate, duration } = existingMember;
              const endDate = new Date(
                startDate.getTime() + duration * 365 * 24 * 60 * 60 * 1000
              ); // Adding duration to startDate
              if (new Date() < endDate) {
                // If member exists and current date is within validity period, set isMember to true
                console.log("Existing member within validity period");
                isMember = true;
              } else {
                console.log("Existing member, but membership has expired");
              }
            }

            return {
              name: item.name,
              email: item.email,
              mobileNumber: item.mobileNumber,
              branch: item.branch,
              currentAcademicYear: item.currentAcademicYear,
              isMember: isMember, // Set to true if member exists, otherwise false
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
    try {
      const { eventCode } = req.query;

      // Validate event code
      if (!eventCode) {
        return res.status(400).json({ error: "Event code is required" });
      }

      // Find event details based on event code
      const eventInfo = await EligibleCandidates.findOne({
        eventCode: eventCode,
      });

      if (!eventInfo) {
        return res.status(404).json({ error: "No Eligible Candidates Added" });
      }

      // Filter eligible candidates where isDeleted is false
      const eligibleCandidates = eventInfo.eligibleCandidates.filter(
        (candidate) => !candidate.isDeleted
      );

      // Send filtered eligible candidates as response
      res.status(200).json({ eligibleCandidates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .put("/api/eligible-candidate/edit", async (req, res) => {
    try {
      // Get studentId from query parameters
      const uniqueCertCode = req.query.uniqueCertCode;
      if (!uniqueCertCode) {
        return res
          .status(400)
          .json({ error: "Certificate UniqueCode is required" });
      }
      // Check if the member exists
      const doesEligibleCandidateexist = await EligibleCandidates.findOne({
        "eligibleCandidates.uniqueCertificateCode": uniqueCertCode,
      });
      console.log(doesEligibleCandidateexist);
      if (!doesEligibleCandidateexist) {
        return res.status(404).json({ error: "Eligible Candidate not found" });
      }

      const {
        name,
        email,
        mobileNumber,
        branch,
        currentAcademicYear,
        currentDate,
      } = req.body;
      await EligibleCandidates.findOneAndUpdate(
        { "eligibleCandidates.uniqueCertificateCode": uniqueCertCode },
        {
          $set: {
            "eligibleCandidates.$[elem].name": String(name),
            "eligibleCandidates.$[elem].email": String(email),
            "eligibleCandidates.$[elem].mobileNumber": Number(mobileNumber),
            "eligibleCandidates.$[elem].branch": Number(branch),
            "eligibleCandidates.$[elem].currentAcademicYear":
              Number(currentAcademicYear),
            "eligibleCandidates.$[elem].lastEdited": new Date(currentDate),
            lastEdited: new Date(currentDate),
          },
          $inc: { "eligibleCandidates.$[elem].editCount": 1, editCount: 1 },
        },
        {
          new: true,
          arrayFilters: [{ "elem.uniqueCertificateCode": uniqueCertCode }],
        }
      );
      res
        .status(200)
        .json({ message: "Eligible Candidate updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .put("/api/eligible-candidate/delete", async (req, res) => {
    try {
      // Get studentId from query parameters
      const uniqueCertCode = req.query.uniqueCertCode;
      if (!uniqueCertCode) {
        return res
          .status(400)
          .json({ error: "Certificate UniqueCode is required" });
      }

      // Extract lastDeleted from request body
      const { currentDate } = req.body;
      if (!currentDate) {
        return res.status(400).json({ error: "Last Deleted date is required" });
      }

      // Update isDeleted to true and increment deleteCount by 1
      await EligibleCandidates.findOneAndUpdate(
        { "eligibleCandidates.uniqueCertificateCode": uniqueCertCode },
        {
          $set: {
            "eligibleCandidates.$[elem].isDeleted": true,
            "eligibleCandidates.$[elem].uniqueCertificateCode": "",
            "eligibleCandidates.$[elem].uniqueCertificateUrl": "",
            lastEdited: new Date(currentDate),
          },
          $inc: { editCount: 1 },
        },
        {
          new: true,
          arrayFilters: [{ "elem.uniqueCertificateCode": uniqueCertCode }],
        }
      );
      res.status(200).json({ message: "Candidate deleted successfully" });
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
