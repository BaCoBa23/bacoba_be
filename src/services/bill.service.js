const billRepo = require("../repositories/bill.repository");
const billProductRepo = require("../repositories/bill-product.repository");
const { buildPagination, buildMeta } = require("../utils");
const prisma = require("../config/prisma.config");

// Format bill data to match mock structure
const formatBill = (bill) => {
  if (!bill) return null;
  
  const year = new Date(bill.createdAt).getFullYear();
  const paddedId = String(bill.id).padStart(3, '0');
  
  return {
    id: `BILL-${year}-${paddedId}`, // Format: BILL-2026-001
    exchange: bill.exchange || null,
    name: bill.name,
    customerName: bill.customerName,
    phoneNumber: bill.phoneNumber,
    discount: bill.discount,
    total: bill.total,
    status: bill.status,
    createdAt: bill.createdAt,
    updatedAt: bill.updatedAt,
    billProducts: bill.billProducts ? bill.billProducts.map((bp) => {
      const bpPaddedId = String(bp.id).padStart(3, '0');
      return {
        id: `BP-${bpPaddedId}`, // Format: BP-001
        productId: bp.productId,
        productName: bp.product?.name || "", // Extract product name
        quantity: bp.quantity,
        salePrice: bp.salePrice,
        total: bp.total,
        status: bp.status,
      };
    }) : [],
  };
};

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

    const formattedData = data.map(formatBill);

    return {
      data: formattedData,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getBillById(id) {
    const bill = await billRepo.findById(id);
    return formatBill(bill);
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

      const bill = await prisma.bill.create({
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
          exchange: true,
        },
      });
      return formatBill(bill);
    }

    // Nếu không có billProducts, tạo bill bình thường
    const bill = await billRepo.create(billData);
    return formatBill(bill);
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

      const bill = await prisma.bill.update({
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
          exchange: true,
        },
      });
      return formatBill(bill);
    }

    // Nếu không có billProducts, chỉ update bill
    const bill = await billRepo.update(id, updateData);
    return formatBill(bill);
  }

  async deleteBill(id) {
    const bill = await billRepo.delete(id);
    return formatBill(bill);
  }
}

module.exports = new BillService();
