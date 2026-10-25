/**
 * Login Rate Limiting Middleware
 * Protects against brute-force attacks by limiting failed login attempts.
 * Max 5 failed attempts per 15 minutes window per IP / identifier.
 */
import { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  blockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function getClientKey(req: Request): string {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const email = (req.body?.email || '').toLowerCase().trim();
  return `${ip}:${email}`;
}

export function loginRateLimiter(req: Request, res: Response, next: NextFunction) {
  const key = getClientKey(req);
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (record) {
    // Check if currently blocked
    if (record.blockedUntil && record.blockedUntil > now) {
      const waitSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return res.status(429).json({
        success: false,
        error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${waitSeconds} seconds.`,
        retryAfter: waitSeconds,
      });
    }

    // Reset window if older than WINDOW_MS
    if (now - record.firstAttemptAt > WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }

  next();
}

export function recordFailedLogin(req: Request) {
  const key = getClientKey(req);
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(key, {
      count: 1,
      firstAttemptAt: now,
    });
  } else {
    record.count += 1;
    if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
    }
    loginAttempts.set(key, record);
  }
}

export function resetLoginAttempts(req: Request) {
  const key = getClientKey(req);
  loginAttempts.delete(key);
}

// Helper to manually reset for tests
export function clearAllLoginAttempts() {
  loginAttempts.clear();
}
