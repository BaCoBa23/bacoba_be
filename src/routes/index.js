const express = require("express");
const router = express.Router();

const API_V1 = "/api/v1";

// Health Check
router.use(`${API_V1}/health`, (req, res) => {
  res.success({ message: "We are still good 👍" });
});

router.use(`${API_V1}/users`, require("./user.route"));
router.use(`${API_V1}/products`, require("./product.route"));
router.use(`${API_V1}/product-types`, require("./product-type.route"));
router.use(`${API_V1}/brands`, require("./brand.route"));
router.use(`${API_V1}/attribute-types`, require("./attribute-type.route"));
router.use(`${API_V1}/attributes`, require("./attribute.route"));
router.use(`${API_V1}/product-attributes`, require("./product-attribute.route"));
router.use(`${API_V1}/bills`, require("./bill.route"));
router.use(`${API_V1}/providers`, require("./provider.route"));
router.use(`${API_V1}/history-providers`, require("./history-provider.route"));
router.use(`${API_V1}/received-notes`, require("./received-note.route"));
// Thêm các route khác ở đây:
// router.use(`${API_V1}/invoices`, require('./invoice.route'));

module.exports = router;
