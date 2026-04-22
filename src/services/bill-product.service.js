const billProductRepo = require("../repositories/bill-product.repository");
const { buildPagination, buildMeta } = require("../utils");
const prisma = require("../config/prisma.config");

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

    // Tạo BillProduct
    const billProduct = await billProductRepo.create(billProductData);

    // Update kho: giảm quantity sản phẩm
    await prisma.product.update({
      where: { id: data.productId },
      data: {
        quantity: {
          decrement: parseInt(data.quantity, 10),
        },
      },
    });

    // Update kho parent product (nếu có)
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
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

    return billProduct;
  }

  async updateBillProduct(billId, productId, data) {
    const updateData = {};

    if (data.quantity !== undefined) updateData.quantity = parseInt(data.quantity, 10);
    if (data.salePrice !== undefined) updateData.salePrice = parseFloat(data.salePrice);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);

    return await billProductRepo.update({
      billId: parseInt(billId, 10),
      productId: productId,
    }, updateData);
  }

  async deleteBillProduct(billId, productId) {
    // Lấy quantity trước khi xóa
    const billProduct = await prisma.billProduct.findFirst({
      where: {
        billId: parseInt(billId, 10),
        productId: productId,
      },
    });

    if (!billProduct) {
      return null;
    }

    // Xóa BillProduct
    await billProductRepo.delete({
      billId: parseInt(billId, 10),
      productId: productId,
    });

    // Update kho: tăng lại quantity sản phẩm
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          increment: billProduct.quantity,
        },
      },
    });

    // Update kho parent product (nếu có)
    const product = await prisma.product.findUnique({
      where: { id: productId },
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

    return billProduct;
  }
}

module.exports = new BillProductService();
