const express = require("express");
const router = express.Router();
const getAllEventsController = require("../controllers/eventControllers/getAllEvents");
const addEventController = require("../controllers/eventControllers/addEvent");
const editEventController = require("../controllers/eventControllers/editEvent");
const deleteEventController = require("../controllers/eventControllers/deleteEvent");
const getEventDetailsController = require("../controllers/eventControllers/getEventDetails");
const sendCertificateEmailAllController = require("../controllers/eventControllers/sendCertificateEmailAll");
const sendCertificateEmailSingleController = require("../controllers/eventControllers/sendCertificateEmailSingle");

router.get("/get/all_events", async (req, res) => {
  const result = await getAllEventsController.getAllEvents();
  res.status(200).json({
    success: result.success,
    message: result.message,
    allEvents: result.data,
  });
});

router.post("/add", async (req, res) => {
  const result = await addEventController.addEvent(req.body);
  res.status(200).json({ success: result.success, message: result.message });
});
router.post("/edit", async (req, res) => {
  const eventCode = req.query.eventCode;
  const result = await editEventController.editEvent(eventCode, req.body);
  res.status(200).json({ success: result.success, message: result.message });
});
router.put("/delete", async (req, res) => {
  const eventCode = req.query.eventCode;
  const result = await deleteEventController.deleteEvent(eventCode, req.body);
  res.status(200).json({ success: result.success, message: result.message });
});
router.get("/get/event_details", async (req, res) => {
  const { eventCode } = req.query;
  const result = await getEventDetailsController.getEventDetails(eventCode);
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});
router.post("/send-certificate-emails/all", async (req, res) => {
  const eventCode = req.query.eventCode;
  const result =
    await sendCertificateEmailAllController.sendCertificateEmailAll(
      eventCode,
      req.body
    );
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});
router.post("/send-certificate-emails/single", async (req, res) => {
  const eventCode = req.query.eventCode;
  const candidateEmail = req.query.candidateEmail;
  const currentDate = req.query.currentDate;
  const result =
    await sendCertificateEmailSingleController.sendCertificateEmailSingle(
      eventCode,
      candidateEmail,
      currentDate
    );
  res.status(200).json({
    success: result.success,
    message: result.message,
    eventData: result.data,
  });
});

module.exports = router;
