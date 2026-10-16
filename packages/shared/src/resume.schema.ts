import { z } from 'zod';

export const TemplateSlugSchema = z.enum([
  'classic-ats',
  'modern-professional',
  'student-fresher',
  'software-engineer',
  'academic-research',
  'creative-portfolio',
]);
export type TemplateSlug = z.infer<typeof TemplateSlugSchema>;

export const SectionKeySchema = z.enum([
  'summary',
  'education',
  'skills',
  'experience',
  'projects',
  'honors',
  'certifications',
  'volunteering',
  'publications',
  'languages',
  'custom',
]);
export type SectionKey = z.infer<typeof SectionKeySchema>;

export const LinkItemSchema = z.object({
  id: z.string(),
  label: z.enum(['GitHub', 'LinkedIn', 'Portfolio', 'Google Scholar', 'Website', 'Other']),
  displayHandle: z.string().max(80),
  url: z.string().url('Must be a valid URL including https://'),
});
export type LinkItem = z.infer<typeof LinkItemSchema>;

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  gpa: z.string().max(30).optional().default(''),
  relevantCoursework: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string().min(1, 'Category name is required'),
  items: z.array(z.string()).min(1, 'Add at least one skill'),
  visible: z.boolean().default(true),
});
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const ExperienceItemSchema = z.object({
  id: z.string(),
  organization: z.string().min(1, 'Organization is required'),
  role: z.string().min(1, 'Role title is required'),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string().max(500)).default([]),
  visible: z.boolean().default(true),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const ProjectItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required'),
  subtitle: z.string().optional().default(''),
  techStack: z.array(z.string()).default([]),
  date: z.string().default(''),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  bullets: z.array(z.string().max(500)).default([]),
  visible: z.boolean().default(true),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const HonorItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Honor or award title is required'),
  issuer: z.string().default(''),
  date: z.string().default(''),
  description: z.string().max(400).default(''),
  visible: z.boolean().default(true),
});
export type HonorItem = z.infer<typeof HonorItemSchema>;

export const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().default(''),
  credentialId: z.string().optional().default(''),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  visible: z.boolean().default(true),
});
export type CertificationItem = z.infer<typeof CertificationItemSchema>;

export const CustomEntryItemSchema = z.object({
  id: z.string(),
  heading: z.string().min(1),
  subheading: z.string().optional().default(''),
  date: z.string().optional().default(''),
  location: z.string().optional().default(''),
  bullets: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
});
export type CustomEntryItem = z.infer<typeof CustomEntryItemSchema>;

export const CustomSectionSchema = z.object({
  id: z.string(),
  sectionKey: z.enum(['volunteering', 'publications', 'languages', 'custom']).default('custom'),
  title: z.string().min(1, 'Section title is required'),
  entries: z.array(CustomEntryItemSchema).default([]),
  visible: z.boolean().default(true),
});
export type CustomSection = z.infer<typeof CustomSectionSchema>;

export const ResumeMetadataSchema = z.object({
  templateId: TemplateSlugSchema.default('classic-ats'),
  pageSize: z.enum(['A4', 'LETTER']).default('A4'),
  fontFamily: z.enum(['Inter', 'Merriweather', 'Roboto', 'Source Serif 4', 'JetBrains Mono']).default('Inter'),
  fontSize: z.enum(['compact', 'standard', 'comfortable']).default('standard'), // 9.5pt, 10.5pt, 11.5pt
  lineHeight: z.number().min(1.15).max(1.6).default(1.35),
  marginPreset: z.enum(['narrow', 'normal', 'wide']).default('normal'), // 12mm, 16mm, 20mm
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#1E3A8A'),
  showIcons: z.boolean().default(true),
  sectionOrder: z.array(z.string()).default([
    'summary',
    'education',
    'skills',
    'experience',
    'projects',
    'honors',
    'certifications',
  ]),
  sectionTitles: z.record(z.string(), z.string()).default({
    summary: 'Summary',
    education: 'Education',
    skills: 'Skills',
    experience: 'Professional Experience',
    projects: 'Academic Projects',
    honors: 'Honors & Leadership',
    certifications: 'Certifications',
  }),
});
export type ResumeMetadata = z.infer<typeof ResumeMetadataSchema>;

export const ResumeBasicsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  headline: z.string().max(160).optional().default(''),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required').max(30),
  location: z.string().max(100).default(''),
  links: z.array(LinkItemSchema).max(6).default([]),
});
export type ResumeBasics = z.infer<typeof ResumeBasicsSchema>;

export const ResumeSummarySchema = z.object({
  visible: z.boolean().default(true),
  content: z.string().max(1500).default(''),
});
export type ResumeSummary = z.infer<typeof ResumeSummarySchema>;

export const ResumeDocumentSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  metadata: ResumeMetadataSchema,
  basics: ResumeBasicsSchema,
  summary: ResumeSummarySchema,
  education: z.array(EducationItemSchema).default([]),
  skills: z.array(SkillCategorySchema).default([]),
  experience: z.array(ExperienceItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  honors: z.array(HonorItemSchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
});

export type ResumeDocument = z.infer<typeof ResumeDocumentSchema>;
