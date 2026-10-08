import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        {
          message: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: "APPROVED",
      },

      include: {
        Seller: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            description: true,
            logoUrl: true,
            phone: true,
            status: true,
            commissionRate: true,
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
            sortOrder: true,
          },
        },

        ProductVariant: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stockQuantity: true,
            attributes: true,
          },
        },

        Inventory: {
          select: {
            quantity: true,
            reserved: true,
          },
        },

        Review: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: {
        ...product,

        seller: product.Seller,
        category: product.Category,
        brand: product.Brand,
        images: product.ProductImage,
        variants: product.ProductVariant,
        inventory: product.Inventory,
        reviews: product.Review,
      },
    });
  } catch (error) {
    console.error(
      "SINGLE PRODUCT GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load product.",
      },
      { status: 500 }
    );
  }
}