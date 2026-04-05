const historyProviderService = require("../services/history-provider.service");
const { validateCreateHistoryProvider, validateUpdateHistoryProvider } = require("../validations/history-provider.validation");
const { ERROR_MESSAGES } = require("../constants");

class HistoryProviderController {
  getList = async (req, res) => {
    try {
      const result = await historyProviderService.getHistories(req.query);

      return res.success({
        message: "Lấy danh sách lịch sử thanh toán thành công",
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
      const history = await historyProviderService.getHistoryById(parseInt(id, 10));

      if (!history) {
        return res.error({
          message: ERROR_MESSAGES.HISTORY_PROVIDER_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết lịch sử thanh toán thành công",
        data: history,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getByProviderId = async (req, res) => {
    try {
      const { providerId } = req.params;
      const result = await historyProviderService.getHistoriesByProviderId(providerId, req.query);

      return res.success({
        message: "Lấy danh sách lịch sử thanh toán của nhà cung cấp thành công",
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
      const errors = validateCreateHistoryProvider(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const history = await historyProviderService.createHistory(req.body);

      return res.success({
        message: "Tạo lịch sử thanh toán thành công",
        data: history,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: "Nhà cung cấp không tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateHistoryProvider(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const history = await historyProviderService.updateHistory(parseInt(id, 10), req.body);

      if (!history) {
        return res.error({
          message: ERROR_MESSAGES.HISTORY_PROVIDER_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật lịch sử thanh toán thành công",
        data: history,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await historyProviderService.deleteHistory(parseInt(id, 10));

      return res.success({
        message: "Xóa lịch sử thanh toán thành công",
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.HISTORY_PROVIDER_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new HistoryProviderController();
