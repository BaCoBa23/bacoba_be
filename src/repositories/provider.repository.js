const prisma = require("../config/prisma.config");

class ProviderRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.provider.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.provider.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.provider.findUnique({
      where: { id },
      include: {
        histories: true,
        receivedNotes: true,
      },
    });
  }

  async create(data) {
    return await prisma.provider.create({
      data,
    });
  }

  async update(id, data) {
    return await prisma.provider.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.provider.delete({
      where: { id },
    });
  }
}

module.exports = new ProviderRepository();
