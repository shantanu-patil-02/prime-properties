/**
 * Administrator Authentication Controller
 * Strict single-admin access: shantanupatil636@gmail.com
 * Protected by bcrypt, JWT, and brute-force rate limiting
 */
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.ts';
import { AUTHORIZED_ADMIN_EMAIL } from '../middleware/auth.ts';
import { getDbStatus } from '../config/db.ts';
import { recordFailedLogin, resetLoginAttempts } from '../middleware/rateLimiter.ts';

const SESSION_SECRET = process.env.SESSION_SECRET || 'prime_properties_secret_key_2026';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce authorized administrator email
    if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      recordFailedLogin(req);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized administrator credentials',
      });
    }

    let isValid = false;

    if (getDbStatus().isConnected) {
      const adminDoc = await Admin.findOne({ email: AUTHORIZED_ADMIN_EMAIL });
      if (adminDoc && adminDoc.passwordHash) {
        isValid = await bcrypt.compare(password, adminDoc.passwordHash);
      } else {
        isValid = password === 'PrimeAdmin@2026#';
      }
    } else {
      isValid = password === 'PrimeAdmin@2026#';
    }

    if (!isValid) {
      recordFailedLogin(req);
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator password',
      });
    }

    // Login successful: reset failed attempt counter
    resetLoginAttempts(req);

    const token = jwt.sign(
      { email: AUTHORIZED_ADMIN_EMAIL, role: 'admin' },
      SESSION_SECRET,
      { expiresIn: '24h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Administrator authenticated successfully',
      admin: {
        email: AUTHORIZED_ADMIN_EMAIL,
        name: 'Shantanu Patil',
        role: 'Principal Broker / Administrator',
      },
      token,
    });
  } catch (err: any) {
    next(err);
  }
}

export function logout(req: Request, res: Response) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

export function verify(req: Request, res: Response) {
  try {
    let token = req.cookies?.admin_token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'No token provided' });
    }

    const decoded: any = jwt.verify(token, SESSION_SECRET);
    if (!decoded || decoded.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ authenticated: false, error: 'Unauthorized token identity' });
    }

    return res.json({
      authenticated: true,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false, error: 'Session expired or invalid' });
  }
}

export default {
  login,
  logout,
  verify,
};
