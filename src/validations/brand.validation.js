const validateCreateBrand = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Tên thương hiệu là bắt buộc và phải là chuỗi";
  }

  return errors;
};

const validateUpdateBrand = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = "Tên thương hiệu phải là chuỗi";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateBrand, validateUpdateBrand };
