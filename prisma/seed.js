const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Bắt đầu nạp dữ liệu mẫu...");

  // 1. Tạo User
  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "hashed_password_here", // Thực tế sẽ dùng bcrypt để hash
      status: "active",
    },
  });

  // 2. Tạo Brand
  const brand = await prisma.brand.create({
    data: { name: "Uniqlo" },
  });

  // 3. Tạo ProductType
  const productType = await prisma.productType.create({
    data: { name: "Áo khoác" },
  });

  // 4. Tạo AttributeType (Loại thuộc tính: Màu sắc, Size)
  const colorType = await prisma.attributeType.create({
    data: { name: "Màu sắc" },
  });

  const sizeType = await prisma.attributeType.create({
    data: { name: "Kích cỡ" },
  });

  // 5. Tạo Attribute (Giá trị cụ thể: Đỏ, Xanh, S, M, L)
  const attrColorBlack = await prisma.attribute.create({
    data: { attributeTypeId: colorType.id, value: "Đen" },
  });
  const attrSizeL = await prisma.attribute.create({
    data: { attributeTypeId: sizeType.id, value: "L" },
  });

  // 6. Tạo Product
  const product = await prisma.product.create({
    data: {
      productTypeId: productType.id,
      brandId: brand.id,
      initialPrice: 500000,
      salePrice: 799000,
      quantity: 50,
      description: "Áo khoác gió chống nước",
      barcode: "893123456789",
      status: "active",
    },
  });

  // 7. Gắn Attribute cho Product (Sản phẩm này màu Đen, Size L)
  await prisma.productAttribute.createMany({
    data: [
      {
        productId: product.id,
        attributeId: attrColorBlack.id,
        content: "Màu sắc: Đen",
      },
      {
        productId: product.id,
        attributeId: attrSizeL.id,
        content: "Kích cỡ: L",
      },
    ],
  });

  // 8. Tạo Provider (Nhà cung cấp)
  const provider = await prisma.provider.create({
    data: {
      name: "Xưởng may ABC",
      phoneNumber: "0987654321",
      email: "contact@abc.com",
      debtTotal: 0,
      total: 0,
    },
  });

  console.log("Đã tạo thành công dữ liệu mẫu!");
}

main()
  .catch((e) => {
    console.error("Lỗi khi seed data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
