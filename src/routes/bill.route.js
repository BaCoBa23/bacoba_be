const express = require("express");
const router = express.Router();
const billController = require("../controllers/bill.controller");

router.get("/", billController.getList);
router.get("/:id", billController.getById);
router.post("/", billController.create);
router.put("/:id", billController.update);
router.delete("/:id", billController.delete);

module.exports = router;
