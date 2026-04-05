const brandService = require("../services/brand.service");
const { validateCreateBrand, validateUpdateBrand } = require("../validations/brand.validation");
const { ERROR_MESSAGES } = require("../constants");

class BrandController {
  getList = async (req, res) => {
    try {
      const result = await brandService.getBrands(req.query);

      return res.success({
        message: "Lấy danh sách thương hiệu thành công",
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
      const brand = await brandService.getBrandById(parseInt(id, 10));

      if (!brand) {
        return res.error({
          message: ERROR_MESSAGES.BRAND_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Lấy chi tiết thương hiệu thành công",
        data: brand,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateBrand(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const brand = await brandService.createBrand(req.body);

      return res.success({
        message: "Tạo thương hiệu thành công",
        data: brand,
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
      const errors = validateUpdateBrand(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const brand = await brandService.updateBrand(parseInt(id, 10), req.body);

      if (!brand) {
        return res.error({
          message: ERROR_MESSAGES.BRAND_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Cập nhật thương hiệu thành công",
        data: brand,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const brand = await brandService.deleteBrand(parseInt(id, 10));

      if (!brand) {
        return res.error({
          message: ERROR_MESSAGES.BRAND_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: "Xóa thương hiệu thành công",
        data: brand,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new BrandController();
