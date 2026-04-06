const billService = require("../services/bill.service");
const { validateCreateBill, validateUpdateBill } = require("../validations/bill.validation");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

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
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateBill(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const bill = await billService.createBill(req.body);

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
      const errors = validateUpdateBill(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const bill = await billService.updateBill(parseInt(id, 10), req.body);

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
}

module.exports = new BillController();
