// api-error-responses.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiExtraModels,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
} from '../errors/error-response';

export const ApiErrorResponses = () =>
  applyDecorators(
    ApiExtraModels(
      BadRequestError,
      UnauthorizedError,
      NotFoundError,
      ConflictError,
      UnprocessableEntityError,
      InternalServerError,
    ),
    ApiBadRequestResponse({
      type: BadRequestError,
      description: 'Invalid Parameter',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedError,
      description: 'Authentication Error',
    }),
    ApiNotFoundResponse({ type: NotFoundError, description: 'Not Found' }),
    ApiConflictResponse({
      type: ConflictError,
      description: 'Business Rules Violation',
    }),
    ApiUnprocessableEntityResponse({
      type: UnprocessableEntityError,
      description: 'Validation Error',
    }),
    ApiInternalServerErrorResponse({
      type: InternalServerError,
      description: 'Internal Server Error',
    }),
  );
