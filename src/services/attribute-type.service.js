const attributeTypeRepo = require("../repositories/attribute-type.repository");

class AttributeTypeService {
  async getAttributeTypes(query) {
    const where = {};
    const { search, status } = query;

    if (search) {
      where.OR = [
        { name: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const data = await attributeTypeRepo.findAll({
      where,
    });

    return data;
  }

  async getAttributeTypeById(id) {
    return await attributeTypeRepo.findById(id);
  }

  async createAttributeType(data) {
    const attributeTypeData = {
      name: data.name,
      status: data.status || "active",
    };

    return await attributeTypeRepo.create(attributeTypeData);
  }

  async updateAttributeType(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;

    return await attributeTypeRepo.update(id, updateData);
  }

  async deleteAttributeType(id) {
    return await attributeTypeRepo.delete(id);
  }
}

module.exports = new AttributeTypeService();
