const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateBill = (data) => {
  const errors = {};

  if (!data) {
    return errors;
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = ERROR_VALIDATIONS.BILL_TOTAL_REQUIRED_GTE0;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.BILL_STATUS_MUST_STRING;
  }

  // Validate billProducts nếu có
  if (data.billProducts !== undefined && data.billProducts !== null) {
    if (!Array.isArray(data.billProducts)) {
      errors.billProducts = ERROR_VALIDATIONS.BILL_PRODUCTS_MUST_ARRAY;
    } else {
      data.billProducts.forEach((bp, index) => {
        if (!bp.productId) {
          errors[`billProducts[${index}].productId`] = ERROR_VALIDATIONS.BILL_PRODUCT_PRODUCT_ID_REQUIRED;
        }
        if (bp.quantity === undefined || Number(bp.quantity) <= 0) {
          errors[`billProducts[${index}].quantity`] = ERROR_VALIDATIONS.BILL_PRODUCT_QUANTITY_MUST_GT0;
        }
        if (bp.salePrice === undefined || Number(bp.salePrice) < 0) {
          errors[`billProducts[${index}].salePrice`] = ERROR_VALIDATIONS.BILL_PRODUCT_SALE_PRICE_MUST_GTE0;
        }
        if (bp.total === undefined || Number(bp.total) < 0) {
          errors[`billProducts[${index}].total`] = ERROR_VALIDATIONS.BILL_PRODUCT_TOTAL_MUST_GTE0;
        }
      });
    }
  }

  return errors;
};

const validateUpdateBill = (data) => {
  const errors = {};

  if (!data) {
    return errors;
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = ERROR_VALIDATIONS.BILL_TOTAL_MUST_GTE0;
  }

  if (data.discount !== undefined && (Number(data.discount) < 0 || isNaN(Number(data.discount)))) {
    errors.discount = ERROR_VALIDATIONS.BILL_DISCOUNT_MUST_GTE0;
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = ERROR_VALIDATIONS.BILL_STATUS_MUST_STRING;
  }

  if (data.phoneNumber !== undefined && data.phoneNumber !== null && typeof data.phoneNumber !== "string") {
    errors.phoneNumber = ERROR_VALIDATIONS.BILL_PHONE_MUST_STRING;
  }

  // Validate billProducts nếu có
  if (data.billProducts !== undefined && data.billProducts !== null) {
    if (!Array.isArray(data.billProducts)) {
      errors.billProducts = ERROR_VALIDATIONS.BILL_PRODUCTS_MUST_ARRAY;
    } else {
      data.billProducts.forEach((bp, index) => {
        if (!bp.productId) {
          errors[`billProducts[${index}].productId`] = ERROR_VALIDATIONS.BILL_PRODUCT_PRODUCT_ID_REQUIRED;
        }
        if (bp.quantity === undefined || Number(bp.quantity) <= 0) {
          errors[`billProducts[${index}].quantity`] = ERROR_VALIDATIONS.BILL_PRODUCT_QUANTITY_MUST_GT0;
        }
        if (bp.salePrice === undefined || Number(bp.salePrice) < 0) {
          errors[`billProducts[${index}].salePrice`] = ERROR_VALIDATIONS.BILL_PRODUCT_SALE_PRICE_MUST_GTE0;
        }
        if (bp.total === undefined || Number(bp.total) < 0) {
          errors[`billProducts[${index}].total`] = ERROR_VALIDATIONS.BILL_PRODUCT_TOTAL_MUST_GTE0;
        }
      });
    }
  }

  return errors;
};

module.exports = { validateCreateBill, validateUpdateBill };
