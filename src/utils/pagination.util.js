const buildPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const pageSize = parseInt(query.pageSize, 10) || 10;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let orderBy = { createdAt: "desc" };

  // Xử lý order dạng JSON { 'price': 'asc', 'createdAt': 'desc' }
  if (query.order) {
    try {
      const parsedOrder = JSON.parse(query.order);
      // Prisma hỗ trợ mảng object để sort nhiều cột: [{ price: 'asc' }, { createdAt: 'desc' }]
      orderBy = Object.entries(parsedOrder).map(([key, value]) => ({
        [key]: value.toLowerCase(),
      }));
    } catch (error) {
      console.warn("Invalid order format, fallback to default");
    }
  }

  return { page, pageSize, skip, take, orderBy };
};

const buildMeta = (totalItems, page, pageSize) => {
  return {
    totalItems,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

module.exports = { buildPagination, buildMeta };
