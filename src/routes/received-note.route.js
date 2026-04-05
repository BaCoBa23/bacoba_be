const express = require("express");
const router = express.Router();
const receivedNoteController = require("../controllers/received-note.controller");

// Danh sách tất cả phiếu nhập
router.get("/", receivedNoteController.getList);

// Danh sách phiếu nhập của một nhà cung cấp
router.get("/provider/:providerId", receivedNoteController.getByProviderId);

// Chi tiết một phiếu nhập
router.get("/:id", receivedNoteController.getById);

// Tạo phiếu nhập
router.post("/", receivedNoteController.create);

// Cập nhật phiếu nhập
router.put("/:id", receivedNoteController.update);

// Xóa phiếu nhập
router.delete("/:id", receivedNoteController.delete);

module.exports = router;
