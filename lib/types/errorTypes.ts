/* File: errorTypes.ts
Overview: Type definitions for error handling
Note: This file only contains TYPE definitions.
The actual error classes are in /lib/errors.ts
*/

// Re-export error classes from /lib/errors.ts for convenience
export type { ErrorResponse } from '../errors'
export { 
  AppError, 
  ValidationError, 
  AuthError, 
  NotFoundError,
  isAppError,
  formatError
} from '../errors'

// Define all possible error codes as a TypeScript type
export type ErrorCode = 
  // Auth errors
  | 'AUTH_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'USER_EXISTS'
  | 'USER_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'TOKEN_EXPIRED'
  // Validation errors
  | 'VALIDATION_ERROR'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_ROLE'
  | 'INVALID_JOB_STATUS'
  | 'INVALID_PRIORITY'
  // Resource errors
  | 'NOT_FOUND'
  | 'JOB_NOT_FOUND'
  | 'COMPANY_NOT_FOUND'
  | 'EMPLOYEE_NOT_FOUND'
  // Business logic errors
  | 'TECH_NOT_AVAILABLE'
  | 'JOB_ALREADY_ASSIGNED'
  | 'INSUFFICIENT_SKILLS'
  | 'INVALID_ASSIGNMENT'
  // System errors
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR'