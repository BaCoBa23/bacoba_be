const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out_of_stock",
  DELETED: "deleted",
};

const CommonStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
};

const ReceiveNoteStatus = {
  DRAFT: "draft",
  CONFIRM: "confirm",
  CANCELLED: "cancelled",
};

const BillStatus = {
  COMPLETED: "completed",
  RETURNED: "returned",
  EXCHANGED: "exchanged",
};

const HistoryProviderStatus = {
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

module.exports = {
  ProductStatus,
  CommonStatus,
  ReceiveNoteStatus,
  BillStatus,
  HistoryProviderStatus,
};
