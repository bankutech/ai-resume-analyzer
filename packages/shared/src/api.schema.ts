import { z } from 'zod';
import { ResumeDocumentSchema } from './resume.schema';

// Auth Request / Response Schemas
export const SignupRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export const RegisterRequestSchema = SignupRequestSchema;
export type RegisterRequest = SignupRequest;

export const AtsAuditRequestSchema = z.object({
  resumeDocument: ResumeDocumentSchema,
  jobDescription: z.string().optional(),
  resumeId: z.string().optional(),
});
export type AtsAuditRequest = z.infer<typeof AtsAuditRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

// Resume DTOs
export const CreateResumeRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Untitled Resume'),
  templateSlug: z.string().default('classic-ats'),
  targetJobTitle: z.string().optional().default(''),
  document: ResumeDocumentSchema.optional(),
  isSample: z.boolean().default(false),
});
export type CreateResumeRequest = z.infer<typeof CreateResumeRequestSchema>;

export const UpdateResumeRequestSchema = z.object({
  title: z.string().optional(),
  templateSlug: z.string().optional(),
  targetJobTitle: z.string().optional().nullable(),
  document: ResumeDocumentSchema.optional(),
  isPinned: z.boolean().optional(),
  lastAtsScore: z.number().optional().nullable(),
  lastAtsReport: z.any().optional().nullable(),
});
export type UpdateResumeRequest = z.infer<typeof UpdateResumeRequestSchema>;

export const CreateVersionRequestSchema = z.object({
  label: z.string().min(1, 'Version label is required').default('Manual Checkpoint'),
  documentSnapshot: ResumeDocumentSchema,
  atsScoreSnapshot: z.number().optional().nullable(),
});
export type CreateVersionRequest = z.infer<typeof CreateVersionRequestSchema>;

// ATS Finding & Diagnostic Schema
export const AtsAuditFindingSchema = z.object({
  id: z.string(),
  pillar: z.string(),
  severity: z.enum(['CRITICAL', 'WARNING', 'OPTIMIZATION', 'PASSED']),
  title: z.string(),
  reason: z.string(),
  impactPoints: z.number(),
  targetSection: z.string().optional(),
  excerpt: z.string().optional(),
  practicalFix: z.string(),
});
export type AtsAuditFinding = z.infer<typeof AtsAuditFindingSchema>;

export const AtsAuditResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  breakdown: z.object({
    contactCompleteness: z.number(),
    standardSectionHeadings: z.number(),
    sectionCompleteness: z.number(),
    actionVerbStrength: z.number(),
    quantifiableImpact: z.number(),
    formattingAndSafety: z.number(),
    consistencyAndRepetition: z.number(),
    keywordAlignment: z.number(),
  }),
  findings: z.array(AtsAuditFindingSchema),
  wordCount: z.number(),
  bulletCount: z.number(),
  metricsRatio: z.number(),
  strongVerbsRatio: z.number(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  provider: z.enum(['gemini-2.5-flash', 'heuristic-fallback']).optional().default('heuristic-fallback'),
});
export type AtsAuditResult = z.infer<typeof AtsAuditResultSchema>;

// AI Workflows DTOs
export const AiRewriteBulletRequestSchema = z.object({
  bullet: z.string().min(5, 'Bullet text is too short'),
  roleTitle: z.string().optional().default('Software Engineer'),
  techStack: z.array(z.string()).default([]),
  mode: z.enum(['IMPACT_XYZ', 'CONCISE', 'GRAMMAR', 'ACTION_VERB']).default('IMPACT_XYZ'),
});
export type AiRewriteBulletRequest = z.infer<typeof AiRewriteBulletRequestSchema>;

export const AiRewriteBulletResponseSchema = z.object({
  original: z.string(),
  provider: z.enum(['gemini-2.5-flash', 'heuristic-fallback']).optional().default('heuristic-fallback'),
  variations: z.array(
    z.object({
      label: z.string(), // "Conservative Polish" | "XYZ Impact Driven" | "Technical Deep-Dive"
      text: z.string(),
      explanation: z.string(),
      hasPlaceholder: z.boolean(),
    })
  ),
});
export type AiRewriteBulletResponse = z.infer<typeof AiRewriteBulletResponseSchema>;

export const AiGenerateSummaryRequestSchema = z.object({
  resumeId: z.string().optional(),
  targetRole: z.string().default('Software Engineer'),
  tone: z.enum(['student-technical', 'experienced', 'research']).default('student-technical'),
});
export type AiGenerateSummaryRequest = z.infer<typeof AiGenerateSummaryRequestSchema>;

// Job Applications & CRM DTOs
export const JobApplicationRequestSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  roleTitle: z.string().min(1, 'Role title is required'),
  location: z.string().optional().default(''),
  status: z.enum(['SAVED', 'APPLIED', 'ONLINE_ASSESSMENT', 'INTERVIEWING', 'OFFER', 'REJECTED', 'WITHDRAWN']).default('SAVED'),
  resumeId: z.string().optional().nullable(),
  jobDescriptionId: z.string().optional().nullable(),
  jobUrl: z.string().url().optional().or(z.literal('')).nullable(),
  salaryRange: z.string().optional().nullable(),
  appliedDate: z.string().optional().nullable(),
  nextFollowUpDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type JobApplicationRequest = z.infer<typeof JobApplicationRequestSchema>;

// Saved Jobs DTO
export const SavedJobRequestSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  roleTitle: z.string().min(1, 'Role title is required'),
  location: z.string().optional().default(''),
  jobUrl: z.string().url().optional().or(z.literal('')).nullable(),
  rawSnippet: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  priority: z.number().min(1).max(3).default(2),
});
export type SavedJobRequest = z.infer<typeof SavedJobRequestSchema>;

// Cover Letter DTO
export const CoverLetterRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().optional().default(''),
  roleTitle: z.string().optional().default(''),
  resumeId: z.string().optional().nullable(),
  jobDescriptionId: z.string().optional().nullable(),
  tone: z.string().default('professional'),
  content: z.string().min(10, 'Content is required'),
});
export type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>;

// Feedback DTO
export const FeedbackRequestSchema = z.object({
  category: z.enum(['BUG', 'FEATURE_REQUEST', 'TEMPLATE_FEEDBACK', 'GENERAL']).default('GENERAL'),
  rating: z.number().min(1).max(5).optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  pagePath: z.string().optional(),
});
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
