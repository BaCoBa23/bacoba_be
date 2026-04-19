const productRepo = require("../repositories/product.repository");
const { buildPagination, buildMeta } = require("../utils");

class ProductService {
  async getProducts(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { search, brandId, typeId, status } = query;

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { description: { contains: search } },
        { barcode: { contains: search } },
      ];
    }
    if (brandId) where.brandId = parseInt(brandId, 10);
    if (typeId) where.productTypeId = parseInt(typeId, 10);
    if (status) where.status = status;

    const { data, totalItems } = await productRepo.findAndCount({
      skip,
      take,
      where,
      orderBy,
    });

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getProductById(id) {
    return await productRepo.findById(id);
  }

  async createProduct(data) {
    const productData = {
      id: data.id,
      name: data.name || "Sản Phẩm",
      productTypeId: parseInt(data.productTypeId, 10),
      brandId: parseInt(data.brandId, 10),
      initialPrice: parseFloat(data.initialPrice),
      salePrice: parseFloat(data.salePrice),
      quantity: parseInt(data.quantity, 10),
      description: data.description || null,
      barcode: data.barcode || null,
      status: data.status || "active",
      parentId: data.parentId || null,
    };

    return await productRepo.create(productData);
  }

  async updateProduct(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.productTypeId !== undefined) updateData.productTypeId = parseInt(data.productTypeId, 10);
    if (data.brandId !== undefined) updateData.brandId = parseInt(data.brandId, 10);
    if (data.initialPrice !== undefined) updateData.initialPrice = parseFloat(data.initialPrice);
    if (data.salePrice !== undefined) updateData.salePrice = parseFloat(data.salePrice);
    if (data.quantity !== undefined) updateData.quantity = parseInt(data.quantity, 10);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;

    return await productRepo.update(id, updateData);
  }

  async deleteProduct(id) {
    return await productRepo.delete(id);
  }
}

module.exports = new ProductService();
