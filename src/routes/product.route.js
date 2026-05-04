const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.getList);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);
router.put("/:id/rename", productController.renameProduct);
router.get("/:id/variants", productController.getParentAttributes);
router.post("/:id/variants", productController.addVariant);

module.exports = router;
