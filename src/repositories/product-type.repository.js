const prisma = require("../config/prisma.config");

class ProductTypeRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.productType.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.productType.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.productType.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async create(data) {
    return await prisma.productType.create({
      data,
    });
  }

  async update(id, data) {
    return await prisma.productType.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.productType.delete({
      where: { id },
    });
  }
}

module.exports = new ProductTypeRepository();
