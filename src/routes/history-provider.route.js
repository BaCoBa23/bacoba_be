const express = require("express");
const router = express.Router();
const historyProviderController = require("../controllers/history-provider.controller");

// Danh sách một nhà cung cấp (đặt trước :id để tránh conflict)
router.get("/provider/:providerId", historyProviderController.getByProviderId);

// Danh sách tất cả lịch sử
router.get("/", historyProviderController.getList);

// Chi tiết một lịch sử
router.get("/:id", historyProviderController.getById);

// Tạo lịch sử
router.post("/", historyProviderController.create);

// Cập nhật lịch sử
router.put("/:id", historyProviderController.update);

// Xóa lịch sử
router.delete("/:id", historyProviderController.delete);

module.exports = router;
