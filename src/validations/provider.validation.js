const validateCreateProvider = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Tên nhà cung cấp là bắt buộc và phải là chuỗi";
  }

  return errors;
};

const validateUpdateProvider = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = "Tên nhà cung cấp phải là chuỗi";
  }

  if (data.phoneNumber !== undefined && data.phoneNumber !== null && typeof data.phoneNumber !== "string") {
    errors.phoneNumber = "Số điện thoại phải là chuỗi";
  }

  if (data.email !== undefined && data.email !== null && typeof data.email !== "string") {
    errors.email = "Email phải là chuỗi";
  }

  if (data.debtTotal !== undefined && (Number(data.debtTotal) < 0 || isNaN(Number(data.debtTotal)))) {
    errors.debtTotal = "Tổng nợ phải >= 0";
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = "Tổng tiền phải >= 0";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateProvider, validateUpdateProvider };
