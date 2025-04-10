import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CommandActions,
  getPastTenseAction,
} from '../responses/command.response';

export const ApiCommandUseCaseOkResponse = <
  T extends {
    name: string;
    entity?: string;
    action?: CommandActions;
  },
>(
  useCaseClass: T,
  responseModel?: any,
) => {
  const entity = useCaseClass.entity || 'Entity';
  const pastTenseAction = getPastTenseAction(useCaseClass.action);
  const Model = responseModel || class {};

  class CommandResponseDto extends Model {
    @ApiProperty({
      example: `${entity} ${pastTenseAction} successfully`,
    })
    message: string;
  }

  Object.defineProperty(CommandResponseDto, 'name', {
    value: `${entity}${pastTenseAction.charAt(0).toUpperCase() + pastTenseAction.slice(1)}Response`,
  });

  return applyDecorators(
    ApiExtraModels(CommandResponseDto),
    ApiOkResponse({
      description: `${entity} ${pastTenseAction} successfully`,
      schema: { allOf: [{ $ref: getSchemaPath(CommandResponseDto) }] },
    }),
  );
};
