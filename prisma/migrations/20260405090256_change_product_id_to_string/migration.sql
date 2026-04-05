/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductAttribute` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BillProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "billId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "salePrice" REAL NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BillProduct_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BillProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BillProduct" ("billId", "createdAt", "id", "productId", "quantity", "salePrice", "total", "updatedAt") SELECT "billId", "createdAt", "id", "productId", "quantity", "salePrice", "total", "updatedAt" FROM "BillProduct";
DROP TABLE "BillProduct";
ALTER TABLE "new_BillProduct" RENAME TO "BillProduct";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT,
    "productTypeId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "initialPrice" REAL NOT NULL,
    "salePrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,
    "barcode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("barcode", "brandId", "createdAt", "description", "id", "initialPrice", "parentId", "productTypeId", "quantity", "salePrice", "status", "updatedAt") SELECT "barcode", "brandId", "createdAt", "description", "id", "initialPrice", "parentId", "productTypeId", "quantity", "salePrice", "status", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_ProductAttribute" (
    "productId" TEXT NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("productId", "attributeId"),
    CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductAttribute" ("attributeId", "content", "createdAt", "productId", "updatedAt") SELECT "attributeId", "content", "createdAt", "productId", "updatedAt" FROM "ProductAttribute";
DROP TABLE "ProductAttribute";
ALTER TABLE "new_ProductAttribute" RENAME TO "ProductAttribute";
CREATE TABLE "new_ReceivedProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "receivedNoteId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "addQuantity" INTEGER NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "description" TEXT,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReceivedProduct_receivedNoteId_fkey" FOREIGN KEY ("receivedNoteId") REFERENCES "ReceivedNote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReceivedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReceivedProduct" ("addQuantity", "createdAt", "description", "discount", "id", "productId", "receivedNoteId", "total", "updatedAt") SELECT "addQuantity", "createdAt", "description", "discount", "id", "productId", "receivedNoteId", "total", "updatedAt" FROM "ReceivedProduct";
DROP TABLE "ReceivedProduct";
ALTER TABLE "new_ReceivedProduct" RENAME TO "ReceivedProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
