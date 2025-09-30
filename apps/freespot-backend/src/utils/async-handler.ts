import type { RequestHandler, Request, Response, NextFunction } from "express";
import type { ParsedQs } from "qs";

export const asyncHandler = <
  P extends Record<string, string> = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
  Locals extends Record<string, unknown> = Record<string, unknown>
>(fn: (req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction) => Promise<unknown>)
  : RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
};

export const withQuery = <Q, ResBody = unknown>() => asyncHandler<Record<string, string>, ResBody, unknown, Q>;
export const withBody = <B, ResBody = unknown>() => asyncHandler<Record<string, string>, ResBody, B, ParsedQs>;
export const withParams = <P extends Record<string, string>, ResBody = unknown>() => asyncHandler<P, ResBody, unknown, ParsedQs>;
export const withParamsAndBody = <P extends Record<string, string>, B, ResBody = unknown>() => asyncHandler<P, ResBody, B, ParsedQs>;
