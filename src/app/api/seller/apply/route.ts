import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to become a seller.",
        },
        { status: 401 }
      );
    }

    // Only customers can submit a new seller application.
    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message:
            user.role === "SELLER"
              ? "You already have a seller account."
              : "This account cannot submit a seller application.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    /*
     * Personal Information
     */
    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    /*
     * Store Information
     */
    const storeName =
      typeof body.storeName === "string"
        ? body.storeName.trim()
        : "";

    const storeDescription =
      typeof body.storeDescription === "string"
        ? body.storeDescription.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const productsToSell =
      typeof body.productsToSell === "string"
        ? body.productsToSell.trim()
        : "";

    /*
     * Business Information
     */
    const businessType =
      typeof body.businessType === "string"
        ? body.businessType.trim()
        : "";

    const businessAddress =
      typeof body.businessAddress === "string"
        ? body.businessAddress.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : "";

    const businessRegistration =
      typeof body.businessRegistration === "string"
        ? body.businessRegistration.trim()
        : null;

    /*
     * Verification Information
     */
    const identityType =
      typeof body.identityType === "string"
        ? body.identityType.trim()
        : "";

    const identityNumber =
      typeof body.identityNumber === "string"
        ? body.identityNumber.trim()
        : "";

    /*
     * Banking Information
     */
    const bankName =
      typeof body.bankName === "string"
        ? body.bankName.trim()
        : "";

    const accountName =
      typeof body.accountName === "string"
        ? body.accountName.trim()
        : "";

    const accountNumber =
      typeof body.accountNumber === "string"
        ? body.accountNumber.trim()
        : "";

    /*
     * Validate personal information.
     */
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your personal information.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate email.
     */
    if (!email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate store information.
     */
    if (
      !storeName ||
      !storeDescription ||
      !category ||
      !productsToSell
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your store information.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate business information.
     */
    if (
      !businessType ||
      !businessAddress ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your business information.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate verification and banking information.
     */
    if (
      !identityType ||
      !identityNumber ||
      !bankName ||
      !accountName ||
      !accountNumber
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your verification and banking information.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate Nigerian bank account number.
     */
    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "Bank account number must contain exactly 10 digits.",
        },
        { status: 400 }
      );
    }

    /*
     * Check whether the user already has a seller account.
     */
    const existingSeller = await prisma.seller.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (existingSeller) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have a seller account or seller record.",
        },
        { status: 409 }
      );
    }

    /*
     * Check whether the user already has a pending application.
     */
    const existingApplication =
      await prisma.sellerApplication.findFirst({
        where: {
          userId: user.userId,
          status: "PENDING",
        },
      });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have a pending seller application.",
        },
        { status: 409 }
      );
    }

    /*
     * Create seller application.
     *
     * IMPORTANT:
     * SellerApplication.id is required by the Prisma schema,
     * so we generate the ID manually using randomUUID().
     */
    const now = new Date();

    const application =
      await prisma.sellerApplication.create({
        data: {
          // Required primary key
          id: randomUUID(),

          // User
          userId: user.userId,

          // Personal Information
          firstName,
          lastName,
          email,
          phone,

          // Store Information
          storeName,
          storeDescription,
          category,
          productsToSell,

          // Business Information
          businessType,
          businessAddress,
          city,
          state,
          businessRegistration,

          // Verification
          identityType,
          identityNumber,

          // Banking
          bankName,
          accountName,
          accountNumber,

          // Business name
          businessName: storeName,

          // Application status
          status: "PENDING",

          // Timestamps
          createdAt: now,
          updatedAt: now,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Seller application submitted successfully.",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SELLER APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit seller application.",
      },
      { status: 500 }
    );
  }
}