
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();

    if ("error" in auth) {
      return auth.error;
    }

    const { id } = await context.params;
    const body = await request.json();
    const action = body.action;

    /*
     * APPROVE / REJECT SELLER APPLICATION
     */
    if (action === "approve" || action === "reject") {
      const application = await prisma.sellerApplication.findUnique({
        where: { id },
      });

      if (!application) {
        return NextResponse.json(
          { message: "Seller application not found." },
          { status: 404 }
        );
      }

      if (application.status !== "PENDING") {
        return NextResponse.json(
          {
            message: `This application has already been ${application.status.toLowerCase()}.`,
          },
          { status: 409 }
        );
      }

      if (action === "reject") {
        const updatedApplication =
          await prisma.sellerApplication.update({
            where: { id: application.id },
            data: {
              status: "REJECTED",
              rejectionReason:
                typeof body.rejectionReason === "string" &&
                body.rejectionReason.trim()
                  ? body.rejectionReason.trim()
                  : "Seller application was not approved.",
              updatedAt: new Date(),
            },
          });

        return NextResponse.json({
          message: "Seller application rejected.",
          application: updatedApplication,
        });
      }

      /*
       * APPROVAL
       *
       * Create the Seller account and update the application
       * inside one database transaction.
       */
      const result = await prisma.$transaction(async (tx) => {
        const existingSeller = await tx.seller.findUnique({
          where: { userId: application.userId },
        });

        if (existingSeller) {
          throw new Error(
            "This customer already has a seller account."
          );
        }

        const baseSlug = createSlug(application.storeName);

        if (!baseSlug) {
          throw new Error(
            "The store name cannot be converted into a valid store slug."
          );
        }

        let slug = baseSlug;

        const existingSlug = await tx.seller.findUnique({
          where: { slug },
        });

        if (existingSlug) {
          slug = `${baseSlug}-${Date.now()}`;
        }

        const seller = await tx.seller.create({
          data: {
            id: randomUUID(),
            userId: application.userId,
            storeName: application.storeName,
            slug,
            phone: application.phone,
            status: "APPROVED",
            approvedAt: new Date(),
          },
        });

        const updatedApplication =
          await tx.sellerApplication.update({
            where: { id: application.id },
            data: {
              status: "APPROVED",
              updatedAt: new Date(),
            },
          });

        await tx.user.update({
          where: { id: application.userId },
          data: {
            role: "SELLER",
          },
        });

        return {
          seller,
          application: updatedApplication,
        };
      });

      return NextResponse.json({
        message:
          "Seller application approved successfully. Seller account created.",
        ...result,
      });
    }

    /*
     * EXISTING SELLER ACTIONS
     */
    if (action !== "suspend" && action !== "activate") {
      return NextResponse.json(
        {
          message:
            "Invalid action. Use approve, reject, suspend or activate.",
        },
        { status: 400 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Seller not found." },
        { status: 404 }
      );
    }

    const status: "SUSPENDED" | "APPROVED" =
      action === "suspend" ? "SUSPENDED" : "APPROVED";

    const updatedSeller = await prisma.seller.update({
      where: { id: seller.id },
      data: {
        status,
        approvedAt:
          status === "APPROVED"
            ? seller.approvedAt ?? new Date()
            : seller.approvedAt,
      },
    });

    return NextResponse.json({
      message:
        action === "suspend"
          ? "Seller suspended successfully."
          : "Seller activated successfully.",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("ADMIN SELLER ACTION ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to process seller action.";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
