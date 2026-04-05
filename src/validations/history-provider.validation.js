const validateCreateHistoryProvider = (data) => {
  const errors = {};

  if (!data.providerId || !Number.isInteger(Number(data.providerId))) {
    errors.providerId = "ID nhà cung cấp là bắt buộc";
  }

  if (data.paidAmount === undefined || data.paidAmount === null || Number(data.paidAmount) < 0) {
    errors.paidAmount = "Số tiền thanh toán là bắt buộc và phải >= 0";
  }

  return errors;
};

const validateUpdateHistoryProvider = (data) => {
  const errors = {};

  if (data.paidAmount !== undefined && (Number(data.paidAmount) < 0 || isNaN(Number(data.paidAmount)))) {
    errors.paidAmount = "Số tiền thanh toán phải >= 0";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateHistoryProvider, validateUpdateHistoryProvider };
