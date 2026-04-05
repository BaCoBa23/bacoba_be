const userRepo = require("../repositories/user.repository");
const { buildPagination, buildMeta } = require("../utils");

class UserService {
  async getUsers(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { search, status } = query;

    if (search) {
      where.OR = [
        { username: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const { data, totalItems } = await userRepo.findAndCount({
      skip,
      take,
      where,
      orderBy,
    });

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getUserById(id) {
    return await userRepo.findById(id);
  }

  async getUserByUsername(username) {
    return await userRepo.findByUsername(username);
  }

  async createUser(data) {
    const userData = {
      username: data.username,
      password: data.password,
      status: data.status || "active",
    };

    return await userRepo.create(userData);
  }

  async updateUser(id, data) {
    const updateData = {};

    if (data.password !== undefined) updateData.password = data.password;
    if (data.status !== undefined) updateData.status = data.status;

    return await userRepo.update(id, updateData);
  }

  async deleteUser(id) {
    return await userRepo.delete(id);
  }
}

module.exports = new UserService();
