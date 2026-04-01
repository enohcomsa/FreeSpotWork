import { ConflictError, InternalError } from "./app-errors";

type MongoLikeError = {
  code?: number;
  message?: string;
  name?: string;
};

const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;
const DUPLICATE_KEY_ERROR_MESSAGE = "Duplicate key";
const DEFAULT_DATABASE_ERROR_MESSAGE = "Database error";

export function mapMongoError(error: unknown): never {
  const mongoError = error as MongoLikeError;

  if (typeof mongoError?.code === "number") {
    if (mongoError.code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
      throw new ConflictError(DUPLICATE_KEY_ERROR_MESSAGE);
    }
  }

  throw new InternalError(
    mongoError?.message ?? DEFAULT_DATABASE_ERROR_MESSAGE,
  );
}
