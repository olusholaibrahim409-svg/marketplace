import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { createClient } from "@supabase/supabase-js";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/*
 * GET PRODUCT
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    if (
      sessionUser.role !== "SELLER" &&
      sessionUser.role !== "ADMIN" &&
      sessionUser.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to view this product.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    let sellerId: string | null = null;

    if (sessionUser.role === "SELLER") {
      const seller = await prisma.seller.findUnique({
        where: {
          userId: sessionUser.userId,
        },

        select: {
          id: true,
        },
      });

      if (!seller) {
        return NextResponse.json(
          {
            success: false,
            message: "Seller account not found.",
          },
          { status: 404 }
        );
      }

      sellerId = seller.id;
    }

    const [product, categories, brands] =
      await Promise.all([
        prisma.product.findUnique({
          where: {
            id,
          },

          include: {
            Category: {
              select: {
                id: true,
                name: true,
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

            Seller: {
              select: {
                id: true,
                storeName: true,
                slug: true,
                status: true,
              },
            },

            Inventory: {
              select: {
                quantity: true,
                reserved: true,
              },
            },
          },
        }),

        prisma.category.findMany({
          orderBy: {
            name: "asc",
          },

          select: {
            id: true,
            name: true,
          },
        }),

        prisma.brand.findMany({
          orderBy: {
            name: "asc",
          },

          select: {
            id: true,
            name: true,
          },
        }),
      ]);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    if (
      sessionUser.role === "SELLER" &&
      product.sellerId !== sellerId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to view this product.",
        },
        { status: 403 }
      );
    }

    /*
     * LOAD FLASH SALE
     */
    let flashSaleProduct = null;

    if (product.isFlashSale) {
      flashSaleProduct =
        await prisma.flashSaleProduct.findFirst({
          where: {
            productId: product.id,

            FlashSale: {
              isActive: true,
            },
          },

          include: {
            FlashSale: true,
          },
        });

      /*
       * If there is no currently active Flash Sale,
       * load the latest configured Flash Sale.
       */
      if (!flashSaleProduct) {
        flashSaleProduct =
          await prisma.flashSaleProduct.findFirst({
            where: {
              productId: product.id,
            },

            orderBy: {
              FlashSale: {
                startsAt: "desc",
              },
            },

            include: {
              FlashSale: true,
            },
          });
      }
    }

    return NextResponse.json({
      success: true,

      categories,

      brands,

      product: {
        id: product.id,

        name: product.name,

        slug: product.slug,

        description: product.description,

        sku: product.sku,

        price: Number(product.price),

        compareAtPrice:
          product.compareAtPrice !== null
            ? Number(product.compareAtPrice)
            : null,

        stockQuantity: product.stockQuantity,

        status: product.status,

        isFeatured: product.isFeatured,

        isFlashSale: product.isFlashSale,

        category: product.Category
          ? {
              id: product.Category.id,
              name: product.Category.name,
            }
          : null,

        brand: product.Brand
          ? {
              id: product.Brand.id,
              name: product.Brand.name,
            }
          : null,

        images: product.ProductImage,

        inventory: product.Inventory
          ? {
              quantity:
                product.Inventory.quantity,

              reserved:
                product.Inventory.reserved,
            }
          : null,

        seller: product.Seller
          ? {
              id: product.Seller.id,

              storeName:
                product.Seller.storeName,

              slug: product.Seller.slug,

              status:
                product.Seller.status,
            }
          : null,

        flashSale: flashSaleProduct
          ? {
              id: flashSaleProduct.id,

              salePrice: Number(
                flashSaleProduct.salePrice
              ),

              stockLimit:
                flashSaleProduct.stockLimit,

              soldQuantity:
                flashSaleProduct.soldQuantity,

              flashSaleId:
                flashSaleProduct.FlashSale.id,

              name:
                flashSaleProduct.FlashSale.name,

              description:
                flashSaleProduct.FlashSale
                  .description,

              startsAt:
                flashSaleProduct.FlashSale
                  .startsAt,

              endsAt:
                flashSaleProduct.FlashSale
                  .endsAt,

              isActive:
                flashSaleProduct.FlashSale
                  .isActive,
            }
          : null,
      },
    });
  } catch (error) {
    console.error(
      "SELLER PRODUCT GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to load product.",
      },
      { status: 500 }
    );
  }
}

