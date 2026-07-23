import type { RequestHandler, Request, Response, NextFunction } from "express";
import type { ParsedQs } from "qs";
import type { AccessTokenClaims } from './tokens';

type RouteParams = Record<string, string>;
type AsyncController<
  TParams extends RouteParams,
  TResBody,
  TReqBody,
  TReqQuery,
> = (
  req: Request<TParams, TResBody, TReqBody, TReqQuery>,
  res: Response<TResBody>,
  next: NextFunction,
) => Promise<unknown>;

type AuthenticatedRequest<TParams, TResBody, TReqBody, TReqQuery> = Request<TParams, TResBody, TReqBody, TReqQuery> & { user: AccessTokenClaims };
type AuthenticatedAsyncController<
  TParams extends RouteParams,
  TResBody,
  TReqBody,
  TReqQuery
> = (
  req: AuthenticatedRequest<TParams, TResBody, TReqBody, TReqQuery>,
  res: Response<TResBody>,
  next: NextFunction,
) => Promise<unknown>;


// const asyncHandler = <...>(fn) => { ... }
const asyncHandler = <TParams extends RouteParams = RouteParams, TResBody = unknown, TReqBody = unknown, TReqQuery = ParsedQs>
  (fn: AsyncController<TParams, TResBody, TReqBody, TReqQuery>): RequestHandler<TParams, TResBody, TReqBody, TReqQuery> => {

  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const authenticatedAsyncHandler = <TParams extends RouteParams = RouteParams, TResBody = unknown, TReqBody = unknown, TReqQuery = ParsedQs>
  (fn: AuthenticatedAsyncController<TParams, TResBody, TReqBody, TReqQuery>): RequestHandler<TParams, TResBody, TReqBody, TReqQuery> => {

  return (req, res, next) => {
    fn(req as AuthenticatedRequest<TParams, TResBody, TReqBody, TReqQuery>, res, next).catch(next);
  };
};

// export const withRequest = <TResBody>() => asyncHandler<RouteParams, TResBody>;
// export const withParams = <TParams extends RouteParams, TResBody>() => asyncHandler<TParams, TResBody>;
// export const withQuery = <TQuery, TResBody>() => asyncHandler<RouteParams, TResBody, unknown, TQuery>;
export const withBody = <TReqBody, TResBody>() => asyncHandler<RouteParams, TResBody, TReqBody>;//intentionally different types order
// export const withParamsAndBody = <TParams extends RouteParams, TReqBody, TResBody>() => asyncHandler<TParams, TResBody, TReqBody>;//intentionally different types order

//with auth
export const withAuthenticatedRequest = <TResBody>() => authenticatedAsyncHandler<RouteParams, TResBody>;
export const withAuthenticatedParams = <TParams extends RouteParams, TResBody>() => authenticatedAsyncHandler<TParams, TResBody>;
export const withAuthenticatedQuery = <TQuery, TResBody>() => authenticatedAsyncHandler<RouteParams, TResBody, unknown, TQuery>;
export const withAuthenticatedBody = <TReqBody, TResBody>() => authenticatedAsyncHandler<RouteParams, TResBody, TReqBody>;//intentionally different types order
export const withAuthenticatedParamsAndBody = <TParams extends RouteParams, TReqBody, TResBody>() => authenticatedAsyncHandler<TParams, TResBody, TReqBody>;//intentionally different types order
