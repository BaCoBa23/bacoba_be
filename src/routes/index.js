const express = require("express");
const router = express.Router();

const API_V1 = "/api/v1";

// Health Check
router.use(`${API_V1}/health`, (req, res) => {
  res.success({ message: "We are still good 👍" });
});

router.use(`${API_V1}/products`, require("./product.route"));
// Thêm các route khác ở đây:
// router.use(`${API_V1}/bills`, require('./bill.route'));

module.exports = router;
