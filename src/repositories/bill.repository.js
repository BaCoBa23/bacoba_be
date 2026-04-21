const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

class BillRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const whereWithStatus = {
      ...where,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.bill.findMany({
        skip,
        take,
        where: whereWithStatus,
        orderBy,
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
          exchange: true,
        },
      }),
      prisma.bill.count({ where: whereWithStatus }),
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
        exchange: true,
      },
    });
  }

  async create(data) {
    return await prisma.bill.create({
      data: {
        ...data,
        status: data.status || CommonStatus.ACTIVE,
      },
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
        exchange: true,
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
        exchange: true,
      },
    });
  }

  async delete(id) {
    // Soft delete
    return await prisma.bill.update({
      where: { id },
      data: { status: CommonStatus.DELETED },
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
        exchange: true,
      },
    });
  }
}

module.exports = new BillRepository();
