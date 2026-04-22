const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateHistoryProvider = (data) => {
  const errors = {};

  if (!data) {
    return errors;
  }

  if (!data.providerId || !Number.isInteger(Number(data.providerId))) {
    errors.providerId = ERROR_VALIDATIONS.HISTORY_PROVIDER_PROVIDER_ID_REQUIRED;
  }

  if (data.paidAmount !== undefined && data.paidAmount !== null && Number(data.paidAmount) < 0) {
    errors.paidAmount = ERROR_VALIDATIONS.HISTORY_PROVIDER_PAID_AMOUNT_MUST_GTE0;
  }

  return errors;
};

const validateUpdateHistoryProvider = (data) => {
  const errors = {};

  if (!data) {
    return errors;
  }

  if (data.paidAmount !== undefined && (Number(data.paidAmount) < 0 || isNaN(Number(data.paidAmount)))) {
    errors.paidAmount = ERROR_VALIDATIONS.HISTORY_PROVIDER_PAID_AMOUNT_MUST_GTE0;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.HISTORY_PROVIDER_STATUS_MUST_STRING;
  }

  return errors;
};

module.exports = { validateCreateHistoryProvider, validateUpdateHistoryProvider };
