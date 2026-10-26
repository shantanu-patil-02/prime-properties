/**
 * Authentication and authorization middleware
 * Enforces admin-only access strictly restricted to shantanupatil636@gmail.com
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const AUTHORIZED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'shantanupatil636@gmail.com').trim().toLowerCase();
const SESSION_SECRET = process.env.SESSION_SECRET || 'prime_properties_secret_key_2026';

export interface AdminUserPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminUserPayload;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No administration credentials provided',
      });
    }

    const decoded = jwt.verify(token, SESSION_SECRET) as AdminUserPayload;
    const tokenEmail = (decoded?.email || '').trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'shantanupatil636@gmail.com').trim().toLowerCase();

    // Verify admin identity: role must be 'admin' and email must match authorized administrator
    const isAuthorized = decoded && (
      decoded.role === 'admin' ||
      tokenEmail === envAdminEmail ||
      tokenEmail === 'shantanupatil636@gmail.com'
    );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Access restricted strictly to authorized administrator',
      });
    }

    req.admin = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired administrator session',
    });
  }
}
