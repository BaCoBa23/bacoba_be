# 👕 Bacoba Backend - API Quản lý cửa hàng quần áo

Đây là hệ thống Backend (RESTful API) phục vụ cho dự án quản lý kho hàng và bán hàng thời trang. Dự án được xây dựng theo kiến trúc phân tầng chuẩn (**N-Tier Architecture**) giúp code dễ dàng mở rộng và bảo trì.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (v5.x)
- **ORM:** Prisma ORM
- **Database:** SQLite (Dễ dàng migrate sang MySQL/PostgreSQL nếu cần)

---

## 📂 Cấu trúc thư mục (Folder Structure)

Dự án áp dụng **Barrel Pattern** (dùng `index.js` để gom module) và chia tách logic rõ ràng:

```text
/src
├── config/             # Cấu hình hệ thống (Prisma Client, v.v.)
├── constants/          # Các hằng số (Error messages, keys...)
├── enums/              # Định nghĩa các trạng thái, loại (Status, Roles...)
├── middlewares/        # Xử lý Request chặn ngang (Response formatter, Auth...)
├── validations/        # Rule kiểm tra dữ liệu đầu vào (Body, Params, Query)
├── routes/             # Khai báo các Endpoint API (/api/v1/...)
├── controllers/        # Nhận Request, gọi Service và trả về Response JSON
├── services/           # Chứa toàn bộ Business Logic (tính toán, xử lý nghiệp vụ)
├── repositories/       # Tầng giao tiếp trực tiếp với Database (Query, Insert, Update)
└── utils/              # Các hàm tiện ích dùng chung (Pagination, Formatter...)
```

---

## 🚀 Hướng dẫn cài đặt (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)

- Node.js (Khuyến nghị bản LTS - v18 hoặc v20 trở lên)
- Máy tính đã cài đặt Git.

### 2. Cài đặt chi tiết

**Bước 1:** Clone source code về máy và di chuyển vào thư mục dự án

```bash
git clone <đường-dẫn-repo-của-bạn>
cd bacoba_be
```

**Bước 2:** Cài đặt các thư viện cần thiết

```bash
npm install
```

**Bước 3:** Cấu hình biến môi trường
Tạo một file `.env` ở thư mục gốc (ngang hàng với `package.json`) và thêm nội dung sau:

```env
PORT=5555
DATABASE_URL="file:./dev.db"
```

**Bước 4:** Khởi tạo Database và nạp dữ liệu mẫu (Seeding)
Chạy lệnh dưới đây, Prisma sẽ tự động tạo file `dev.db`, cấu trúc các bảng và nạp data mẫu từ file `prisma/seed.js`:

```bash
npx prisma migrate dev
```

**Bước 5:** Khởi chạy Server

```bash
npm run dev
```

Mở trình duyệt hoặc Postman truy cập: `http://localhost:3000/api/v1/health` để kiểm tra server.

---

## 📜 Các lệnh kịch bản (Available Scripts)

- `npm run dev`: Chạy server trong môi trường phát triển (Sử dụng Nodemon để tự động reload khi lưu file).
- `npm run build`: Khởi tạo lại Prisma Client (Thường dùng trước khi deploy lên server thật).
- `npm start`: Chạy server trong môi trường Production (Chạy thuần bằng Node).

---

## 💡 Tiêu chuẩn dữ liệu trả về (Response Convention)

Toàn bộ API trong dự án đã được bọc qua middleware `res.success` và `res.error` để chuẩn hóa dữ liệu trả về cho Frontend.

**1. Thành công (Success Response)**

```json
{
  "success": true,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": [ ... ],
  "meta": {
    "totalItems": 50,
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

**2. Thất bại (Error Response)**

```json
{
  "success": false,
  "message": "Không tìm thấy sản phẩm."
}
```

---

## 🔍 Hướng dẫn API Phân trang & Tìm kiếm cơ bản

Hệ thống hỗ trợ phân trang, tìm kiếm và sắp xếp truyền qua **Query String**.
**Ví dụ:** GET `/api/v1/products?page=1&pageSize=10&search=ao&status=active&order={"price":"asc"}`

- `page`: Số trang hiện tại (Mặc định: 1)
- `pageSize`: Số lượng item trên mỗi trang (Mặc định: 10)
- `search`: Từ khóa tìm kiếm (Tùy logic từng API, vd: tìm theo tên, mã vạch)
- `order`: JSON quy định sắp xếp (Vd: `{"createdAt":"desc"}`)
