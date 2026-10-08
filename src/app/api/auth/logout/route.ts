import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("marketplace_token");

    const url = new URL("/login", request.url);

    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    const url = new URL("/login", request.url);

    return NextResponse.redirect(url, 303);
  }
}