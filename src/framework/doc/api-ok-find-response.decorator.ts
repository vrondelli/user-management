import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export const ApiFindUseCaseOkResponse = <
  T extends {
    responseModel: any;
    entity: string;
  },
>(
  useCaseClass: T,
) => {
  const Model = useCaseClass.responseModel || class {};
  const entity = useCaseClass.entity || "Entity";

  class FindResponseDto extends Model {}

  return applyDecorators(
    ApiExtraModels(FindResponseDto),
    ApiOkResponse({
      description: `${entity} found successfully`,
      schema: { allOf: [{ $ref: getSchemaPath(FindResponseDto) }] },
    }),
  );
};
