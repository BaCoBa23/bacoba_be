const express = require("express");
const router = express.Router();
const attributeTypeController = require("../controllers/attribute-type.controller");

router.get("/", attributeTypeController.getList);
router.get("/:id", attributeTypeController.getById);
router.post("/", attributeTypeController.create);
router.put("/:id", attributeTypeController.update);
router.delete("/:id", attributeTypeController.delete);

module.exports = router;
