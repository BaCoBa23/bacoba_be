const providerRepo = require("../repositories/provider.repository");
const { buildPagination, buildMeta } = require("../utils");

class ProviderService {
  async getProviders(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { search, status } = query;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phoneNumber: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const { data, totalItems } = await providerRepo.findAndCount({
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

  async getProviderById(id) {
    return await providerRepo.findById(id);
  }

  async createProvider(data) {
    const providerData = {
      name: data.name,
      phoneNumber: data.phoneNumber || null,
      email: data.email || null,
      debtTotal: parseFloat(data.debtTotal) || 0,
      total: parseFloat(data.total) || 0,
      status: data.status || "active",
    };

    return await providerRepo.create(providerData);
  }

  async updateProvider(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.debtTotal !== undefined) updateData.debtTotal = parseFloat(data.debtTotal);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);
    if (data.status !== undefined) updateData.status = data.status;

    return await providerRepo.update(id, updateData);
  }

  async deleteProvider(id) {
    return await providerRepo.delete(id);
  }
}

module.exports = new ProviderService();
