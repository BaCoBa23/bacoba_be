const productAttributeRepo = require("../repositories/product-attribute.repository");
const { buildPagination, buildMeta } = require("../utils");

class ProductAttributeService {
  async getProductAttributes(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { productId, attributeId } = query;

    if (productId) where.productId = productId;
    if (attributeId) where.attributeId = parseInt(attributeId, 10);

    const { data, totalItems } = await productAttributeRepo.findAndCount({
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

  async getProductAttributeByKey(productId, attributeId) {
    return await productAttributeRepo.findByProductAndAttribute(productId, parseInt(attributeId, 10));
  }

  async getAttributesByProductId(productId, query) {
    const { page, pageSize, skip, take } = buildPagination(query);
    const { data, totalItems } = await productAttributeRepo.findByProductId(productId, skip, take);

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async createProductAttribute(data) {
    const productAttributeData = {
      productId: data.productId,
      attributeId: parseInt(data.attributeId, 10),
      content: data.content || "",
    };

    return await productAttributeRepo.create(productAttributeData);
  }

  async updateProductAttribute(productId, attributeId, data) {
    const updateData = {};

    if (data.content !== undefined) updateData.content = data.content;

    return await productAttributeRepo.update(productId, parseInt(attributeId, 10), updateData);
  }

  async deleteProductAttribute(productId, attributeId) {
    return await productAttributeRepo.delete(productId, parseInt(attributeId, 10));
  }
}

module.exports = new ProductAttributeService();
