import { ConflictError, InternalError } from "./errors";

type MongoLikeError = { code?: number; message?: string; name?: string };

export function mapMongoError(e: unknown): never {
  const err = e as MongoLikeError;
  if (err && typeof err.code === "number") {
    if (err.code === 11000) {
      throw new ConflictError("Duplicate key");
    }
  }
  throw new InternalError(err?.message ?? "Database error");
}
