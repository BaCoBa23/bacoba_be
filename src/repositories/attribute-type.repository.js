const prisma = require("../config/prisma.config");

class AttributeTypeRepository {
  async findAll({ where }) {
    return await prisma.attributeType.findMany({
      where,
      include: {
        attributes: true,
      },
    });
  }

  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.attributeType.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.attributeType.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.attributeType.findUnique({
      where: { id },
      include: {
        attributes: true,
      },
    });
  }

  async create(data) {
    return await prisma.attributeType.create({
      data,
    });
  }

  async update(id, data) {
    return await prisma.attributeType.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.attributeType.delete({
      where: { id },
    });
  }
}

module.exports = new AttributeTypeRepository();
