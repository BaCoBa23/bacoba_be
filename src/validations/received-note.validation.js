const validateCreateReceivedNote = (data) => {
  const errors = {};

  if (!data.providerId || !Number.isInteger(Number(data.providerId))) {
    errors.providerId = "ID nhà cung cấp là bắt buộc";
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = "Tổng tiền là bắt buộc và phải >= 0";
  }

  return errors;
};

const validateUpdateReceivedNote = (data) => {
  const errors = {};

  if (data.discount !== undefined && (Number(data.discount) < 0 || isNaN(Number(data.discount)))) {
    errors.discount = "Giảm giá phải >= 0";
  }

  if (data.payedMoney !== undefined && (Number(data.payedMoney) < 0 || isNaN(Number(data.payedMoney)))) {
    errors.payedMoney = "Tiền đã trả phải >= 0";
  }

  if (data.debtMoney !== undefined && (Number(data.debtMoney) < 0 || isNaN(Number(data.debtMoney)))) {
    errors.debtMoney = "Tiền nợ phải >= 0";
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = "Tổng tiền phải >= 0";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  return errors;
};

module.exports = { validateCreateReceivedNote, validateUpdateReceivedNote };
