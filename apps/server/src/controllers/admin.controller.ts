import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export class AdminController {
  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Database Connection & System Health
      let neonInfo: any = null;
      try {
        const raw = await prisma.$queryRaw<
          Array<{ current_database: string; current_user: string; version: string }>
        >`SELECT current_database(), current_user, version()`;
        if (raw && raw.length > 0) {
          neonInfo = raw[0];
        }
      } catch (err) {
        console.warn('Could not query raw neon info', err);
      }

      // 2. Counts & Aggregates
      const [userCount, resumeCount, appCount, coverLetterCount, avgAtsAggregate] = await Promise.all([
        prisma.user.count(),
        prisma.resume.count(),
        prisma.jobApplication.count(),
        prisma.coverLetter.count(),
        prisma.resume.aggregate({
          _avg: { lastAtsScore: true },
        }),
      ]);

      // 3. Template Usage Distribution
      const templates = await prisma.resume.groupBy({
        by: ['templateSlug'],
        _count: { id: true },
      });

      // 4. AI Usage Telemetry
      const [aiLogCount, aiTokenAgg, recentAiLogs] = await Promise.all([
        prisma.aiUsageLog.count(),
        prisma.aiUsageLog.aggregate({
          _sum: { promptTokens: true, completionTokens: true, latencyMs: true },
          _avg: { latencyMs: true },
        }),
        prisma.aiUsageLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            feature: true,
            model: true,
            promptTokens: true,
            completionTokens: true,
            latencyMs: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

      // 5. Recent System Users
      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              resumes: true,
              applications: true,
            },
          },
        },
      });

      // 6. Recent Audit Logs
      const recentAudits = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: {
          actor: {
            select: {
              email: true,
              role: true,
            },
          },
        },
      });

      const totalTokens =
        (aiTokenAgg._sum.promptTokens || 0) + (aiTokenAgg._sum.completionTokens || 0);
      const promptCost = ((aiTokenAgg._sum.promptTokens || 0) / 1000000) * 0.075;
      const completionCost = ((aiTokenAgg._sum.completionTokens || 0) / 1000000) * 0.3;
      const estimatedCostUsd = Number((promptCost + completionCost).toFixed(4));

      res.json({
        status: 'success',
        data: {
          system: {
            service: 'myRmyC Production Cluster',
            version: '1.0.0',
            neonBranch: process.env.NEON_BRANCH || 'production',
            database: neonInfo?.current_database || 'neondb',
            dbUser: neonInfo?.current_user || 'neondb_owner',
            pgVersion: neonInfo?.version ? neonInfo.version.split(' ')[0] : 'PostgreSQL 16',
            uptimeSeconds: Math.round(process.uptime()),
            memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          },
          summary: {
            totalUsers: userCount,
            totalResumes: resumeCount,
            totalApplications: appCount,
            totalCoverLetters: coverLetterCount,
            averageAtsScore: Math.round(avgAtsAggregate._avg.lastAtsScore || 85),
            totalAiCalls: aiLogCount,
            totalTokensConsumed: totalTokens,
            averageAiLatencyMs: Math.round(aiTokenAgg._avg.latencyMs || 0),
            estimatedCostUsd,
          },
          templateDistribution: templates.map((t) => ({
            templateSlug: t.templateSlug,
            count: t._count.id,
          })),
          recentUsers,
          recentAiLogs,
          recentAudits,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
