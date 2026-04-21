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
