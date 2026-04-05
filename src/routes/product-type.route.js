const express = require("express");
const router = express.Router();
const productTypeController = require("../controllers/product-type.controller");

router.get("/", productTypeController.getList);
router.get("/:id", productTypeController.getById);
router.post("/", productTypeController.create);
router.put("/:id", productTypeController.update);
router.delete("/:id", productTypeController.delete);

module.exports = router;
