const productTypeRepo = require("../repositories/product-type.repository");
const { buildPagination, buildMeta } = require("../utils");

class ProductTypeService {
  async getProductTypes(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { search, status } = query;

    if (search) {
      where.OR = [
        { name: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const { data, totalItems } = await productTypeRepo.findAndCount({
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

  async getProductTypeById(id) {
    return await productTypeRepo.findById(id);
  }

  async createProductType(data) {
    const productTypeData = {
      name: data.name,
      status: data.status || "active",
    };

    return await productTypeRepo.create(productTypeData);
  }

  async updateProductType(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;

    return await productTypeRepo.update(id, updateData);
  }

  async deleteProductType(id) {
    return await productTypeRepo.delete(id);
  }
}

module.exports = new ProductTypeService();
