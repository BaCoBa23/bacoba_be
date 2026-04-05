const validateCreateProduct = (data) => {
  const errors = {};

  if (!data.id || typeof data.id !== "string") {
    errors.id = "ID sản phẩm là bắt buộc và phải là chuỗi";
  }

  if (!data.productTypeId || !Number.isInteger(Number(data.productTypeId))) {
    errors.productTypeId = "Loại sản phẩm là bắt buộc";
  }

  if (!data.brandId || !Number.isInteger(Number(data.brandId))) {
    errors.brandId = "Thương hiệu là bắt buộc";
  }

  if (data.initialPrice === undefined || data.initialPrice === null || Number(data.initialPrice) < 0) {
    errors.initialPrice = "Giá gốc là bắt buộc và phải >= 0";
  }

  if (data.salePrice === undefined || data.salePrice === null || Number(data.salePrice) < 0) {
    errors.salePrice = "Giá bán là bắt buộc và phải >= 0";
  }

  if (data.quantity === undefined || data.quantity === null || !Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 0) {
    errors.quantity = "Số lượng là bắt buộc, phải là số nguyên và >= 0";
  }

  return errors;
};

const validateUpdateProduct = (data) => {
  const errors = {};

  if (data.productTypeId !== undefined && !Number.isInteger(Number(data.productTypeId))) {
    errors.productTypeId = "Loại sản phẩm không hợp lệ";
  }

  if (data.brandId !== undefined && !Number.isInteger(Number(data.brandId))) {
    errors.brandId = "Thương hiệu không hợp lệ";
  }

  if (data.initialPrice !== undefined && (Number(data.initialPrice) < 0 || isNaN(Number(data.initialPrice)))) {
    errors.initialPrice = "Giá gốc phải >= 0";
  }

  if (data.salePrice !== undefined && (Number(data.salePrice) < 0 || isNaN(Number(data.salePrice)))) {
    errors.salePrice = "Giá bán phải >= 0";
  }

  if (data.quantity !== undefined && (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 0)) {
    errors.quantity = "Số lượng phải là số nguyên và >= 0";
  }

  return errors;
};

module.exports = { validateCreateProduct, validateUpdateProduct };
