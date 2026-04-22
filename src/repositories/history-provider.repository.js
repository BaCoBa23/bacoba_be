const prisma = require("../config/prisma.config");
const { HistoryProviderStatus } = require("../enums/status.enum");

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
      const history = await tx.historyProvider.create({
        data: historyData,
        include: { provider: true },
      });

      await tx.provider.update({
        where: { id: providerId },
        data: { debtTotal: { decrement: historyData.paidAmount } },
      });

      return history;
    });
  }

  async updateWithTransaction(id, oldHistory, updateData) {
    return await prisma.$transaction(async (tx) => {
      await tx.provider.update({
        where: { id: oldHistory.providerId },
        data: { debtTotal: { increment: oldHistory.paidAmount } },
      });

      const updatedHistory = await tx.historyProvider.update({
        where: { id },
        data: updateData,
        include: { provider: true },
      });

      await tx.provider.update({
        where: { id: updatedHistory.providerId },
        data: { debtTotal: { decrement: updatedHistory.paidAmount } },
      });

      return updatedHistory;
    });
  }

  async cancelWithTransaction(id, oldHistory) {
    return await prisma.$transaction(async (tx) => {
      if (oldHistory.status === HistoryProviderStatus.COMPLETED) {
        await tx.provider.update({
          where: { id: oldHistory.providerId },
          data: { debtTotal: { increment: oldHistory.paidAmount } },
        });
      }
      return await tx.historyProvider.update({
        where: { id },
        data: { status: HistoryProviderStatus.CANCELLED },
        include: { provider: true },
      });
    });
  }
}

module.exports = new HistoryProviderRepository();
