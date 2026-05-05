const billService = require("../services/bill.service");
const { validateCreateBill, validateUpdateBill } = require("../validations/bill.validation");
const { MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class BillController {
  getList = async (req, res) => {
    try {
      const result = await billService.getBills(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.BILL_LIST_SUCCESSFUL,
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
      
      if (!id || isNaN(parseInt(id, 10))) {
        return res.error({
          message: "ID hoá đơn không hợp lệ",
          status: 400,
        });
      }

      const bill = await billService.getBillById(parseInt(id, 10));

      if (!bill) {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.BILL_DETAIL_SUCCESSFUL,
        data: bill,
      });
    } catch (error) {
      console.error("Error in getById:", error);
      return res.error({ 
        message: ERROR_MESSAGES.SERVER_ERROR,
        error: error.message 
      });
    }
  };

  create = async (req, res) => {
    try {
      const data = req.body || {};
      const errors = validateCreateBill(data);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const bill = await billService.createBill(data);

      return res.success({
        message: SUCCESS_MESSAGES.BILL_CREATE_SUCCESSFUL,
        data: bill,
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
      const data = req.body || {};
      const errors = validateUpdateBill(data);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const bill = await billService.updateBill(parseInt(id, 10), data);

      if (!bill) {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.BILL_UPDATE_SUCCESSFUL,
        data: bill,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await billService.deleteBill(parseInt(id, 10));

      return res.success({
        message: SUCCESS_MESSAGES.BILL_DELETE_SUCCESSFUL,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  return = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id, 10))) {
        return res.error({
          message: "ID hoá đơn không hợp lệ",
          status: 400,
        });
      }

      const bill = await billService.returnBill(parseInt(id, 10));

      if (!bill) {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Trả hàng thành công",
        data: bill,
      });
    } catch (error) {
      console.error("Error in return:", error);
      if (error.message === "BILL_NOT_FOUND") {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  exchange = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body || {};

      if (!id || isNaN(parseInt(id, 10))) {
        return res.error({
          message: "ID hoá đơn không hợp lệ",
          status: 400,
        });
      }

      const errors = validateCreateBill(data);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const bill = await billService.exchangeBill(parseInt(id, 10), data);

      if (!bill) {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Đổi hàng thành công",
        data: bill,
        status: 201,
      });
    } catch (error) {
      console.error("Error in exchange:", error);
      if (error.message === "BILL_NOT_FOUND") {
        return res.error({
          message: ERROR_MESSAGES.BILL_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new BillController();
