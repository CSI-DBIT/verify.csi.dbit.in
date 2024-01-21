const mongoose = require("mongoose");
require("dotenv").config();

// Load environment variables
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD ;
const dbName = process.env.DB_NAME;

const dbURL = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.ciobgcf.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(dbURL);

const db = mongoose.connection;

module.exports = db;
