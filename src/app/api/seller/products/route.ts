import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only sellers can access this endpoint." },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Seller account not found." },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        { message: "Your seller account is not approved." },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        categories,
        brands,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SELLER PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only sellers can create products." },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Seller account not found." },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        { message: "Your seller account is not approved." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const categoryId =
      typeof body.categoryId === "string"
        ? body.categoryId
        : "";

    const brandId =
      typeof body.brandId === "string" &&
      body.brandId.trim()
        ? body.brandId.trim()
        : null;

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const sku =
      typeof body.sku === "string" &&
      body.sku.trim()
        ? body.sku.trim()
        : null;

    /*
     * Support multiple uploaded images.
     */
    let imageUrls: string[] = [];

    if (Array.isArray(body.imageUrls)) {
      imageUrls = body.imageUrls
        .filter(
          (value: unknown): value is string =>
            typeof value === "string"
        )
        .map((value: string) => value.trim())
        .filter(
          (value: string) =>
            value.length > 0
        );
    }

    /*
     * Backward compatibility
     * with the old imageUrl field.
     */
    if (
      imageUrls.length === 0 &&
      typeof body.imageUrl === "string" &&
      body.imageUrl.trim()
    ) {
      imageUrls = [
        body.imageUrl.trim(),
      ];
    }

    /*
     * Maximum 10 images.
     */
    if (imageUrls.length > 10) {
      return NextResponse.json(
        {
          message:
            "You can add a maximum of 10 product images.",
        },
        { status: 400 }
      );
    }

    const price = Number(body.price);

    const compareAtPrice =
      body.compareAtPrice !== "" &&
      body.compareAtPrice !== null &&
      body.compareAtPrice !== undefined
        ? Number(body.compareAtPrice)
        : null;

    const stockQuantity =
      Number(body.stockQuantity);

    const isFeatured =
      body.isFeatured === true;

    const isFlashSale =
      body.isFlashSale === true;

    /*
     * Product name validation.
     */
    if (!name) {
      return NextResponse.json(
        {
          message:
            "Product name is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Category validation.
     */
    if (!categoryId) {
      return NextResponse.json(
        {
          message:
            "Category is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Price validation.
     */
    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Enter a valid product price.",
        },
        { status: 400 }
      );
    }

    /*
     * Compare-at price validation.
     */
    if (
      compareAtPrice !== null &&
      (!Number.isFinite(
        compareAtPrice
      ) ||
        compareAtPrice <= 0)
    ) {
      return NextResponse.json(
        {
          message:
            "Enter a valid compare-at price.",
        },
        { status: 400 }
      );
    }

    /*
     * Compare-at price must be
     * greater than selling price.
     */
    if (
      compareAtPrice !== null &&
      compareAtPrice <= price
    ) {
      return NextResponse.json(
        {
          message:
            "Compare-at price must be higher than the selling price.",
        },
        { status: 400 }
      );
    }

    /*
     * Stock validation.
     */
    if (
      !Number.isInteger(
        stockQuantity
      ) ||
      stockQuantity < 0
    ) {
      return NextResponse.json(
        {
          message:
            "Enter a valid stock quantity.",
        },
        { status: 400 }
      );
    }

    /*
     * Verify category.
     */
    const category =
      await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          message:
            "Selected category was not found.",
        },
        { status: 400 }
      );
    }

    /*
     * Verify brand.
     */
    if (brandId) {
      const brand =
        await prisma.brand.findUnique({
          where: {
            id: brandId,
          },
        });

      if (!brand) {
        return NextResponse.json(
          {
            message:
              "Selected brand was not found.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Check SKU uniqueness.
     */
    if (sku) {
      const existingSku =
        await prisma.product.findUnique({
          where: {
            sku,
          },
        });

      if (existingSku) {
        return NextResponse.json(
          {
            message:
              "That SKU is already in use.",
          },
          { status: 409 }
        );
      }
    }

    /*
     * Create URL-friendly slug.
     */
    const slugBase =
      name
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          "") ||
      `product-${Date.now()}`;

    let slug = slugBase;

    /*
     * Make sure the slug is unique.
     */
    const existingSlug =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existingSlug) {
      slug = `${slugBase}-${Date.now()}`;
    }

    /*
     * Create everything inside
     * one database transaction.
     */
    const product =
      await prisma.$transaction(
        async (transaction) => {
          /*
           * Create Product.
           */
          const createdProduct =
            await transaction.product.create({
              data: {
                id: crypto.randomUUID(),

                sellerId:
                  seller.id,

                categoryId,

                brandId,

                name,

                slug,

                description:
                  description ||
                  null,

                sku,

                price,

                compareAtPrice,

                status:
                  "PENDING",

                stockQuantity,

                isFeatured,

                isFlashSale,

                updatedAt:
                  new Date(),
              },
            });

          /*
           * Create Inventory.
           *
           * Inventory requires both
           * id and updatedAt.
           */
          await transaction.inventory.create({
            data: {
              id: crypto.randomUUID(),

              productId:
                createdProduct.id,

              quantity:
                stockQuantity,

              reserved: 0,

              updatedAt:
                new Date(),
            },
          });

          /*
           * Create ProductImage records.
           */
          for (
            let index = 0;
            index < imageUrls.length;
            index++
          ) {
            await transaction.productImage.create({
              data: {
                id: crypto.randomUUID(),

                productId:
                  createdProduct.id,

                url:
                  imageUrls[index],

                altText:
                  name,

                sortOrder:
                  index,
              },
            });
          }

          /*
           * Return created product
           * with images and inventory.
           */
          return transaction.product.findUnique({
            where: {
              id: createdProduct.id,
            },

            include: {
              ProductImage: {
                orderBy: {
                  sortOrder:
                    "asc",
                },
              },

              Inventory: true,
            },
          });
        }
      );

    return NextResponse.json(
      {
        message:
          "Product created successfully and submitted for approval.",

        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SELLER PRODUCT CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}