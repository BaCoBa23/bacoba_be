const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateProvider = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = ERROR_VALIDATIONS.PROVIDER_NAME_REQUIRED_STRING;
  }

  return errors;
};

const validateUpdateProvider = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = ERROR_VALIDATIONS.PROVIDER_NAME_MUST_STRING;
  }

  if (data.phoneNumber !== undefined && data.phoneNumber !== null && typeof data.phoneNumber !== "string") {
    errors.phoneNumber = ERROR_VALIDATIONS.PROVIDER_PHONE_MUST_STRING;
  }

  if (data.email !== undefined && data.email !== null && typeof data.email !== "string") {
    errors.email = ERROR_VALIDATIONS.PROVIDER_EMAIL_MUST_STRING;
  }

  if (data.debtTotal !== undefined && (Number(data.debtTotal) < 0 || isNaN(Number(data.debtTotal)))) {
    errors.debtTotal = ERROR_VALIDATIONS.PROVIDER_DEBT_TOTAL_MUST_GTE0;
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = ERROR_VALIDATIONS.PROVIDER_TOTAL_MUST_GTE0;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.PROVIDER_STATUS_MUST_STRING;
  }

  return errors;
};

module.exports = { validateCreateProvider, validateUpdateProvider };
