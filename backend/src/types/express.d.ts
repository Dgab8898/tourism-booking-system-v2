import type { UserRole } from "./user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export {};
