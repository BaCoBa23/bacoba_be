const prisma = require("../config/prisma.config");
const { CommonStatus } = require("../enums/status.enum");

class BillRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.bill.findMany({
        skip,
        take,
        where,
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
      prisma.bill.count({ where: where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.bill.findUnique({
      where: { id },
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

      for (const bp of billProductsData) {
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

  async returnBillWithTransaction(id) {
    return await prisma.$transaction(async (tx) => {
      // Lấy bill và billProducts để trả hàng
      const bill = await tx.bill.findUnique({
        where: { id },
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!bill) {
        throw new Error("BILL_NOT_FOUND");
      }

      // Increment kho cho tất cả billProducts
      for (const bp of bill.billProducts) {
        const updatedProduct = await tx.product.update({
          where: { id: bp.productId },
          data: {
            quantity: {
              increment: bp.quantity,
            },
          },
        });

        // Update kho parent product nếu có
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

      // Update status bill thành "returned"
      await tx.bill.update({
        where: { id },
        data: { status: "returned" },
      });

      // Update status tất cả billProducts thành "returned"
      await tx.billProduct.updateMany({
        where: { billId: id },
        data: { status: "returned" },
      });

      // Lấy lại bill sau khi update
      const updatedBill = await tx.bill.findUnique({
        where: { id },
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
          exchange: true,
        },
      });

      return updatedBill;
    });
  }

  async createExchangeBill(originalBillId, newBillData, newBillProductsData) {
    return await prisma.$transaction(async (tx) => {
      // B1: Lấy bill gốc
      const originalBill = await tx.bill.findUnique({
        where: { id: originalBillId },
        include: {
          billProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!originalBill) {
        throw new Error("BILL_NOT_FOUND");
      }

      // B1: Hoàn lại kho cho tất cả sản phẩm cũ
      for (const bp of originalBill.billProducts) {
        const updatedProduct = await tx.product.update({
          where: { id: bp.productId },
          data: {
            quantity: {
              increment: bp.quantity,
            },
          },
        });

        // Update kho parent product nếu có
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

      // B1: Update status bill gốc thành "exchanged"
      await tx.bill.update({
        where: { id: originalBillId },
        data: { status: "exchanged" },
      });

      // B1: Update status tất cả billProducts gốc thành "exchanged"
      await tx.billProduct.updateMany({
        where: { billId: originalBillId },
        data: { status: "exchanged" },
      });

      // B2: Tạo bill mới với exchangedId tham chiếu bill gốc
      const newBill = await tx.bill.create({
        data: {
          ...newBillData,
          exchangeId: originalBillId,
          billProducts: {
            create: newBillProductsData,
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

      // B2: Giảm kho cho sản phẩm mới
      for (const bp of newBillProductsData) {
        const updatedProduct = await tx.product.update({
          where: { id: bp.productId },
          data: {
            quantity: {
              decrement: bp.quantity,
            },
          },
        });

        // Update kho parent product nếu có
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

      return newBill;
    });
  }
}

module.exports = new BillRepository();
