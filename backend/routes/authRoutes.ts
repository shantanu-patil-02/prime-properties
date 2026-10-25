/**
 * Administrator Authentication Routes
 */
import { Router } from 'express';
import { login, logout, verify } from '../controllers/authController.ts';
import { loginRateLimiter } from '../middleware/rateLimiter.ts';

const router = Router();

router.post('/admin/login', loginRateLimiter, login);
router.post('/admin/logout', logout);
router.get('/admin/verify', verify);

export default router;
