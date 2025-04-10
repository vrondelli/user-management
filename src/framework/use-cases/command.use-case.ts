import { Logger } from '@nestjs/common';
import { CommandErrorHandler } from '../errors/command-error-handler';
import {
  CommandActions,
  CommandResponse,
  CommandResponseBuilder,
} from '../responses/command.response';

export abstract class CommandUseCase<
  InputData,
  ResponseData = Record<string, never>,
> {
  static entity: string;
  static action: CommandActions;

  protected logger: Logger;

  protected readonly commandResponseBuilder: CommandResponseBuilder<ResponseData>;
  protected readonly commandErrorHandler: CommandErrorHandler;

  constructor({
    entity,
    action,
    name,
  }: {
    entity: string;
    action: CommandActions;
    name: string;
  }) {
    this.commandResponseBuilder = new CommandResponseBuilder<ResponseData>(
      entity,
      action,
    );

    this.logger = new Logger(name);

    this.commandErrorHandler = new CommandErrorHandler(
      entity,
      action,
      this.logger,
    );
  }

  abstract execute(data: InputData): Promise<CommandResponse<ResponseData>>;

  protected respondWithSuccess(
    data: ResponseData = {} as ResponseData,
  ): CommandResponse<ResponseData> {
    const response = this.commandResponseBuilder.buildResponse(data);
    this.logSuccessResponse(response);
    return response;
  }

  private logSuccessResponse(response: CommandResponse<ResponseData>) {
    this.logger.debug(
      `Command executed successfully with response:`,
      JSON.stringify(response, undefined, 2),
    );
  }
}
