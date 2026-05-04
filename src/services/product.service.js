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

  async getParentAttributes(parentId) {
    const attributes = await productRepo.findAttributesByParentId(parentId);
    return attributes;
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
    // 1. Kiểm tra product cha
    const parent = await productRepo.findById(parentId);
    if (!parent) throw new Error("PARENT_NOT_FOUND");

    // 2. Nhóm các attribute từ payload theo attributeTypeId
    // Payload là 1 flat array: [ { id: 3, attributeTypeId: 1, value: "Đỏ" }, ... ]
    const groupedAttributes = {};
    for (const attr of attributesData) {
      if (!groupedAttributes[attr.attributeTypeId]) {
        groupedAttributes[attr.attributeTypeId] = [];
      }
      groupedAttributes[attr.attributeTypeId].push({
        id: parseInt(attr.id, 10),
        value: attr.value,
      });
    }

    const formattedAttributes = Object.values(groupedAttributes);

    const combinations = generateCombinations(formattedAttributes);

    const existingVariants = await productRepo.findVariantsByParentId(parentId);

    let maxIndex = 0;
    existingVariants.forEach((v) => {
      const parts = v.id.split("-");
      if (parts.length > 1) {
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxIndex) {
          maxIndex = num;
        }
      }
    });

    const variantsToCreatePayload = [];
    const duplicateCombos = [];

    for (const combo of combinations) {
      const sortedCombo = [...combo].sort((a, b) => a.id - b.id);

      const isExist = existingVariants.some((variant) => {
        if (
          !variant.productAttributes ||
          variant.productAttributes.length !== sortedCombo.length
        )
          return false;

        const sortedVariantAttrs = [...variant.productAttributes].sort(
          (a, b) => a.attributeId - b.attributeId,
        );

        return sortedCombo.every((c, index) => {
          const vAttr = sortedVariantAttrs[index];
          return (
            c.id === vAttr.attributeId &&
            c.value === (vAttr.attribute?.value || vAttr.content)
          );
        });
      });

      if (isExist) {
        duplicateCombos.push(combo);
      } else {
        maxIndex++;
        const variantId = `${parentId}-${maxIndex}`;
        const variantNameSuffix = combo.map((c) => c.value).join("-");

        variantsToCreatePayload.push({
          id: variantId,
          name: `${parent.name} - ${variantNameSuffix}`,
          parentId: parentId,
          productTypeId: parent.productTypeId,
          brandId: parent.brandId,
          initialPrice: parent.initialPrice,
          salePrice: parent.salePrice,
          quantity: 0,
          description:
            parent.description || `${parent.name} - ${variantNameSuffix}`,
          barcode: variantId,
          status: "active",
          productAttributes: {
            create: combo.map((attr) => ({
              attributeId: attr.id,
              content: attr.value,
            })),
          },
        });
      }
    }

    if (variantsToCreatePayload.length === 0) {
      throw new Error("ALL_VARIANTS_EXIST");
    }

    const createdVariants = await productRepo.createManyVariants(
      variantsToCreatePayload,
    );

    return {
      createdVariants,
      duplicateCount: duplicateCombos.length,
    };
  }
}

module.exports = new ProductService();
