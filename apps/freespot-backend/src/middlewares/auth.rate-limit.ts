import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

function readIdentifier(req: Request): string {
  const body = req.body as { identifier?: unknown };
  return typeof body?.identifier === "string"
    ? body.identifier.trim().toLowerCase()
    : "unknown";
}

export const rateLimitLogin = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${readIdentifier(req)}|${ipKeyGenerator(req.ip)}`,
});

export const rateLimitSignup = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});

export const rateLimitRefresh = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});
