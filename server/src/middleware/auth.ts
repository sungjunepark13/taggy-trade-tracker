import { Request, Response, NextFunction } from 'express';
import { verifyJWT, JWTPayload } from '../utils/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT from cookies or Authorization header
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  try {
    // Check for token in cookie first (preferred for web apps)
    let token = req.cookies?.authToken;

    // Fallback to Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const payload = verifyJWT(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional authentication - adds user to request if token is valid, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    let token = req.cookies?.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const payload = verifyJWT(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    next();
  }
}
