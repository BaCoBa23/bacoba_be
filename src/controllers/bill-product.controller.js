const billProductService = require("../services/bill-product.service");
const { validateCreateBillProduct, validateUpdateBillProduct } = require("../validations/bill-product.validation");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class BillProductController {
  getList = async (req, res) => {
    try {
      const result = await billProductService.getBillProducts(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.BILL_PRODUCT_LIST_SUCCESSFUL,
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
      const billProduct = await billProductService.getBillProductById(parseInt(id, 10));

      if (!billProduct) {
        return res.error({
          message: ERROR_MESSAGES.BILL_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.BILL_PRODUCT_DETAIL_SUCCESSFUL,
        data: billProduct,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getByBillId = async (req, res) => {
    try {
      const { billId } = req.params;
      const result = await billProductService.getProductsByBillId(billId, req.query);

      return res.success({
        message: SUCCESS_MESSAGES.BILL_PRODUCT_BY_BILL_LIST_SUCCESSFUL,
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
      const errors = validateCreateBillProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const billProduct = await billProductService.createBillProduct(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.BILL_PRODUCT_CREATE_SUCCESSFUL,
        data: billProduct,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: "Hoá đơn hoặc sản phẩm không tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateBillProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const billProduct = await billProductService.updateBillProduct(parseInt(id, 10), req.body);

      if (!billProduct) {
        return res.error({
          message: ERROR_MESSAGES.BILL_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.BILL_PRODUCT_UPDATE_SUCCESSFUL,
        data: billProduct,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await billProductService.deleteBillProduct(parseInt(id, 10));

      return res.success({
        message: SUCCESS_MESSAGES.BILL_PRODUCT_DELETE_SUCCESSFUL,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.BILL_PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new BillProductController();
