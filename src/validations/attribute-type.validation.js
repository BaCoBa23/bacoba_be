const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateAttributeType = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = ERROR_VALIDATIONS.ATTRIBUTE_TYPE_NAME_REQUIRED_STRING;
  }

  return errors;
};

const validateUpdateAttributeType = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = ERROR_VALIDATIONS.ATTRIBUTE_TYPE_NAME_MUST_STRING;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.ATTRIBUTE_TYPE_STATUS_MUST_STRING;
  }

  return errors;
};

module.exports = { validateCreateAttributeType, validateUpdateAttributeType };
