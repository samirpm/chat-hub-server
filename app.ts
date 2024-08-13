// app.ts
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import http from "http";
import socketIo from 'socket.io';
import cookieParser from 'cookie-parser';
// import path from "path";
import { ErrorHandler, handleError } from "./utils/errorHandler";
import logger from "./utils/logger";
import { chatSocketHandler } from "./routes/socketRoute";
import AppRouter from "./routes/appRoute"

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 7000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io = new socketIo.Server(server, {
  cors: {
    origin: '*', // Adjust as needed
  },
});

chatSocketHandler(io);

// DB connection
connectDB();

// Global error handler
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { stack: err.stack });
    handleError(err, req, res, next);
  }
);

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

// Routes (uncomment if needed)
app.use('/v1', AppRouter);
// app.use('/admin', AdminRouter);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
