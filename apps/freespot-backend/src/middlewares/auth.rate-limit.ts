import rateLimit from "express-rate-limit";
import type { Request } from "express";

const json429 = { error: "Too many requests, try again later." };

function readIdentifier(req: Request): string {
  const body = req.body as { identifier?: unknown } | undefined;
  return typeof body?.identifier === "string" ? body.identifier.trim().toLowerCase() : "unknown";
}

export const rateLimitLogin = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${readIdentifier(req)}|${req.ip}`,
});

export const rateLimitSignup = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

export const rateLimitRefresh = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});
