import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      session.role !== "SELLER" &&
      session.role !== "ADMIN" &&
      session.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          message: "You are not authorized to access seller settings.",
        },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        userId: session.userId,
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
        {
          message: "Seller profile not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      seller,
    });
  } catch (error) {
    console.error("SELLER STORE GET ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load store settings.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      session.role !== "SELLER" &&
      session.role !== "ADMIN" &&
      session.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          message: "You are not authorized to update seller settings.",
        },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        userId: session.userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        {
          message: "Seller profile not found.",
        },
        { status: 404 }
      );
    }

    if (
      session.role === "SELLER" &&
      seller.status !== "APPROVED"
    ) {
      return NextResponse.json(
        {
          message:
            "Your seller account must be approved before you can update your store.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const storeName =
      typeof body.storeName === "string"
        ? body.storeName.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim().toLowerCase()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : null;

    const logoUrl =
      typeof body.logoUrl === "string"
        ? body.logoUrl.trim()
        : null;

    if (!storeName) {
      return NextResponse.json(
        {
          message: "Store name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          message: "Store slug is required.",
        },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          message:
            "Store slug can only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    const existingSeller = await prisma.seller.findFirst({
      where: {
        slug,
        NOT: {
          id: seller.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingSeller) {
      return NextResponse.json(
        {
          message: "That store slug is already being used.",
        },
        { status: 409 }
      );
    }

    const updatedSeller = await prisma.seller.update({
      where: {
        id: seller.id,
      },
      data: {
        storeName,
        slug,
        description: description || null,
        phone: phone || null,
        logoUrl: logoUrl || null,
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

    return NextResponse.json({
      message: "Store settings updated successfully.",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("SELLER STORE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update store settings.",
      },
      { status: 500 }
    );
  }
}