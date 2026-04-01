import type { Request, Response } from "express";
import crypto from "crypto";
import { XSRF_COOKIE, xsrfCookieOpts } from "./cookies";
import { ForbiddenError } from "../errors/app-errors";

export const XSRF_HEADER = "X-XSRF-TOKEN";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:4200",
  "https://free-spot.vercel.app",
  "https://freespotwork.onrender.com",
]);

function readCookie(req: Request, name: string): string | undefined {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const value = cookies?.[name];
  return typeof value === "string" ? value : undefined;
}

/**
 * Defense-in-depth: require same-origin frontend for state-changing requests.
 * Prefers Origin, falls back to Referer.
 */
export function requireOrigin(req: Request): void {
  const origin = req.get("origin");

  if (origin) {
    if (!ALLOWED_ORIGINS.has(origin)) {
      throw new ForbiddenError("Origin not allowed", "BAD_ORIGIN");
    }
    return;
  }

  const referer = req.get("referer");
  if (!referer) {
    throw new ForbiddenError("Missing Origin/Referer", "BAD_ORIGIN");
  }

  try {
    const refererOrigin = new URL(referer).origin;

    if (!ALLOWED_ORIGINS.has(refererOrigin)) {
      throw new ForbiddenError("Referer not allowed", "BAD_ORIGIN");
    }
  } catch {
    throw new ForbiddenError("Invalid Referer", "BAD_ORIGIN");
  }
}

export function issueXsrfCookie(res: Response): string {
  const token = crypto.randomBytes(32).toString("base64url");
  res.cookie(XSRF_COOKIE, token, xsrfCookieOpts);
  return token;
}

/**
 * Require XSRF header + cookie match, and verify Origin/Referer.
 * Use for POST/PUT/PATCH/DELETE routes that rely on cookies.
 */
export function requireXsrf(req: Request): void {
  requireOrigin(req);

  const xsrfHeader = req.get(XSRF_HEADER);
  const xsrfCookie = readCookie(req, XSRF_COOKIE);

  if (!xsrfHeader || !xsrfCookie || xsrfHeader !== xsrfCookie) {
    throw new ForbiddenError("XSRF validation failed", "XSRF");
  }
}
