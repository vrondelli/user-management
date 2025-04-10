import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty()
  id: string;
}
