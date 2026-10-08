
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const action =
      typeof body === "object" &&
      body !== null &&
      "action" in body &&
      typeof body.action === "string"
        ? body.action
        : "";

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          message:
            "Action must be approve or reject.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    if (product.status !== "PENDING") {
      return NextResponse.json(
        {
          message:
            "Only pending products can be approved or rejected.",
        },
        { status: 409 }
      );
    }

    const newStatus =
      action === "approve"
        ? "APPROVED"
        : "REJECTED";

    const updatedProduct =
      await prisma.product.update({
        where: {
          id,
        },
        data: {
          status: newStatus,
        },
        include: {
          seller: {
            select: {
              id: true,
              storeName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    return NextResponse.json({
      message:
        action === "approve"
          ? "Product approved successfully."
          : "Product rejected successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "ADMIN PRODUCT STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update product status.",
      },
      { status: 500 }
    );
  }
}
