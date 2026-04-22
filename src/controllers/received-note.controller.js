const receivedNoteService = require("../services/received-note.service");
const {
  validateCreateReceivedNote,
  validateUpdateReceivedNote,
} = require("../validations/received-note.validation");
const { MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class ReceivedNoteController {
  getList = async (req, res) => {
    try {
      const result = await receivedNoteService.getReceivedNotes(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_NOTE_LIST_SUCCESSFUL,
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
      const receivedNote = await receivedNoteService.getReceivedNoteById(
        parseInt(id, 10)
      );

      if (!receivedNote) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_NOTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_NOTE_DETAIL_SUCCESSFUL,
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
      const result = await receivedNoteService.getReceivedNotesByProviderId(
        providerId,
        req.query
      );

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_NOTE_BY_PROVIDER_LIST_SUCCESSFUL,
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
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const receivedNote = await receivedNoteService.createReceivedNote(
        req.body
      );

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_NOTE_CREATE_SUCCESSFUL,
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

  confirm = async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL

      const confirmedNote = await receivedNoteService.confirmNote(
        parseInt(id, 10)
      );

      return res.success({
        message: "Xác nhận phiếu nhập kho thành công",
        data: confirmedNote,
        status: 200,
      });
    } catch (error) {
      console.error(error);
      if (error.message === "NOTE_NOT_FOUND") {
        return res.error({ message: "Không tìm thấy phiếu nhập", status: 404 });
      }
      
      if (error.message === "NOTE_NOT_IN_DRAFT_STATE") {
        return res.error({ 
          message: "Chỉ có thể xác nhận phiếu ở trạng thái tạm (Draft)", 
          status: 400 
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  // receivedNoteController.js

  cancel = async (req, res) => {
    try {
      const { id } = req.params; // Hoặc lấy từ req.body tùy design của bạn

      if (!id) {
        return res.error({
          message: "Thiếu ID phiếu nhập",
          status: 400,
        });
      }

      const cancelledNote = await receivedNoteService.cancelReceivedNote(
        parseInt(id, 10)
      );

      return res.success({
        message: "Hủy phiếu nhập và cập nhật kho/công nợ thành công",
        data: cancelledNote,
        status: 200,
      });
    } catch (error) {
      console.error("Cancel Note Error:", error);

      if (error.message === "NOT_FOUND") {
        return res.error({ message: "Không tìm thấy phiếu nhập", status: 404 });
      }
      if (error.message === "ALREADY_CANCELLED") {
        return res.error({
          message: "Phiếu này đã được hủy trước đó",
          status: 400,
        });
      }

      return res.error({
        message: "Có lỗi xảy ra khi hủy phiếu",
        status: 500,
      });
    }
  };
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateReceivedNote(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const receivedNote = await receivedNoteService.updateReceivedNote(
        parseInt(id, 10),
        req.body
      );

      if (!receivedNote) {
        return res.error({
          message: ERROR_MESSAGES.RECEIVED_NOTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.RECEIVED_NOTE_UPDATE_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.RECEIVED_NOTE_DELETE_SUCCESSFUL,
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
