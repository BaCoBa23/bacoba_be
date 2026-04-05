const receivedNoteService = require("../services/received-note.service");
const { validateCreateReceivedNote, validateUpdateReceivedNote } = require("../validations/received-note.validation");
const { ERROR_MESSAGES } = require("../constants");

class ReceivedNoteController {
  getList = async (req, res) => {
    try {
      const result = await receivedNoteService.getReceivedNotes(req.query);

      return res.success({
        message: "Lấy danh sách phiếu nhập kho thành công",
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
      const receivedNote = await receivedNoteService.getReceivedNoteById(parseInt(id, 10));

      if (!receivedNote) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_NOTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết phiếu nhập kho thành công",
        data: receivedNote,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getByProviderId = async (req, res) => {
    try {
      const { providerId } = req.params;
      const result = await receivedNoteService.getReceivedNotesByProviderId(providerId, req.query);

      return res.success({
        message: "Lấy danh sách phiếu nhập kho của nhà cung cấp thành công",
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
      const errors = validateCreateReceivedNote(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const receivedNote = await receivedNoteService.createReceivedNote(req.body);

      return res.success({
        message: "Tạo phiếu nhập kho thành công",
        data: receivedNote,
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
      const errors = validateUpdateReceivedNote(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const receivedNote = await receivedNoteService.updateReceivedNote(parseInt(id, 10), req.body);

      if (!receivedNote) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_NOTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật phiếu nhập kho thành công",
        data: receivedNote,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await receivedNoteService.deleteReceivedNote(parseInt(id, 10));

      return res.success({
        message: "Xóa phiếu nhập kho thành công",
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_NOTE_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ReceivedNoteController();
