/**
 * Blog Routes
 */
import { Router } from 'express';
import * as blogController from '../controllers/blogController.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// Public
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:slug', blogController.getBlogBySlug);

// Admin
router.get('/admin/blogs', requireAdmin, blogController.adminGetBlogs);
router.post('/admin/blogs', requireAdmin, blogController.createBlog);
router.put('/admin/blogs/:id', requireAdmin, blogController.updateBlog);
router.delete('/admin/blogs/:id', requireAdmin, blogController.deleteBlog);

export default router;
