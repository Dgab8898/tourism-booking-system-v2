import { handleBookingError } from "./controllers/booking.controller.js";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";

import { handleAuthError } from "./controllers/auth.controller.js";
import authRouter from "./routes/auth.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import tourRouter from "./routes/tour.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Tourism Booking System API is healthy",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/tours", tourRouter);
app.use("/api/bookings", bookingRouter);

app.use(handleAuthError);
app.use(handleBookingError);

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);

export default app;
