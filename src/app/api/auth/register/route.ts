import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const password = body.password;

    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        {
          success: false,
          message:
            "First name, last name, email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        passwordHash,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to create account",
      },
      { status: 500 }
    );
  }
}