const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares");

router.post("/login", userController.login);
router.post("/", userController.create);
router.get("/", authMiddleware, userController.getList);
router.get("/:id", authMiddleware, userController.getById);

module.exports = router;
