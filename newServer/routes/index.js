const express = require("express");
const router = express.Router();

const eligibleCandidatesRoutes = require("./eligibleCandidatesRoutes");
const memberRoutes = require("./memberRoutes");
const eventRoutes = require("./eventRoutes");

router.use("/api/eligible-candidate", eligibleCandidatesRoutes);
router.use("/api/member", memberRoutes);
router.use("/api/event", eventRoutes);

module.exports = router;
