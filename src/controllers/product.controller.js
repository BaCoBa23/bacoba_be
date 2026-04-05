const productService = require("../services/product.service");
const { ERROR_MESSAGES } = require("../constants");

class ProductController {
  getList = async (req, res) => {
    try {
      const result = await productService.getProducts(req.query);

      return res.success({
        message: "Lấy danh sách sản phẩm thành công",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProductController();
