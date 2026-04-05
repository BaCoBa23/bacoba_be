const historyProviderRepo = require("../repositories/history-provider.repository");
const { buildPagination, buildMeta } = require("../utils");

class HistoryProviderService {
  async getHistories(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { providerId, status } = query;

    if (providerId) where.providerId = parseInt(providerId, 10);
    if (status) where.status = status;

    const { data, totalItems } = await historyProviderRepo.findAndCount({
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

  async getHistoryById(id) {
    return await historyProviderRepo.findById(id);
  }

  async getHistoriesByProviderId(providerId, query) {
    const { page, pageSize, skip, take } = buildPagination(query);
    const { data, totalItems } = await historyProviderRepo.findByProviderId(parseInt(providerId, 10), skip, take);

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async createHistory(data) {
    const historyData = {
      providerId: parseInt(data.providerId, 10),
      paidAmount: parseFloat(data.paidAmount),
      description: data.description || null,
      status: data.status || "active",
    };

    return await historyProviderRepo.create(historyData);
  }

  async updateHistory(id, data) {
    const updateData = {};

    if (data.paidAmount !== undefined) updateData.paidAmount = parseFloat(data.paidAmount);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    return await historyProviderRepo.update(id, updateData);
  }

  async deleteHistory(id) {
    return await historyProviderRepo.delete(id);
  }
}

module.exports = new HistoryProviderService();
