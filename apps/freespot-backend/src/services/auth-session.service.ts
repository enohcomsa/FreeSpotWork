import type { Request, Response } from "express";
import type { ObjectId } from "mongodb";
import type { UserAuthProjection } from "../db/types";

import * as refreshRepo from "../repos/refresh-tokens.repo";

import { setAuthCookies } from "../utils/cookies";
import { getClientIp, getUserAgent } from "../utils/request-meta";
import { issueXsrfCookie } from "../utils/xsrf";
import { createRefreshTokenPair, generateJti, REFRESH_TTL_MS, signAccessToken, } from "../utils/tokens";

function createAccessTokenForUser(user: UserAuthProjection): string {
  return signAccessToken({
    sub: user._id.toHexString(),
    role: user.role,
    tokenVersion: user.security.tokenVersion,
    jti: generateJti(),
  });
}

async function createRefreshSession(req: Request, userId: ObjectId): Promise<string> {
  const { token: refreshToken, tokenHash } = createRefreshTokenPair();

  await refreshRepo.createRefreshToken({
    userId,
    jti: generateJti(),
    tokenHash,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    revokedAt: null,
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
  });

  return refreshToken;
}

export async function issueAuthSession(req: Request, res: Response, user: UserAuthProjection): Promise<{ xsrfToken: string }> {
  const accessToken = createAccessTokenForUser(user);
  const refreshToken = await createRefreshSession(req, user._id);

  setAuthCookies(res, accessToken, refreshToken);
  const xsrfToken = issueXsrfCookie(res);

  return { xsrfToken };
}
