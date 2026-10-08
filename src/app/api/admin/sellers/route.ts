import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function requireAdmin() {
  const user = await getSessionUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return {
      error: NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export async function GET() {
  try {
    const auth = await requireAdmin();

    if ("error" in auth) {
      return auth.error;
    }

    const [sellers, applications] = await Promise.all([
      prisma.seller.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
              commissions: true,
              payouts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.sellerApplication.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      sellers,
      applications,
    });
  } catch (error) {
    console.error("GET ADMIN SELLERS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load sellers.",
      },
      { status: 500 }
    );
  }
}