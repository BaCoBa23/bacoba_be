const receivedProductService = require("../services/received-product.service");
const { validateCreateReceivedProduct, validateUpdateReceivedProduct } = require("../validations/received-product.validation");
const { ERROR_MESSAGES } = require("../constants");

class ReceivedProductController {
  getList = async (req, res) => {
    try {
      const result = await receivedProductService.getReceivedProducts(req.query);

      return res.success({
        message: "Lấy danh sách sản phẩm nhập kho thành công",
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
      const receivedProduct = await receivedProductService.getReceivedProductById(parseInt(id, 10));

      if (!receivedProduct) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết sản phẩm nhập kho thành công",
        data: receivedProduct,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getByReceivedNoteId = async (req, res) => {
    try {
      const { receivedNoteId } = req.params;
      const result = await receivedProductService.getProductsByReceivedNoteId(receivedNoteId, req.query);

      return res.success({
        message: "Lấy danh sách sản phẩm của phiếu nhập kho thành công",
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
      const errors = validateCreateReceivedProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const receivedProduct = await receivedProductService.createReceivedProduct(req.body);

      return res.success({
        message: "Thêm sản phẩm vào phiếu nhập kho thành công",
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
      const { id } = req.params;
      const errors = validateUpdateReceivedProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const receivedProduct = await receivedProductService.updateReceivedProduct(parseInt(id, 10), req.body);

      if (!receivedProduct) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật sản phẩm nhập kho thành công",
        data: receivedProduct,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await receivedProductService.deleteReceivedProduct(parseInt(id, 10));

      return res.success({
        message: "Xóa sản phẩm khỏi phiếu nhập kho thành công",
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
