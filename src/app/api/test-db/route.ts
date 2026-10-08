import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();

    return Response.json({
      success: true,
      message: "Database connection successful",
      users: userCount,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}