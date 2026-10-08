import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function createSellerSlug(storeName: string) {
  const baseSlug = storeName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseSlug || "seller"}-${randomUUID()
    .slice(0, 8)
    .toLowerCase()}`;
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    // --------------------------------------------------
    // 1. CHECK ADMIN SESSION
    // --------------------------------------------------
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    if (
      sessionUser.role !== "ADMIN" &&
      sessionUser.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only administrators can review seller applications.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 2. GET APPLICATION ID
    // --------------------------------------------------
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3. GET REQUEST BODY
    // --------------------------------------------------
    let body: {
      action?: string;
      rejectionReason?: string;
    } = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const action = body.action;

    if (
      action !== "APPROVE" &&
      action !== "REJECT"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid application action.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 4. GET APPLICATION
    // --------------------------------------------------
    const application =
      await prisma.sellerApplication.findUnique({
        where: {
          id,
        },
      });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Seller application not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 5. PREVENT REPROCESSING
    // --------------------------------------------------
    if (application.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            `This application has already been ${application.status.toLowerCase()}.`,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. REJECT APPLICATION
    // --------------------------------------------------
    if (action === "REJECT") {
      const rejectionReason =
        typeof body.rejectionReason === "string"
          ? body.rejectionReason.trim()
          : "";

      if (!rejectionReason) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A rejection reason is required.",
          },
          { status: 400 }
        );
      }

      await prisma.sellerApplication.update({
        where: {
          id,
        },

        data: {
          status: "REJECTED",
          rejectionReason,
          updatedAt: new Date(),
        },
      });

      revalidatePath(
        "/admin/seller-applications"
      );

      revalidatePath(
        `/admin/seller-applications/${id}`
      );

      return NextResponse.json({
        success: true,
        message:
          "Seller application rejected successfully.",
      });
    }

    // --------------------------------------------------
    // 7. APPROVE APPLICATION
    // --------------------------------------------------
    const sellerSlug =
      createSellerSlug(
        application.storeName
      );

    const result =
      await prisma.$transaction(
        async (tx) => {
          // --------------------------------------------
          // Check whether seller already exists
          // --------------------------------------------
          const existingSeller =
            await tx.seller.findUnique({
              where: {
                userId:
                  application.userId,
              },
            });

          if (existingSeller) {
            throw new Error(
              "A seller account already exists for this applicant."
            );
          }

          // --------------------------------------------
          // Check that the user exists
          // --------------------------------------------
          const applicant =
            await tx.user.findUnique({
              where: {
                id: application.userId,
              },
            });

          if (!applicant) {
            throw new Error(
              "The applicant's user account could not be found."
            );
          }

          // --------------------------------------------
          // Create seller
          // --------------------------------------------
          const seller =
            await tx.seller.create({
              data: {
                id: randomUUID(),

                userId:
                  application.userId,

                storeName:
                  application.storeName,

                slug:
                  sellerSlug,

                description:
                  application.storeDescription,

                phone:
                  application.phone,

                status: "APPROVED",

                approvedAt:
                  new Date(),
              },
            });

          // --------------------------------------------
          // Change user role
          // --------------------------------------------
          const updatedUser =
            await tx.user.update({
              where: {
                id: application.userId,
              },

              data: {
                role: "SELLER",
                updatedAt: new Date(),
              },
            });

          // --------------------------------------------
          // Approve application
          // --------------------------------------------
          const updatedApplication =
            await tx.sellerApplication.update({
              where: {
                id,
              },

              data: {
                status: "APPROVED",

                rejectionReason:
                  null,

                updatedAt:
                  new Date(),
              },
            });

          return {
            seller,
            updatedUser,
            updatedApplication,
          };
        }
      );

    // --------------------------------------------------
    // 8. REFRESH ADMIN PAGES
    // --------------------------------------------------
    revalidatePath(
      "/admin/seller-applications"
    );

    revalidatePath(
      `/admin/seller-applications/${id}`
    );

    revalidatePath("/seller");

    // --------------------------------------------------
    // 9. SUCCESS
    // --------------------------------------------------
    return NextResponse.json({
      success: true,

      message:
        "Seller application approved successfully.",

      seller: {
        id: result.seller.id,
        storeName:
          result.seller.storeName,
        slug:
          result.seller.slug,
        status:
          result.seller.status,
      },

      application: {
        id:
          result.updatedApplication.id,
        status:
          result.updatedApplication.status,
      },

      user: {
        id:
          result.updatedUser.id,
        role:
          result.updatedUser.role,
      },
    });
  } catch (error) {
    console.error(
      "SELLER APPLICATION REVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to process seller application.",
      },
      { status: 500 }
    );
  }
}