const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateAttribute = (data) => {
  const errors = {};

  if (!data.attributeTypeId || !Number.isInteger(Number(data.attributeTypeId))) {
    errors.attributeTypeId = ERROR_VALIDATIONS.ATTRIBUTE_TYPE_ID_REQUIRED;
  }

  if (!data.value || typeof data.value !== "string") {
    errors.value = ERROR_VALIDATIONS.ATTRIBUTE_VALUE_REQUIRED_STRING;
  }

  return errors;
};

const validateUpdateAttribute = (data) => {
  const errors = {};

  if (data.attributeTypeId !== undefined && !Number.isInteger(Number(data.attributeTypeId))) {
    errors.attributeTypeId = ERROR_VALIDATIONS.ATTRIBUTE_TYPE_ID_INVALID;
  }

  if (data.value !== undefined && typeof data.value !== "string") {
    errors.value = ERROR_VALIDATIONS.ATTRIBUTE_VALUE_MUST_STRING;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.ATTRIBUTE_STATUS_MUST_STRING;
  }

  return errors;
};

module.exports = { validateCreateAttribute, validateUpdateAttribute };
