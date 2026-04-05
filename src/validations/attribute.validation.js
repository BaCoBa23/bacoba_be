const validateCreateAttribute = (data) => {
  const errors = {};

  if (!data.attributeTypeId || !Number.isInteger(Number(data.attributeTypeId))) {
    errors.attributeTypeId = "Loại thuộc tính là bắt buộc";
  }

  if (!data.value || typeof data.value !== "string") {
    errors.value = "Giá trị thuộc tính là bắt buộc và phải là chuỗi";
  }

  return errors;
};

const validateUpdateAttribute = (data) => {
  const errors = {};

  if (data.attributeTypeId !== undefined && !Number.isInteger(Number(data.attributeTypeId))) {
    errors.attributeTypeId = "Loại thuộc tính không hợp lệ";
  }

  if (data.value !== undefined && typeof data.value !== "string") {
    errors.value = "Giá trị thuộc tính phải là chuỗi";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateAttribute, validateUpdateAttribute };
