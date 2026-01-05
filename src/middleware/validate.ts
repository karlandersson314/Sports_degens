import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../types';

type Targets = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: Targets = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[target]);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: result.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
      } as ApiResponse);
      return;
    }
    (req as any)[target] = result.data;
    next();
  };
}
