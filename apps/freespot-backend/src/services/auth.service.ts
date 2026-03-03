import type { Request, Response } from "express";

import type { AuthOkResponseT, LoginRequestT, SignupRequestT } from "../schemas/auth.zod";

import * as usersRepo from "../repos/users.repo";
import * as refreshRepo from "../repos/refresh-tokens.repo";

import { hashPassword, verifyPassword } from "../utils/password";
import { issueXsrfCookie, requireXsrf } from "../utils/xsrf";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOpts,
  refreshCookieOpts,
  clearAuthCookies,
} from "../utils/cookies";

import {
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  generateJti,
  ACCESS_TTL,
  REFRESH_TTL_MS,
} from "../utils/tokens";
import { toObjectId } from "../utils/mongo";

function appError(status: number, code: string, message: string) {
  return { status, code, message };
}

function getIp(req: Request): string | null {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) return xff.split(",")[0].trim();
  return req.ip ?? null;
}

function getUserAgent(req: Request): string | null {
  const ua = req.headers["user-agent"];
  return typeof ua === "string" ? ua : null;
}

function toAuthOk(user: { id: string; email: string; role: "ADMIN" | "MEMBER" }): AuthOkResponseT {
  return { ok: true, user };
}


export async function signup(
  req: Request,
  res: Response,
  input: SignupRequestT
): Promise<AuthOkResponseT> {
  const passwordHash = await hashPassword(input.password);

  const u = await usersRepo.createUser(input, passwordHash);

  const accessJti = generateJti();
  const access = signAccessToken(
    {
      sub: u._id.toHexString(),
      role: u.role,
      tokenVersion: u.security.tokenVersion,
      jti: accessJti,
    },
    ACCESS_TTL
  );

  const { jti: refreshJti, token: refreshToken } = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  await refreshRepo.createRefreshToken({
    userId: u._id,
    jti: refreshJti,
    tokenHash,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    revokedAt: null,
    ip: getIp(req),
    userAgent: getUserAgent(req),
  });

  res.cookie(ACCESS_COOKIE, access, accessCookieOpts);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOpts);
  issueXsrfCookie(res);

  return toAuthOk({
    id: u._id.toHexString(),
    email: u.email,
    role: u.role,
  });
}

export async function login(
  req: Request,
  res: Response,
  input: LoginRequestT
): Promise<AuthOkResponseT> {
  const ident = input.identifier.trim().toLowerCase();

  const u = await usersRepo.findUserAuthByIdentifier(ident);
  const phc = u?.auth?.local?.hash;

  if (!u || !phc) throw appError(401, "UNAUTHENTICATED", "Invalid credentials");

  const ok = await verifyPassword(phc, input.password);
  if (!ok) throw appError(401, "UNAUTHENTICATED", "Invalid credentials");

  const accessJti = generateJti();
  const access = signAccessToken(
    {
      sub: u._id.toHexString(),
      role: u.role,
      tokenVersion: u.security.tokenVersion,
      jti: accessJti,
    },
    ACCESS_TTL
  );

  const { jti: refreshJti, token: refreshToken } = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  await refreshRepo.createRefreshToken({
    userId: u._id,
    jti: refreshJti,
    tokenHash,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    revokedAt: null,
    ip: getIp(req),
    userAgent: getUserAgent(req),
  });

  res.cookie(ACCESS_COOKIE, access, accessCookieOpts);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOpts);
  issueXsrfCookie(res);

  return toAuthOk({
    id: u._id.toHexString(),
    email: u.email,
    role: u.role,
  });
}

export async function refresh(req: Request, res: Response): Promise<{ ok: true }> {
  requireXsrf(req);

  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) throw appError(401, "UNAUTHENTICATED", "Missing refresh token");

  const tokenHash = hashRefreshToken(refreshToken);
  const row = await refreshRepo.findRefreshTokenByHash(tokenHash);

  if (!row) throw appError(401, "UNAUTHENTICATED", "Invalid refresh token");

  if (row.revokedAt) throw appError(401, "UNAUTHENTICATED", "Invalid refresh token");

  if (row.expiresAt.getTime() <= Date.now())
    throw appError(401, "UNAUTHENTICATED", "Expired refresh token");

  const revoked = await refreshRepo.revokeRefreshTokenByHash(tokenHash);
  if (!revoked) throw appError(401, "UNAUTHENTICATED", "Invalid refresh token");

  const { jti: nextJti, token: nextRefresh } = generateRefreshToken();
  const nextHash = hashRefreshToken(nextRefresh);

  await refreshRepo.createRefreshToken({
    userId: row.userId,
    jti: nextJti,
    tokenHash: nextHash,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    revokedAt: null,
    ip: getIp(req),
    userAgent: getUserAgent(req),
  });

  const u = await usersRepo.findUserAuthById(row.userId);
  if (!u) throw appError(401, "UNAUTHENTICATED", "User not found");

  const accessJti = generateJti();
  const access = signAccessToken(
    {
      sub: u._id.toHexString(),
      role: u.role,
      tokenVersion: u.security.tokenVersion,
      jti: accessJti,
    },
    ACCESS_TTL
  );

  res.cookie(ACCESS_COOKIE, access, accessCookieOpts);
  res.cookie(REFRESH_COOKIE, nextRefresh, refreshCookieOpts);
  issueXsrfCookie(res);

  return { ok: true };
}

export async function logout(req: Request, res: Response): Promise<{ ok: true }> {
  requireXsrf(req);

  const refreshToken = req.cookies?.[REFRESH_COOKIE];

  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    await refreshRepo.revokeRefreshTokenByHash(tokenHash);
  }

  clearAuthCookies(res);
  return { ok: true };
}

export async function me(req: Request): Promise<AuthOkResponseT> {
  const claims = req.user;
  if (!claims) throw appError(401, "UNAUTHENTICATED", "Unauthenticated");

  const u = await usersRepo.findUserAuthById(toObjectId(claims.sub));
  if (!u) throw appError(401, "UNAUTHENTICATED", "Unauthenticated");

  return toAuthOk({
    id: u._id.toHexString(),
    email: u.email,
    role: u.role,
  });
}
