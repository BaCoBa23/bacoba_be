const brandRepo = require("../repositories/brand.repository");
const { buildPagination, buildMeta } = require("../utils");

class BrandService {
  async getBrands(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { search, status } = query;

    if (search) {
      where.OR = [
        { name: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const { data, totalItems } = await brandRepo.findAndCount({
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

  async getBrandById(id) {
    return await brandRepo.findById(id);
  }

  async createBrand(data) {
    const brandData = {
      name: data.name,
      status: data.status || "active",
    };

    return await brandRepo.create(brandData);
  }

  async updateBrand(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;

    return await brandRepo.update(id, updateData);
  }

  async deleteBrand(id) {
    return await brandRepo.delete(id);
  }
}

module.exports = new BrandService();
