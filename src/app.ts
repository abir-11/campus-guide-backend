import { Application, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.router";
import { EventRoutes } from "./modules/eventss/events.router";
import { DepartmentRoutes } from "./modules/departments/departments.router";
import { userRoutes } from "./modules/user/user.router";
import { mentorRoutes } from "./modules/mentor/mentor.router";
import { bookingRoutes } from "./modules/booking/booking.router";
import { storyRoutes } from "./modules/story/story.router";
import { homeContentRoutes } from "./modules/homeContent/homeContent.router";
import { mentorServiceRoutes } from "./modules/mentorService/mentorService.router";
import { mentorProfileRoutes } from "./modules/mentorProfile/mentorProfile.router";
import { resourceRoutes }   from "./modules/resource/resource.router";
import { campusAlertRoutes } from "./modules/campusAlert/campusAlert.router";
import { campusNewsRoutes }  from "./modules/campusNews/campusNews.router";
import { paymentRoutes }     from "./modules/payment/payment.router";
import { payoutRoutes }      from "./modules/payout/payout.router";

const app: Application = express();

// Backend app.ts / main.ts


app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://campus-guide-frontend.vercel.app' 
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (_req: Request, res: Response) => {
  res.send("Campus Guide API is running!");
});

// Existing routes
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/events", EventRoutes);
app.use("/api/departments", DepartmentRoutes);
app.use("/api/mentor-services", mentorServiceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/mentors-apply", mentorProfileRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/home-content", homeContentRoutes);

// New routes
app.use("/api/resources",    resourceRoutes);
app.use("/api/alerts",       campusAlertRoutes);
app.use("/api/campus-news",  campusNewsRoutes);
app.use("/api/payments",     paymentRoutes);
app.use("/api/payouts",      payoutRoutes);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message    || "Internal server error";

  // Log full error server-side but never expose stack traces to clients
  console.error(`[ERROR] ${statusCode}: ${message}`, err.stack ?? "");

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
