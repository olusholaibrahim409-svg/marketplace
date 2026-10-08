import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const SECRET: string = JWT_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.passwordHash) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const passwordMatches = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return Response.json(
        {
          success: false,
          message: `Your account is ${user.status.toLowerCase()}`,
        },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET,
      {
        expiresIn: "7d",
      }
    );

    const cookieStore = await cookies();

    cookieStore.set("marketplace_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    let redirectTo = "/";

    if (user.role === "SELLER") {
      redirectTo = "/seller";
    }

    if (
      user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN"
    ) {
      redirectTo = "/admin";
    }

    return Response.json({
      success: true,
      message: "Login successful",
      redirectTo,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to login",
      },
      { status: 500 }
    );
  }
}