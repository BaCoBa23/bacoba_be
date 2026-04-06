const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

class ReceivedProductRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const whereWithStatus = {
      ...where,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.receivedProduct.findMany({
        skip,
        take,
        where: whereWithStatus,
        orderBy,
        include: {
          receivedNote: true,
          product: true,
        },
      }),
      prisma.receivedProduct.count({ where: whereWithStatus }),
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
    const whereWithStatus = {
      receivedNoteId,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.receivedProduct.findMany({
        where: whereWithStatus,
        skip,
        take,
        include: {
          product: true,
        },
      }),
      prisma.receivedProduct.count({ where: whereWithStatus }),
    ]);

    return { data, totalItems };
  }

  async create(data) {
    return await prisma.receivedProduct.create({
      data: {
        ...data,
        status: CommonStatus.ACTIVE,
      },
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
    // Soft delete
    return await prisma.receivedProduct.update({
      where: { id },
      data: { status: CommonStatus.DELETED },
      include: {
        receivedNote: true,
        product: true,
      },
    });
  }
}

module.exports = new ReceivedProductRepository();
