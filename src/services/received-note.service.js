const receivedNoteRepo = require("../repositories/received-note.repository");
const { buildPagination, buildMeta } = require("../utils");

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

    return {
      data,
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getReceivedNoteById(id) {
    return await receivedNoteRepo.findById(id);
  }

  async getReceivedNotesByProviderId(providerId, query) {
    const { page, pageSize, skip, take } = buildPagination(query);
    const { data, totalItems } = await receivedNoteRepo.findByProviderId(parseInt(providerId, 10), skip, take);

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

    return await receivedNoteRepo.create(receivedNoteData);
  }

  async updateReceivedNote(id, data) {
    const updateData = {};

    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.discount !== undefined) updateData.discount = parseFloat(data.discount);
    if (data.payedMoney !== undefined) updateData.payedMoney = parseFloat(data.payedMoney);
    if (data.debtMoney !== undefined) updateData.debtMoney = parseFloat(data.debtMoney);
    if (data.total !== undefined) updateData.total = parseFloat(data.total);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    return await receivedNoteRepo.update(id, updateData);
  }

  async deleteReceivedNote(id) {
    return await receivedNoteRepo.delete(id);
  }
}

module.exports = new ReceivedNoteService();
