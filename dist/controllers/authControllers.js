"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../utils/errorHandler");
const jwt_1 = require("../utils/jwt");
const AuthController = () => {
    const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                throw new errorHandler_1.ErrorHandler(400, 'All fields are required');
            }
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser) {
                throw new errorHandler_1.ErrorHandler(400, 'User already exists');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = new User_1.default({ username, email, password: hashedPassword });
            yield newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'all parameters required',
                });
            }
            const user = yield User_1.default.findOne({ email });
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
                return res.status(200).json({
                    status: 'success',
                    statusCode: 401,
                    message: 'Invalid email or password',
                });
            }
            const accessToken = (0, jwt_1.generateAccessToken)(user === null || user === void 0 ? void 0 : user._id);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user === null || user === void 0 ? void 0 : user._id);
            // Store refresh token in a secure cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'successfully signed in',
                userdata: {
                    name: user === null || user === void 0 ? void 0 : user.username,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    id: user === null || user === void 0 ? void 0 : user._id
                },
                accessToken: accessToken
            });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        registerUser,
        loginUser
    };
};
exports.default = AuthController;
