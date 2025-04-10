import { ApiPropertyOptional } from "@nestjs/swagger";

export class BaseQueryParametersDto {
  public organizationId: string;

  @ApiPropertyOptional({
    description: "Limit the number of results",
    example: "100",
  })
  public limit?: string;

  @ApiPropertyOptional({ description: "Offset for pagination", example: "100" })
  public offset?: string;
}
