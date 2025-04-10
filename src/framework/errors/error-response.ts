import { ApiProperty } from '@nestjs/swagger';
import { ErrorReason } from './error-reason';

export class ErrorResponse {
  @ApiProperty({ description: 'Error message' })
  public readonly message: string;

  @ApiProperty({ description: 'HTTP status code' })
  public readonly status: number;

  @ApiProperty({ description: 'Error reason', enum: ErrorReason })
  public readonly reason: ErrorReason;

  @ApiProperty({ description: 'Error code' })
  public readonly code?: string;

  constructor(
    message: string,
    status: number,
    reason: ErrorReason,
    code?: string,
  ) {
    this.code = code;
    this.message = message;
    this.status = status;
    this.reason = reason;
  }
}

export class BadRequestError extends ErrorResponse {
  @ApiProperty({
    enum: [ErrorReason.INVALID_PARAMETER],
    default: ErrorReason.INVALID_PARAMETER,
  })
  public readonly reason: ErrorReason = ErrorReason.INVALID_PARAMETER;

  @ApiProperty({ description: 'HTTP status code', default: 400 })
  public readonly status: number = 400;

  constructor(message: string, code: string) {
    super(message, 400, ErrorReason.INVALID_PARAMETER, code);
  }
}

export class UnauthorizedError extends ErrorResponse {
  @ApiProperty({
    enum: [ErrorReason.AUTHENTICATION],
    default: ErrorReason.AUTHENTICATION,
  })
  public readonly reason: ErrorReason = ErrorReason.AUTHENTICATION;

  @ApiProperty({ description: 'HTTP status code', default: 401 })
  public readonly status: number = 401;

  constructor(message: string, code?: string) {
    super(message, 401, ErrorReason.AUTHENTICATION, code);
  }
}

export class NotFoundError extends ErrorResponse {
  @ApiProperty({
    enum: [ErrorReason.NOT_FOUND],
    default: ErrorReason.NOT_FOUND,
  })
  public readonly reason: ErrorReason = ErrorReason.NOT_FOUND;

  @ApiProperty({ description: 'HTTP status code', default: 404 })
  public readonly status: number = 404;

  constructor(message: string, code?: string) {
    super(message, 404, ErrorReason.NOT_FOUND, code);
  }
}

export class ConflictError extends ErrorResponse {
  @ApiProperty({
    enum: [ErrorReason.BUSINESS_RULES],
    default: ErrorReason.BUSINESS_RULES,
  })
  public readonly reason: ErrorReason = ErrorReason.BUSINESS_RULES;

  @ApiProperty({ description: 'HTTP status code', default: 409 })
  public readonly status: number = 409;

  constructor(message: string, code?: string) {
    super(message, 409, ErrorReason.BUSINESS_RULES, code);
  }
}

export class UnprocessableEntityError extends ErrorResponse {
  @ApiProperty({
    enum: [ErrorReason.BUSINESS_RULES],
    default: ErrorReason.BUSINESS_RULES,
  })
  public readonly reason: ErrorReason = ErrorReason.BUSINESS_RULES;

  @ApiProperty({ description: 'HTTP status code', default: 422 })
  public readonly status: number = 422;

  constructor(message: string, code?: string) {
    super(message, 422, ErrorReason.BUSINESS_RULES, code);
  }
}

export class InternalServerError extends ErrorResponse {
  @ApiProperty({
    enum: [ErrorReason.INTERNAL_SERVER_ERROR],
    default: ErrorReason.INTERNAL_SERVER_ERROR,
  })
  public readonly reason: ErrorReason = ErrorReason.INTERNAL_SERVER_ERROR;

  @ApiProperty({ description: 'HTTP status code', default: 500 })
  public readonly status: number = 500;

  constructor(message: string, code?: string) {
    super(message, 500, ErrorReason.INTERNAL_SERVER_ERROR, code);
  }
}
