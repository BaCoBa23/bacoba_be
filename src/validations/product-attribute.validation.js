const validateCreateProductAttribute = (data) => {
  const errors = {};

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = "ID sản phẩm là bắt buộc và phải là chuỗi";
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
