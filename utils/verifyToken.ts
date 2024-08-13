// middleware/verifyToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/errorHandler';
import { generateAccessToken } from './jwt';

declare global {
    namespace Express {
        interface Request {
            user_id?: string | any;
        }
    }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken :any = req.header('Authorization');
  const refreshToken = req.cookies.refreshToken;
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET! , (err:any, user:any) => {
        if (err) {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err:any, user:any) => {
                if (err) return next(new ErrorHandler(401, 'Invalid refresh token'));
          
                const newAccessToken = generateAccessToken(user.id);
                res.setHeader('Authorization',newAccessToken)
                req.user_id = user.id; // Attach the decoded user information to the request object
                next();
              });
        }else{
            const newAccessToken = generateAccessToken(user.id);
            res.setHeader('Authorization',newAccessToken)
            next();
        }
    });
  
};

export default verifyToken;
