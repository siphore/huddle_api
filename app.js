import express from "express";
import createError from "http-errors";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

dotenv.config();

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import eventsRouter from "./routes/events.js";
import articlesRouter from "./routes/articles.js";
import podcastsRouter from "./routes/podcasts.js";
import opportunitiesRouter from "./routes/opportunities.js";

mongoose
  .connect(process.env.DATABASE_URL || "mongodb://localhost/huddle-api")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit app if DB fails to connect
  });

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://huddle-coach.ch",
  "https://huddle-coach.ch/*",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // If using cookies or authorization headers
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/articles", articlesRouter);
app.use("/podcasts", podcastsRouter);
app.use("/opportunities", opportunitiesRouter);
app.get("/health", (req, res) => res.send("OK"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

export default app;
