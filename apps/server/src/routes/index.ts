import { Router } from 'express';
import authRoutes from './auth.routes';
import resumeRoutes from './resume.routes';
import aiRoutes from './ai.routes';
import exportRoutes from './export.routes';
import applicationRoutes from './application.routes';
import coverLetterRoutes from './cover-letter.routes';
import notificationRoutes from './notification.routes';
import profileRoutes from './profile.routes';
import savedJobRoutes from './saved-job.routes';
import adminRoutes from './admin.routes';
import prisma from '../lib/prisma';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ai', aiRoutes);
router.use('/export', exportRoutes);
router.use('/applications', applicationRoutes);
router.use('/cover-letters', coverLetterRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profile', profileRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'myRmyC — myresume mycareer API',
    version: '1.0.0',
    neonBranch: process.env.NEON_BRANCH || 'production',
  });
});

// Neon Cloud Status
router.get('/neon-status', async (_req, res) => {
  try {
    const dbInfo = await prisma.$queryRaw<
      Array<{ current_database: string; current_user: string; version: string }>
    >`SELECT current_database(), current_user, version()`;

    const userCount = await prisma.user.count();
    const resumeCount = await prisma.resume.count();
    const sampleResumes = await prisma.resume.findMany({
      select: {
        id: true,
        title: true,
        targetJobTitle: true,
        lastAtsScore: true,
        isPinned: true,
        isSample: true,
        user: {
          select: {
            email: true,
            role: true,
            profile: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    res.json({
      status: 'connected',
      provider: 'Neon Cloud PostgreSQL',
      branch: process.env.NEON_BRANCH || 'production',
      database: dbInfo[0]?.current_database,
      user: dbInfo[0]?.current_user,
      postgresVersion: dbInfo[0]?.version,
      stats: {
        totalUsers: userCount,
        totalResumes: resumeCount,
      },
      resumes: sampleResumes,
    });
  } catch (error: any) {
    console.error('[Neon Status Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to query Neon PostgreSQL',
    });
  }
});

export default router;