/*
 * PUT / EDIT PRODUCT
 */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    if (sessionUser.role !== "SELLER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only sellers can edit products.",
        },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        userId: sessionUser.userId,
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller account not found.",
        },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your seller account is not approved.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          Inventory: true,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    if (existingProduct.sellerId !== seller.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to edit this product.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    /*
     * BASIC PRODUCT FIELDS
     */

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const categoryId =
      typeof body.categoryId === "string"
        ? body.categoryId.trim()
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

    /*
     * FLASH SALE
     */

    const requestedFlashSale =
      body.isFlashSale === true;

    const flashSalePrice =
      body.flashSalePrice !== "" &&
      body.flashSalePrice !== null &&
      body.flashSalePrice !== undefined
        ? Number(body.flashSalePrice)
        : null;

    const flashSaleStart =
      typeof body.flashSaleStart === "string" &&
      body.flashSaleStart.trim()
        ? body.flashSaleStart.trim()
        : null;

    const flashSaleEnd =
      typeof body.flashSaleEnd === "string" &&
      body.flashSaleEnd.trim()
        ? body.flashSaleEnd.trim()
        : null;

    const flashSaleStockLimit =
      body.flashSaleStockLimit !== "" &&
      body.flashSaleStockLimit !== null &&
      body.flashSaleStockLimit !== undefined
        ? Number(body.flashSaleStockLimit)
        : null;

    /*
     * NORMAL VALIDATION
     */

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid product price.",
        },
        { status: 400 }
      );
    }

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) ||
        compareAtPrice <= 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid compare-at price.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid stock quantity.",
        },
        { status: 400 }
      );
    }

    /*
     * CATEGORY
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
          success: false,
          message:
            "Selected category was not found.",
        },
        { status: 400 }
      );
    }

    /*
     * BRAND
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
            success: false,
            message:
              "Selected brand was not found.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * SKU
     */

    if (sku) {
      const existingSku =
        await prisma.product.findFirst({
          where: {
            sku,

            NOT: {
              id: existingProduct.id,
            },
          },
        });

      if (existingSku) {
        return NextResponse.json(
          {
            success: false,
            message:
              "That SKU is already in use.",
          },
          { status: 409 }
        );
      }
    }

    /*
     * EXISTING FLASH SALE
     */

    const existingFlashSaleProduct =
      await prisma.flashSaleProduct.findFirst({
        where: {
          productId: existingProduct.id,
        },

        include: {
          FlashSale: true,
        },
      });

    /*
     * FINAL FLASH SALE STATE
     */

    const isFlashSale =
      requestedFlashSale;

    let parsedFlashSaleStart:
      Date | null = null;

    let parsedFlashSaleEnd:
      Date | null = null;

    /*
     * FLASH SALE VALIDATION
     */

    if (isFlashSale) {
      if (
        flashSalePrice === null ||
        !Number.isFinite(flashSalePrice) ||
        flashSalePrice <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Enter a valid Flash Sale price.",

            field:
              "flashSalePrice",
          },
          { status: 400 }
        );
      }

      if (flashSalePrice >= price) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale price must be lower than the normal product price.",

            field:
              "flashSalePrice",
          },
          { status: 400 }
        );
      }

      if (!flashSaleStart) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale start date and time are required.",

            field:
              "flashSaleStart",
          },
          { status: 400 }
        );
      }

      if (!flashSaleEnd) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale end date and time are required.",

            field:
              "flashSaleEnd",
          },
          { status: 400 }
        );
      }

      parsedFlashSaleStart =
        new Date(flashSaleStart);

      parsedFlashSaleEnd =
        new Date(flashSaleEnd);

      if (
        Number.isNaN(
          parsedFlashSaleStart.getTime()
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale start date is invalid.",

            field:
              "flashSaleStart",
          },
          { status: 400 }
        );
      }

      if (
        Number.isNaN(
          parsedFlashSaleEnd.getTime()
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale end date is invalid.",

            field:
              "flashSaleEnd",
          },
          { status: 400 }
        );
      }

      if (
        parsedFlashSaleEnd <=
        parsedFlashSaleStart
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale end time must be after the start time.",

            field:
              "flashSaleEnd",
          },
          { status: 400 }
        );
      }

      if (
        flashSaleStockLimit === null ||
        !Number.isInteger(
          flashSaleStockLimit
        ) ||
        flashSaleStockLimit <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Enter a valid Flash Sale stock limit.",

            field:
              "flashSaleStockLimit",
          },
          { status: 400 }
        );
      }

      if (
        flashSaleStockLimit >
        stockQuantity
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Flash Sale stock limit cannot be greater than the available product stock.",

            field:
              "flashSaleStockLimit",
          },
          { status: 400 }
        );
      }
    }

    /*
     * SAVE EVERYTHING
     */

    const updatedProduct =
      await prisma.$transaction(
        async (transaction) => {
          /*
           * UPDATE PRODUCT
           */

          const product =
            await transaction.product.update({
              where: {
                id: existingProduct.id,
              },

              data: {
                name,

                categoryId,

                brandId,

                description:
                  description || null,

                sku,

                price,

                compareAtPrice,

                stockQuantity,

                isFeatured,

                isFlashSale,
              },

              include: {
                Category: {
                  select: {
                    id: true,
                    name: true,
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
                },

                Inventory: true,
              },
            });

          /*
           * UPDATE INVENTORY
           */

          if (existingProduct.Inventory) {
            await transaction.inventory.update({
              where: {
                id:
                  existingProduct
                    .Inventory.id,
              },

              data: {
                quantity:
                  stockQuantity,
              },
            });
          } else {
            await transaction.inventory.create({
              data: {
                productId:
                  existingProduct.id,

                quantity:
                  stockQuantity,

                reserved: 0,
              },
            });
          }

          /*
           * ENABLE / UPDATE FLASH SALE
           */

          if (
            isFlashSale &&
            parsedFlashSaleStart &&
            parsedFlashSaleEnd &&
            flashSalePrice !== null &&
            flashSaleStockLimit !== null
          ) {
            const now = new Date();

            const saleIsCurrentlyActive =
              parsedFlashSaleStart <= now &&
              parsedFlashSaleEnd > now;

            /*
             * UPDATE EXISTING FLASH SALE
             */

            if (existingFlashSaleProduct) {
              await transaction.flashSale.update({
                where: {
                  id:
                    existingFlashSaleProduct
                      .FlashSale.id,
                },

                data: {
                  name:
                    `${name} Flash Sale`,

                  description:
                    `Limited-time Flash Sale for ${name}`,

                  startsAt:
                    parsedFlashSaleStart,

                  endsAt:
                    parsedFlashSaleEnd,

                  isActive:
                    saleIsCurrentlyActive,

                  updatedAt:
                    new Date(),
                },
              });

              /*
               * IMPORTANT:
               * FlashSaleProduct DOES NOT have updatedAt.
               */
              await transaction.flashSaleProduct.update({
                where: {
                  id:
                    existingFlashSaleProduct.id,
                },

                data: {
                  salePrice:
                    flashSalePrice,

                  stockLimit:
                    flashSaleStockLimit,
                },
              });
            } else {
              /*
               * CREATE NEW FLASH SALE
               */

              const flashSale =
                await transaction.flashSale.create({
                  data: {
                    id:
                      crypto.randomUUID(),

                    name:
                      `${name} Flash Sale`,

                    description:
                      `Limited-time Flash Sale for ${name}`,

                    startsAt:
                      parsedFlashSaleStart,

                    endsAt:
                      parsedFlashSaleEnd,

                    isActive:
                      saleIsCurrentlyActive,

                    updatedAt:
                      new Date(),
                  },
                });

              /*
               * FlashSaleProduct does NOT have updatedAt.
               */
              await transaction.flashSaleProduct.create({
                data: {
                  id:
                    crypto.randomUUID(),

                  flashSaleId:
                    flashSale.id,

                  productId:
                    existingProduct.id,

                  salePrice:
                    flashSalePrice,

                  stockLimit:
                    flashSaleStockLimit,

                  soldQuantity:
                    0,
                },
              });
            }
          }

          /*
           * DISABLE FLASH SALE
           */

          if (
            !isFlashSale &&
            existingFlashSaleProduct
          ) {
            /*
             * FlashSale itself HAS updatedAt.
             */
            await transaction.flashSale.update({
              where: {
                id:
                  existingFlashSaleProduct
                    .FlashSale.id,
              },

              data: {
                isActive: false,

                updatedAt:
                  new Date(),
              },
            });

            /*
             * FlashSaleProduct does NOT have updatedAt.
             *
             * We don't need to update it.
             */
          }

          return product;
        }
      );

    /*
     * LOAD LATEST FLASH SALE
     */

    let flashSaleProduct = null;

    if (updatedProduct.isFlashSale) {
      flashSaleProduct =
        await prisma.flashSaleProduct.findFirst({
          where: {
            productId:
              updatedProduct.id,
          },

          orderBy: {
            FlashSale: {
              startsAt: "desc",
            },
          },

          include: {
            FlashSale: true,
          },
        });
    }

    /*
     * RETURN UPDATED PRODUCT
     */

    return NextResponse.json(
      {
        success: true,

        message:
          "Product updated successfully.",

        product: {
          id:
            updatedProduct.id,

          name:
            updatedProduct.name,

          slug:
            updatedProduct.slug,

          description:
            updatedProduct.description,

          sku:
            updatedProduct.sku,

          price:
            Number(
              updatedProduct.price
            ),

          compareAtPrice:
            updatedProduct.compareAtPrice !==
            null
              ? Number(
                  updatedProduct.compareAtPrice
                )
              : null,

          stockQuantity:
            updatedProduct.stockQuantity,

          status:
            updatedProduct.status,

          isFeatured:
            updatedProduct.isFeatured,

          isFlashSale:
            updatedProduct.isFlashSale,

          category:
            updatedProduct.Category,

          brand:
            updatedProduct.Brand,

          images:
            updatedProduct.ProductImage,

          inventory:
            updatedProduct.Inventory
              ? {
                  quantity:
                    updatedProduct
                      .Inventory.quantity,

                  reserved:
                    updatedProduct
                      .Inventory.reserved,
                }
              : null,

          flashSale:
            flashSaleProduct
              ? {
                  id:
                    flashSaleProduct.id,

                  salePrice:
                    Number(
                      flashSaleProduct
                        .salePrice
                    ),

                  stockLimit:
                    flashSaleProduct
                      .stockLimit,

                  soldQuantity:
                    flashSaleProduct
                      .soldQuantity,

                  flashSaleId:
                    flashSaleProduct
                      .FlashSale.id,

                  name:
                    flashSaleProduct
                      .FlashSale.name,

                  description:
                    flashSaleProduct
                      .FlashSale.description,

                  startsAt:
                    flashSaleProduct
                      .FlashSale.startsAt,

                  endsAt:
                    flashSaleProduct
                      .FlashSale.endsAt,

                  isActive:
                    flashSaleProduct
                      .FlashSale.isActive,
                }
              : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SELLER PRODUCT UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to update product.",
      },
      { status: 500 }
    );
  }
}

