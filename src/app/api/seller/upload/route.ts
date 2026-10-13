import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER") {
      return NextResponse.json(
        {
          message: "Seller access required.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const files = formData.getAll("files").filter(
      (value): value is File => value instanceof File
    );

    if (files.length === 0) {
      return NextResponse.json(
        {
          message: "Please select at least one image.",
        },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        {
          message: "You can upload a maximum of 10 images.",
        },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            message: "Only JPG, PNG, WEBP and GIF images are allowed.",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            message: `Image "${file.name}" is larger than 5 MB.`,
          },
          { status: 400 }
        );
      }
    }

    // Initialize Supabase only when an authenticated seller uploads images.
    const supabaseAdmin = getSupabaseAdmin();

    const uploadedImages: {
      url: string;
      path: string;
      name: string;
    }[] = [];

    for (const file of files) {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeExtension =
        extension === "jpeg" ? "jpg" : extension;

      const uniqueName = `${crypto.randomUUID()}.${safeExtension}`;
      const filePath = `${user.userId}/${uniqueName}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from("product-images")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("SUPABASE IMAGE UPLOAD ERROR:", uploadError);

        return NextResponse.json(
          {
            message: "Unable to upload image. Please try again.",
          },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedImages.push({
        url: publicUrlData.publicUrl,
        path: filePath,
        name: file.name,
      });
    }

    return NextResponse.json({
      message: "Images uploaded successfully.",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("SELLER IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to upload images.",
      },
      { status: 500 }
    );
  }
}