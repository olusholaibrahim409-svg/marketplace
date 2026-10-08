import "server-only";

import { cookies } from "next/headers";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const SECRET: string = JWT_SECRET;

export type SessionUser = {
  userId: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
};

type MarketplaceJwtPayload = JwtPayload & {
  userId: string;
  email: string;
  role: SessionUser["role"];
};

function isValidRole(
  role: unknown
): role is SessionUser["role"] {
  return (
    role === "CUSTOMER" ||
    role === "SELLER" ||
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  );
}

function isMarketplaceJwtPayload(
  value: string | JwtPayload
): value is MarketplaceJwtPayload {
  if (typeof value === "string") {
    return false;
  }

  return (
    typeof value.userId === "string" &&
    typeof value.email === "string" &&
    isValidRole(value.role)
  );
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("marketplace_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (!isMarketplaceJwtPayload(decoded)) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}