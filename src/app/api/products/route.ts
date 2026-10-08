import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Seller: {
          select: {
            id: true,
            storeName: true,
          },
        },
        Category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        Brand: {
          select: {
            id: true,
            name: true,
          },
        },
        ProductImage: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },
      },
    });

    const mappedProducts = products.map((product) => ({
      id: product.id,
      sellerId: product.sellerId,
      categoryId: product.categoryId,
      brandId: product.brandId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      status: product.status,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      isFlashSale: product.isFlashSale,
      stockQuantity: product.stockQuantity,

      seller: product.Seller,
      category: product.Category,
      brand: product.Brand,
      images: product.ProductImage,
    }));

    return NextResponse.json({
      products: mappedProducts,
    });
  } catch (error) {
    console.error("CUSTOMER PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load products.",
      },
      { status: 500 }
    );
  }
}