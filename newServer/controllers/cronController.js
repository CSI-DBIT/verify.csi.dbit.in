const cron = require('node-cron');
const MemberDetail = require('../models/MemberDetail');

const scheduleJuneJobs = () => {
    cron.schedule("0 0 1 6 *", async () => {
        try {
            await MemberDetail.updateMany({}, { $inc: { currentAcademicYear: 1 } });
            console.log("Current academic year incremented for all members");
        } catch (error) {
            console.error("Error incrementing academic year:", error);
        }
    });

    cron.schedule("0 0 1 6,12 *", async () => {
        try {
            await MemberDetail.updateMany({}, { $inc: { currentSemester: 1 } });
            console.log("Current semester incremented for all members");
        } catch (error) {
            console.error("Error incrementing semester:", error);
        }
    });
};

module.exports = { scheduleJuneJobs };
