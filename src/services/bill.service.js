const billRepo = require("../repositories/bill.repository");
const billProductRepo = require("../repositories/bill-product.repository");
const { buildPagination, buildMeta } = require("../utils");
const prisma = require("../config/prisma.config");

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

    // Nếu có billProducts, tạo bill với nested create
    if (data.billProducts && Array.isArray(data.billProducts) && data.billProducts.length > 0) {
      const billProductsData = data.billProducts.map((bp) => ({
        productId: bp.productId,
        quantity: parseInt(bp.quantity, 10),
        salePrice: parseFloat(bp.salePrice),
        total: parseFloat(bp.total),
      }));

      return await prisma.bill.create({
        data: {
          ...billData,
          billProducts: {
            create: billProductsData,
          },
        },
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Nếu không có billProducts, tạo bill bình thường
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

    // Nếu có billProducts, delete old ones và create new ones
    if (data.billProducts && Array.isArray(data.billProducts)) {
      const billProductsData = data.billProducts.map((bp) => ({
        productId: bp.productId,
        quantity: parseInt(bp.quantity, 10),
        salePrice: parseFloat(bp.salePrice),
        total: parseFloat(bp.total),
      }));

      return await prisma.bill.update({
        where: { id },
        data: {
          ...updateData,
          billProducts: {
            deleteMany: {}, // Delete tất cả billProducts cũ
            create: billProductsData, // Tạo billProducts mới
          },
        },
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Nếu không có billProducts, chỉ update bill
    return await billRepo.update(id, updateData);
  }

  async deleteBill(id) {
    return await billRepo.delete(id);
  }
}

module.exports = new BillService();
