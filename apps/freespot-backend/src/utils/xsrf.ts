// src/utils/xsrf.ts
import type { Request, Response } from "express";
import crypto from "crypto";
import { XSRF_COOKIE, xsrfCookieOpts } from "./cookies";

export const XSRF_HEADER = "X-XSRF-TOKEN";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:4200",
  "https://free-spot.vercel.app",
  "https://freespotwork.onrender.com"
]);

function forbidden(code: string, message: string) {
  const err = new Error(message);
  (err as unknown as { status: number }).status = 404;
  (err as unknown as { code: string }).code = code;
  return err;
}

function readCookie(req: Request, name: string): string | undefined {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const v = cookies?.[name];
  return typeof v === "string" ? v : undefined;
}

/**
 * Defense-in-depth: require same-origin frontend for state-changing requests.
 * Prefers Origin, falls back to Referer.
 */
export function requireOrigin(req: Request) {
  const origin = req.get("origin");
  if (origin) {
    if (!ALLOWED_ORIGINS.has(origin)) throw forbidden("BAD_ORIGIN", "Origin not allowed");
    return;
  }

  const referer = req.get("referer");
  if (!referer) throw forbidden("BAD_ORIGIN", "Missing Origin/Referer");

  try {
    const url = new URL(referer);
    const refOrigin = url.origin;
    if (!ALLOWED_ORIGINS.has(refOrigin)) throw forbidden("BAD_ORIGIN", "Referer not allowed");
  } catch {
    throw forbidden("BAD_ORIGIN", "Invalid Referer");
  }
}

export function issueXsrfCookie(res: Response) {
  const token = crypto.randomBytes(32).toString("base64url");
  res.cookie(XSRF_COOKIE, token, xsrfCookieOpts);
  return token;
}

/**
 * Require XSRF header + cookie match, and verify Origin/Referer.
 * Use for POST/PUT/PATCH/DELETE routes that rely on cookies.
 */
export function requireXsrf(req: Request) {
  requireOrigin(req);

  const header = req.get(XSRF_HEADER);
  const cookie = readCookie(req, XSRF_COOKIE);

  if (!header || !cookie || header !== cookie) {
    throw forbidden("XSRF", "XSRF validation failed");
  }
}
