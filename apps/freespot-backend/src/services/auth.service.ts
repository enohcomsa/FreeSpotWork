import type { Request, Response } from "express";
import type {
  AuthOkResponseT,
  LoginRequestT,
  MeResponseT,
  RefreshResponseT,
  SignupRequestT,
} from "../schemas/auth.zod";

import * as usersRepo from "../repos/users.repo";
import * as refreshRepo from "../repos/refresh-tokens.repo";
import { toAuthOkBasic, toAuthOkMe, userToAuthMeDto } from "../mappers";

import { hashPassword, verifyPassword } from "../utils/password";
import { requireXsrf } from "../utils/xsrf";
import { REFRESH_COOKIE, clearAuthCookies } from "../utils/cookies";
import { toObjectId } from "../utils/mongo";

import { UnauthorizedError } from "./errors";
import { issueAuthSession } from "./auth-session.service";
import { hashRefreshToken } from "../utils/tokens";

const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";
const MISSING_REFRESH_TOKEN_MESSAGE = "Missing refresh token";
const INVALID_REFRESH_TOKEN_MESSAGE = "Invalid refresh token";
const EXPIRED_REFRESH_TOKEN_MESSAGE = "Expired refresh token";
const UNAUTHENTICATED_MESSAGE = "Unauthenticated";

export async function signup(req: Request, res: Response, input: SignupRequestT): Promise<AuthOkResponseT> {
  const passwordHash = await hashPassword(input.password);
  const user = await usersRepo.createUser(input, passwordHash);

  const { xsrfToken } = await issueAuthSession(req, res, user);

  return toAuthOkBasic(
    {
      id: user._id.toHexString(),
      email: user.email,
      role: user.role,
    },
    xsrfToken
  );
}

export async function login(req: Request, res: Response, input: LoginRequestT): Promise<AuthOkResponseT> {
  const normalizedIdentifier = input.identifier.trim().toLowerCase();

  const user = await usersRepo.findUserAuthByIdentifier(normalizedIdentifier);
  const passwordHash = user?.auth?.local?.hash;

  if (!user || !passwordHash) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }

  const isPasswordValid = await verifyPassword(passwordHash, input.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }

  const { xsrfToken } = await issueAuthSession(req, res, user);

  return toAuthOkBasic(
    {
      id: user._id.toHexString(),
      email: user.email,
      role: user.role,
    },
    xsrfToken
  );
}

export async function refresh(req: Request, res: Response): Promise<RefreshResponseT> {
  requireXsrf(req);

  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) {
    throw new UnauthorizedError(MISSING_REFRESH_TOKEN_MESSAGE);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);
  const refreshSession = await refreshRepo.findRefreshTokenByHash(refreshTokenHash);

  if (!refreshSession || refreshSession.revokedAt) {
    throw new UnauthorizedError(INVALID_REFRESH_TOKEN_MESSAGE);
  }

  if (refreshSession.expiresAt.getTime() <= Date.now()) {
    throw new UnauthorizedError(EXPIRED_REFRESH_TOKEN_MESSAGE);
  }

  const wasRevoked = await refreshRepo.revokeRefreshTokenByHash(refreshTokenHash);

  if (!wasRevoked) {
    throw new UnauthorizedError(INVALID_REFRESH_TOKEN_MESSAGE);
  }

  const user = await usersRepo.findUserAuthById(refreshSession.userId);
  if (!user) {
    throw new UnauthorizedError(UNAUTHENTICATED_MESSAGE);
  }

  const { xsrfToken } = await issueAuthSession(req, res, user);

  return { ok: true, xsrfToken };
}

export async function logout(req: Request, res: Response): Promise<{ ok: true }> {
  requireXsrf(req);

  const refreshToken = req.cookies?.[REFRESH_COOKIE];

  if (refreshToken) {
    const refreshTokenHash = hashRefreshToken(refreshToken);
    await refreshRepo.revokeRefreshTokenByHash(refreshTokenHash);
  }

  clearAuthCookies(res);
  return { ok: true };
}

export async function me(req: Request): Promise<MeResponseT> {
  const claims = req.user;
  if (!claims) {
    throw new UnauthorizedError(UNAUTHENTICATED_MESSAGE);
  }

  const user = await usersRepo.findUserMeById(toObjectId(claims.sub));
  if (!user) {
    throw new UnauthorizedError(UNAUTHENTICATED_MESSAGE);
  }

  return toAuthOkMe(userToAuthMeDto(user));
}
