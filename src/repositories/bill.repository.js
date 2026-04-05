const prisma = require("../config/prisma.config");

class BillRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.bill.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.bill.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.bill.findUnique({
      where: { id },
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(data) {
    return await prisma.bill.create({
      data,
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.bill.update({
      where: { id },
      data,
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.bill.delete({
      where: { id },
    });
  }
}

module.exports = new BillRepository();
