const userService = require("../services/user.service");
const { validateCreateUser, validateUpdateUser } = require("../validations/user.validation");
const { ERROR_MESSAGES } = require("../constants");

class UserController {
  getList = async (req, res) => {
    try {
      const result = await userService.getUsers(req.query);

      return res.success({
        message: "Lấy danh sách người dùng thành công",
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
        message: "Lấy chi tiết người dùng thành công",
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
          message: "Dữ liệu không hợp lệ",
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
        message: "Tạo người dùng thành công",
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

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateUser(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const user = await userService.updateUser(parseInt(id, 10), req.body);

      if (!user) {
        return res.error({
          message: ERROR_MESSAGES.USER_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật người dùng thành công",
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await userService.deleteUser(parseInt(id, 10));

      return res.success({
        message: "Xóa người dùng thành công",
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.USER_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new UserController();
