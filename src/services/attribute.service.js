const attributeRepo = require("../repositories/attribute.repository");

class AttributeService {
  async getAttributes(query) {
    const where = {};
    const { search, attributeTypeId, status } = query;

    if (search) {
      where.OR = [
        { value: { contains: search } },
      ];
    }
    if (attributeTypeId) where.attributeTypeId = parseInt(attributeTypeId, 10);
    if (status) where.status = status;

    const data = await attributeRepo.findAll({
      where,
    });

    return data;
  }

  async getAttributeById(id) {
    return await attributeRepo.findById(id);
  }

  async createAttribute(data) {
    const attributeData = {
      attributeTypeId: parseInt(data.attributeTypeId, 10),
      value: data.value,
      status: data.status || "active",
    };

    return await attributeRepo.create(attributeData);
  }

  async updateAttribute(id, data) {
    const updateData = {};

    if (data.attributeTypeId !== undefined) updateData.attributeTypeId = parseInt(data.attributeTypeId, 10);
    if (data.value !== undefined) updateData.value = data.value;
    if (data.status !== undefined) updateData.status = data.status;

    return await attributeRepo.update(id, updateData);
  }

  async deleteAttribute(id) {
    return await attributeRepo.delete(id);
  }
}

module.exports = new AttributeService();
