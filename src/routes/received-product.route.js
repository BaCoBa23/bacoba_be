const express = require("express");
const router = express.Router();
const receivedProductController = require("../controllers/received-product.controller");

// Danh sách tất cả ReceivedProduct
router.get("/", receivedProductController.getList);

// Danh sách sản phẩm của một phiếu nhập kho
router.get("/received-note/:receivedNoteId", receivedProductController.getByReceivedNoteId);

// Chi tiết một ReceivedProduct
router.get("/:id", receivedProductController.getById);

// Tạo ReceivedProduct mới
router.post("/", receivedProductController.create);

// Cập nhật ReceivedProduct
router.put("/:id", receivedProductController.update);

// Xóa ReceivedProduct
router.delete("/:id", receivedProductController.delete);

module.exports = router;
