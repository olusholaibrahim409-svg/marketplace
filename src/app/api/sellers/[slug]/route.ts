import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { message: "Seller slug is required." },
        { status: 400 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        storeName: true,
        slug: true,
        description: true,
        logoUrl: true,
        phone: true,
        status: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Seller store not found." },
        { status: 404 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        sellerId: seller.id,
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,

        ProductImage: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },

        Category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,

      images: product.ProductImage,

      category: product.Category,
    }));

    return NextResponse.json({
      seller,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("SELLER STOREFRONT API ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load seller store.",
      },
      { status: 500 }
    );
  }
}