const providerService = require("../services/provider.service");
const { validateCreateProvider, validateUpdateProvider } = require("../validations/provider.validation");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");

class ProviderController {
  getList = async (req, res) => {
    try {
      const result = await providerService.getProviders(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.PROVIDER_LIST_SUCCESSFUL,
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
      const provider = await providerService.getProviderById(parseInt(id, 10));

      if (!provider) {
        return res.error({
          message: ERROR_MESSAGES.PROVIDER_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PROVIDER_DETAIL_SUCCESSFUL,
        data: provider,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateProvider(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const provider = await providerService.createProvider(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.PROVIDER_CREATE_SUCCESSFUL,
        data: provider,
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
      const errors = validateUpdateProvider(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: "Dữ liệu không hợp lệ",
          status: 400,
          errors,
        });
      }

      const provider = await providerService.updateProvider(parseInt(id, 10), req.body);

      if (!provider) {
        return res.error({
          message: ERROR_MESSAGES.PROVIDER_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PROVIDER_UPDATE_SUCCESSFUL,
        data: provider,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await providerService.deleteProvider(parseInt(id, 10));

      return res.success({
        message: SUCCESS_MESSAGES.PROVIDER_DELETE_SUCCESSFUL,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.PROVIDER_NOT_FOUND,
          status: 404,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProviderController();
