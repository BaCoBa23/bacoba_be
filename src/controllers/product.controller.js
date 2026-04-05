const productService = require("../services/product.service");
const { validateCreateProduct, validateUpdateProduct } = require("../validations/product.validation");
const { ERROR_MESSAGES } = require("../constants");

class ProductController {
  getList = async (req, res) => {
    try {
      const result = await productService.getProducts(req.query);

      return res.success({
        message: "Lấy danh sách sản phẩm thành công",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const product = await productService.createProduct(req.body);

      return res.success({
        message: "Tạo sản phẩm thành công",
        data: product,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.error({
          message: "ID sản phẩm đã tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const product = await productService.updateProduct(id, req.body);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productService.deleteProduct(id);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Xóa sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProductController();
