const jwt = require("jsonwebtoken");
const { ERROR_MESSAGES } = require("../constants");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.error({
        message: "Token không được tìm thấy",
        status: 401,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.error({
      message: "Token không hợp lệ hoặc đã hết hạn",
      status: 401,
    });
  }
};

module.exports = authMiddleware;
