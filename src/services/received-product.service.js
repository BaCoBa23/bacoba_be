const receivedProductRepo = require("../repositories/received-product.repository");
const { buildPagination, buildMeta } = require("../utils");

class ReceivedProductService {
  async getReceivedProducts(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { receivedNoteId, productId } = query;

    if (receivedNoteId) where.receivedNoteId = parseInt(receivedNoteId, 10);
    if (productId) where.productId = productId;

    const { data, totalItems } = await receivedProductRepo.findAndCount({
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

  async getReceivedProductById(id) {
    return await receivedProductRepo.findById(id);
  }

  async getProductsByReceivedNoteId(receivedNoteId, query) {
    const { page, pageSize, skip, take } = buildPagination(query);
    const { data, totalItems } = await receivedProductRepo.findByReceivedNoteId(parseInt(receivedNoteId, 10), skip, take);

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async createReceivedProduct(data) {
    const receivedProductData = {
      receivedNoteId: parseInt(data.receivedNoteId, 10),
      productId: data.productId,
      addQuantity: parseInt(data.addQuantity, 10),
      discount: parseFloat(data.discount) || 0,
      description: data.description || null,
      total: parseFloat(data.total),
    };

    return await receivedProductRepo.create(receivedProductData);
  }

  async updateReceivedProduct(id, data) {
    const updateData = {};

    if (data.addQuantity !== undefined) updateData.addQuantity = parseInt(data.addQuantity, 10);
    if (data.discount !== undefined) updateData.discount = parseFloat(data.discount);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.total !== undefined) updateData.total = parseFloat(data.total);

    return await receivedProductRepo.update(id, updateData);
  }

  async deleteReceivedProduct(id) {
    return await receivedProductRepo.delete(id);
  }
}

module.exports = new ReceivedProductService();
