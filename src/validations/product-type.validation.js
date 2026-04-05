const validateCreateProductType = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Tên loại sản phẩm là bắt buộc và phải là chuỗi";
  }

  return errors;
};

const validateUpdateProductType = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = "Tên loại sản phẩm phải là chuỗi";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateProductType, validateUpdateProductType };
