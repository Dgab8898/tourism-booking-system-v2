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
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      /*
       * Store Zod's parsed output.
       *
       * This preserves transformations such as:
       * "1" -> 1
       * "true" -> true
       */
      res.locals.validated = validated;

      /*
       * Update body and params when those sections exist.
       * Query values are read from res.locals in the controller.
       */
      if (
        validated &&
        typeof validated === "object"
      ) {
        const parsed = validated as {
          body?: unknown;
          params?: Record<string, string>;
        };

        if (parsed.body !== undefined) {
          req.body = parsed.body;
        }

        if (parsed.params !== undefined) {
          req.params = parsed.params;
        }
      }

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