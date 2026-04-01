const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_CONFLICT = 409;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

const ERROR_CODE_BAD_REQUEST = "BAD_REQUEST";
const ERROR_CODE_UNAUTHENTICATED = "UNAUTHENTICATED";
const ERROR_CODE_FORBIDDEN = "FORBIDDEN";
const ERROR_CODE_NOT_FOUND = "NOT_FOUND";
const ERROR_CODE_CONFLICT = "CONFLICT";
const ERROR_CODE_INTERNAL = "INTERNAL";

export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", code = ERROR_CODE_BAD_REQUEST) {
    super(HTTP_STATUS_BAD_REQUEST, code, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthenticated", code = ERROR_CODE_UNAUTHENTICATED) {
    super(HTTP_STATUS_UNAUTHORIZED, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code = ERROR_CODE_FORBIDDEN) {
    super(HTTP_STATUS_FORBIDDEN, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", code = ERROR_CODE_NOT_FOUND) {
    super(HTTP_STATUS_NOT_FOUND, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", code = ERROR_CODE_CONFLICT) {
    super(HTTP_STATUS_CONFLICT, code, message);
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal server error", code = ERROR_CODE_INTERNAL) {
    super(HTTP_STATUS_INTERNAL_SERVER_ERROR, code, message);
  }
}
