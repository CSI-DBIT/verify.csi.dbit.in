const mongoose = require('mongoose');

const dbUsername = 'csidbit';
const dbPassword = 'csidbit';
const dbName = 'Members';
const dbURL = `mongodb+srv://${dbUsername}:${dbPassword}@verify-csi-members.iaqdmjc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
module.exports = db;