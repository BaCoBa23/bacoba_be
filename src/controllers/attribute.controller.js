const attributeService = require("../services/attribute.service");
const { validateCreateAttribute, validateUpdateAttribute } = require("../validations/attribute.validation");
const { ERROR_MESSAGES } = require("../constants");

class AttributeController {
  getList = async (req, res) => {
    try {
      const result = await attributeService.getAttributes(req.query);

      return res.success({
        message: "Lấy danh sách thuộc tính thành công",
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
      const attribute = await attributeService.getAttributeById(parseInt(id, 10));

      if (!attribute) {
        return res.error({
          message: ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết thuộc tính thành công",
        data: attribute,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateAttribute(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const attribute = await attributeService.createAttribute(req.body);

      return res.success({
        message: "Tạo thuộc tính thành công",
        data: attribute,
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
      const errors = validateUpdateAttribute(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const attribute = await attributeService.updateAttribute(parseInt(id, 10), req.body);

      if (!attribute) {
        return res.error({
          message: ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật thuộc tính thành công",
        data: attribute,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const attribute = await attributeService.deleteAttribute(parseInt(id, 10));

      if (!attribute) {
        return res.error({
          message: ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Xóa thuộc tính thành công",
        data: attribute,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new AttributeController();
