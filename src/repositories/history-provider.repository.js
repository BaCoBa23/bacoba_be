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
}

module.exports = new HistoryProviderRepository();
