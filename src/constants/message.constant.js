const MESSAGES = {
  SUCCESS: "Thành công",
  ERROR_SERVER: "Đã xảy ra lỗi từ phía máy chủ",
};

const SUCCESS_MESSAGES = {
  // Attribute Type
  ATTRIBUTE_TYPE_LIST_SUCCESSFUL: "Lấy danh sách loại thuộc tính thành công",
  ATTRIBUTE_TYPE_DETAIL_SUCCESSFUL: "Lấy chi tiết loại thuộc tính thành công",
  ATTRIBUTE_TYPE_CREATE_SUCCESSFUL: "Tạo loại thuộc tính thành công",
  ATTRIBUTE_TYPE_UPDATE_SUCCESSFUL: "Cập nhật loại thuộc tính thành công",
  ATTRIBUTE_TYPE_DELETE_SUCCESSFUL: "Xóa loại thuộc tính thành công",

  // Brand
  BRAND_LIST_SUCCESSFUL: "Lấy danh sách thương hiệu thành công",
  BRAND_DETAIL_SUCCESSFUL: "Lấy chi tiết thương hiệu thành công",
  BRAND_CREATE_SUCCESSFUL: "Tạo thương hiệu thành công",
  BRAND_UPDATE_SUCCESSFUL: "Cập nhật thương hiệu thành công",
  BRAND_DELETE_SUCCESSFUL: "Xóa thương hiệu thành công",

  // Product Attribute
  PRODUCT_ATTRIBUTE_LIST_SUCCESSFUL: "Lấy danh sách thuộc tính sản phẩm thành công",
  PRODUCT_ATTRIBUTE_BY_PRODUCT_LIST_SUCCESSFUL: "Lấy danh sách thuộc tính của sản phẩm thành công",
  PRODUCT_ATTRIBUTE_DETAIL_SUCCESSFUL: "Lấy chi tiết thuộc tính sản phẩm thành công",
  PRODUCT_ATTRIBUTE_CREATE_SUCCESSFUL: "Thêm thuộc tính cho sản phẩm thành công",
  PRODUCT_ATTRIBUTE_UPDATE_SUCCESSFUL: "Cập nhật thuộc tính sản phẩm thành công",
  PRODUCT_ATTRIBUTE_DELETE_SUCCESSFUL: "Xóa thuộc tính sản phẩm thành công",

  // User
  USER_LIST_SUCCESSFUL: "Lấy danh sách người dùng thành công",
  USER_DETAIL_SUCCESSFUL: "Lấy chi tiết người dùng thành công",
  USER_CREATE_SUCCESSFUL: "Tạo người dùng thành công",
  USER_UPDATE_SUCCESSFUL: "Cập nhật người dùng thành công",
  USER_DELETE_SUCCESSFUL: "Xóa người dùng thành công",

  // Attribute
  ATTRIBUTE_LIST_SUCCESSFUL: "Lấy danh sách thuộc tính thành công",
  ATTRIBUTE_DETAIL_SUCCESSFUL: "Lấy chi tiết thuộc tính thành công",
  ATTRIBUTE_CREATE_SUCCESSFUL: "Tạo thuộc tính thành công",
  ATTRIBUTE_UPDATE_SUCCESSFUL: "Cập nhật thuộc tính thành công",
  ATTRIBUTE_DELETE_SUCCESSFUL: "Xóa thuộc tính thành công",

  // Provider
  PROVIDER_LIST_SUCCESSFUL: "Lấy danh sách nhà cung cấp thành công",
  PROVIDER_DETAIL_SUCCESSFUL: "Lấy chi tiết nhà cung cấp thành công",
  PROVIDER_CREATE_SUCCESSFUL: "Tạo nhà cung cấp thành công",
  PROVIDER_UPDATE_SUCCESSFUL: "Cập nhật nhà cung cấp thành công",
  PROVIDER_DELETE_SUCCESSFUL: "Xóa nhà cung cấp thành công",

  // History Provider
  HISTORY_PROVIDER_LIST_SUCCESSFUL: "Lấy danh sách lịch sử thanh toán thành công",
  HISTORY_PROVIDER_DETAIL_SUCCESSFUL: "Lấy chi tiết lịch sử thanh toán thành công",
  HISTORY_PROVIDER_BY_PROVIDER_LIST_SUCCESSFUL: "Lấy danh sách lịch sử thanh toán của nhà cung cấp thành công",
  HISTORY_PROVIDER_CREATE_SUCCESSFUL: "Tạo lịch sử thanh toán thành công",
  HISTORY_PROVIDER_UPDATE_SUCCESSFUL: "Cập nhật lịch sử thanh toán thành công",
  HISTORY_PROVIDER_DELETE_SUCCESSFUL: "Xóa lịch sử thanh toán thành công",

  // Received Product
  RECEIVED_PRODUCT_BY_NOTE_LIST_SUCCESSFUL: "Lấy danh sách sản phẩm của phiếu nhập kho thành công",
  RECEIVED_PRODUCT_CREATE_SUCCESSFUL: "Thêm sản phẩm vào phiếu nhập kho thành công",
  RECEIVED_PRODUCT_UPDATE_SUCCESSFUL: "Cập nhật sản phẩm nhập kho thành công",
  RECEIVED_PRODUCT_DELETE_SUCCESSFUL: "Xóa sản phẩm khỏi phiếu nhập kho thành công",

  // Received Note
  RECEIVED_NOTE_LIST_SUCCESSFUL: "Lấy danh sách phiếu nhập kho thành công",
  RECEIVED_NOTE_DETAIL_SUCCESSFUL: "Lấy chi tiết phiếu nhập kho thành công",
  RECEIVED_NOTE_BY_PROVIDER_LIST_SUCCESSFUL: "Lấy danh sách phiếu nhập kho của nhà cung cấp thành công",
  RECEIVED_NOTE_CREATE_SUCCESSFUL: "Tạo phiếu nhập kho thành công",
  RECEIVED_NOTE_UPDATE_SUCCESSFUL: "Cập nhật phiếu nhập kho thành công",
  RECEIVED_NOTE_DELETE_SUCCESSFUL: "Xóa phiếu nhập kho thành công",

  // Bill Product
  BILL_PRODUCT_BY_BILL_LIST_SUCCESSFUL: "Lấy danh sách sản phẩm của hoá đơn thành công",
  BILL_PRODUCT_CREATE_SUCCESSFUL: "Thêm sản phẩm vào hoá đơn thành công",
  BILL_PRODUCT_UPDATE_SUCCESSFUL: "Cập nhật sản phẩm hóa đơn thành công",
  BILL_PRODUCT_DELETE_SUCCESSFUL: "Xóa sản phẩm khỏi hoá đơn thành công",

  // Bill
  BILL_LIST_SUCCESSFUL: "Lấy danh sách hoá đơn thành công",
  BILL_DETAIL_SUCCESSFUL: "Lấy chi tiết hoá đơn thành công",
  BILL_CREATE_SUCCESSFUL: "Tạo hoá đơn thành công",
  BILL_UPDATE_SUCCESSFUL: "Cập nhật hoá đơn thành công",
  BILL_DELETE_SUCCESSFUL: "Xóa hoá đơn thành công",

  // Product
  PRODUCT_LIST_SUCCESSFUL: "Lấy danh sách sản phẩm thành công",
  PRODUCT_DETAIL_SUCCESSFUL: "Lấy chi tiết sản phẩm thành công",
  PRODUCT_CREATE_SUCCESSFUL: "Tạo sản phẩm thành công",
  PRODUCT_UPDATE_SUCCESSFUL: "Cập nhật sản phẩm thành công",
  PRODUCT_DELETE_SUCCESSFUL: "Xóa sản phẩm thành công",

  // Product Type
  PRODUCT_TYPE_LIST_SUCCESSFUL: "Lấy danh sách loại sản phẩm thành công",
  PRODUCT_TYPE_DETAIL_SUCCESSFUL: "Lấy chi tiết loại sản phẩm thành công",
  PRODUCT_TYPE_CREATE_SUCCESSFUL: "Tạo loại sản phẩm thành công",
  PRODUCT_TYPE_UPDATE_SUCCESSFUL: "Cập nhật loại sản phẩm thành công",
  PRODUCT_TYPE_DELETE_SUCCESSFUL: "Xóa loại sản phẩm thành công",
};

