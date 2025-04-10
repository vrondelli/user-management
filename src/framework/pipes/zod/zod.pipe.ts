import { Logger, PipeTransform } from '@nestjs/common';
import { ErrorReason } from '../../errors/error-reason';
import { ErrorResponse } from '../../errors/error-response';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const data = this.schema.parse(value);

      return data;
    } catch (error) {
      if (error instanceof ZodError) {
        const message = this.createErrorMessage(error);
        this.logger.error(
          `Validation failed for value: ${JSON.stringify(value)}. Issues: ${JSON.stringify(error.format())}`,
        );

        throw new ErrorResponse(
          `Invalid payload: ${message}`,
          422,
          ErrorReason.BUSINESS_RULES,
        );
      }
      this.logger.error('Unexpected error during validation', error);
      throw new ErrorResponse(
        'Internal Server Error',
        500,
        ErrorReason.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private createErrorMessage(error: ZodError) {
    return error.issues
      .map((issue) => {
        if (issue.path.length === 0) {
          return issue.message;
        }
        return issue.path.map(
          (path) => `Invalid field "${path}": ${issue.message}`,
        );
      })
      .flat()
      .join(', ');
  }
}
