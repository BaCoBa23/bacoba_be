const prisma = require("../config/prisma.config");

class BillProductRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.billProduct.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          bill: true,
          product: true,
        },
      }),
      prisma.billProduct.count({ where }),
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
    const [data, totalItems] = await Promise.all([
      prisma.billProduct.findMany({
        where: { billId },
        skip,
        take,
        include: {
          product: true,
        },
      }),
      prisma.billProduct.count({ where: { billId } }),
    ]);

    return { data, totalItems };
  }

  async create(data) {
    return await prisma.billProduct.create({
      data,
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
    return await prisma.billProduct.delete({
      where: { id },
    });
  }
}

module.exports = new BillProductRepository();
