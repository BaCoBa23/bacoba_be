const express = require("express");
const router = express.Router();
const receivedNoteController = require("../controllers/received-note.controller");
const receivedProductController = require("../controllers/received-product.controller");

// Received Note routes
router.get("/", receivedNoteController.getList);
router.post("/", receivedNoteController.create);
router.get("/provider/:providerId", receivedNoteController.getByProviderId);
router.get("/:id", receivedNoteController.getById);
router.put("/:id", receivedNoteController.update);
router.put("/:id/cancelled", receivedNoteController.cancel);
router.put("/:id/confirm", receivedNoteController.confirm);
router.delete("/:id", receivedNoteController.delete);

// Received Products - Nested routes
router.get("/:id/products", receivedProductController.getByReceivedNoteId);
router.post("/:id/products", receivedProductController.create);
router.put("/:id/products/:productId", receivedProductController.update);
router.delete("/:id/products/:productId", receivedProductController.delete);

module.exports = router;
