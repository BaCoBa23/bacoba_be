const prisma = require("../config/prisma.config");

class HistoryProviderRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.historyProvider.findMany({
        skip,
        take,
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

  async findByProviderId(providerId, skip, take) {
    const [data, totalItems] = await Promise.all([
      prisma.historyProvider.findMany({
        where: { providerId },
        skip,
        take,
        include: {
          provider: true,
        },
      }),
      prisma.historyProvider.count({ where: { providerId } }),
    ]);

    return { data, totalItems };
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
