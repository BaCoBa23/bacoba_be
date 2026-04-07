const userService = require("../services/user.service");
const { validateCreateUser, validateUpdateUser } = require("../validations/user.validation");
const { MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

class UserController {
  getList = async (req, res) => {
    try {
      const result = await userService.getUsers(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.USER_LIST_SUCCESSFUL,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(parseInt(id, 10));

      if (!user) {
        return res.error({
          message: ERROR_MESSAGES.USER_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.USER_DETAIL_SUCCESSFUL,
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateUser(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      // Check if username already exists
      const existingUser = await userService.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.error({
          message: "Tên đăng nhập đã tồn tại",
          status: 400,
        });
      }

      const user = await userService.createUser(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.USER_CREATE_SUCCESSFUL,
        data: user,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.error({
          message: "Tên đăng nhập đã tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.error({
          message: "Vui lòng nhập username và password",
          status: 400,
        });
      }

      const user = await userService.getUserByUsername(username);

      if (!user) {
        return res.error({
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
          status: 401,
        });
      }

      const isPasswordValid = await userService.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.error({
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
          status: 401,
        });
      }

      // Tạo JWT Token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Không trả password về client
      const { password: _, ...userInfo } = user;

      return res.success({
        message: "Đăng nhập thành công",
        data: {
          user: userInfo,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

}

module.exports = new UserController();
