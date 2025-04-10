import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from "@nestjs/swagger";

export const ApiOkListResponse = <TModel extends Type<any>>(
  responseModel: TModel,
  description?: string,
) => {
  class ListQueryResponseDto extends responseModel {
    @ApiProperty()
    total: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    offset: number;
  }

  Object.defineProperty(ListQueryResponseDto, "name", {
    value: responseModel.name,
  });

  return applyDecorators(
    ApiExtraModels(ListQueryResponseDto),
    ApiOkResponse({
      description,
      schema: { allOf: [{ $ref: getSchemaPath(ListQueryResponseDto) }] },
    }),
  );
};
