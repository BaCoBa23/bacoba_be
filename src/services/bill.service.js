const billRepo = require("../repositories/bill.repository");
const { buildPagination, buildMeta } = require("../utils");

class BillService {
  async getBills(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { search, status } = query;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { customerName: { contains: search } },
        { phoneNumber: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const { data, totalItems } = await billRepo.findAndCount({
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

  async getBillById(id) {
    return await billRepo.findById(id);
  }

  async createBill(data) {
    const billData = {
      name: data.name || null,
      customerName: data.customerName || null,
      phoneNumber: data.phoneNumber || null,
      discount: parseFloat(data.discount) || 0,
      total: parseFloat(data.total),
      status: data.status || "pending",
      exchangeId: data.exchangeId ? parseInt(data.exchangeId, 10) : null,
    };

    return await billRepo.create(billData);
  }

  async updateBill(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.customerName !== undefined) updateData.customerName = data.customerName;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.discount !== undefined) updateData.discount = parseFloat(data.discount);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.exchangeId !== undefined) updateData.exchangeId = data.exchangeId ? parseInt(data.exchangeId, 10) : null;

    return await billRepo.update(id, updateData);
  }

  async deleteBill(id) {
    return await billRepo.delete(id);
  }
}

module.exports = new BillService();
