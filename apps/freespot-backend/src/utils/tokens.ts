import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { UserRoleT } from "../schemas/common.zod";

function readRequiredEnv(name: string): string {
  const value = (process.env[name] ?? "").trim();
  if (!value) {
    throw new Error(`${name} is missing`);
  }
  return value;
}

function readRequiredPemEnv(
  name: string,
  kind: "PRIVATE KEY" | "PUBLIC KEY"
): string {
  const value = readRequiredEnv(name).replace(/\\n/g, "\n");

  if (!value.includes("BEGIN") || !value.includes(kind)) {
    throw new Error(`${name} does not look like a PEM ${kind.toLowerCase()}`);
  }

  return value;
}

const JWT_PRIVATE_KEY = readRequiredPemEnv("JWT_PRIVATE_KEY", "PRIVATE KEY");
const JWT_PUBLIC_KEY = readRequiredPemEnv("JWT_PUBLIC_KEY", "PUBLIC KEY");
const REFRESH_HMAC_SECRET = readRequiredEnv("REFRESH_HMAC_SECRET");

const ACCESS_TOKEN_ALGORITHM = "RS256";
const REFRESH_TOKEN_BYTE_LENGTH = 64;

export const ACCESS_TTL = "15m";
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type AccessTokenClaims = {
  sub: string;
  role: UserRoleT;
  tokenVersion: number;
  jti: string;
};

export function signAccessToken(claims: AccessTokenClaims): string {
  return jwt.sign(claims, JWT_PRIVATE_KEY, {
    algorithm: ACCESS_TOKEN_ALGORITHM,
    expiresIn: ACCESS_TTL,
  });
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  return jwt.verify(token, JWT_PUBLIC_KEY, {
    algorithms: [ACCESS_TOKEN_ALGORITHM],
  }) as AccessTokenClaims;
}

export function generateJti(): string {
  return crypto.randomUUID();
}

export function hashRefreshToken(refreshToken: string): string {
  return crypto
    .createHmac("sha256", REFRESH_HMAC_SECRET)
    .update(refreshToken)
    .digest("base64url");
}

export function createRefreshTokenPair(): { token: string; tokenHash: string } {
  const token = crypto
    .randomBytes(REFRESH_TOKEN_BYTE_LENGTH)
    .toString("base64url");

  return {
    token,
    tokenHash: hashRefreshToken(token),
  };
}
