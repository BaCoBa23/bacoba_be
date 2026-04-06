const productTypeService = require("../services/product-type.service");
const { validateCreateProductType, validateUpdateProductType } = require("../validations/product-type.validation");
const { MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class ProductTypeController {
  getList = async (req, res) => {
    try {
      const result = await productTypeService.getProductTypes(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_TYPE_LIST_SUCCESSFUL,
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
      const productType = await productTypeService.getProductTypeById(parseInt(id, 10));

      if (!productType) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_TYPE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_TYPE_DETAIL_SUCCESSFUL,
        data: productType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateProductType(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const productType = await productTypeService.createProductType(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_TYPE_CREATE_SUCCESSFUL,
        data: productType,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateProductType(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const productType = await productTypeService.updateProductType(parseInt(id, 10), req.body);

      if (!productType) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_TYPE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_TYPE_UPDATE_SUCCESSFUL,
        data: productType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const productType = await productTypeService.deleteProductType(parseInt(id, 10));

      if (!productType) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_TYPE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_TYPE_DELETE_SUCCESSFUL,
        data: productType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProductTypeController();
