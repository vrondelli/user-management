export type CommandResponse<T = Record<string, never>> = {
  message: string;
} & T;

export enum CommandActions {
  CREATE = 'create',
  UPDATE = 'update',
  GET = 'get',
  DELETE = 'delete',
}

export const getPastTenseAction = (action?: CommandActions): string => {
  switch (action) {
    case CommandActions.CREATE:
      return 'created';
    case CommandActions.UPDATE:
      return 'updated';
    case CommandActions.DELETE:
      return 'deleted';
    case CommandActions.GET:
      return 'fetched';
    default:
      return 'processed';
  }
};

export class CommandResponseBuilder<T> {
  constructor(
    private entity: string,
    private action: CommandActions,
  ) {}

  public buildResponse(payload?: T): CommandResponse<T> {
    return {
      message: `${this.entity} ${getPastTenseAction(this.action)} successfully`,
      ...payload,
    } as CommandResponse<T>;
  }
}
