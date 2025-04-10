import { createApiPropertyDecorator } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export const NameApiProperty = (entity: string, required: boolean = true) =>
  createApiPropertyDecorator({
    description: `The ${entity} name`,
    required,
  });

export const DateIsoApiProperty = (required: boolean = true) =>
  createApiPropertyDecorator({
    description: `Date in ISO format`,
    example: '2021-01-01T00:00:00.000Z',
    required,
  });

export const IdsApiProperty = (entity: string, required: boolean = true) =>
  createApiPropertyDecorator({
    type: [Number],
    required,
    description: `${entity} ids`,
  });

export const PasswordApiProperty = (required: boolean = true) =>
  createApiPropertyDecorator({
    description:
      'Password must contain letters, numbers, and special characters',
    example: 'Password123!',
    minLength: 8,
    maxLength: 20,
    required,
  });

export const EmailApiProperty = (entity: string, required: boolean = true) =>
  createApiPropertyDecorator({
    description: `The email of a ${entity}`,
    required,
  });
