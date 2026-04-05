const prisma = require("../config/prisma.config");

class UserRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          username: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async create(data) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        username: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

module.exports = new UserRepository();
