const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

class BillRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const whereWithStatus = {
      ...where,
      status: { not: CommonStatus.DELETED },
    };

    const [data, totalItems] = await Promise.all([
      prisma.bill.findMany({
        skip,
        take,
        where: whereWithStatus,
        orderBy,
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
          exchange: true,
        },
      }),
      prisma.bill.count({ where: whereWithStatus }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.bill.findUnique({
      where: { id },
      include: {
        billProducts: {
          where: {
            status: { not: CommonStatus.DELETED },
          },
          include: {
            product: true,
          },
        },
        exchange: true,
      },
    });
  }

  async create(data) {
    return await prisma.bill.create({
      data: {
        ...data,
        status: data.status || CommonStatus.ACTIVE,
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
  }

  async update(id, data) {
    return await prisma.bill.update({
      where: { id },
      data,
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
        exchange: true,
      },
    });
  }

  async delete(id) {
    // Soft delete
    return await prisma.bill.update({
      where: { id },
      data: { status: CommonStatus.DELETED },
      include: {
        billProducts: {
          include: {
            product: true,
          },
        },
        exchange: true,
      },
    });
  }

  async createWithTransaction(billData, billProductsData) {
    return await prisma.$transaction(async (tx) => {
      // Create bill with billProducts
      const bill = await tx.bill.create({
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
      for (const bp of billProductsData) {
        // Giảm quantity sản phẩm
        const updatedProduct = await tx.product.update({
          where: { id: bp.productId },
          data: {
            quantity: {
              decrement: bp.quantity,
            },
          },
        });

        // Update kho parent product (nếu có)
        if (updatedProduct?.parentId) {
          const totalVariantQuantity = await tx.product.aggregate({
            where: { parentId: updatedProduct.parentId },
            _sum: { quantity: true },
          });

          await tx.product.update({
            where: { id: updatedProduct.parentId },
            data: { quantity: totalVariantQuantity._sum.quantity || 0 },
          });
        }
      }

      return bill;
    });
  }

  async updateWithTransaction(id, updateData, billProductsData) {
    return await prisma.$transaction(async (tx) => {
      if (billProductsData && Array.isArray(billProductsData)) {
        // Lấy old billProducts để rollback kho
        const oldBillProducts = await tx.billProduct.findMany({
          where: { billId: id },
        });

        // Tăng lại kho của old products
        for (const oldBp of oldBillProducts) {
          const updatedProduct = await tx.product.update({
            where: { id: oldBp.productId },
            data: {
              quantity: {
                increment: oldBp.quantity,
              },
            },
          });

          // Update kho parent product
          if (updatedProduct?.parentId) {
            const totalVariantQuantity = await tx.product.aggregate({
              where: { parentId: updatedProduct.parentId },
              _sum: { quantity: true },
            });

            await tx.product.update({
              where: { id: updatedProduct.parentId },
              data: { quantity: totalVariantQuantity._sum.quantity || 0 },
            });
          }
        }

        // Update bill và delete/create billProducts
        const bill = await tx.bill.update({
          where: { id },
          data: {
            ...updateData,
            billProducts: {
              deleteMany: {},
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

        // Giảm kho của new products
        for (const newBp of billProductsData) {
          const updatedProduct = await tx.product.update({
            where: { id: newBp.productId },
            data: {
              quantity: {
                decrement: newBp.quantity,
              },
            },
          });

          // Update kho parent product
          if (updatedProduct?.parentId) {
            const totalVariantQuantity = await tx.product.aggregate({
              where: { parentId: updatedProduct.parentId },
              _sum: { quantity: true },
            });

            await tx.product.update({
              where: { id: updatedProduct.parentId },
              data: { quantity: totalVariantQuantity._sum.quantity || 0 },
            });
          }
        }

        return bill;
      } else {
        // Chỉ update bill không có billProducts
        return await tx.bill.update({
          where: { id },
          data: updateData,
          include: {
            billProducts: {
              include: {
                product: true,
              },
            },
            exchange: true,
          },
        });
      }
    });
  }

  async deleteWithTransaction(id) {
    return await prisma.$transaction(async (tx) => {
      // Lấy tất cả billProducts để rollback kho
      const billProducts = await tx.billProduct.findMany({
        where: { billId: id },
      });

      // Tăng lại kho cho tất cả products
      for (const bp of billProducts) {
        const updatedProduct = await tx.product.update({
          where: { id: bp.productId },
          data: {
            quantity: {
              increment: bp.quantity,
            },
          },
        });

        // Update kho parent product
        if (updatedProduct?.parentId) {
          const totalVariantQuantity = await tx.product.aggregate({
            where: { parentId: updatedProduct.parentId },
            _sum: { quantity: true },
          });

          await tx.product.update({
            where: { id: updatedProduct.parentId },
            data: { quantity: totalVariantQuantity._sum.quantity || 0 },
          });
        }
      }

      // Delete bill
      return await tx.bill.update({
        where: { id },
        data: { status: CommonStatus.DELETED },
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
          exchange: true,
        },
      });
    });
  }
}

module.exports = new BillRepository();
