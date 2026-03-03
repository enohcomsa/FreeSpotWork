import type { CookieOptions, Response } from "express";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";
export const XSRF_COOKIE = "XSRF-TOKEN";

const isProd = process.env.NODE_ENV === "production";
const sameSite: CookieOptions["sameSite"] = isProd ? "none" : "lax";
const secure = isProd;

export const accessCookieOpts: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOpts: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/api/v1/auth/refresh",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const xsrfCookieOpts: CookieOptions = {
  httpOnly: false,
  secure,
  sameSite,
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  });

  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/api/v1/auth/refresh",
  });

  res.clearCookie(XSRF_COOKIE, {
    httpOnly: false,
    secure,
    sameSite,
    path: "/",
  });
}
