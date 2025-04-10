import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from '@nestjs/common';
import { DatabaseError } from '../errors/database.error';
import { DomainError } from '../errors/domain.error';
import { ErrorReason } from '../errors/error-reason';
import { ErrorResponse } from '../errors/error-response';
import e, { Response } from 'express';
import { ERROR_DECORATOR } from '@framework/errors/error.decorator';

type ErrorHandler = (error: any, response: Response) => void;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private readonly errorHandlers: Map<string, ErrorHandler> = new Map([
    [DomainError.name, this.handleDomainError.bind(this)],
    [DatabaseError.name, this.handleDatabaseError.bind(this)],
    [ErrorResponse.name, this.handleErrorResponse.bind(this)],
    [BadRequestException.name, this.handleHttpException.bind(this)],
    [UnauthorizedException.name, this.handleHttpException.bind(this)],
    [NotFoundException.name, this.handleHttpException.bind(this)],
    [ForbiddenException.name, this.handleHttpException.bind(this)],
    [NotAcceptableException.name, this.handleHttpException.bind(this)],
    [RequestTimeoutException.name, this.handleHttpException.bind(this)],
    [ConflictException.name, this.handleHttpException.bind(this)],
    [GoneException.name, this.handleHttpException.bind(this)],
    [
      HttpVersionNotSupportedException.name,
      this.handleHttpException.bind(this),
    ],
    [PayloadTooLargeException.name, this.handleHttpException.bind(this)],
    [UnsupportedMediaTypeException.name, this.handleHttpException.bind(this)],
    [UnprocessableEntityException.name, this.handleHttpException.bind(this)],
    [InternalServerErrorException.name, this.handleHttpException.bind(this)],
    [NotImplementedException.name, this.handleHttpException.bind(this)],
    [BadGatewayException.name, this.handleHttpException.bind(this)],
    [ServiceUnavailableException.name, this.handleHttpException.bind(this)],
    [GatewayTimeoutException.name, this.handleHttpException.bind(this)],
    [PreconditionFailedException.name, this.handleHttpException.bind(this)],
  ]);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorHandler = this.getErrorHandler(exception);
    if (!errorHandler) {
      return this.handleUnknownError(exception, response);
    }
    return errorHandler(exception, response);
  }

  private getErrorHandlerByMetadata(exception: any): ErrorHandler | undefined {
    return this.errorHandlers.get(
      Reflect.getMetadata(ERROR_DECORATOR, exception.constructor),
    );
  }

  private getErrorHandler(exception: any): ErrorHandler | undefined {
    let errorHandler = this.errorHandlers.get(exception.constructor?.name);
    if (errorHandler) {
      return errorHandler;
    }
    return this.getErrorHandlerByMetadata(exception);
  }

  private handleDomainError(error: DomainError, response: Response): void {
    const status = this.getHttpStatus(error.reason);
    const errorResponse = new ErrorResponse(
      error.message,
      status,
      error.reason,
      error.code,
    );
    this.logError(errorResponse, error);
    this.sendResponse(response, errorResponse);
  }

  private handleDatabaseError(error: DatabaseError, response: Response): void {
    const errorResponse = this.buildInternalServerErrorResponse();
    this.logError(errorResponse, error);
    this.sendResponse(response, errorResponse);
  }

  private handleErrorResponse(error: ErrorResponse, response: Response): void {
    this.logError(error, error);
    this.sendResponse(response, error);
  }

  private handleHttpException(error: HttpException, response: Response): void {
    const status = error.getStatus();
    const responseMessage = error.getResponse();
    const message =
      typeof responseMessage === 'string'
        ? responseMessage
        : (responseMessage as any).message || 'An error occurred';
    const errorReason = this.translateHttpStatusToErrorReason(status);

    const errorResponse = new ErrorResponse(message, status, errorReason);
    this.logError(errorResponse, error);
    this.sendResponse(response, errorResponse);
  }

  private handleUnknownError(error: unknown, response: Response): void {
    const errorResponse = this.buildInternalServerErrorResponse();
    this.logError(errorResponse, error);
    this.sendResponse(response, errorResponse);
  }

  private buildInternalServerErrorResponse(): ErrorResponse {
    return new ErrorResponse(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorReason.INTERNAL_SERVER_ERROR,
    );
  }

  private getHttpStatus(reason: ErrorReason): HttpStatus {
    const errorStatusMap: Record<ErrorReason, HttpStatus> = {
      [ErrorReason.INVALID_PARAMETER]: HttpStatus.BAD_REQUEST,
      [ErrorReason.AUTHENTICATION]: HttpStatus.UNAUTHORIZED,
      [ErrorReason.FORBIDDEN]: HttpStatus.FORBIDDEN,
      [ErrorReason.NOT_FOUND]: HttpStatus.NOT_FOUND,
      [ErrorReason.BUSINESS_RULES]: HttpStatus.CONFLICT,
      [ErrorReason.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return errorStatusMap[reason] || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private translateHttpStatusToErrorReason(
    httpStatus: HttpStatus,
  ): ErrorReason {
    const httpStatusMap = {
      [HttpStatus.BAD_REQUEST]: ErrorReason.INVALID_PARAMETER,
      [HttpStatus.UNAUTHORIZED]: ErrorReason.AUTHENTICATION,
      [HttpStatus.NOT_FOUND]: ErrorReason.NOT_FOUND,
      [HttpStatus.CONFLICT]: ErrorReason.BUSINESS_RULES,
      [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorReason.INTERNAL_SERVER_ERROR,
    };

    return httpStatusMap[httpStatus] || ErrorReason.INTERNAL_SERVER_ERROR;
  }

  private logError(errorResponse: ErrorResponse, originalError: any): void {
    this.logger.error(
      `Exception caught by HttpExceptionFilter: ${JSON.stringify({
        message: errorResponse.message,
        status: errorResponse.status,
        reason: errorResponse.reason,
        originalError:
          originalError instanceof Error
            ? originalError.message
            : originalError,
      })}`,
      originalError.stack,
    );
  }

  private sendResponse(response: Response, errorResponse: ErrorResponse): any {
    const { status, message, reason } = errorResponse;
    return response.status(status).send({
      message,
      status,
      reason,
    });
  }
}
