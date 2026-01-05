import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, error: { message: 'No token provided' } });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
};

export const requireToolsAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    // Import User model
    const { User } = await import('../models/User');

    // Check if user has tools access
    // DEV helper: allow tools routes without subscription (use only locally)
    if ((process.env.TOOLS_DEV_BYPASS || '').toLowerCase() === 'true') {
      next();
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.hasToolsAccess) {
      res.status(403).json({
        success: false,
        error: { message: 'Tools access required. Please subscribe to access sports betting tools.' },
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Error checking tools access' },
    });
  }
};
