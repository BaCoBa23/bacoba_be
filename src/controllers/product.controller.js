const productService = require("../services/product.service");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../validations/product.validation");
const {
  MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_VALIDATIONS,
} = require("../constants");

class ProductController {
  getList = async (req, res) => {
    try {
      const result = await productService.getProducts(req.query);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_LIST_SUCCESSFUL,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getSearchedList = async (req, res) => {
    try {
      const result = await productService.getSearchProducts(req.query);
  
      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_LIST_SUCCESSFUL,
        data: result.data,
        total: result.totalItems, // Trả về tổng số bản ghi đơn giản
      });
    } catch (error) {
      console.error("Error in getList Product:", error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_DETAIL_SUCCESSFUL,
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  create = async (req, res) => {
    try {
      const errors = validateCreateProduct(req.body);
      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const product = await productService.createProduct(req.body);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_CREATE_SUCCESSFUL,
        data: product,
        status: 201,
      });
    } catch (error) {
      console.error("Error at createProduct:", error);
      if (error.code === "P2002") {
        return res.error({
          message: "ID sản phẩm đã tồn tại",
          status: 400,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validateUpdateProduct(req.body);

      if (Object.keys(errors).length > 0) {
        return res.error({
          message: MESSAGES.VALIDATION_ERROR,
          status: 400,
          errors,
        });
      }

      const product = await productService.updateProduct(id, req.body);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_UPDATE_SUCCESSFUL,
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productService.deleteProduct(id);

      if (!product) {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_DELETE_SUCCESSFUL,
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  renameProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, productTypeId, initialPrice, salePrice } = req.body;
  
      // --- VALIDATION ĐẦU VÀO ---
      // Khởi tạo object chứa dữ liệu sạch sau khi validate
      const updateData = {};
  
      // Validate Name (nếu có truyền lên)
      if (name !== undefined) {
        if (!name || typeof name !== "string") {
          return res.error({ message: "Tên sản phẩm phải là chuỗi ký tự hợp lệ", status: 400 });
        }
        updateData.name = name;
      }
  
      // Validate Product Type Id (nếu có truyền lên)
      if (productTypeId !== undefined) {
        if (!Number.isInteger(productTypeId)) {
          return res.error({ message: "Mã loại sản phẩm (productTypeId) phải là số nguyên", status: 400 });
        }
        updateData.productTypeId = productTypeId;
      }
  
      // Validate Initial Price (nếu có truyền lên)
      if (initialPrice !== undefined) {
        if (typeof initialPrice !== "number" || initialPrice < 0) {
          return res.error({ message: "Giá vốn (initialPrice) phải là số và không được âm", status: 400 });
        }
        updateData.initialPrice = initialPrice;
      }
  
      // Validate Sale Price (nếu có truyền lên)
      if (salePrice !== undefined) {
        if (typeof salePrice !== "number" || salePrice < 0) {
          return res.error({ message: "Giá bán (salePrice) phải là số và không được âm", status: 400 });
        }
        updateData.salePrice = salePrice;
      }
  
      // Nếu không truyền trường nào lên để cập nhật
      if (Object.keys(updateData).length === 0) {
        return res.error({ message: "Không có dữ liệu nào được thay đổi", status: 400 });
      }
  
      // --- GỌI TẦNG NGHIỆP VỤ ---
      // (Giả sử bạn gọi qua productService, và service gọi sang repo đã sửa ở trên)
      const product = await productService.renameProductAndVariants(id, updateData);
  
      return res.success({
        message: "Cập nhật thông tin sản phẩm và các biến thể thành công",
        data: product,
      });
  
    } catch (error) {
      console.error(error);
      
      // Bắt lỗi Prisma P2025 (Không tìm thấy ID sản phẩm cha cần update)
      if (error.code === "P2025") {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
  
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };  

  getParentAttributes = async (req, res) => {
    try {
      const { id } = req.params;

      const attributes = await productService.getParentAttributes(id);

      return res.success({
        message: SUCCESS_MESSAGES.PRODUCT_ATTRIBUTE_BY_PRODUCT_LIST_SUCCESSFUL,
        data: attributes,
      });
    } catch (error) {
      console.error(error);
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  addVariant = async (req, res) => {
    try {
      const { id } = req.params;
      const attributes = req.body;

      if (
        !attributes ||
        !Array.isArray(attributes) ||
        attributes.length === 0
      ) {
        return res.error({
          message: ERROR_VALIDATIONS.COMMON_VALIDATE,
          status: 400,
        });
      }

      const result = await productService.addVariantToProduct(id, attributes);

      let responseMessage = "Tạo biến thể sản phẩm thành công";
      if (result.duplicateCount > 0) {
        responseMessage = `Tạo thành công ${result.createdVariants.length} biến thể. Bỏ qua ${result.duplicateCount} biến thể đã trùng lặp.`;
      }

      return res.success({
        message: responseMessage,
        data: result.createdVariants,
        status: 201,
      });
    } catch (error) {
      console.error("Error at addVariant:", error);

      if (error.message === "PARENT_NOT_FOUND") {
        return res.error({
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      if (error.message === "ALL_VARIANTS_EXIST") {
        return res.error({
          message: ERROR_MESSAGES.DUPLICATE_PRODUCT_VARIANTS,
          status: 409,
        });
      }
      return res.error({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}

module.exports = new ProductController();
