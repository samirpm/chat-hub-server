"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = __importDefault(require("../controllers/authControllers"));
const router = express_1.default.Router();
//auth routes
router.post('/signin', (0, authControllers_1.default)().loginUser);
router.post('/signup', (0, authControllers_1.default)().registerUser);
exports.default = router;