/*
 * POST PRODUCT IMAGE
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const sessionUser =
      await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    if (sessionUser.role !== "SELLER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only sellers can upload product images.",
        },
        { status: 403 }
      );
    }

    const seller =
      await prisma.seller.findUnique({
        where: {
          userId:
            sessionUser.userId,
        },

        select: {
          id: true,
          status: true,
        },
      });

    if (!seller) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Seller account not found.",
        },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your seller account is not approved.",
        },
        { status: 403 }
      );
    }

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          ProductImage: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    if (product.sellerId !== seller.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to modify this product.",
        },
        { status: 403 }
      );
    }

    if (product.ProductImage.length >= 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can have a maximum of 10 images per product.",
        },
        { status: 400 }
      );
    }

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select an image.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image must be smaller than 5MB.",
        },
        { status: 400 }
      );
    }

    const supabase =
      getSupabaseAdmin();

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
        ? "webp"
        : "jpg";

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    const storagePath =
      `${product.id}/${fileName}`;

    const fileBuffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("product-images")
        .upload(
          storagePath,
          fileBuffer,
          {
            contentType:
              file.type,

            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        "SUPABASE PRODUCT IMAGE UPLOAD ERROR:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to upload image to storage.",
        },
        { status: 500 }
      );
    }

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("product-images")
        .getPublicUrl(
          storagePath
        );

    const imageUrl =
      publicUrlData.publicUrl;

    const nextSortOrder =
      product.ProductImage.length;

    /*
     * CREATE DATABASE IMAGE RECORD
     */
    const image =
      await prisma.productImage.create({
        data: {
          id: crypto.randomUUID(),

          productId:
            product.id,

          url:
            imageUrl,

          altText:
            product.name,

          sortOrder:
            nextSortOrder,
        },
      });

    return NextResponse.json(
      {
        success: true,

        message:
          "Product image uploaded successfully.",

        image: {
          id:
            image.id,

          url:
            image.url,

          altText:
            image.altText,

          sortOrder:
            image.sortOrder,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SELLER PRODUCT IMAGE UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to upload product image.",
      },
      { status: 500 }
    );
  }
}

