// import libraries
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// importing files
const db = require("./db");
const { scheduleJuneJobs } = require("./controllers/cronController");
const routes = require("./routes");
const app = express();

app
  .use(cors())
  .use(express.json())
  .use("/certificates", express.static(path.join(__dirname, "certificates")))
  .use(
    "/candidate_certificates",
    express.static(path.join(__dirname, "candidate_certificates"))
  )
  .use(routes)
  .use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error❌" });
  });

// Initialize cron jobs
scheduleJuneJobs();

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
