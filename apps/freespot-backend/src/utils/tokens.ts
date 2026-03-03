// src/utils/tokens.ts
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = (process.env.JWT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n").trim();
const JWT_PUBLIC_KEY = (process.env.JWT_PUBLIC_KEY ?? "").replace(/\\n/g, "\n").trim();
const REFRESH_HMAC_SECRET = (process.env.REFRESH_HMAC_SECRET ?? "").trim();

export const ACCESS_TTL = "15m";
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// fail-fast (better than runtime surprises)
(function validateEnv() {
  if (!JWT_PRIVATE_KEY) throw new Error("JWT_PRIVATE_KEY is missing");
  if (!JWT_PUBLIC_KEY) throw new Error("JWT_PUBLIC_KEY is missing");
  if (!REFRESH_HMAC_SECRET) throw new Error("REFRESH_HMAC_SECRET is missing");

  // light sanity checks (helps catch copy/paste mistakes)
  if (!JWT_PRIVATE_KEY.includes("BEGIN") || !JWT_PRIVATE_KEY.includes("PRIVATE KEY")) {
    throw new Error("JWT_PRIVATE_KEY does not look like a PEM private key");
  }
  if (!JWT_PUBLIC_KEY.includes("BEGIN") || !JWT_PUBLIC_KEY.includes("PUBLIC KEY")) {
    throw new Error("JWT_PUBLIC_KEY does not look like a PEM public key");
  }
})();

export type AccessTokenClaims = {
  sub: string;
  role: "ADMIN" | "MEMBER";
  tokenVersion: number;
  jti: string;
};

export function signAccessToken(
  claims: AccessTokenClaims,
  expiresIn: string | number = ACCESS_TTL
): string {
  return jwt.sign(claims, JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn,
  });
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  return jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ["RS256"] }) as AccessTokenClaims;
}

export function generateJti(): string {
  return crypto.randomUUID();
}

export function generateRefreshToken(): { token: string; jti: string } {
  const token = crypto.randomBytes(64).toString("base64url");
  const jti = crypto.randomUUID();
  return { token, jti };
}

export function hashRefreshToken(refreshToken: string): string {
  return crypto.createHmac("sha256", REFRESH_HMAC_SECRET).update(refreshToken).digest("base64url");
}
