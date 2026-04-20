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
          variants: {
            include: {
              type: true, // Lấy type cho biến thể
              productAttributes: {
                include: {
                  attribute: true, // Lấy detail thuộc tính (Màu, Size...)
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        type: true,
        variants: true,
        productAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async create(data) {
    return await prisma.product.create({
      data,
      include: {
        brand: true,
        type: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        brand: true,
        type: true,
      },
    });
  }

  async delete(id) {
    return await prisma.product.delete({
      where: { id },
      include: {
        brand: true,
        type: true,
      },
    });
  }
}

module.exports = new ProductRepository();
