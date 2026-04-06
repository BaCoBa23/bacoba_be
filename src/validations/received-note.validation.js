const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateReceivedNote = (data) => {
  const errors = {};

  if (!data.providerId || !Number.isInteger(Number(data.providerId))) {
    errors.providerId = ERROR_VALIDATIONS.RECEIVED_NOTE_PROVIDER_ID_REQUIRED;
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = ERROR_VALIDATIONS.RECEIVED_NOTE_TOTAL_REQUIRED_GTE0;
  }

  // Validate receivedProducts nếu có
  if (data.receivedProducts !== undefined && data.receivedProducts !== null) {
    if (!Array.isArray(data.receivedProducts)) {
      errors.receivedProducts = ERROR_VALIDATIONS.RECEIVED_NOTE_PRODUCTS_MUST_ARRAY;
    } else {
      data.receivedProducts.forEach((rp, index) => {
        if (!rp.productId) {
          errors[`receivedProducts[${index}].productId`] = ERROR_VALIDATIONS.RECEIVED_PRODUCT_PRODUCT_ID_REQUIRED;
        }
        if (rp.addQuantity === undefined || Number(rp.addQuantity) <= 0) {
          errors[`receivedProducts[${index}].addQuantity`] = ERROR_VALIDATIONS.RECEIVED_PRODUCT_QUANTITY_MUST_GT0;
        }
        if (rp.total === undefined || Number(rp.total) < 0) {
          errors[`receivedProducts[${index}].total`] = ERROR_VALIDATIONS.RECEIVED_PRODUCT_TOTAL_MUST_GTE0;
        }
      });
    }
  }

  return errors;
};

const validateUpdateReceivedNote = (data) => {
  const errors = {};

  if (data.discount !== undefined && (Number(data.discount) < 0 || isNaN(Number(data.discount)))) {
    errors.discount = ERROR_VALIDATIONS.RECEIVED_NOTE_DISCOUNT_MUST_GTE0;
  }

  if (data.payedMoney !== undefined && (Number(data.payedMoney) < 0 || isNaN(Number(data.payedMoney)))) {
    errors.payedMoney = ERROR_VALIDATIONS.RECEIVED_NOTE_PAYED_MONEY_MUST_GTE0;
  }

  if (data.debtMoney !== undefined && (Number(data.debtMoney) < 0 || isNaN(Number(data.debtMoney)))) {
    errors.debtMoney = ERROR_VALIDATIONS.RECEIVED_NOTE_DEBT_MONEY_MUST_GTE0;
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = ERROR_VALIDATIONS.RECEIVED_NOTE_TOTAL_MUST_GTE0;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.RECEIVED_NOTE_STATUS_MUST_STRING;
  }

  // Validate receivedProducts nếu có
  if (data.receivedProducts !== undefined && data.receivedProducts !== null) {
    if (!Array.isArray(data.receivedProducts)) {
      errors.receivedProducts = ERROR_VALIDATIONS.RECEIVED_NOTE_PRODUCTS_MUST_ARRAY;
    } else {
      data.receivedProducts.forEach((rp, index) => {
        if (!rp.productId) {
          errors[`receivedProducts[${index}].productId`] = ERROR_VALIDATIONS.RECEIVED_PRODUCT_PRODUCT_ID_REQUIRED;
        }
        if (rp.addQuantity === undefined || Number(rp.addQuantity) <= 0) {
          errors[`receivedProducts[${index}].addQuantity`] = ERROR_VALIDATIONS.RECEIVED_PRODUCT_QUANTITY_MUST_GT0;
        }
        if (rp.total === undefined || Number(rp.total) < 0) {
          errors[`receivedProducts[${index}].total`] = ERROR_VALIDATIONS.RECEIVED_PRODUCT_TOTAL_MUST_GTE0;
        }
      });
    }
  }

  return errors;
};

module.exports = { validateCreateReceivedNote, validateUpdateReceivedNote };
