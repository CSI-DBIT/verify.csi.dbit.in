const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const addMemberController = require("../controllers/memberContollers/addMember");
const editMemberController = require("../controllers/memberContollers/editMember");
const deleteMemberController = require("../controllers/memberContollers/deleteMember");
const revokeMemberController = require("../controllers/memberContollers/revokeMember");
const getAllMembersController = require("../controllers/memberContollers/getAllMembers");
const getDeletedMembersController = require("../controllers/memberContollers/getDeletedMembers");
const getMemberDetailsController = require("../controllers/memberContollers/getMemberDetails");
const bulkUploadMemberController = require("../controllers/memberContollers/bulkUploadMembers");

// multer middlewares
const { memberExcelupload } = require("../multer/memoryStorage");

// member routes

router.post("/add", async (req, res) => {
  const result = await addMemberController.addMember(req.body);
  res.status(200).json({ success: result.success, message: result.message });
});

router.post(
  "/bulk-upload",
  memberExcelupload.single("bulk_upload_memberDetails_excel"),
  async (req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const result = await bulkUploadMemberController.bulkUpload(data);

    res.status(200).json({
      success: result.success,
      message: result.message,
      duplicates: result.duplicates || [],
    });
  }
);

router.post("/edit", async (req, res) => {
  const studentId = req.query.studentId;
  const email = req.query.email;
  const result = await editMemberController.editMember(
    studentId,
    email,
    req.body
  );
  res.status(200).json({ success: result.success, message: result.message });
});

router.put("/delete", async (req, res) => {
  const studentId = req.query.studentId;
  const result = await deleteMemberController.deleteMember(studentId, req.body);
  res.status(200).json({ success: result.success, message: result.message });
});

router.put("/revoke", async (req, res) => {
  const studentId = req.query.studentId;
  const result = await revokeMemberController.revokeMember(studentId, req.body);
  res.status(200).json({ success: result.success, message: result.message });
});

router.get("/get/all_members", async (req, res) => {
  const result = await getAllMembersController.getAllMembers();
  res.status(200).json({
    success: result.success,
    message: result.message,
    allMembers: result.data,
  });
});
router.get("/get/deleted_members", async (req, res) => {
  const result = await getDeletedMembersController.getDeletedMembers();
  res.status(200).json({
    success: result.success,
    message: result.message,
    deletedMembers: result.data,
  });
});

router.get("/get/memberDetails", async (req, res) => {
  const studentId = req.query.studentId;

  const result = await getMemberDetailsController.getMemberDetails(studentId);
  console.log(result);
  res.status(200).json({
    success: result.success,
    message: result.message,
    memberData: result.data,
  });
});

module.exports = router;
