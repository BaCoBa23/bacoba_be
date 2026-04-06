const attributeService = require("../services/attribute.service");
const { validateCreateAttribute, validateUpdateAttribute } = require("../validations/attribute.validation");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class AttributeController {
  getList = async (req, res) => {
    try {
      const result = await attributeService.getAttributes(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.ATTRIBUTE_LIST_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.ATTRIBUTE_DETAIL_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.ATTRIBUTE_CREATE_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.ATTRIBUTE_UPDATE_SUCCESSFUL,
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
        message: SUCCESS_MESSAGES.ATTRIBUTE_DELETE_SUCCESSFUL,
        data: attribute,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new AttributeController();
