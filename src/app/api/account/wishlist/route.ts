import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: session.userId,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    sortOrder: "asc",
                  },
                  take: 1,
                },
                brand: true,
                category: true,
                seller: {
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

    const items = wishlist.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,

      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,

        price: item.product.price.toString(),

        compareAtPrice:
          item.product.compareAtPrice !== null
            ? item.product.compareAtPrice.toString()
            : null,

        stockQuantity: item.product.stockQuantity,

        status: item.product.status,

        isFeatured: item.product.isFeatured,

        isFlashSale: item.product.isFlashSale,

        image:
          item.product.images[0]?.url || null,

        brand: item.product.brand
          ? {
              id: item.product.brand.id,
              name: item.product.brand.name,
            }
          : null,

        category: {
          id: item.product.category.id,
          name: item.product.category.name,
          slug: item.product.category.slug,
        },

        seller: {
          storeName:
            item.product.seller.storeName,
        },
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
    console.error(
      "GET /api/account/wishlist error:",
      error
    );

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
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId = body?.productId;

    if (
      !productId ||
      typeof productId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
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
          message:
            "This product is not currently available.",
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
          userId: session.userId,
        },
      });
    }

    const existingItem =
      await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
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
        wishlistId: wishlist.id,
        productId,
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
    console.error(
      "POST /api/account/wishlist error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to wishlist.",
      },
      { status: 500 }
    );
  }
}