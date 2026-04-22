const prisma = require("../config/prisma.config");

class HistoryProviderRepository {
  async findAll({ where }) {
    return await prisma.historyProvider.findMany({
      where,
      include: {
        provider: true,
      },
    });
  }

  async findAndCount({ where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.historyProvider.findMany({
        where,
        orderBy,
        include: {
          provider: true,
        },
      }),
      prisma.historyProvider.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.historyProvider.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });
  }

  async findByProviderId(providerId) {
    return await prisma.historyProvider.findMany({
      where: { providerId },
      include: {
        provider: true,
      },
    });
  }

  async create(data) {
    return await prisma.historyProvider.create({
      data,
      include: {
        provider: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.historyProvider.update({
      where: { id },
      data,
      include: {
        provider: true,
      },
    });
  }

  async delete(id) {
    return await prisma.historyProvider.delete({
      where: { id },
    });
  }

  async createWithTransaction(historyData, providerId) {
    return await prisma.$transaction(async (tx) => {
      // Create history
      const history = await tx.historyProvider.create({
        data: historyData,
        include: {
          provider: true,
        },
      });

      // Cập nhật debtTotal nếu đã thanh toán
      if (historyData.status === "completed" && historyData.paidAmount > 0) {
        const provider = await tx.provider.findUnique({
          where: { id: providerId },
        });

        if (provider) {
          const newDebtTotal = Math.max(0, provider.debtTotal - historyData.paidAmount);
          await tx.provider.update({
            where: { id: providerId },
            data: { debtTotal: newDebtTotal },
          });
        }
      }

      return history;
    });
  }

  async updateWithTransaction(id, updateData, historyBefore) {
    return await prisma.$transaction(async (tx) => {
      // Update history
      const updatedHistory = await tx.historyProvider.update({
        where: { id },
        data: updateData,
        include: {
          provider: true,
        },
      });

      // Cập nhật debtTotal nếu thay đổi status hoặc paidAmount
      const provider = await tx.provider.findUnique({
        where: { id: historyBefore.providerId },
      });

      if (provider) {
        const oldPaidAmount = historyBefore.paidAmount;
        const oldStatus = historyBefore.status;
        const newPaidAmount = updateData.paidAmount !== undefined ? updateData.paidAmount : oldPaidAmount;
        const newStatus = updateData.status !== undefined ? updateData.status : oldStatus;
        
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
          await tx.provider.update({
            where: { id: historyBefore.providerId },
            data: { debtTotal: newDebtTotal },
          });
        }
      }

      return updatedHistory;
    });
  }
}

module.exports = new HistoryProviderRepository();
