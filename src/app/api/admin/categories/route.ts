import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(
  name: string,
  excludeId?: string
) {
  const baseSlug = slugify(name) || `category-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId
          ? {
              NOT: {
                id: excludeId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function checkAdmin() {
  const user = await getSessionUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN"
  ) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

/* GET CATEGORIES */
export async function GET() {
  try {
    const auth = await checkAdmin();

    if (auth.response) {
      return auth.response;
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
        other_Category: {
          select: {
            id: true,
          },
        },
        Product: {
          select: {
            id: true,
          },
        },
      },
    });

    const formattedCategories = categories.map(
      (category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,

        parent: category.Category
          ? {
              id: category.Category.id,
              name: category.Category.name,
            }
          : null,

        parentId: category.parentId,

        childrenCount:
          category.other_Category.length,

        productCount:
          category.Product.length,
      })
    );

    return NextResponse.json({
      categories: formattedCategories,
      count: formattedCategories.length,
    });
  } catch (error) {
    console.error(
      "ADMIN CATEGORIES GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load categories",
      },
      {
        status: 500,
      }
    );
  }
}

/* CREATE CATEGORY */
export async function POST(
  request: NextRequest
) {
  try {
    const auth = await checkAdmin();

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const description =
      body.description
        ? String(body.description).trim()
        : null;

    const imageUrl =
      body.imageUrl
        ? String(body.imageUrl).trim()
        : null;

    const parentId =
      body.parentId
        ? String(body.parentId)
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Category name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (parentId) {
      const parent =
        await prisma.category.findUnique({
          where: {
            id: parentId,
          },
          select: {
            id: true,
          },
        });

      if (!parent) {
        return NextResponse.json(
          {
            error: "Selected parent category does not exist",
          },
          {
            status: 400,
          }
        );
      }
    }

    const slug = await generateUniqueSlug(name);

    const category =
      await prisma.category.create({
        data: {
          id: crypto.randomUUID(),
          name,
          slug,
          description,
          imageUrl,
          parentId,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json(
      {
        message: "Category created successfully",
        category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN CATEGORY CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create category",
      },
      {
        status: 500,
      }
    );
  }
}

/* UPDATE CATEGORY */
export async function PATCH(
  request: NextRequest
) {
  try {
    const auth = await checkAdmin();

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();

    const id = String(body.id || "").trim();
    const name = String(body.name || "").trim();

    const description =
      body.description
        ? String(body.description).trim()
        : null;

    const imageUrl =
      body.imageUrl
        ? String(body.imageUrl).trim()
        : null;

    const parentId =
      body.parentId
        ? String(body.parentId)
        : null;

    if (!id) {
      return NextResponse.json(
        {
          error: "Category ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          error: "Category name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (parentId === id) {
      return NextResponse.json(
        {
          error:
            "A category cannot be its own parent",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    if (parentId) {
      const parent =
        await prisma.category.findUnique({
          where: {
            id: parentId,
          },
          select: {
            id: true,
          },
        });

      if (!parent) {
        return NextResponse.json(
          {
            error:
              "Selected parent category does not exist",
          },
          {
            status: 400,
          }
        );
      }
    }

    const slug = await generateUniqueSlug(
      name,
      id
    );

    const category =
      await prisma.category.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
          description,
          imageUrl,
          parentId,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(
      "ADMIN CATEGORY UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update category",
      },
      {
        status: 500,
      }
    );
  }
}

/* DELETE CATEGORY */
export async function DELETE(
  request: NextRequest
) {
  try {
    const auth = await checkAdmin();

    if (auth.response) {
      return auth.response;
    }

    const { searchParams } =
      new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Category ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },
        include: {
          Product: {
            select: {
              id: true,
            },
          },
          other_Category: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    if (category.Product.length > 0) {
      return NextResponse.json(
        {
          error:
            "This category cannot be deleted because it contains products. Move the products to another category first.",
        },
        {
          status: 400,
        }
      );
    }

    if (category.other_Category.length > 0) {
      return NextResponse.json(
        {
          error:
            "This category cannot be deleted because it contains subcategories. Delete or move the subcategories first.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(
      "ADMIN CATEGORY DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete category",
      },
      {
        status: 500,
      }
    );
  }
}