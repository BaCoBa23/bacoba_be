const validateCreateUser = (data) => {
  const errors = {};

  if (!data.username || typeof data.username !== "string") {
    errors.username = "Tên đăng nhập là bắt buộc và phải là chuỗi";
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.password = "Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự";
  }

  return errors;
};

const validateUpdateUser = (data) => {
  const errors = {};

  if (data.password !== undefined && (typeof data.password !== "string" || data.password.length < 6)) {
    errors.password = "Mật khẩu phải là chuỗi và có ít nhất 6 ký tự";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateUser, validateUpdateUser };
