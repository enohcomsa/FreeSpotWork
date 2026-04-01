import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type AppErrorLike = {
  status?: number;
  code?: string;
  message?: string;
};

const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

const ERROR_CODE_INTERNAL = "INTERNAL";
const ERROR_CODE_GENERIC = "ERROR";
const ERROR_CODE_VALIDATION = "ValidationError";

const DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE = "Internal Server Error";

const isZodError = (error: unknown): error is ZodError =>
  error instanceof ZodError;

const normalizeAppError = (error: unknown) => {
  const appError = error as AppErrorLike;

  const status =
    typeof appError.status === "number"
      ? appError.status
      : HTTP_STATUS_INTERNAL_SERVER_ERROR;

  const code =
    typeof appError.code === "string"
      ? appError.code
      : status === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? ERROR_CODE_INTERNAL
        : ERROR_CODE_GENERIC;

  const message =
    (error as Error)?.message ?? DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE;

  return { status, code, message };
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;

  if (isZodError(error)) {
    return res.status(HTTP_STATUS_UNPROCESSABLE_ENTITY).json({
      error: ERROR_CODE_VALIDATION,
      issues: error.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { status, code, message } = normalizeAppError(error);

  if (process.env.NODE_ENV !== "production") {
    console.error("[error]", error);
  }

  return res.status(status).json({
    error: code,
    message,
  });
};
