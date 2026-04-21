const prisma = require("../config/prisma.config");

class AttributeRepository {
  async findAll({ where }) {
    return await prisma.attribute.findMany({
      where,
      include: {
        attributeType: true,
      },
    });
  }

  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.attribute.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          attributeType: true,
        },
      }),
      prisma.attribute.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.attribute.findUnique({
      where: { id },
      include: {
        attributeType: true,
        productAttributes: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(data) {
    return await prisma.attribute.create({
      data,
      include: {
        attributeType: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.attribute.update({
      where: { id },
      data,
      include: {
        attributeType: true,
      },
    });
  }

  async delete(id) {
    return await prisma.attribute.delete({
      where: { id },
      include: {
        attributeType: true,
      },
    });
  }
}

module.exports = new AttributeRepository();
