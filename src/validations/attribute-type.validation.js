const validateCreateAttributeType = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Tên loại thuộc tính là bắt buộc và phải là chuỗi";
  }

  return errors;
};

const validateUpdateAttributeType = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = "Tên loại thuộc tính phải là chuỗi";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateAttributeType, validateUpdateAttributeType };
