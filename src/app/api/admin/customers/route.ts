
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const formattedCustomers = customers.map((customer) => {
      const orders = customer.Order || [];

      const totalSpent = orders.reduce(
        (sum, order) => {
          return sum + Number(order.total);
        },
        0
      );

      const completedOrders = orders.filter(
        (order) => order.status === "DELIVERED"
      ).length;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        imageUrl: customer.imageUrl,
        createdAt: customer.createdAt,

        orderCount: orders.length,

        completedOrders,

        totalSpent,

        orders: orders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          total: Number(order.total),
          status: order.status,
          createdAt: order.createdAt,
        })),
      };
    });

    const totalCustomers = formattedCustomers.length;

    const customersWithOrders = formattedCustomers.filter(
      (customer) => customer.orderCount > 0
    ).length;

    const totalRevenue = formattedCustomers.reduce(
      (sum, customer) => {
        return sum + customer.totalSpent;
      },
      0
    );

    return NextResponse.json({
      customers: formattedCustomers,

      summary: {
        totalCustomers,
        customersWithOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("ADMIN CUSTOMERS GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load customers",
      },
      {
        status: 500,
      }
    );
  }
}
