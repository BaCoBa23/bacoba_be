const express = require("express");
const router = express.Router();
const productAttributeController = require("../controllers/product-attribute.controller");

// Danh sách tất cả ProductAttribute
router.get("/", productAttributeController.getList);

// Danh sách thuộc tính của một sản phẩm
router.get("/product/:productId", productAttributeController.getByProductId);

// Chi tiết một ProductAttribute (productId + attributeId)
router.get("/:productId/:attributeId", productAttributeController.getByKey);

// Tạo ProductAttribute mới
router.post("/", productAttributeController.create);

// Cập nhật ProductAttribute
router.put("/:productId/:attributeId", productAttributeController.update);

// Xóa ProductAttribute
router.delete("/:productId/:attributeId", productAttributeController.delete);

module.exports = router;
