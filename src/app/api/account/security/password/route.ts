import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { comparePassword, hashPassword } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    // Check whether the customer is logged in
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please log in again.",
        },
        { status: 401 }
      );
    }

    // Read request body
    const body = await request.json();

    const currentPassword = body?.currentPassword;
    const newPassword = body?.newPassword;

    // Validate input
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password and new password are required.",
        },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all password fields.",
        },
        { status: 400 }
      );
    }

    // Password length requirement
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Your new password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // Prevent using the same password
    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    // Get current user's password hash
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found.",
        },
        { status: 404 }
      );
    }

    // Make sure the account has a password
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account does not currently have a password. Please use the appropriate account recovery method.",
        },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Your current password is incorrect.",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const newPasswordHash = await hashPassword(newPassword);

    // Save the new password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been changed successfully.",
    });
  } catch (error) {
    console.error(
      "PATCH /api/account/security/password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while changing your password.",
      },
      { status: 500 }
    );
  }
}