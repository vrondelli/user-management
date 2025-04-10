import { z } from 'zod';
import { ZodValidationPipe } from '@framework/pipes/zod/zod.pipe';

const LoginSchema = z.object({
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
});

export default new ZodValidationPipe(LoginSchema);
