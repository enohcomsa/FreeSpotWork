import type { Request, Response, NextFunction } from "express";
import { ACCESS_COOKIE } from "../utils/cookies";
import { verifyAccessToken } from "../utils/tokens";
import * as usersRepo from "../repos/users.repo";
import { toObjectId } from "../utils/mongo";

function unauthorized(res: Response, error: string) {
  return res.status(401).json({ ok: false, error });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return unauthorized(res, "UNAUTHENTICATED");

  let claims;
  try {
    claims = verifyAccessToken(token);
  } catch {
    return unauthorized(res, "INVALID_TOKEN");
  }

  const userId = toObjectId(claims.sub);

  const user = await usersRepo.findUserAuthById(userId);
  if (!user) return unauthorized(res, "UNAUTHENTICATED");

  if (claims.tokenVersion !== user.security.tokenVersion)
    return unauthorized(res, "STALE_TOKEN");

  req.user = claims;
  return next();
}

export function requireRole(...roles: Array<"ADMIN" | "MEMBER">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return unauthorized(res, "UNAUTHENTICATED");
    if (!roles.includes(req.user.role))
      return res.status(403).json({ ok: false, error: "FORBIDDEN" });
    return next();
  };
}
