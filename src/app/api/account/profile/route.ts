import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { createClient } from "@supabase/supabase-js";

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

const PROFILE_BUCKET = "avatars";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function PATCH(request: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const image = formData.get("image");

    if (!firstName || !lastName) {
      return Response.json(
        {
          success: false,
          message: "First name and last name are required.",
        },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (image instanceof File && image.size > 0) {
      if (image.size > MAX_FILE_SIZE) {
        return Response.json(
          {
            success: false,
            message: "Profile image must be 5MB or smaller.",
          },
          { status: 400 }
        );
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedTypes.includes(image.type)) {
        return Response.json(
          {
            success: false,
            message: "Please upload a JPG, PNG, WEBP, or GIF image.",
          },
          { status: 400 }
        );
      }

      // Create the Supabase client only when an image upload is needed.
      const supabaseAdmin = getSupabaseAdmin();

      const { data: existingBuckets, error: listBucketsError } =
        await supabaseAdmin.storage.listBuckets();

      if (listBucketsError) {
        console.error("PROFILE BUCKET LIST ERROR:", listBucketsError);

        return Response.json(
          {
            success: false,
            message: "Unable to access profile image storage.",
          },
          { status: 500 }
        );
      }

      const bucketExists = existingBuckets?.some(
        (bucket) => bucket.name === PROFILE_BUCKET
      );

      if (!bucketExists) {
        const { error: bucketError } =
          await supabaseAdmin.storage.createBucket(PROFILE_BUCKET, {
            public: true,
            fileSizeLimit: MAX_FILE_SIZE,
            allowedMimeTypes: allowedTypes,
          });

        if (
          bucketError &&
          !bucketError.message.toLowerCase().includes("already exists")
        ) {
          console.error("PROFILE BUCKET ERROR:", bucketError);

          return Response.json(
            {
              success: false,
              message: "Unable to prepare profile image storage.",
            },
            { status: 500 }
          );
        }
      }

      const extension =
        image.type === "image/png"
          ? "png"
          : image.type === "image/webp"
            ? "webp"
            : image.type === "image/gif"
              ? "gif"
              : "jpg";

      const filePath = `profiles/${session.userId}-${Date.now()}.${extension}`;
      const arrayBuffer = await image.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from(PROFILE_BUCKET)
        .upload(filePath, arrayBuffer, {
          contentType: image.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("PROFILE IMAGE UPLOAD ERROR:", uploadError);

        return Response.json(
          {
            success: false,
            message: "Unable to upload profile image.",
          },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from(PROFILE_BUCKET)
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.userId,
      },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        imageUrl: true,
      },
    });

    return Response.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update profile.",
      },
      { status: 500 }
    );
  }
}