const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm.",
  OUT_OF_STOCK: "Sản phẩm trong kho không đủ số lượng.",
  PRODUCT_TYPE_NOT_FOUND: "Không tìm thấy loại sản phẩm.",
  BRAND_NOT_FOUND: "Không tìm thấy thương hiệu.",
  ATTRIBUTE_NOT_FOUND: "Không tìm thấy thuộc tính.",
  ATTRIBUTE_TYPE_NOT_FOUND: "Không tìm thấy loại thuộc tính.",
  PRODUCT_ATTRIBUTE_NOT_FOUND: "Không tìm thấy thuộc tính sản phẩm.",
  BILL_NOT_FOUND: "Không tÌm thấy hóa đơn.",
  BILL_PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm hóa đơn.",
  PROVIDER_NOT_FOUND: "Không tìm thấy nhà cung cấp.",
  HISTORY_PROVIDER_NOT_FOUND: "Không tìm thấy lịch sử thanh toán.",
  RECEIVED_NOTE_NOT_FOUND: "Không tìm thấy phiếu nhập kho.",
  RECEIVED_PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm nhập kho.",
  USER_NOT_FOUND: "Không tÌm thấy người dùng.",
  SERVER_ERROR: "Đã xảy ra lỗi từ phía máy chủ",
};

module.exports = {
  MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};
