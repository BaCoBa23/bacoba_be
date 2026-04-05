const validateCreateBillProduct = (data) => {
  const errors = {};

  if (!data.billId || !Number.isInteger(Number(data.billId))) {
    errors.billId = "ID hoá đơn là bắt buộc";
  }

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = "ID sản phẩm là bắt buộc và phải là chuỗi";
  }

  if (data.quantity === undefined || data.quantity === null || !Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0) {
    errors.quantity = "Số lượng là bắt buộc, phải là số nguyên và > 0";
  }

  if (data.salePrice === undefined || data.salePrice === null || Number(data.salePrice) < 0) {
    errors.salePrice = "Giá bán là bắt buộc và phải >= 0";
  }

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = "Tổng tiền là bắt buộc và phải >= 0";
  }

  return errors;
};

const validateUpdateBillProduct = (data) => {
  const errors = {};

  if (data.quantity !== undefined && (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0)) {
    errors.quantity = "Số lượng phải là số nguyên và > 0";
  }

  if (data.salePrice !== undefined && (Number(data.salePrice) < 0 || isNaN(Number(data.salePrice)))) {
    errors.salePrice = "Giá bán phải >= 0";
  }

  if (data.total !== undefined && (Number(data.total) < 0 || isNaN(Number(data.total)))) {
    errors.total = "Tổng tiền phải >= 0";
  }

  return errors;
};

module.exports = { validateCreateBillProduct, validateUpdateBillProduct };
