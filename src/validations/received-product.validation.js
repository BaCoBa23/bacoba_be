const validateCreateReceivedProduct = (data) => {
  const errors = {};

  if (!data.receivedNoteId || !Number.isInteger(Number(data.receivedNoteId))) {
    errors.receivedNoteId = "ID phiếu nhập kho là bắt buộc";
  }

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = "ID sản phẩm là bắt buộc và phải là chuỗi";
  }

  if (data.addQuantity === undefined || data.addQuantity === null || !Number.isInteger(Number(data.addQuantity)) || Number(data.addQuantity) <= 0) {
    errors.addQuantity = "Số lượng thêm là bắt buộc, phải là số nguyên và > 0";
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = "Tổng tiền là bắt buộc và phải >= 0";
  }

  return errors;
};

const validateUpdateReceivedProduct = (data) => {
  const errors = {};

  if (data.addQuantity !== undefined && (!Number.isInteger(Number(data.addQuantity)) || Number(data.addQuantity) <= 0)) {
    errors.addQuantity = "Số lượng thêm phải là số nguyên và > 0";
  }

  if (data.discount !== undefined && (Number(data.discount) < 0 || isNaN(Number(data.discount)))) {
    errors.discount = "Giảm giá phải >= 0";
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = "Tổng tiền phải >= 0";
  }

  return errors;
};

module.exports = { validateCreateReceivedProduct, validateUpdateReceivedProduct };
