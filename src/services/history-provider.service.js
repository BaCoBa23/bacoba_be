const historyProviderRepo = require("../repositories/history-provider.repository");

class HistoryProviderService {
  async getHistories(query) {
    const where = {};
    const { providerId, status } = query;

    if (providerId) where.providerId = parseInt(providerId, 10);
    if (status) where.status = status;

    const data = await historyProviderRepo.findAll({
      where,
    });

    return data;
  }

  async getHistoryById(id) {
    return await historyProviderRepo.findById(id);
  }

  async getHistoriesByProviderId(providerId, query) {
    const data = await historyProviderRepo.findByProviderId(parseInt(providerId, 10));

    return data;
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
