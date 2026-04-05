const prisma = require("../config/prisma.config");

class ProductAttributeRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.productAttribute.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          product: true,
          attribute: {
            include: {
              attributeType: true,
            },
          },
        },
      }),
      prisma.productAttribute.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findByProductAndAttribute(productId, attributeId) {
    return await prisma.productAttribute.findUnique({
      where: {
        productId_attributeId: {
          productId,
          attributeId,
        },
      },
      include: {
        product: true,
        attribute: {
          include: {
            attributeType: true,
          },
        },
      },
    });
  }

  async findByProductId(productId, skip, take) {
    const [data, totalItems] = await Promise.all([
      prisma.productAttribute.findMany({
        where: { productId },
        skip,
        take,
        include: {
          attribute: {
            include: {
              attributeType: true,
            },
          },
        },
      }),
      prisma.productAttribute.count({ where: { productId } }),
    ]);

    return { data, totalItems };
  }

  async create(data) {
    return await prisma.productAttribute.create({
      data,
      include: {
        product: true,
        attribute: {
          include: {
            attributeType: true,
          },
        },
      },
    });
  }

  async update(productId, attributeId, data) {
    return await prisma.productAttribute.update({
      where: {
        productId_attributeId: {
          productId,
          attributeId,
        },
      },
      data,
      include: {
        product: true,
        attribute: {
          include: {
            attributeType: true,
          },
        },
      },
    });
  }

  async delete(productId, attributeId) {
    return await prisma.productAttribute.delete({
      where: {
        productId_attributeId: {
          productId,
          attributeId,
        },
      },
    });
  }
}

module.exports = new ProductAttributeRepository();
