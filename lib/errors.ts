// /lib/errors.ts
import { getPublicError } from "./publicErrors";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 500,
    public readonly details?: Record<string, unknown>,
    public readonly retryable = false
  ) {
    super(message);
    this.name = "AppError";
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(details?: Record<string, unknown>) {
    super("Validation failed", "VALIDATION_ERROR", 400, details, false);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor() {
    super("Authentication required", "AUTH_ERROR", 401, undefined, false);
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404, undefined, false);
    this.name = "NotFoundError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export type ErrorResponse = {
  message: string;
  action: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
  retryable?: boolean;
};

export function formatError(error: unknown): ErrorResponse {
  if (isAppError(error)) {
    const publicError = getPublicError(error.code);
    
    return {
      ...publicError,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      retryable: error.retryable,
    };
  }

  const publicError = getPublicError("INTERNAL_ERROR");
  return {
    ...publicError,
    code: "INTERNAL_ERROR",
    statusCode: 500,
    retryable: false,
  };
}