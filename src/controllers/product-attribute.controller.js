const productAttributeService = require("../services/product-attribute.service");
const { validateCreateProductAttribute, validateUpdateProductAttribute } = require("../validations/product-attribute.validation");
const { ERROR_MESSAGES } = require("../constants");

class ProductAttributeController {
  getList = async (req, res) => {
    try {
      const result = await productAttributeService.getProductAttributes(req.query);

      return res.success({
        message: "Lấy danh sách thuộc tính sản phẩm thành công",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productAttributeService.getAttributesByProductId(productId, req.query);

      return res.success({
        message: "Lấy danh sách thuộc tính của sản phẩm thành công",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getByKey = async (req, res) => {
    try {
      const { productId, attributeId } = req.params;
      const productAttribute = await productAttributeService.getProductAttributeByKey(productId, attributeId);

      if (!productAttribute) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_ATTRIBUTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết thuộc tính sản phẩm thành công",
        data: productAttribute,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateProductAttribute(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const productAttribute = await productAttributeService.createProductAttribute(req.body);

      return res.success({
        message: "Thêm thuộc tính cho sản phẩm thành công",
        data: productAttribute,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: "Sản phẩm hoặc thuộc tính không tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { productId, attributeId } = req.params;
      const errors = validateUpdateProductAttribute(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const productAttribute = await productAttributeService.updateProductAttribute(productId, attributeId, req.body);

      if (!productAttribute) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_ATTRIBUTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật thuộc tính sản phẩm thành công",
        data: productAttribute,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { productId, attributeId } = req.params;
      await productAttributeService.deleteProductAttribute(productId, attributeId);

      return res.success({
        message: "Xóa thuộc tính sản phẩm thành công",
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_ATTRIBUTE_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProductAttributeController();
