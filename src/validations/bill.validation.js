const validateCreateBill = (data) => {
  const errors = {};

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = "Tổng tiền là bắt buộc và phải >= 0";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

const validateUpdateBill = (data) => {
  const errors = {};

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = "Tổng tiền phải >= 0";
  }

  if (data.discount !== undefined && (Number(data.discount) < 0 || isNaN(Number(data.discount)))) {
    errors.discount = "Giảm giá phải >= 0";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  if (data.phoneNumber !== undefined && data.phoneNumber !== null && typeof data.phoneNumber !== "string") {
    errors.phoneNumber = "Số điện thoại phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateBill, validateUpdateBill };
