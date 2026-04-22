const prisma = require("../config/prisma.config");

class ReceivedNoteRepository {
  async findAndCount({ skip, take, where, orderBy }) {
    const [data, totalItems] = await Promise.all([
      prisma.receivedNote.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          provider: true,
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.receivedNote.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findById(id) {
    return await prisma.receivedNote.findUnique({
      where: { id },
      include: {
        provider: true,
        receivedProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByProviderId(providerId, skip, take) {
    const [data, totalItems] = await Promise.all([
      prisma.receivedNote.findMany({
        where: { providerId },
        skip,
        take,
        include: {
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.receivedNote.count({ where: { providerId } }),
    ]);

    return { data, totalItems };
  }

  async createWithTransaction(noteData, receivedProductsData, isConfirm) {
    return await prisma.$transaction(async (tx) => {
      const note = await tx.receivedNote.create({
        data: {
          ...noteData,
          receivedProducts: {
            create: receivedProductsData,
          },
        },
        include: {
          provider: true,
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      if (isConfirm) {
        await tx.provider.update({
          where: { id: note.providerId },
          data: {
            total: { increment: note.total },
            debtTotal: { increment: note.debtMoney },
          },
        });

        if (receivedProductsData && receivedProductsData.length > 0) {
          for (const rp of receivedProductsData) {
            const updatedProduct = await tx.product.update({
              where: { id: rp.productId },
              data: {
                quantity: { increment: rp.addQuantity },
              },
            });

            if (updatedProduct.parentId) {
              await tx.product.update({
                where: { id: updatedProduct.parentId },
                data: {
                  quantity: { increment: rp.addQuantity },
                },
              });
            }
          }
        }
      }

      return note;
    });
  }

  async confirmWithTransaction(note) {
    return await prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái phiếu nhập sang CONFIRM
      const updatedNote = await tx.receivedNote.update({
        where: { id: note.id },
        data: { status: "confirm" },
        include: { receivedProducts: true }, // Lấy danh sách SP để tăng kho
      });

      // 2. Cập nhật công nợ Nhà cung cấp
      await tx.provider.update({
        where: { id: note.providerId },
        data: {
          total: { increment: note.total },
          debtTotal: { increment: note.debtMoney },
        },
      });

      // 3. Cập nhật tồn kho sản phẩm (và sản phẩm cha)
      if (
        updatedNote.receivedProducts &&
        updatedNote.receivedProducts.length > 0
      ) {
        for (const rp of updatedNote.receivedProducts) {
          // Tăng kho sản phẩm hiện tại
          const product = await tx.product.update({
            where: { id: rp.productId },
            data: {
              quantity: { increment: rp.addQuantity },
            },
          });

          // Nếu có sản phẩm cha, tăng kho sản phẩm cha
          if (product.parentId) {
            await tx.product.update({
              where: { id: product.parentId },
              data: {
                quantity: { increment: rp.addQuantity },
              },
            });
          }
        }
      }

      return updatedNote;
    });
  }

  // receivedNoteRepo.js

  async cancelWithTransaction(noteId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin phiếu và chi tiết sản phẩm
      const note = await tx.receivedNote.findUnique({
        where: { id: noteId },
        include: { receivedProducts: true },
      });

      if (!note) throw new Error("NOT_FOUND");
      if (note.status === "cancelled") throw new Error("ALREADY_CANCELLED");

      // 2. Nếu trạng thái là CONFIRM, tiến hành ĐẢO NGƯỢC số liệu
      if (note.status === "confirm") {
        // 2.1 Cập nhật lại công nợ Nhà cung cấp (Trừ đi)
        await tx.provider.update({
          where: { id: note.providerId },
          data: {
            total: { decrement: note.total },
            debtTotal: { decrement: note.debtMoney },
          },
        });

        // 2.2 Cập nhật lại tồn kho sản phẩm (Trừ đi)
        for (const rp of note.receivedProducts) {
          const product = await tx.product.update({
            where: { id: rp.productId },
            data: {
              quantity: { decrement: rp.addQuantity },
            },
          });

          // Nếu có sản phẩm cha, trừ luôn kho sản phẩm cha
          if (product.parentId) {
            await tx.product.update({
              where: { id: product.parentId },
              data: {
                quantity: { decrement: rp.addQuantity },
              },
            });
          }
        }
      }

      // 3. Cập nhật trạng thái phiếu về CANCELLED (Áp dụng cho cả DRAFT và CONFIRM)
      const cancelledNote = await tx.receivedNote.update({
        where: { id: noteId },
        data: { status: "cancelled" },
      });

      return cancelledNote;
    });
  }

  async update(id, data) {
    return await prisma.receivedNote.update({
      where: { id },
      data,
      include: {
        provider: true,
        receivedProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.receivedNote.delete({
      where: { id },
    });
  }
}

module.exports = new ReceivedNoteRepository();
