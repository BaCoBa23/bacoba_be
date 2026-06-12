const prisma = require("../config/prisma.config");
const { ReceiveNoteStatus } = require("../enums/status.enum");

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
      
      // Chặn nếu phiếu đã ở trạng thái kết thúc trước đó
      if (note.status === "cancelled" || note.status === "returned") {
        throw new Error("ALREADY_PROCESSED");
      }
  
      // Xác định trạng thái mới dựa trên trạng thái hiện tại
      const nextStatus = note.status === "confirm" ? "returned" : "cancelled";
  
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
  
      // 3. Cập nhật trạng thái phiếu theo trạng thái mới đã xác định (returned hoặc cancelled)
      const updatedNote = await tx.receivedNote.update({
        where: { id: noteId },
        data: { status: nextStatus },
      });
  
      return updatedNote;
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

  async updateWithTransaction(id, oldNote, updateData, newProductsData) {
    return await prisma.$transaction(async (tx) => {
      if (oldNote.status === ReceiveNoteStatus.CONFIRM) {
        await tx.provider.update({
          where: { id: oldNote.providerId },
          data: {
            total: { decrement: oldNote.total },
            debtTotal: { decrement: oldNote.debtMoney },
          },
        });

        for (const rp of oldNote.receivedProducts) {
          const updatedProduct = await tx.product.update({
            where: { id: rp.productId },
            data: { quantity: { decrement: rp.addQuantity } },
          });

          if (updatedProduct.parentId) {
            await tx.product.update({
              where: { id: updatedProduct.parentId },
              data: { quantity: { decrement: rp.addQuantity } },
            });
          }
        }
      }

      const noteUpdateQuery = {
        where: { id },
        data: { ...updateData },
        include: {
          provider: true,
          receivedProducts: {
            include: { product: true },
          },
        },
      };

      if (newProductsData) {
        noteUpdateQuery.data.receivedProducts = {
          deleteMany: {},
          create: newProductsData,
        };
      }

      const updatedNote = await tx.receivedNote.update(noteUpdateQuery);
      if (updatedNote.status === ReceiveNoteStatus.CONFIRM) {
        await tx.provider.update({
          where: { id: updatedNote.providerId },
          data: {
            total: { increment: updatedNote.total },
            debtTotal: { increment: updatedNote.debtMoney },
          },
        });

        for (const rp of updatedNote.receivedProducts) {
          const prod = await tx.product.update({
            where: { id: rp.productId },
            data: { quantity: { increment: rp.addQuantity } },
          });

          if (prod.parentId) {
            await tx.product.update({
              where: { id: prod.parentId },
              data: { quantity: { increment: rp.addQuantity } },
            });
          }
        }
      }

      return updatedNote;
    });
  }

  async delete(id) {
    return await prisma.receivedNote.delete({
      where: { id },
    });
  }

  // =========================================================================
// TRANSACTIONAL OPERATIONS (Trong file received-note.repository.js)
// =========================================================================

async createReturnWithTransaction(noteData, receivedProductsData) {
  return await prisma.$transaction(async (tx) => {
    
    // 1. KIỂM TRA TỒN KHO THỰC TẾ TRONG BẢNG PRODUCT TRƯỚC KHI XUẤT TRẢ
    if (receivedProductsData && receivedProductsData.length > 0) {
      for (const rp of receivedProductsData) {
        const currentProduct = await tx.product.findUnique({
          where: { id: rp.productId },
          select: { name: true, quantity: true },
        });

        if (!currentProduct) {
          throw new Error(`PRODUCT_NOT_FOUND:${rp.productId}`);
        }

        // Nếu số lượng xuất trả lớn hơn số lượng thực tế đang có trong kho -> Báo lỗi
        if (currentProduct.quantity < rp.addQuantity) {
          throw new Error(`EXCEEDS_STOCK:${currentProduct.name || rp.productId}`);
        }
      }
    }

    // 2. TẠO PHIẾU XUẤT TRẢ (Lưu trữ danh sách sản phẩm hoàn trả)
    const note = await tx.receivedNote.create({
      data: {
        ...noteData,
        status: "returned", // Trạng thái trả hàng/hủy theo nghiệp vụ của bạn
        receivedProducts: {
          create: receivedProductsData.map(rp => ({
            productId: rp.productId,
            addQuantity: parseInt(rp.addQuantity, 10),
            discount: parseFloat(rp.discount) || 0,
            description: rp.description || null,
            total: parseFloat(rp.total),
          })),
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

    // 3. ĐẢO NGƯỢC SỐ LIỆU NHÀ CUNG CẤP: GIẢM TỔNG TIỀN & GIẢM NỢ
    await tx.provider.update({
      where: { id: note.providerId },
      data: {
        total: { decrement: note.total },         // Trừ đi tổng tiền đơn hàng trả
        debtTotal: { decrement: note.debtMoney }, // Trừ đi số tiền còn nợ từ đơn này
      },
    });

    // 4. ĐẢO NGƯỢC KHO HÀNG: TRỪ SỐ LƯỢNG SẢN PHẨM CON & SẢN PHẨM CHA
    if (receivedProductsData && receivedProductsData.length > 0) {
      for (const rp of receivedProductsData) {
        
        // Trừ kho của sản phẩm biến thể hiện tại (Sản phẩm con)
        const updatedProduct = await tx.product.update({
          where: { id: rp.productId },
          data: {
            quantity: { decrement: parseInt(rp.addQuantity, 10) },
          },
        });

        // Nếu sản phẩm này có sản phẩm cha (parentId), tiến hành trừ đồng bộ kho của sản phẩm cha
        if (updatedProduct.parentId) {
          await tx.product.update({
            where: { id: updatedProduct.parentId },
            data: {
              quantity: { decrement: parseInt(rp.addQuantity, 10) },
            },
          });
        }
      }
    }

    return note;
  });
}
}

module.exports = new ReceivedNoteRepository();
