const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

class BillProductRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    // Auto filter deleted records
    const whereWithStatus = {
      ...where,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.billProduct.findMany({
        skip,
        take,
        where: whereWithStatus,
        orderBy,
        include: {
          bill: true,
          product: true,
        },
      }),
      prisma.billProduct.count({ where: whereWithStatus }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.billProduct.findUnique({
      where: { id },
      include: {
        bill: true,
        product: true,
      },
    });
  }

  async findByBillId(billId, skip, take) {
    const whereWithStatus = {
      billId,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.billProduct.findMany({
        where: whereWithStatus,
        skip,
        take,
        include: {
          product: true,
        },
      }),
      prisma.billProduct.count({ where: whereWithStatus }),
    ]);

    return { data, totalItems };
  }

  async create(data) {
    return await prisma.billProduct.create({
      data: {
        ...data,
        status: CommonStatus.ACTIVE,
      },
      include: {
        bill: true,
        product: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.billProduct.update({
      where: { id },
      data,
      include: {
        bill: true,
        product: true,
      },
    });
  }

  async delete(id) {
    // Soft delete - update status to DELETED
    return await prisma.billProduct.update({
      where: { id },
      data: { status: CommonStatus.DELETED },
      include: {
        bill: true,
        product: true,
      },
    });
  }
}

module.exports = new BillProductRepository();
