import {
  EmailApiProperty,
  NameApiProperty,
} from '@framework/doc/swagger-properties.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @EmailApiProperty('user')
  email: string;

  @ApiProperty({
    description:
      'Password must contain letters, numbers, and special characters',
    example: 'Password123!',
    minLength: 8,
    maxLength: 20,
  })
  password: string;

  @NameApiProperty('user')
  name: string;

  @ApiProperty({
    description: 'The role of the user.',
    example: 'admin',
    enum: ['admin', 'basic_user'],
    required: true,
  })
  role: string;

  creatorUserId: string;

  organizationId: string;
}
