
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  // Configure DNS before importing modules that use MongoDB.
  try {
    const dns = await import('node:dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('[DNS] Public DNS resolvers configured');
  } catch (dnsErr) {
    console.warn('[DNS] Notice: Using system default DNS resolvers:', dnsErr);
  }

  // Load backend modules only after DNS configuration.
  const [
    db,
    propertyRoutesModule,
    blogRoutesModule,
    authRoutesModule,
    inquiryRoutesModule,
    inquiryServiceModule,
    authMiddlewareModule,
    errorHandlerModule,
    seederModule,
    propertyModelModule,
  ] = await Promise.all([
    import('./backend/config/db.ts'),
    import('./backend/routes/propertyRoutes.ts'),
    import('./backend/routes/blogRoutes.ts'),
    import('./backend/routes/authRoutes.ts'),
    import('./backend/routes/inquiryRoutes.ts'),
    import('./backend/services/inquiryService.ts'),
    import('./backend/middleware/auth.ts'),
    import('./backend/middleware/errorHandler.ts'),
    import('./backend/scripts/seedDemoData.ts'),
    import('./backend/models/Property.ts'),
  ]);

  const { connectDB, getDbStatus } = db;
  const propertyRoutes = propertyRoutesModule.default;
  const blogRoutes = blogRoutesModule.default;
  const authRoutes = authRoutesModule.default;
  const inquiryRoutes = inquiryRoutesModule.default;
  const inquiryService = inquiryServiceModule.default;
  const {
    requireAdmin,
    AUTHORIZED_ADMIN_EMAIL,
  } = authMiddlewareModule;
  const { errorHandler } = errorHandlerModule;
  const { runDemoSeeder } = seederModule;
  const { default: Property } = propertyModelModule;

  const app = express();

  // Core middleware
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Serve static images for both /images and legacy /src/assets/images
  const publicImages = path.resolve(__dirname, 'public/images');
  if (fs.existsSync(publicImages)) {
    app.use('/images', express.static(publicImages));
    app.use('/src/assets/images', express.static(publicImages));
  }

  // Initialize MongoDB
  const dbStatus = await connectDB();

  if (dbStatus.isConnected && process.env.NODE_ENV !== 'production') {
    try {
      await runDemoSeeder();
    } catch (err: unknown) {
      console.warn(
        '[Seeder warning]:',
        err instanceof Error ? err.message : err
      );
    }
  }

  // Health and database status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: getDbStatus(),
      administrator: AUTHORIZED_ADMIN_EMAIL,
    });
  });

  // API routes
  app.use('/api', authRoutes);
  app.use('/api', inquiryRoutes);
  app.use('/api', propertyRoutes);
  app.use('/api', blogRoutes);

  // Admin dashboard
  app.get(
    '/api/admin/dashboard',
    requireAdmin,
    async (_req, res, next) => {
      try {
        const inquiries = await inquiryService.getInquiriesAdmin();

        const totalInquiries = inquiries.length;
        const newInquiries = inquiries.filter(
          (i: any) => i.status === 'New'
        ).length;
        const closedInquiries = inquiries.filter(
          (i: any) => i.status === 'Closed'
        ).length;
        const inProgressInquiries = inquiries.filter(
          (i: any) => i.status === 'In Progress'
        ).length;

        const conversionRate =
          totalInquiries > 0
            ? Math.round(
                ((closedInquiries + inProgressInquiries) /
                  totalInquiries) *
                  100
              )
            : 0;

        if (getDbStatus().isConnected) {
          const [
            totalProperties,
            publishedProperties,
            availableProperties,
            properties,
          ] = await Promise.all([
            Property.countDocuments(),
            Property.countDocuments({ isPublished: true }),
            Property.countDocuments({ availability: 'Available' }),
            Property.find().sort({ createdAt: -1 }),
          ]);

          return res.json({
            stats: {
              totalProperties,
              publishedProperties,
              availableProperties,
              totalInquiries,
              newInquiries,
              closedInquiries,
              inProgressInquiries,
              conversionRate,
            },
            inquiries,
            properties,
          });
        }

        // Fallback data is for development UI only.
        // Do not present these records as real properties.
        return res.json({
          stats: {
            totalProperties: 0,
            publishedProperties: 0,
            availableProperties: 0,
            totalInquiries,
            newInquiries,
            closedInquiries,
            inProgressInquiries,
            conversionRate,
          },
          inquiries,
          properties: [],
          demoMode: true,
          message: 'Database unavailable. Displaying no property records.',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  // Centralized error handler
  app.use(errorHandler);

  const distPath = path.resolve(__dirname, 'dist');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Vite development middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Prime Properties server running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exitCode = 1;
});
