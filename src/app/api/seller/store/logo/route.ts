import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only sellers can upload a store logo." },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.userId },
      select: {
        id: true,
        status: true,
        logoUrl: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Seller profile not found." },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        {
          message:
            "Your seller account must be approved before uploading a store logo.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please select a logo image." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message: "Only JPG, PNG, and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Logo image must be 5MB or smaller." },
        { status: 400 }
      );
    }

    // Initialize Supabase only when the API is called.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      console.error(
        "Store logo upload: Supabase environment variables are missing."
      );

      return NextResponse.json(
        { message: "Store logo upload is not configured." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseSecretKey
    );

    const extension =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : "webp";

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `seller-logos/${seller.id}/${fileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("SELLER LOGO UPLOAD ERROR:", uploadError);

      return NextResponse.json(
        { message: "Unable to upload store logo." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const logoUrl = publicUrlData.publicUrl;

    const updatedSeller = await prisma.seller.update({
      where: { id: seller.id },
      data: { logoUrl },
      select: {
        id: true,
        storeName: true,
        slug: true,
        description: true,
        logoUrl: true,
        phone: true,
        status: true,
      },
    });

    return NextResponse.json({
      message: "Store logo uploaded successfully.",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("STORE LOGO API ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload store logo.",
      },
      { status: 500 }
    );
  }
}