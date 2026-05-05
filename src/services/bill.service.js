const billRepo = require("../repositories/bill.repository");
const billProductRepo = require("../repositories/bill-product.repository");
const { buildPagination, buildMeta } = require("../utils");
const { CommonStatus, BillStatus } = require("../enums/status.enum");

// Format bill data to match mock structure
const formatBill = (bill) => {
  if (!bill) return null;

  // Filter billProducts - only include valid ones with product
  const validBillProducts =
    bill.billProducts && Array.isArray(bill.billProducts)
      ? bill.billProducts.filter((bp) => bp && bp.product) // Only include if product exists
      : [];

  return {
    id: bill.id,
    exchange: bill.exchange || null,
    name: bill.name,
    customerName: bill.customerName,
    phoneNumber: bill.phoneNumber,
    discount: bill.discount,
    total: bill.total,
    status: bill.status,
    createdAt: bill.createdAt,
    updatedAt: bill.updatedAt,
    billProducts: validBillProducts.map((bp) => {
      return {
        productId: bp.productId,
        productName: bp.product?.name || bp.productId,
        quantity: bp.quantity,
        salePrice: bp.salePrice,
        total: bp.total,
        status: bp.status,
      };
    }),
  };
};

class BillService {
  // Parse date from DD-MM-YYYY format to Date object
  parseDate(dateString) {
    if (!dateString) return null;
    
    // Try DD-MM-YYYY format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
        return new Date(year, month - 1, day);
      }
    }
    
    // Try ISO format or other formats
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

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

    if (!bill) {
      return null;
    }
    return formatBill(bill);
  }

  async createBill(data) {
    const billData = {
      name: data.name || null,
      customerName: data.customerName || null,
      phoneNumber: data.phoneNumber || null,
      discount: parseFloat(data.discount) || 0,
      total: parseFloat(data.total),
      status: data.status || BillStatus.PENDING,
      exchangeId: data.exchangeId ? parseInt(data.exchangeId, 10) : null,
    };

    // Nếu có billProducts, tạo bill với transaction
    if (
      data.billProducts &&
      Array.isArray(data.billProducts) &&
      data.billProducts.length > 0
    ) {
      const billProductsData = data.billProducts.map((bp) => ({
        productId: bp.productId,
        quantity: parseInt(bp.quantity, 10),
        salePrice: parseFloat(bp.salePrice),
        total: parseFloat(bp.total),
      }));

      const bill = await billRepo.createWithTransaction(
        billData,
        billProductsData,
      );
      return formatBill(bill);
    }

    // Nếu không có billProducts, tạo bill bình thường
    const bill = await billRepo.create(billData);
    return formatBill(bill);
  }

  async updateBill(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.customerName !== undefined)
      updateData.customerName = data.customerName;
    if (data.phoneNumber !== undefined)
      updateData.phoneNumber = data.phoneNumber;
    if (data.discount !== undefined)
      updateData.discount = parseFloat(data.discount);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.exchangeId !== undefined)
      updateData.exchangeId = data.exchangeId
        ? parseInt(data.exchangeId, 10)
        : null;
    
    // Handle createdAt if provided (DD-MM-YYYY format)
    if (data.createdAt !== undefined) {
      const date = this.parseDate(data.createdAt);
      if (date) updateData.createdAt = date;
    }

    // Nếu có billProducts, update với transaction
    if (data.billProducts && Array.isArray(data.billProducts)) {
      const billProductsData = data.billProducts.map((bp) => ({
        productId: bp.productId,
        quantity: parseInt(bp.quantity, 10),
        salePrice: parseFloat(bp.salePrice),
        total: parseFloat(bp.total),
      }));

      const bill = await billRepo.updateWithTransaction(
        id,
        updateData,
        billProductsData,
      );
      return formatBill(bill);
    }

    // Nếu không có billProducts, chỉ update bill
    const bill = await billRepo.update(id, updateData);
    return formatBill(bill);
  }

  async deleteBill(id) {
    const bill = await billRepo.deleteWithTransaction(id);
    return formatBill(bill);
  }

  async returnBill(id) {
    const bill = await billRepo.returnBillWithTransaction(id);
    return formatBill(bill);
  }

  async exchangeBill(originalBillId, data) {
    // Nếu billProducts rỗng -> chỉ trả hàng, không tạo bill mới
    if (!data.billProducts || data.billProducts.length === 0) {
      return await this.returnBill(originalBillId);
    }

    const newBillData = {
      name: data.name || null,
      customerName: data.customerName || null,
      phoneNumber: data.phoneNumber || null,
      discount: parseFloat(data.discount) || 0,
      total: parseFloat(data.total),
      status: data.status || BillStatus.COMPLETED,
    };

    const newBillProductsData = data.billProducts.map((bp) => ({
      productId: bp.productId,
      quantity: parseInt(bp.quantity, 10),
      salePrice: parseFloat(bp.salePrice),
      total: parseFloat(bp.total),
    }));

    const bill = await billRepo.createExchangeBill(
      originalBillId,
      newBillData,
      newBillProductsData,
    );
    return formatBill(bill);
  }
}

module.exports = new BillService();
