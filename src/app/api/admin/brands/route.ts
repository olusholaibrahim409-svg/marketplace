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
  const baseSlug =
    slugify(name) || `brand-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing =
      await prisma.brand.findFirst({
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
      response: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    response: null,
  };
}

/* GET BRANDS */
export async function GET() {
  try {
    const auth = await checkAdmin();

    if (auth.response) {
      return auth.response;
    }

    const brands =
      await prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          Product: {
            select: {
              id: true,
            },
          },
        },
      });

    const formattedBrands = brands.map(
      (brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        description: brand.description,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
        productCount:
          brand.Product.length,
      })
    );

    return NextResponse.json({
      brands: formattedBrands,
      count: formattedBrands.length,
    });
  } catch (error) {
    console.error(
      "ADMIN BRANDS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load brands",
      },
      {
        status: 500,
      }
    );
  }
}

/* CREATE BRAND */
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

    const logoUrl =
      body.logoUrl
        ? String(body.logoUrl).trim()
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Brand name is required",
        },
        {
          status: 400,
        }
      );
    }

    const slug =
      await generateUniqueSlug(name);

    const brand =
      await prisma.brand.create({
        data: {
          id: crypto.randomUUID(),
          name,
          slug,
          logoUrl,
          description,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json(
      {
        message: "Brand created successfully",
        brand,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN BRAND CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create brand",
      },
      {
        status: 500,
      }
    );
  }
}

/* UPDATE BRAND */
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

    const logoUrl =
      body.logoUrl
        ? String(body.logoUrl).trim()
        : null;

    if (!id) {
      return NextResponse.json(
        {
          error: "Brand ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          error: "Brand name is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.brand.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Brand not found",
        },
        {
          status: 404,
        }
      );
    }

    const slug =
      await generateUniqueSlug(name, id);

    const brand =
      await prisma.brand.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
          logoUrl,
          description,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error(
      "ADMIN BRAND UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update brand",
      },
      {
        status: 500,
      }
    );
  }
}

/* DELETE BRAND */
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
          error: "Brand ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const brand =
      await prisma.brand.findUnique({
        where: {
          id,
        },
        include: {
          Product: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!brand) {
      return NextResponse.json(
        {
          error: "Brand not found",
        },
        {
          status: 404,
        }
      );
    }

    if (brand.Product.length > 0) {
      return NextResponse.json(
        {
          error:
            "This brand cannot be deleted because it is assigned to products. Remove the brand from those products first.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.brand.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error(
      "ADMIN BRAND DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete brand",
      },
      {
        status: 500,
      }
    );
  }
}