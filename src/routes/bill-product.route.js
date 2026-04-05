const express = require("express");
const router = express.Router();
const billProductController = require("../controllers/bill-product.controller");

// Danh sách tất cả BillProduct
router.get("/", billProductController.getList);

// Danh sách sản phẩm của một hoá đơn
router.get("/bill/:billId", billProductController.getByBillId);

// Chi tiết một BillProduct
router.get("/:id", billProductController.getById);

// Tạo BillProduct mới
router.post("/", billProductController.create);

// Cập nhật BillProduct
router.put("/:id", billProductController.update);

// Xóa BillProduct
router.delete("/:id", billProductController.delete);

module.exports = router;
