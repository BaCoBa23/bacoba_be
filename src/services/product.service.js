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

    // 3. Gọi repository
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
}

module.exports = new ProductService();
