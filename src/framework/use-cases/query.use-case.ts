import { Logger } from '@nestjs/common';
import { QueryErrorHandler } from '@framework/errors/query-error-handler';

export enum QueryActions {
  LIST = 'list',
  FIND = 'find',
}

export abstract class ListQueryUseCase<InputData, ResponseData> {
  private readonly logger: Logger;
  private useCaseName: string;

  protected readonly queryErrorHandler: QueryErrorHandler;

  constructor({
    name,
    entity,
    action,
  }: {
    name: string;
    entity: string;
    action: QueryActions;
  }) {
    this.queryErrorHandler = new QueryErrorHandler(entity, action);
    this.logger = new Logger(name);
    this.useCaseName = name;
  }

  abstract execute(params: InputData): Promise<ResponseData>;

  protected respondWithSuccess(response: ResponseData) {
    this.logger.debug(
      `Query ${this.useCaseName} use case executed successfully with response:`,
      JSON.stringify(response, undefined, 2),
    );
    return response;
  }
}

export abstract class FindQueryUseCase<InputData, ResponseData> {
  static entity: string;
  static action: QueryActions;
  private readonly logger: Logger;
  private useCaseName: string;

  protected readonly queryErrorHandler: QueryErrorHandler;

  constructor({
    name,
    entity,
    action,
  }: {
    name: string;
    entity: string;
    action: QueryActions;
  }) {
    this.queryErrorHandler = new QueryErrorHandler(entity, action);
    this.logger = new Logger(name);
    this.useCaseName = name;
  }

  abstract execute(params: InputData): Promise<ResponseData>;

  protected respondWithSuccess(response: ResponseData) {
    this.logger.debug(
      `Query ${this.useCaseName} use case executed successfully with response:`,
      JSON.stringify(response, undefined, 2),
    );
    return response;
  }
}
