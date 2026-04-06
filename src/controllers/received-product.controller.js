const receivedProductService = require("../services/received-product.service");
const { validateCreateReceivedProduct, validateUpdateReceivedProduct } = require("../validations/received-product.validation");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class ReceivedProductController {
  getByReceivedNoteId = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await receivedProductService.getProductsByReceivedNoteId(id, req.query);

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_PRODUCT_BY_NOTE_LIST_SUCCESSFUL,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateCreateReceivedProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const receivedProduct = await receivedProductService.createReceivedProduct({
        ...req.body,
        receivedNoteId: id,
      });

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_PRODUCT_CREATE_SUCCESSFUL,
        data: receivedProduct,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: "Phiếu nhập kho hoặc sản phẩm không tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { id, productId } = req.params;
      const errors = validateUpdateReceivedProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const receivedProduct = await receivedProductService.updateReceivedProduct(id, productId, req.body);

      if (!receivedProduct) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_PRODUCT_UPDATE_SUCCESSFUL,
        data: receivedProduct,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id, productId } = req.params;
      await receivedProductService.deleteReceivedProduct(id, productId);

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_PRODUCT_DELETE_SUCCESSFUL,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ReceivedProductController();
