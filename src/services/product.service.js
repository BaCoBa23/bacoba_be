const productRepo = require("../repositories/product.repository");
const {
  buildPagination,
  buildMeta,
  generateProductId,
  generateCombinations,
} = require("../utils");

class ProductService {
  async getProducts(query) {
    const { page, pageSize, skip, take, orderBy } = buildPagination(query);

    const where = { parentId: null };
    const { search, brandId, typeId, status } = query;

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { description: { contains: search } },
        { barcode: { contains: search } },
      ];
    }
    if (brandId) where.brandId = parseInt(brandId, 10);
    if (typeId) where.productTypeId = parseInt(typeId, 10);
    if (status) where.status = status;

    const { data, totalItems } = await productRepo.findAndCount({
      skip,
      take,
      where,
      orderBy,
    });
    const formattedData = data.map((product) => {
      return {
        id: product.id,
        name: product.name,
        productType: product.type, // Đổi 'type' của Prisma thành 'productType'
        initialPrice: product.initialPrice,
        salePrice: product.salePrice,
        quantity: product.quantity,
        description: product.description,
        barcode: product.barcode,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        // Map mảng variants
        variants: product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          productType: variant.type,
          initialPrice: variant.initialPrice,
          salePrice: variant.salePrice,
          quantity: variant.quantity,
          description: variant.description,
          barcode: variant.barcode,
          status: variant.status,
          // Bóc tách productAttributes thành mảng attributes [{ id, value }]
          attributes: variant.productAttributes.map((pa) => ({
            id: pa.attribute.id,
            value: pa.attribute.value,
          })),
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
        })),
      };
    });

    return {
      data: formattedData, // Trả về mảng đã format
      meta: buildMeta(totalItems, page, pageSize),
    };
  }

  async getProductById(id) {
    return await productRepo.findById(id);
  }

  async createProduct(data) {
    const parentId = generateProductId();
    const productTypeId = parseInt(data.productTypeId, 10);
    const brandId = data.brandId ? parseInt(data.brandId, 10) : null;

    const productData = {
      id: parentId,
      name: data.name,
      initialPrice: parseFloat(data.initialPrice) || 0,
      salePrice: parseFloat(data.salePrice) || 0,
      quantity: 0,
      description: data.description || null,
      barcode: data.barcode || parentId,
      status: data.status || "active",
      type: {
        connect: { id: productTypeId },
      },
    };
    if (brandId) {
      productData.brand = {
        connect: { id: brandId },
      };
    }
    if (
      data.attributes &&
      Array.isArray(data.attributes) &&
      data.attributes.length > 0
    ) {
      const combinations = generateCombinations(data.attributes);
      const variantsData = combinations.map((combo, index) => {
        const variantId = `${parentId}-${index + 1}`;
        const variantNameSuffix = combo.map((c) => c.value).join("-");

        const variantPayload = {
          id: variantId,
          name: `${data.name} - ${variantNameSuffix}`,
          initialPrice: parseFloat(data.initialPrice) || 0,
          salePrice: parseFloat(data.salePrice) || 0,
          quantity: 0,
          status: "active",
          barcode: variantId,
          description:
            data.description || `${data.name} - ${variantNameSuffix}`,
          type: {
            connect: { id: productTypeId },
          },
          productAttributes: {
            create: combo.map((attr) => ({
              attributeId: parseInt(attr.id, 10),
              content: attr.value,
            })),
          },
        };
        if (brandId) {
          variantPayload.brand = {
            connect: { id: brandId },
          };
        }

        return variantPayload;
      });

      productData.variants = {
        create: variantsData,
      };
    }

    return await productRepo.create(productData);
  }

  async updateProduct(id, data) {
    const updateData = {};

    if (data.productTypeId !== undefined)
      updateData.productTypeId = parseInt(data.productTypeId, 10);
    if (data.brandId !== undefined)
      updateData.brandId = parseInt(data.brandId, 10);
    if (data.initialPrice !== undefined)
      updateData.initialPrice = parseFloat(data.initialPrice);
    if (data.salePrice !== undefined)
      updateData.salePrice = parseFloat(data.salePrice);
    if (data.quantity !== undefined)
      updateData.quantity = parseInt(data.quantity, 10);
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;

    return await productRepo.update(id, updateData);
  }

  async deleteProduct(id) {
    return await productRepo.delete(id);
  }

  async renameProductAndVariants(id, newName) {
    // Cập nhật tên sản phẩm cha
    const updatedParent = await productRepo.update(id, { name: newName });

    // Cập nhật tên tất cả variant (con) của sản phẩm
    const variants = await productRepo.findVariantsByParentId(id);
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const variantNameSuffix = variant.productAttributes
          .map((pa) => pa.attribute.value)
          .join("-");
        const updatedName = `${newName} - ${variantNameSuffix}`;
        await productRepo.update(variant.id, { name: updatedName });
      }
    }

    return updatedParent;
  }

  async addVariantToProduct(parentId, attributesData) {
    // Get parent product
    const parent = await productRepo.findById(parentId);
    if (!parent) throw new Error("Parent product not found");

    // Get existing variants
    const variants = await productRepo.findVariantsByParentId(parentId);

    // Convert attributesData to combinations format (support both single value and multiple values)
    const attributeArrays = attributesData.map((attr) => {
      // If values is array, use it; if value is single, wrap in array
      const values = Array.isArray(attr.values) ? attr.values : [attr.value];
      return {
        id: attr.id,
        values: values,
      };
    });

    // Generate all combinations
    const combinations = generateCombinations(attributeArrays.map((a) => a.values.map((v) => ({ id: a.id, value: v }))));

    const createdVariants = [];
    const duplicateErrors = [];

    // Create each variant from combinations
    for (const combo of combinations) {
      // Check if variant with same attributes AND values already exists
      let isDuplicate = false;

      for (const variant of variants) {
        if (!variant.productAttributes || variant.productAttributes.length === 0) continue;

        // Compare attribute count first
        if (variant.productAttributes.length !== combo.length) continue;

        // Sort both for comparison
        const existingAttrs = variant.productAttributes
          .map((pa) => ({ id: pa.attributeId, value: pa.attribute?.value || pa.content }))
          .sort((a, b) => a.id - b.id || a.value.localeCompare(b.value));

        const newAttrs = combo
          .map((attr) => ({ id: parseInt(attr.id, 10), value: attr.value }))
          .sort((a, b) => a.id - b.id || a.value.localeCompare(b.value));

        // Check if all attributes match (both id and value)
        const allMatch = existingAttrs.every((existing, idx) => {
          const newAttr = newAttrs[idx];
          return existing.id === newAttr.id && existing.value === newAttr.value;
        });

        if (allMatch) {
          const variantNames = existingAttrs.map((a) => a.value).join(" + ");
          duplicateErrors.push(`[${variantNames}] (ID: ${variant.id})`);
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) continue;

      // Create new variant
      const nextVariantNumber = variants.length + createdVariants.length + 1;
      const variantId = `${parentId}-${nextVariantNumber}`;
      const variantNameSuffix = combo.map((c) => c.value).join("-");
      const variantName = `${parent.name} - ${variantNameSuffix}`;

      const variantPayload = {
        id: variantId,
        name: variantName,
        parentId: parentId,
        productTypeId: parent.productTypeId,
        brandId: parent.brandId,
        initialPrice: parent.initialPrice,
        salePrice: parent.salePrice,
        quantity: 0,
        description: parent.description,
        barcode: variantId,
        status: "active",
        productAttributes: {
          create: combo.map((attr) => ({
            attributeId: parseInt(attr.id, 10),
            content: attr.value,
          })),
        },
      };

      const created = await productRepo.create(variantPayload);
      createdVariants.push(created);
      variants.push(created); // Add to list để check duplicate lần sau
    }

    // If all are duplicates
    if (createdVariants.length === 0) {
      throw new Error(`Tất cả variants đã tồn tại: ${duplicateErrors.join(", ")}`);
    }

    // If some are duplicates
    if (duplicateErrors.length > 0) {
      return {
        message: `Tạo ${createdVariants.length} variant thành công. Những variant sau đã tồn tại: ${duplicateErrors.join(", ")}`,
        data: createdVariants,
        hasWarning: true,
      };
    }

    return {
      message: `Tạo ${createdVariants.length} variant thành công`,
      data: createdVariants,
    };
  }
}

module.exports = new ProductService();
