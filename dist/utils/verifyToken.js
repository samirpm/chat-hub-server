"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const jwt_1 = require("./jwt");
const verifyToken = (req, res, next) => {
    const accessToken = req.header('Authorization');
    const refreshToken = req.cookies.refreshToken;
    jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
                if (err)
                    return next(new errorHandler_1.ErrorHandler(401, 'Invalid refresh token'));
                const newAccessToken = (0, jwt_1.generateAccessToken)(user.id);
                res.setHeader('Authorization', newAccessToken);
                req.user_id = user.id; // Attach the decoded user information to the request object
                next();
            });
        }
        else {
            const newAccessToken = (0, jwt_1.generateAccessToken)(user.id);
            res.setHeader('Authorization', newAccessToken);
            next();
        }
    });
};
exports.default = verifyToken;
