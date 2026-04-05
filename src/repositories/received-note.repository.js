const prisma = require("../config/prisma.config");

class ReceivedNoteRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.receivedNote.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          provider: true,
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.receivedNote.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.receivedNote.findUnique({
      where: { id },
      include: {
        provider: true,
        receivedProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByProviderId(providerId, skip, take) {
    const [data, totalItems] = await Promise.all([
      prisma.receivedNote.findMany({
        where: { providerId },
        skip,
        take,
        include: {
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.receivedNote.count({ where: { providerId } }),
    ]);

    return { data, totalItems };
  }

  async create(data) {
    return await prisma.receivedNote.create({
      data,
      include: {
        provider: true,
        receivedProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.receivedNote.update({
      where: { id },
      data,
      include: {
        provider: true,
        receivedProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.receivedNote.delete({
      where: { id },
    });
  }
}

module.exports = new ReceivedNoteRepository();
