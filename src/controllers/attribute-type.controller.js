const attributeTypeService = require("../services/attribute-type.service");
const { validateCreateAttributeType, validateUpdateAttributeType } = require("../validations/attribute-type.validation");
const { ERROR_MESSAGES } = require("../constants");

class AttributeTypeController {
  getList = async (req, res) => {
    try {
      const result = await attributeTypeService.getAttributeTypes(req.query);

      return res.success({
        message: "Lấy danh sách loại thuộc tính thành công",
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
        message: "Lấy chi tiết loại thuộc tính thành công",
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
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const attributeType = await attributeTypeService.createAttributeType(req.body);

      return res.success({
        message: "Tạo loại thuộc tính thành công",
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
          message: "Dữ liệu không hợp lệ",
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
        message: "Cập nhật loại thuộc tính thành công",
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
        message: "Xóa loại thuộc tính thành công",
        data: attributeType,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new AttributeTypeController();
