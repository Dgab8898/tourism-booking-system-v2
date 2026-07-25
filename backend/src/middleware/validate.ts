import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { ZodError, type ZodType } from "zod";

export function validate(schema: ZodType): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });

        return;
      }

      next(error);
    }
  };
}
