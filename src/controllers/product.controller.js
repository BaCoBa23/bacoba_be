const productService = require("../services/product.service");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../validations/product.validation");
const {
  MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_VALIDATIONS,
} = require("../constants");

class ProductController {
  getList = async (req, res) => {
    try {
      const result = await productService.getProducts(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_LIST_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.PRODUCT_DETAIL_SUCCESSFUL,
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
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const product = await productService.createProduct(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_CREATE_SUCCESSFUL,
        data: product,
        status: 201,
      });
    } catch (error) {
      console.error("Error at createProduct:", error);
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
          message: MESSAGES.VALIDATION_ERROR,
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
        message: SUCCESS_MESSAGES.PRODUCT_UPDATE_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.PRODUCT_DELETE_SUCCESSFUL,
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  renameProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || typeof name !== "string") {
        return res.error({
          message: "Tên sản phẩm là bắt buộc và phải là chuỗi ký tự",
          status: 400,
        });
      }

      const product = await productService.renameProductAndVariants(id, name);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Đổi tên sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getParentAttributes = async (req, res) => {
    try {
      const { id } = req.params;

      const attributes = await productService.getParentAttributes(id);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_ATTRIBUTE_BY_PRODUCT_LIST_SUCCESSFUL,
        data: attributes,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  addVariant = async (req, res) => {
    try {
      const { id } = req.params;
      const attributes = req.body;

      if (
        !attributes ||
        !Array.isArray(attributes) ||
        attributes.length === 0
      ) {
        return res.error({
          message: ERROR_VALIDATIONS.COMMON_VALIDATE,
          status: 400,
        });
      }

      const result = await productService.addVariantToProduct(id, attributes);

      let responseMessage = "Tạo biến thể sản phẩm thành công";
      if (result.duplicateCount > 0) {
        responseMessage = `Tạo thành công ${result.createdVariants.length} biến thể. Bỏ qua ${result.duplicateCount} biến thể đã trùng lặp.`;
      }

      return res.success({
        message: responseMessage,
        data: result.createdVariants,
        status: 201,
      });
    } catch (error) {
      console.error("Error at addVariant:", error);

      if (error.message === "PARENT_NOT_FOUND") {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      if (error.message === "ALL_VARIANTS_EXIST") {
        return res.error({
          message: ERROR_MESSAGES.DUPLICATE_PRODUCT_VARIANTS,
          status: 409,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProductController();
