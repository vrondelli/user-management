import { ZodValidationPipe } from './zod.pipe';
import z from 'zod';
import { ErrorResponse } from '@framework/errors/error-response';

describe('ZodValidationPipe', () => {
  describe('Given a schema and a value to transform', () => {
    const schema = z.object({
      field: z.string(),
    });

    const pipe = new ZodValidationPipe(schema);

    it('should return data if validation pass', async () => {
      const data = {
        field: 'string',
      };

      const response = pipe.transform(data);

      expect(response).toStrictEqual(data);
    });

    it("should throw an unprocessable entity error if validation don't pass", () => {
      const data = {
        field: 123,
      };

      let error;

      try {
        pipe.transform(data);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ErrorResponse);
    });

    it('show throw an internal server error if zod fails to validate', () => {
      jest.spyOn(schema, 'parse').mockImplementationOnce(() => {
        throw new Error('Sample Error');
      });

      const data = {
        field: 123,
      };

      let error;

      try {
        pipe.transform(data);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ErrorResponse);
    });
  });
});
