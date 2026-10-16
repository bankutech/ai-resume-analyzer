import { z } from 'zod';
import { ResumeDocumentSchema } from './resume';

export const AtsKeywordMatchSchema = z.object({
  keyword: z.string(),
  found: z.boolean(),
  category: z.enum(['Technical Skills', 'Methodologies', 'Certifications & Education', 'Soft Skills', 'Domain']),
  importance: z.enum(['critical', 'high', 'medium', 'low']),
  frequency: z.number().default(0),
});
export type AtsKeywordMatch = z.infer<typeof AtsKeywordMatchSchema>;

export const AtsBulletFeedbackSchema = z.object({
  originalBullet: z.string(),
  suggestedBullet: z.string(),
  critique: z.string(),
  actionVerbStrength: z.enum(['strong', 'average', 'weak']),
  hasMetrics: z.boolean(),
  xyzFormulaApplied: z.boolean(),
});
export type AtsBulletFeedback = z.infer<typeof AtsBulletFeedbackSchema>;

export const AtsAuditRequestSchema = z.object({
  resumeDocument: ResumeDocumentSchema,
  jobDescription: z.string().min(20, 'Job description must be at least 20 characters for meaningful analysis'),
  targetRole: z.string().optional(),
});
export type AtsAuditRequest = z.infer<typeof AtsAuditRequestSchema>;

export const AtsAuditResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z.object({
    keywordMatch: z.number().min(0).max(100),
    quantifiableImpact: z.number().min(0).max(100),
    brevityAndFormatting: z.number().min(0).max(100),
    sectionCompleteness: z.number().min(0).max(100),
  }),
  keywordMatches: z.array(AtsKeywordMatchSchema),
  missingKeywords: z.array(z.string()),
  bulletFeedbacks: z.array(AtsBulletFeedbackSchema),
  formattingIssues: z.array(z.string()),
  summaryRecommendation: z.string(),
});
export type AtsAuditResult = z.infer<typeof AtsAuditResultSchema>;

export const BulletImproveRequestSchema = z.object({
  bullet: z.string().min(5, 'Bullet text is too short'),
  role: z.string().optional(),
  targetIndustry: z.string().optional(),
  focusMetric: z.enum(['latency', 'revenue', 'scale', 'accuracy', 'reliability', 'general']).default('general'),
});
export type BulletImproveRequest = z.infer<typeof BulletImproveRequestSchema>;

export const BulletImproveResponseSchema = z.object({
  original: z.string(),
  enhancedOptions: z.array(
    z.object({
      label: z.string(), // e.g. "Google X-Y-Z Metric Driven", "Executive Impact", "Concise High-Density"
      text: z.string(),
      metricsAdded: z.string(),
    })
  ),
  explanation: z.string(),
});
export type BulletImproveResponse = z.infer<typeof BulletImproveResponseSchema>;
