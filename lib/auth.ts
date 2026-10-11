import crypto from "crypto";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "super_secret_torah_laneshma_admin_jwt_key_2026";
export const COOKIE_NAME = "torah_admin_session";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "editor";
  created_at?: string;
}

// Secure password hashing using native Node crypto scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Signed session token containing user details and expiration
export function createSessionToken(user: AdminUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): AdminUser | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// Server helper to get authenticated user
export async function getCurrentUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return verifySessionToken(sessionCookie.value);
}
