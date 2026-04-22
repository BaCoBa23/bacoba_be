const historyProviderRepo = require("../repositories/history-provider.repository");
const { HistoryProviderStatus } = require("../enums/status.enum");

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
    const data = await historyProviderRepo.findByProviderId(
      parseInt(providerId, 10),
    );

    return data;
  }

  async createHistory(data) {
    const paidAmount =
      data.paidAmount !== undefined && data.paidAmount !== null
        ? parseFloat(data.paidAmount)
        : 0;
    const providerId = parseInt(data.providerId, 10);
    const historyData = {
      providerId,
      paidAmount,
      description: data.description || null,
      status: HistoryProviderStatus.COMPLETED,
    };

    return await historyProviderRepo.createWithTransaction(
      historyData,
      providerId,
    );
  }

  async updateHistory(id, data) {
    const oldHistory = await historyProviderRepo.findById(id);
    if (!oldHistory) return null;

    const updateData = {};
    if (data.providerId !== undefined)
      updateData.providerId = parseInt(data.providerId, 10);
    if (data.paidAmount !== undefined)
      updateData.paidAmount = parseFloat(data.paidAmount);
    if (data.description !== undefined)
      updateData.description = data.description;

    return await historyProviderRepo.updateWithTransaction(
      id,
      oldHistory,
      updateData,
    );
  }

  async deleteHistory(id) {
    const oldHistory = await historyProviderRepo.findById(id);
    if (!oldHistory) return null;

    if (oldHistory.status === HistoryProviderStatus.CANCELLED) {
      return oldHistory;
    }
    return await historyProviderRepo.cancelWithTransaction(id, oldHistory);
  }
}

module.exports = new HistoryProviderService();
