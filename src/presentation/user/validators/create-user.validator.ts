import { z } from 'zod';
import { ZodValidationPipe } from '@framework/pipes/zod/zod.pipe';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain letters, numbers, and special characters',
    )
    .refine((val) => !/\s/.test(val), 'Password must not contain spaces'),

  name: z.string().min(1),
  role: z.string().min(1),
});

export default new ZodValidationPipe(CreateUserSchema);
