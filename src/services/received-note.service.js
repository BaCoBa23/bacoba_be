const receivedNoteRepo = require("../repositories/received-note.repository");
const { buildPagination, buildMeta } = require("../utils");
const prisma = require("../config/prisma.config");

class ReceivedNoteService {
  async getReceivedNotes(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = {};
    const { providerId, status } = query;

    if (providerId) where.providerId = parseInt(providerId, 10);
    if (status) where.status = status;

    const { data, totalItems } = await receivedNoteRepo.findAndCount({
      skip,
      take,
      where,
      orderBy,
    });
    const formattedData = data.map((note) => ({
      id: note.id,
      provider: note.provider
        ? {
            id: note.provider.id,
            name: note.provider.name,
            status: note.provider.status,
          }
        : null,
      phoneNumber: note.phoneNumber,
      discount: note.discount,
      payedMoney: note.payedMoney,
      debtMoney: note.debtMoney,
      total: note.total,
      description: note.description,
      status: note.status,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      receivedProducts: note.receivedProducts.map((rp) => ({
        id: rp.id,
        productId: rp.productId,
        productName: rp.product?.name || "Sản Phẩm", // Đưa name của product ra ngoài
        addQuantity: rp.addQuantity,
        discount: rp.discount,
        total: rp.total,
        createdAt: rp.createdAt,
        updatedAt: rp.updatedAt,
      })),
    }));

    return {
      data: formattedData,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getReceivedNoteById(id) {
    return await receivedNoteRepo.findById(id);
  }

  async getReceivedNotesByProviderId(providerId, query) {
    const { page, pageSize, skip, take } = buildPagination(query);
    const { data, totalItems } = await receivedNoteRepo.findByProviderId(
      parseInt(providerId, 10),
      skip,
      take,
    );

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async createReceivedNote(data) {
    const receivedNoteData = {
      providerId: parseInt(data.providerId, 10),
      phoneNumber: data.phoneNumber || null,
      discount: parseFloat(data.discount) || 0,
      payedMoney: parseFloat(data.payedMoney) || 0,
      debtMoney: parseFloat(data.debtMoney) || 0,
      total: parseFloat(data.total),
      description: data.description || null,
      status: data.status || "pending",
    };

    // Nếu có receivedProducts, tạo receivedNote với nested create
    if (
      data.receivedProducts &&
      Array.isArray(data.receivedProducts) &&
      data.receivedProducts.length > 0
    ) {
      const receivedProductsData = data.receivedProducts.map((rp) => ({
        productId: rp.productId,
        addQuantity: parseInt(rp.addQuantity, 10),
        discount: parseFloat(rp.discount) || 0,
        description: rp.description || null,
        total: parseFloat(rp.total),
      }));

      return await prisma.receivedNote.create({
        data: {
          ...receivedNoteData,
          receivedProducts: {
            create: receivedProductsData,
          },
        },
        include: {
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Nếu không có receivedProducts, tạo receivedNote bình thường
    return await receivedNoteRepo.create(receivedNoteData);
  }

  async updateReceivedNote(id, data) {
    const updateData = {};

    if (data.phoneNumber !== undefined)
      updateData.phoneNumber = data.phoneNumber;
    if (data.discount !== undefined)
      updateData.discount = parseFloat(data.discount);
    if (data.payedMoney !== undefined)
      updateData.payedMoney = parseFloat(data.payedMoney);
    if (data.debtMoney !== undefined)
      updateData.debtMoney = parseFloat(data.debtMoney);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    // Nếu có receivedProducts, delete old ones và create new ones
    if (data.receivedProducts && Array.isArray(data.receivedProducts)) {
      const receivedProductsData = data.receivedProducts.map((rp) => ({
        productId: rp.productId,
        addQuantity: parseInt(rp.addQuantity, 10),
        discount: parseFloat(rp.discount) || 0,
        description: rp.description || null,
        total: parseFloat(rp.total),
      }));

      return await prisma.receivedNote.update({
        where: { id },
        data: {
          ...updateData,
          receivedProducts: {
            deleteMany: {}, // Delete tất cả receivedProducts cũ
            create: receivedProductsData, // Tạo receivedProducts mới
          },
        },
        include: {
          receivedProducts: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Nếu không có receivedProducts, chỉ update receivedNote
    return await receivedNoteRepo.update(id, updateData);
  }

  async deleteReceivedNote(id) {
    return await receivedNoteRepo.delete(id);
  }
}

module.exports = new ReceivedNoteService();
