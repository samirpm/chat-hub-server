// controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { ErrorHandler } from '../utils/errorHandler';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
const AuthController = ()=>{
    const registerUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          throw new ErrorHandler(400, 'All fields are required');
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new ErrorHandler(400, 'User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: IUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
    
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        next(error);
      }
    };
    
    const loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.status(400).json({
              status: 'error',
              statusCode: 400,
              message: 'all parameters required',
            });
          }
      
          const user:any = await User.findOne({ email });
          if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(200).json({
              status: 'success',
              statusCode: 401,
              message: 'Invalid email or password',
            });
          }
      
          const accessToken = generateAccessToken(user?._id);
          const refreshToken = generateRefreshToken(user?._id);
      
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
            userdata : {
              name: user?.username,
              email: user?.email,  
              id: user?._id
            },
            accessToken:accessToken
           });
        } catch (error) {
          next(error);
        }
      };
    return {
        registerUser,
        loginUser
    }
}

export default AuthController;