/*
 * DELETE PRODUCT IMAGE
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const sessionUser =
      await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first.",
        },
        { status: 401 }
      );
    }

    if (sessionUser.role !== "SELLER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only sellers can delete product images.",
        },
        { status: 403 }
      );
    }

    const seller =
      await prisma.seller.findUnique({
        where: {
          userId:
            sessionUser.userId,
        },

        select: {
          id: true,
          status: true,
        },
      });

    if (!seller) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Seller account not found.",
        },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your seller account is not approved.",
        },
        { status: 403 }
      );
    }

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const imageId =
      searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image ID is required.",
        },
        { status: 400 }
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          sellerId: true,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    if (product.sellerId !== seller.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to modify this product.",
        },
        { status: 403 }
      );
    }

    const image =
      await prisma.productImage.findFirst({
        where: {
          id: imageId,
          productId:
            product.id,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product image not found.",
        },
        { status: 404 }
      );
    }

    /*
     * DELETE FROM SUPABASE STORAGE
     */
    try {
      const supabase =
        getSupabaseAdmin();

      const marker =
        "/storage/v1/object/public/product-images/";

      const markerIndex =
        image.url.indexOf(marker);

      if (markerIndex !== -1) {
        const storagePath =
          decodeURIComponent(
            image.url.slice(
              markerIndex +
                marker.length
            )
          );

        if (storagePath) {
          const {
            error: storageError,
          } =
            await supabase.storage
              .from("product-images")
              .remove([
                storagePath,
              ]);

          if (storageError) {
            console.error(
              "SUPABASE IMAGE DELETE ERROR:",
              storageError
            );
          }
        }
      }
    } catch (storageError) {
      console.error(
        "SUPABASE STORAGE DELETE ERROR:",
        storageError
      );
    }

    /*
     * DELETE DATABASE IMAGE RECORD
     */
    await prisma.productImage.delete({
      where: {
        id: image.id,
      },
    });

    /*
     * REORDER REMAINING IMAGES
     */
    const remainingImages =
      await prisma.productImage.findMany({
        where: {
          productId:
            product.id,
        },

        orderBy: {
          sortOrder: "asc",
        },

        select: {
          id: true,
        },
      });

    for (
      let index = 0;
      index < remainingImages.length;
      index++
    ) {
      await prisma.productImage.update({
        where: {
          id:
            remainingImages[index].id,
        },

        data: {
          sortOrder:
            index,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Product image deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE PRODUCT IMAGE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to delete product image.",
      },
      { status: 500 }
    );
  }
}