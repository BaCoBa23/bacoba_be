const attributeTypeService = require("../services/attribute-type.service");
const { validateCreateAttributeType, validateUpdateAttributeType } = require("../validations/attribute-type.validation");
const { MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class AttributeTypeController {
  getList = async (req, res) => {
    try {
      const result = await attributeTypeService.getAttributeTypes(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.ATTRIBUTE_TYPE_LIST_SUCCESSFUL,
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
      const attributeType = await attributeTypeService.getAttributeTypeById(parseInt(id, 10));

      if (!attributeType) {
        return res.error({
          message: ERROR_MESSAGES.ATTRIBUTE_TYPE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.ATTRIBUTE_TYPE_DETAIL_SUCCESSFUL,
        data: attributeType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateAttributeType(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const attributeType = await attributeTypeService.createAttributeType(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.ATTRIBUTE_TYPE_CREATE_SUCCESSFUL,
        data: attributeType,
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
      const errors = validateUpdateAttributeType(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const attributeType = await attributeTypeService.updateAttributeType(parseInt(id, 10), req.body);

      if (!attributeType) {
        return res.error({
          message: ERROR_MESSAGES.ATTRIBUTE_TYPE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.ATTRIBUTE_TYPE_UPDATE_SUCCESSFUL,
        data: attributeType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const attributeType = await attributeTypeService.deleteAttributeType(parseInt(id, 10));

      if (!attributeType) {
        return res.error({
          message: ERROR_MESSAGES.ATTRIBUTE_TYPE_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.ATTRIBUTE_TYPE_DELETE_SUCCESSFUL,
        data: attributeType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new AttributeTypeController();
