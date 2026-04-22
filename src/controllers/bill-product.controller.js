const billProductService = require("../services/bill-product.service");
const { validateCreateBillProduct, validateUpdateBillProduct } = require("../validations/bill-product.validation");
const { MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class BillProductController {
  getByBillId = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await billProductService.getProductsByBillId(id, req.query);

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
      const { id } = req.params;
      const dataWithBillId = {
        ...req.body,
        billId: id,
      };
      const errors = validateCreateBillProduct(dataWithBillId);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const billProduct = await billProductService.createBillProduct(dataWithBillId);

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
      const { id, productId } = req.params;
      const errors = validateUpdateBillProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const billProduct = await billProductService.updateBillProduct(id, productId, req.body);

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
      const { id, productId } = req.params;
      await billProductService.deleteBillProduct(id, productId);

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
