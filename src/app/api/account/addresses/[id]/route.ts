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

    const { id } = await context.params;
    const body = await request.json();

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found.",
        },
        { status: 404 }
      );
    }

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
      firstName !== undefined &&
      !String(firstName).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "First name cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (
      lastName !== undefined &&
      !String(lastName).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Last name cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (
      phone !== undefined &&
      !String(phone).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (
      addressLine1 !== undefined &&
      !String(addressLine1).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Address cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (
      city !== undefined &&
      !String(city).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "City cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (
      state !== undefined &&
      !String(state).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "State cannot be empty.",
        },
        { status: 400 }
      );
    }

    /*
     * SET DEFAULT ADDRESS
     *
     * If this address is being made default,
     * remove default status from all other
     * addresses belonging to this user.
     */
    if (isDefault === true) {
      await prisma.address.updateMany({
        where: {
          userId: session.userId,
          isDefault: true,
          NOT: {
            id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        ...(firstName !== undefined && {
          firstName: String(firstName).trim(),
        }),

        ...(lastName !== undefined && {
          lastName: String(lastName).trim(),
        }),

        ...(phone !== undefined && {
          phone: String(phone).trim(),
        }),

        ...(addressLine1 !== undefined && {
          addressLine1: String(addressLine1).trim(),
        }),

        ...(addressLine2 !== undefined && {
          addressLine2:
            String(addressLine2).trim() || null,
        }),

        ...(city !== undefined && {
          city: String(city).trim(),
        }),

        ...(state !== undefined && {
          state: String(state).trim(),
        }),

        ...(country !== undefined && {
          country:
            String(country).trim() || "Nigeria",
        }),

        ...(postalCode !== undefined && {
          postalCode:
            String(postalCode).trim() || null,
        }),

        ...(addressType !== undefined && {
          addressType,
        }),

        ...(deliveryInstructions !== undefined && {
          deliveryInstructions:
            String(deliveryInstructions).trim() || null,
        }),

        ...(isDefault !== undefined && {
          isDefault: Boolean(isDefault),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address updated successfully.",
      address: updatedAddress,
    });
  } catch (error) {
    console.error(
      "PATCH /api/account/addresses/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update address.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found.",
        },
        { status: 404 }
      );
    }

    const addressCount = await prisma.address.count({
      where: {
        userId: session.userId,
      },
    });

    if (addressCount === 1) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot delete your only saved address. Add another address first.",
        },
        { status: 400 }
      );
    }

    /*
     * Try to delete the address.
     *
     * If an existing order is using this address,
     * Prisma will throw P2003 because of the
     * Order_addressId_fkey foreign key.
     */
    try {
      await prisma.address.delete({
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2003"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This address is linked to an existing order and cannot be deleted. You can keep it for your order history.",
          },
          { status: 400 }
        );
      }

      throw error;
    }

    /*
     * If the deleted address was the default address,
     * automatically make the newest remaining address
     * the default address.
     */
    if (address.isDefault) {
      const replacement = await prisma.address.findFirst({
        where: {
          userId: session.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (replacement) {
        await prisma.address.update({
          where: {
            id: replacement.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/account/addresses/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete address.",
      },
      { status: 500 }
    );
  }
}