const historyProviderRepo = require("../repositories/history-provider.repository");
const providerRepo = require("../repositories/provider.repository");

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

    const history = await historyProviderRepo.create(historyData);

    // Cập nhật debtTotal nếu đã thanh toán
    if (status === "completed" && paidAmount > 0) {
      const provider = await providerRepo.findById(providerId);
      if (provider) {
        const newDebtTotal = Math.max(0, provider.debtTotal - paidAmount);
        await providerRepo.update(providerId, { debtTotal: newDebtTotal });
      }
    }

    return history;
  }

  async updateHistory(id, data) {
    const updateData = {};
    const history = await historyProviderRepo.findById(id);

    if (!history) return null;

    const oldPaidAmount = history.paidAmount;
    const oldStatus = history.status;
    let newPaidAmount = oldPaidAmount;
    let newStatus = oldStatus;

    if (data.paidAmount !== undefined) {
      newPaidAmount = parseFloat(data.paidAmount);
      updateData.paidAmount = newPaidAmount;
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) {
      newStatus = data.status;
      updateData.status = newStatus;
    }

    const updatedHistory = await historyProviderRepo.update(id, updateData);

    // Cập nhật debtTotal nếu thay đổi status hoặc paidAmount
    const provider = await providerRepo.findById(history.providerId);
    if (provider) {
      let newDebtTotal = provider.debtTotal;

      // Nếu chuyển từ pending sang completed
      if (oldStatus === "pending" && newStatus === "completed") {
        newDebtTotal = Math.max(0, provider.debtTotal - newPaidAmount);
      }
      // Nếu chuyển từ completed sang pending
      else if (oldStatus === "completed" && newStatus === "pending") {
        newDebtTotal = provider.debtTotal + oldPaidAmount;
      }
      // Nếu update paidAmount khi đã completed
      else if (oldStatus === "completed" && newStatus === "completed" && newPaidAmount !== oldPaidAmount) {
        const diff = newPaidAmount - oldPaidAmount;
        newDebtTotal = Math.max(0, provider.debtTotal - diff);
      }

      if (newDebtTotal !== provider.debtTotal) {
        await providerRepo.update(history.providerId, { debtTotal: newDebtTotal });
      }
    }

    return updatedHistory;
  }

  async deleteHistory(id) {
    return await historyProviderRepo.delete(id);
  }
}

module.exports = new HistoryProviderService();
