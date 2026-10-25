/**
 * Blog Controller: Public reading and administrator blog management
 */
import { Request, Response } from 'express';
import * as blogService from '../services/blogService.ts';

export async function getBlogs(req: Request, res: Response) {
  try {
    const { category, search } = req.query;
    const blogs = await blogService.getPublishedBlogs({
      category: category as string,
      search: search as string,
    });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve blogs',
    });
  }
}

export async function getBlogBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await blogService.getBlogBySlug(slug);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    res.json(blog);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve article',
    });
  }
}

export async function adminGetBlogs(req: Request, res: Response) {
  try {
    const blogs = await blogService.getAllBlogsAdmin();
    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve admin blogs',
    });
  }
}

export async function createBlog(req: Request, res: Response) {
  try {
    const newBlog = await blogService.createBlog(req.body);
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: newBlog,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create article',
    });
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await blogService.updateBlog(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }
    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update article',
    });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await blogService.deleteBlog(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }
    res.json({
      success: true,
      message: 'Article deleted successfully',
      data: deleted,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete article',
    });
  }
}
