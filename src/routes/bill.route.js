const express = require("express");
const router = express.Router();
const billController = require("../controllers/bill.controller");
const billProductController = require("../controllers/bill-product.controller");

// Bill routes
router.get("/", billController.getList);
router.get("/:billId", billController.getById);
router.get("/:id", billController.getById);
router.put("/:id", billController.update);
router.delete("/:id", billController.delete);

// Bill Products - Nested routes
router.get("/:id/products", billProductController.getByBillId);
router.post("/:id/products", billProductController.create);
router.put("/:id/products/:productId", billProductController.update);
router.delete("/:id/products/:productId", billProductController.delete);

module.exports = router;
