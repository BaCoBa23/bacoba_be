const prisma = require("../config/prisma.config");

class ReceivedProductRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.receivedProduct.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          receivedNote: true,
          product: true,
        },
      }),
      prisma.receivedProduct.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.receivedProduct.findUnique({
      where: { id },
      include: {
        receivedNote: true,
        product: true,
      },
    });
  }

  async findByReceivedNoteId(receivedNoteId, skip, take) {
    const [data, totalItems] = await Promise.all([
      prisma.receivedProduct.findMany({
        where: { receivedNoteId },
        skip,
        take,
        include: {
          product: true,
        },
      }),
      prisma.receivedProduct.count({ where: { receivedNoteId } }),
    ]);

    return { data, totalItems };
  }

  async create(data) {
    return await prisma.receivedProduct.create({
      data,
      include: {
        receivedNote: true,
        product: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.receivedProduct.update({
      where: { id },
      data,
      include: {
        receivedNote: true,
        product: true,
      },
    });
  }

  async delete(id) {
    return await prisma.receivedProduct.delete({
      where: { id },
    });
  }
}

module.exports = new ReceivedProductRepository();
