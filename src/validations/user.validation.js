const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateUser = (data) => {
  const errors = {};

  if (!data.username || typeof data.username !== "string") {
    errors.username = ERROR_VALIDATIONS.USER_USERNAME_REQUIRED_STRING;
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.password = ERROR_VALIDATIONS.USER_PASSWORD_REQUIRED_MIN;
  }

  return errors;
};

const validateUpdateUser = (data) => {
  const errors = {};

  if (data.password !== undefined && (typeof data.password !== "string" || data.password.length < 6)) {
    errors.password = ERROR_VALIDATIONS.USER_PASSWORD_MUST_MIN;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.USER_STATUS_MUST_STRING;
  }

  return errors;
};

module.exports = { validateCreateUser, validateUpdateUser };
