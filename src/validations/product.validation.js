const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateProduct = (data) => {
  const errors = {};

  if (!data.id || typeof data.id !== "string") {
    errors.id = ERROR_VALIDATIONS.PRODUCT_ID_REQUIRED_STRING;
  }

  if (!data.productTypeId || !Number.isInteger(Number(data.productTypeId))) {
    errors.productTypeId = ERROR_VALIDATIONS.PRODUCT_TYPE_ID_REQUIRED;
  }

  if (!data.brandId || !Number.isInteger(Number(data.brandId))) {
    errors.brandId = ERROR_VALIDATIONS.PRODUCT_BRAND_ID_REQUIRED;
  }

  if (data.initialPrice === undefined || data.initialPrice === null || Number(data.initialPrice) < 0) {
    errors.initialPrice = ERROR_VALIDATIONS.PRODUCT_INITIAL_PRICE_REQUIRED_GTE0;
  }

  if (data.salePrice === undefined || data.salePrice === null || Number(data.salePrice) < 0) {
    errors.salePrice = ERROR_VALIDATIONS.PRODUCT_SALE_PRICE_REQUIRED_GTE0;
  }

  if (data.quantity === undefined || data.quantity === null || !Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 0) {
    errors.quantity = ERROR_VALIDATIONS.PRODUCT_QUANTITY_REQUIRED_INT_GTE0;
  }

  return errors;
};

const validateUpdateProduct = (data) => {
  const errors = {};

  if (data.productTypeId !== undefined && !Number.isInteger(Number(data.productTypeId))) {
    errors.productTypeId = ERROR_VALIDATIONS.PRODUCT_TYPE_ID_INVALID;
  }

  if (data.brandId !== undefined && !Number.isInteger(Number(data.brandId))) {
    errors.brandId = ERROR_VALIDATIONS.PRODUCT_BRAND_ID_INVALID;
  }

  if (data.initialPrice !== undefined && (Number(data.initialPrice) < 0 || isNaN(Number(data.initialPrice)))) {
    errors.initialPrice = ERROR_VALIDATIONS.PRODUCT_INITIAL_PRICE_MUST_GTE0;
  }

  if (data.salePrice !== undefined && (Number(data.salePrice) < 0 || isNaN(Number(data.salePrice)))) {
    errors.salePrice = ERROR_VALIDATIONS.PRODUCT_SALE_PRICE_MUST_GTE0;
  }

  if (data.quantity !== undefined && (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 0)) {
    errors.quantity = ERROR_VALIDATIONS.PRODUCT_QUANTITY_MUST_INT_GTE0;
  }

  return errors;
};

module.exports = { validateCreateProduct, validateUpdateProduct };
