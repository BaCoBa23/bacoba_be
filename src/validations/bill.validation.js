const validateCreateBill = (data) => {
  const errors = {};

  if (data.total === undefined || data.total === null || Number(data.total) < 0) {
    errors.total = "Tổng tiền là bắt buộc và phải >= 0";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "Trạng thái phải là chuỗi";
  }

  // Validate billProducts nếu có
  if (data.billProducts !== undefined && data.billProducts !== null) {
    if (!Array.isArray(data.billProducts)) {
      errors.billProducts = "Danh sách sản phẩm phải là array";
    } else {
      data.billProducts.forEach((bp, index) => {
        if (!bp.productId) {
          errors[`billProducts[${index}].productId`] = "Mã sản phẩm là bắt buộc";
        }
        if (bp.quantity === undefined || Number(bp.quantity) <= 0) {
          errors[`billProducts[${index}].quantity`] = "Số lượng phải > 0";
        }
        if (bp.salePrice === undefined || Number(bp.salePrice) < 0) {
          errors[`billProducts[${index}].salePrice`] = "Giá bán phải >= 0";
        }
        if (bp.total === undefined || Number(bp.total) < 0) {
          errors[`billProducts[${index}].total`] = "Tổng tiền phải >= 0";
        }
      });
    }
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

  // Validate billProducts nếu có
  if (data.billProducts !== undefined && data.billProducts !== null) {
    if (!Array.isArray(data.billProducts)) {
      errors.billProducts = "Danh sách sản phẩm phải là array";
    } else {
      data.billProducts.forEach((bp, index) => {
        if (!bp.productId) {
          errors[`billProducts[${index}].productId`] = "Mã sản phẩm là bắt buộc";
        }
        if (bp.quantity === undefined || Number(bp.quantity) <= 0) {
          errors[`billProducts[${index}].quantity`] = "Số lượng phải > 0";
        }
        if (bp.salePrice === undefined || Number(bp.salePrice) < 0) {
          errors[`billProducts[${index}].salePrice`] = "Giá bán phải >= 0";
        }
        if (bp.total === undefined || Number(bp.total) < 0) {
          errors[`billProducts[${index}].total`] = "Tổng tiền phải >= 0";
        }
      });
    }
  }

  return errors;
};

module.exports = { validateCreateBill, validateUpdateBill };
