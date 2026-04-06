const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

class BrandRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const whereWithStatus = {
      ...where,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.brand.findMany({
        skip,
        take,
        where: whereWithStatus,
        orderBy,
      }),
      prisma.brand.count({ where: whereWithStatus }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async create(data) {
    return await prisma.brand.create({
      data: {
        ...data,
        status: data.status || CommonStatus.ACTIVE,
      },
    });
  }

  async update(id, data) {
    return await prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    // Soft delete
    return await prisma.brand.update({
      where: { id },
      data: { status: CommonStatus.DELETED },
    });
  }
}

module.exports = new BrandRepository();
