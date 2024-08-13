import express from 'express';
import AuthController from '../controllers/authControllers';

const router = express.Router();

//auth routes
router.post('/signin',AuthController().loginUser)
router.post('/signup',AuthController().registerUser)
export default router;
