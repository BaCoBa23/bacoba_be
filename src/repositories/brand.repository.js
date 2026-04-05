const prisma = require("../config/prisma.config");

class BrandRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.brand.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.brand.count({ where }),
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
      data,
    });
  }

  async update(id, data) {
    return await prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.brand.delete({
      where: { id },
    });
  }
}

module.exports = new BrandRepository();
