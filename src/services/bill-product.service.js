const billProductRepo = require("../repositories/bill-product.repository");
const { buildPagination, buildMeta } = require("../utils");

class BillProductService {
  async getBillProducts(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { billId, productId } = query;

    if (billId) where.billId = parseInt(billId, 10);
    if (productId) where.productId = productId;

    const { data, totalItems } = await billProductRepo.findAndCount({
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

  async getBillProductById(id) {
    return await billProductRepo.findById(id);
  }

  async getProductsByBillId(billId, query) {
    const { page, pageSize, skip, take } = buildPagination(query);
    const { data, totalItems } = await billProductRepo.findByBillId(parseInt(billId, 10), skip, take);

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async createBillProduct(data) {
    const billProductData = {
      billId: parseInt(data.billId, 10),
      productId: data.productId,
      quantity: parseInt(data.quantity, 10),
      salePrice: parseFloat(data.salePrice),
      total: parseFloat(data.total),
    };

    return await billProductRepo.create(billProductData);
  }

  async updateBillProduct(id, data) {
    const updateData = {};

    if (data.quantity !== undefined) updateData.quantity = parseInt(data.quantity, 10);
    if (data.salePrice !== undefined) updateData.salePrice = parseFloat(data.salePrice);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);

    return await billProductRepo.update(id, updateData);
  }

  async deleteBillProduct(id) {
    return await billProductRepo.delete(id);
  }
}

module.exports = new BillProductService();
