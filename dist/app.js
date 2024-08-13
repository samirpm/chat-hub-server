"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import path from "path";
const errorHandler_1 = require("./utils/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const socketRoute_1 = require("./routes/socketRoute");
const appRoute_1 = __importDefault(require("./routes/appRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 7000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: '*', // Adjust as needed
    },
});
(0, socketRoute_1.chatSocketHandler)(io);
// DB connection
(0, db_1.connectDB)();
// Global error handler
app.use((err, req, res, next) => {
    logger_1.default.error(err.message, { stack: err.stack });
    (0, errorHandler_1.handleError)(err, req, res, next);
});
process.on("uncaughtException", (error) => {
    logger_1.default.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason) => {
    logger_1.default.error("Unhandled Rejection:", reason);
});
// Routes (uncomment if needed)
app.use('/v1', appRoute_1.default);
// app.use('/admin', AdminRouter);
server.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
