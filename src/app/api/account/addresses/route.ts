
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

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
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
        message: "Failed to load addresses",
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
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phone?.trim() ||
      !addressLine1?.trim() ||
      !city?.trim() ||
      !state?.trim()
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

    const existingAddressCount = await prisma.address.count({
      where: {
        userId: session.userId,
      },
    });

    const shouldBeDefault =
      existingAddressCount === 0 || Boolean(isDefault);

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        country: country?.trim() || "Nigeria",
        postalCode: postalCode?.trim() || null,
        addressType: addressType || "HOME",
        deliveryInstructions:
          deliveryInstructions?.trim() || null,
        isDefault: shouldBeDefault,
      },
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
