const { ERROR_VALIDATIONS } = require("../constants");

const validateCreateProductAttribute = (data) => {
  const errors = {};

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = ERROR_VALIDATIONS.PRODUCT_ATTRIBUTE_PRODUCT_ID_REQUIRED_STRING;
  }

  if (!data.attributeId || !Number.isInteger(Number(data.attributeId))) {
    errors.attributeId = "ID thuộc tính là bắt buộc";
  }

  return errors;
};

const validateUpdateProductAttribute = (data) => {
  const errors = {};

  if (data.content !== undefined && typeof data.content !== "string") {
    errors.content = "Nội dung phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateProductAttribute, validateUpdateProductAttribute };
