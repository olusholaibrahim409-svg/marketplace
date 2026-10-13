
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
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

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET /api/account/addresses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load addresses.",
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

    const {
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      addressType,
      deliveryInstructions,
      isDefault,
    } = body;

    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof addressLine1 !== "string" ||
      !addressLine1.trim() ||
      typeof city !== "string" ||
      !city.trim() ||
      typeof state !== "string" ||
      !state.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name, last name, phone, address, city and state are required.",
        },
        { status: 400 }
      );
    }

    const allowedAddressTypes = ["HOME", "OFFICE", "OTHER"];

    const normalizedAddressType =
      typeof addressType === "string" &&
      allowedAddressTypes.includes(addressType)
        ? addressType
        : "HOME";

    const now = new Date();

    const address = await prisma.$transaction(async (tx) => {
      const existingAddressCount = await tx.address.count({
        where: {
          userId: session.userId,
        },
      });

      const shouldBeDefault =
        existingAddressCount === 0 || isDefault === true;

      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: {
            userId: session.userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.create({
        data: {
          id: randomUUID(),
          userId: session.userId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2:
            typeof addressLine2 === "string"
              ? addressLine2.trim() || null
              : null,
          city: city.trim(),
          state: state.trim(),
          country:
            typeof country === "string" && country.trim()
              ? country.trim()
              : "Nigeria",
          postalCode:
            typeof postalCode === "string"
              ? postalCode.trim() || null
              : null,
          addressType: normalizedAddressType as
            | "HOME"
            | "OFFICE"
            | "OTHER",
          deliveryInstructions:
            typeof deliveryInstructions === "string"
              ? deliveryInstructions.trim() || null
              : null,
          isDefault: shouldBeDefault,
          createdAt: now,
          updatedAt: now,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address saved successfully.",
        address,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/account/addresses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save address.",
      },
      { status: 500 }
    );
  }
}
