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
    const paidAmount = data.paidAmount !== undefined && data.paidAmount !== null ? parseFloat(data.paidAmount) : 0;
    const providerId = parseInt(data.providerId, 10);
    const status = data.status || (paidAmount === 0 ? "pending" : "completed");
    
    const historyData = {
      providerId,
      paidAmount,
      description: data.description || null,
      status,
    };

    return await historyProviderRepo.createWithTransaction(historyData, providerId);
  }

  async updateHistory(id, data) {
    const history = await historyProviderRepo.findById(id);

    if (!history) return null;

    const updateData = {};

    if (data.paidAmount !== undefined) {
      updateData.paidAmount = parseFloat(data.paidAmount);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    return await historyProviderRepo.updateWithTransaction(id, updateData, history);
  }

  async deleteHistory(id) {
    return await historyProviderRepo.delete(id);
  }
}

module.exports = new HistoryProviderService();
