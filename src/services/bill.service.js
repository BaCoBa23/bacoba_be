const billRepo = require("../repositories/bill.repository");
const billProductRepo = require("../repositories/bill-product.repository");
const { buildPagination, buildMeta } = require("../utils");
const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

// Format bill data to match mock structure
const formatBill = (bill) => {
  if (!bill) return null;
  
  const year = new Date(bill.createdAt).getFullYear();
  const paddedId = String(bill.id).padStart(3, '0');
  
  // Filter billProducts - only include valid ones with product
  const validBillProducts = (bill.billProducts && Array.isArray(bill.billProducts))
    ? bill.billProducts.filter(bp => bp && bp.product) // Only include if product exists
    : [];

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
    billProducts: validBillProducts.map((bp) => {
      const bpPaddedId = String(bp.id).padStart(3, '0');
      return {
        id: `BP-${bpPaddedId}`, // Format: BP-001
        productId: bp.productId,
        productName: bp.product?.name || bp.productId, // Fallback to productId
        quantity: bp.quantity,
        salePrice: bp.salePrice,
        total: bp.total,
        status: bp.status,
      };
    }),
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
    
    if (!bill) {
      return null;
    }

    // Check if bill is soft deleted
    if (bill.status === CommonStatus.DELETED) {
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

      // Update kho sản phẩm
      for (const bp of data.billProducts) {
        const quantity = parseInt(bp.quantity, 10);
        
        // Giảm quantity sản phẩm
        await prisma.product.update({
          where: { id: bp.productId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        // Update kho parent product (nếu có)
        const product = await prisma.product.findUnique({
          where: { id: bp.productId },
          select: { parentId: true },
        });

        if (product?.parentId) {
          const totalVariantQuantity = await prisma.product.aggregate({
            where: { parentId: product.parentId },
            _sum: { quantity: true },
          });

          await prisma.product.update({
            where: { id: product.parentId },
            data: { quantity: totalVariantQuantity._sum.quantity || 0 },
          });
        }
      }

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
      // Lấy old billProducts để rollback kho
      const oldBillProducts = await prisma.billProduct.findMany({
        where: { billId: id },
      });

      // Tăng lại kho của old products
      for (const oldBp of oldBillProducts) {
        await prisma.product.update({
          where: { id: oldBp.productId },
          data: {
            quantity: {
              increment: oldBp.quantity,
            },
          },
        });

        // Update kho parent product
        const product = await prisma.product.findUnique({
          where: { id: oldBp.productId },
          select: { parentId: true },
        });

        if (product?.parentId) {
          const totalVariantQuantity = await prisma.product.aggregate({
            where: { parentId: product.parentId },
            _sum: { quantity: true },
          });

          await prisma.product.update({
            where: { id: product.parentId },
            data: { quantity: totalVariantQuantity._sum.quantity || 0 },
          });
        }
      }

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

      // Giảm kho của new products
      for (const newBp of data.billProducts) {
        const quantity = parseInt(newBp.quantity, 10);
        
        await prisma.product.update({
          where: { id: newBp.productId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        // Update kho parent product
        const product = await prisma.product.findUnique({
          where: { id: newBp.productId },
          select: { parentId: true },
        });

        if (product?.parentId) {
          const totalVariantQuantity = await prisma.product.aggregate({
            where: { parentId: product.parentId },
            _sum: { quantity: true },
          });

          await prisma.product.update({
            where: { id: product.parentId },
            data: { quantity: totalVariantQuantity._sum.quantity || 0 },
          });
        }
      }

      return formatBill(bill);
    }

    // Nếu không có billProducts, chỉ update bill
    const bill = await billRepo.update(id, updateData);
    return formatBill(bill);
  }

  async deleteBill(id) {
    // Lấy tất cả billProducts để rollback kho
    const billProducts = await prisma.billProduct.findMany({
      where: { billId: id },
    });

    // Tăng lại kho cho tất cả products
    for (const bp of billProducts) {
      await prisma.product.update({
        where: { id: bp.productId },
        data: {
          quantity: {
            increment: bp.quantity,
          },
        },
      });

      // Update kho parent product
      const product = await prisma.product.findUnique({
        where: { id: bp.productId },
        select: { parentId: true },
      });

      if (product?.parentId) {
        const totalVariantQuantity = await prisma.product.aggregate({
          where: { parentId: product.parentId },
          _sum: { quantity: true },
        });

        await prisma.product.update({
          where: { id: product.parentId },
          data: { quantity: totalVariantQuantity._sum.quantity || 0 },
        });
      }
    }

    // Delete bill
    const bill = await billRepo.delete(id);
    return formatBill(bill);
  }
}

module.exports = new BillService();
