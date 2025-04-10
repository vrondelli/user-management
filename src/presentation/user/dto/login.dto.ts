import { EmailApiProperty } from '@framework/doc/swagger-properties.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @EmailApiProperty('user')
  email: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'Password123!',
    minLength: 8,
    maxLength: 20,
  })
  password: string;
}
