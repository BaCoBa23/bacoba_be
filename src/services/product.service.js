const productRepo = require("../repositories/product.repository");
const { buildPagination, buildMeta } = require("../utils");

class ProductService {
  async getProducts(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = { parentId: null };
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
    const formattedData = data.map((product) => {
      return {
        id: product.id,
        name: product.name,
        productType: product.type, // Đổi 'type' của Prisma thành 'productType'
        initialPrice: product.initialPrice,
        salePrice: product.salePrice,
        quantity: product.quantity,
        description: product.description,
        barcode: product.barcode,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        // Map mảng variants
        variants: product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          productType: variant.type,
          initialPrice: variant.initialPrice,
          salePrice: variant.salePrice,
          quantity: variant.quantity,
          description: variant.description,
          barcode: variant.barcode,
          status: variant.status,
          // Bóc tách productAttributes thành mảng attributes [{ id, value }]
          attributes: variant.productAttributes.map((pa) => ({
            id: pa.attribute.id,
            value: pa.attribute.value,
          })),
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
        })),
      };
    });

    return {
      data: formattedData, // Trả về mảng đã format
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getProductById(id) {
    return await productRepo.findById(id);
  }

  async createProduct(data) {
    const productData = {
      id: data.id,
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

    if (data.productTypeId !== undefined)
      updateData.productTypeId = parseInt(data.productTypeId, 10);
    if (data.brandId !== undefined)
      updateData.brandId = parseInt(data.brandId, 10);
    if (data.initialPrice !== undefined)
      updateData.initialPrice = parseFloat(data.initialPrice);
    if (data.salePrice !== undefined)
      updateData.salePrice = parseFloat(data.salePrice);
    if (data.quantity !== undefined)
      updateData.quantity = parseInt(data.quantity, 10);
    if (data.description !== undefined)
      updateData.description = data.description;
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
