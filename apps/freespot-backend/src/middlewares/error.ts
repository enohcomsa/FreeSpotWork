import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type AppErrorLike = { status?: number; code?: string; message?: string };
type MongoErrorLike = { code?: number; message?: string; name?: string };

const isZod = (err: unknown): err is ZodError => err instanceof ZodError;
const isMongoDuplicateKey = (err: unknown): err is MongoErrorLike =>
  typeof (err as MongoErrorLike)?.code === "number" && (err as MongoErrorLike).code === 11000;

const normalizeAppError = (err: unknown) => {
  const app = err as AppErrorLike;
  const status = typeof app.status === "number" ? app.status : 500;
  const code = typeof app.code === "string" ? app.code : status === 500 ? "INTERNAL" : "ERROR";
  const message = (err as Error)?.message ?? "Internal Server Error";
  return { status, code, message };
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  void next;

  if (isZod(err)) {
    return res.status(400).json({
      error: "ValidationError",
      issues: err.issues.map(i => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (isMongoDuplicateKey(err)) {
    return res.status(409).json({ error: "Conflict", message: "Duplicate key" });
  }

  const { status, code, message } = normalizeAppError(err);

  if (process.env.NODE_ENV !== "production") {
    console.error("[error]", err);
  }

  return res.status(status).json({ error: code, message });
};
