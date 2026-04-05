const prisma = require("../config/prisma.config");

class ProductRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          brand: true,
          type: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { data, totalItems };
  }
}

module.exports = new ProductRepository();
