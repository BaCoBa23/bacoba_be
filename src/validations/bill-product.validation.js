const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateBillProduct = (data) => {
  const errors = {};

  if (!data.billId || !Number.isInteger(Number(data.billId))) {
    errors.billId = ERROR_VALIDATIONS.BILL_PRODUCT_BILL_ID_REQUIRED;
  }

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = ERROR_VALIDATIONS.BILL_PRODUCT_PRODUCT_ID_REQUIRED_STRING;
  }

  if (data.quantity === undefined || data.quantity === null || !Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0) {
    errors.quantity = ERROR_VALIDATIONS.BILL_PRODUCT_QUANTITY_REQUIRED_INT_GT0;
  }

  if (data.salePrice === undefined || data.salePrice === null || Number(data.salePrice) < 0) {
    errors.salePrice = ERROR_VALIDATIONS.BILL_PRODUCT_SALE_PRICE_REQUIRED_GTE0;
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = ERROR_VALIDATIONS.BILL_PRODUCT_TOTAL_REQUIRED_GTE0;
  }

  return errors;
};

const validateUpdateBillProduct = (data) => {
  const errors = {};

  if (data.quantity !== undefined && (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0)) {
    errors.quantity = ERROR_VALIDATIONS.BILL_PRODUCT_QUANTITY_MUST_INT_GT0;
  }

  if (data.salePrice !== undefined && (Number(data.salePrice) < 0 || isNaN(Number(data.salePrice)))) {
    errors.salePrice = ERROR_VALIDATIONS.BILL_PRODUCT_SALE_PRICE_MUST_GTE0_UPDATE;
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = ERROR_VALIDATIONS.BILL_PRODUCT_TOTAL_MUST_GTE0_UPDATE;
  }

  return errors;
};

module.exports = { validateCreateBillProduct, validateUpdateBillProduct };
