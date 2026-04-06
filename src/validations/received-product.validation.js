const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateReceivedProduct = (data) => {
  const errors = {};

  if (!data.receivedNoteId || !Number.isInteger(Number(data.receivedNoteId))) {
    errors.receivedNoteId = ERROR_VALIDATIONS.RECEIVED_PRODUCT_RECEIVED_NOTE_ID_REQUIRED;
  }

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = ERROR_VALIDATIONS.RECEIVED_PRODUCT_PRODUCT_ID_REQUIRED_STRING;
  }

  if (data.addQuantity === undefined || data.addQuantity === null || !Number.isInteger(Number(data.addQuantity)) || Number(data.addQuantity) <= 0) {
    errors.addQuantity = ERROR_VALIDATIONS.RECEIVED_PRODUCT_QUANTITY_REQUIRED_INT_GT0;
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = ERROR_VALIDATIONS.RECEIVED_PRODUCT_TOTAL_REQUIRED_GTE0;
  }

  return errors;
};

const validateUpdateReceivedProduct = (data) => {
  const errors = {};

  if (data.addQuantity !== undefined && (!Number.isInteger(Number(data.addQuantity)) || Number(data.addQuantity) <= 0)) {
    errors.addQuantity = ERROR_VALIDATIONS.RECEIVED_PRODUCT_QUANTITY_MUST_INT_GT0;
  }

  if (data.discount !== undefined && (Number(data.discount) < 0 || isNaN(Number(data.discount)))) {
    errors.discount = ERROR_VALIDATIONS.RECEIVED_PRODUCT_DISCOUNT_MUST_GTE0;
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = ERROR_VALIDATIONS.RECEIVED_PRODUCT_TOTAL_MUST_GTE0;
  }

  return errors;
};

module.exports = { validateCreateReceivedProduct, validateUpdateReceivedProduct };
