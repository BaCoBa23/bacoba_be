const express = require("express");
const router = express.Router();
const attributeController = require("../controllers/attribute.controller");

router.get("/", attributeController.getList);
router.get("/:id", attributeController.getById);
router.post("/", attributeController.create);
router.put("/:id", attributeController.update);
router.delete("/:id", attributeController.delete);

module.exports = router;
