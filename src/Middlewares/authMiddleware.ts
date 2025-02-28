import { Request, Response, NextFunction } from 'express';
import AuthService from '../Services/authService';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const userId = AuthService.verifyToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }

  req.body.userId = userId;
  next();
};
