
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: session.userId,
      },
      include: {
        WishlistItem: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            Product: {
              include: {
                ProductImage: {
                  orderBy: {
                    sortOrder: "asc",
                  },
                  take: 1,
                },
                Brand: true,
                Category: true,
                Seller: {
                  select: {
                    storeName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({
        success: true,
        wishlist: {
          id: null,
          items: [],
        },
      });
    }

    const items = wishlist.WishlistItem.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,

      product: {
        id: item.Product.id,
        name: item.Product.name,
        slug: item.Product.slug,
        description: item.Product.description,

        price: item.Product.price.toString(),

        compareAtPrice:
          item.Product.compareAtPrice !== null
            ? item.Product.compareAtPrice.toString()
            : null,

        stockQuantity: item.Product.stockQuantity,
        status: item.Product.status,
        isFeatured: item.Product.isFeatured,
        isFlashSale: item.Product.isFlashSale,

        image: item.Product.ProductImage[0]?.url || null,

        brand: item.Product.Brand
          ? {
              id: item.Product.Brand.id,
              name: item.Product.Brand.name,
            }
          : null,

        category: {
          id: item.Product.Category.id,
          name: item.Product.Category.name,
          slug: item.Product.Category.slug,
        },

        seller: item.Product.Seller
          ? {
              storeName: item.Product.Seller.storeName,
            }
          : null,
      },
    }));

    return NextResponse.json({
      success: true,
      wishlist: {
        id: wishlist.id,
        items,
      },
    });
  } catch (error) {
    console.error("GET /api/account/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load wishlist.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const productId = body?.productId;

    if (
      typeof productId !== "string" ||
      !productId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const normalizedProductId = productId.trim();

    const product = await prisma.product.findUnique({
      where: {
        id: normalizedProductId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    if (product.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: "This product is not currently available.",
        },
        { status: 400 }
      );
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          id: randomUUID(),
          userId: session.userId,
        },
      });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: normalizedProductId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message: "Product is already in your wishlist.",
        item: existingItem,
      });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        id: randomUUID(),
        wishlistId: wishlist.id,
        productId: normalizedProductId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added to wishlist.",
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/account/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to wishlist.",
      },
      { status: 500 }
    );
  }
}
