import { z } from 'zod';

export const TemplateIdSchema = z.enum([
  'classic-ats',
  'modern-pro',
  'student-fresher',
  'swe-tech',
  'academic-cv',
  'creative-minimal',
]);
export type TemplateId = z.infer<typeof TemplateIdSchema>;

export const PageSizeSchema = z.enum(['A4', 'LETTER']);
export type PageSize = z.infer<typeof PageSizeSchema>;

export const FontFamilySchema = z.enum([
  'Inter',
  'Merriweather',
  'Roboto',
  'Source Serif Pro',
]);
export type FontFamily = z.infer<typeof FontFamilySchema>;

export const FontSizeSchema = z.enum(['sm', 'md', 'lg']);
export type FontSize = z.infer<typeof FontSizeSchema>;

export const MarginSizeSchema = z.enum(['compact', 'normal', 'spacious']);
export type MarginSize = z.infer<typeof MarginSizeSchema>;

export const HexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
  message: 'Must be a valid hex color code (e.g., #0F172A)',
});

export const MetadataSchema = z.object({
  templateId: TemplateIdSchema.default('classic-ats'),
  pageSize: PageSizeSchema.default('A4'),
  accentColor: HexColorSchema.default('#0F172A'),
  fontFamily: FontFamilySchema.default('Inter'),
  fontSize: FontSizeSchema.default('md'),
  marginSize: MarginSizeSchema.default('normal'),
  sectionOrder: z.array(z.string()).default([
    'education',
    'skills',
    'experience',
    'projects',
    'honorsAndLeadership',
    'certifications',
    'customSections',
  ]),
});
export type ResumeMetadata = z.infer<typeof MetadataSchema>;

export const LinkSchema = z.object({
  id: z.string(),
  label: z.enum(['GitHub', 'LinkedIn', 'Portfolio', 'Other']),
  url: z.string().url('Must be a valid URL'),
});
export type ResumeLink = z.infer<typeof LinkSchema>;

export const BasicsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  headline: z.string().default(''),
  email: z.string().email('Valid email is required'),
  phone: z.string().default(''),
  location: z.string().default(''),
  links: z.array(LinkSchema).default([]),
  summary: z.string().default(''),
});
export type ResumeBasics = z.infer<typeof BasicsSchema>;

export const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().default(''),
  degree: z.string().min(1, 'Degree is required'),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  gpa: z.string().optional(),
  relevantCoursework: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
});
export type EducationEntry = z.infer<typeof EducationEntrySchema>;

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string().min(1, 'Category name is required'),
  items: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
});
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  organization: z.string().min(1, 'Organization is required'),
  role: z.string().min(1, 'Role title is required'),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
});
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;

export const ProjectEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required'),
  subtitle: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  bullets: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
});
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const HonorEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Award or honor title is required'),
  issuerOrOrg: z.string().default(''),
  date: z.string().default(''),
  description: z.string().default(''),
  visible: z.boolean().default(true),
});
export type HonorEntry = z.infer<typeof HonorEntrySchema>;

export const CertificationEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().default(''),
  issueDate: z.string().default(''),
  credentialUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  visible: z.boolean().default(true),
});
export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;

export const CustomSectionEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Entry title is required'),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});
export type CustomSectionEntry = z.infer<typeof CustomSectionEntrySchema>;

export const CustomSectionSchema = z.object({
  id: z.string(),
  sectionTitle: z.string().min(1, 'Section title is required'),
  entries: z.array(CustomSectionEntrySchema).default([]),
  visible: z.boolean().default(true),
});
export type CustomSection = z.infer<typeof CustomSectionSchema>;

export const ResumeSectionsSchema = z.object({
  education: z.array(EducationEntrySchema).default([]),
  skills: z.array(SkillCategorySchema).default([]),
  experience: z.array(ExperienceEntrySchema).default([]),
  projects: z.array(ProjectEntrySchema).default([]),
  honorsAndLeadership: z.array(HonorEntrySchema).default([]),
  certifications: z.array(CertificationEntrySchema).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
});
export type ResumeSections = z.infer<typeof ResumeSectionsSchema>;

export const ResumeDocumentSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  metadata: MetadataSchema,
  basics: BasicsSchema,
  sections: ResumeSectionsSchema,
});
export type ResumeDocument = z.infer<typeof ResumeDocumentSchema>;

// Seed / Sample Baseline Data (Strictly non-PII, realistic engineer persona)
export const sampleResumeDocument: ResumeDocument = {
  schemaVersion: 1,
  metadata: {
    templateId: 'classic-ats',
    pageSize: 'A4',
    accentColor: '#1E293B',
    fontFamily: 'Inter',
    fontSize: 'md',
    marginSize: 'normal',
    sectionOrder: [
      'education',
      'skills',
      'experience',
      'projects',
      'honorsAndLeadership',
      'certifications',
      'customSections',
    ],
  },
  basics: {
    fullName: 'Alex Rivera — Sample Profile',
    headline: 'Senior Systems & Cloud Infrastructure Engineer',
    email: 'alex.rivera.preview@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    links: [
      { id: 'lnk-1', label: 'GitHub', url: 'https://github.com/alexrivera-sample' },
      { id: 'lnk-2', label: 'LinkedIn', url: 'https://linkedin.com/in/alexrivera-sample' },
      { id: 'lnk-3', label: 'Portfolio', url: 'https://alexrivera-eng.example.com' },
    ],
    summary:
      'Systems engineer with 5+ years of experience architecting distributed event-driven microservices, high-throughput streaming pipelines, and Kubernetes control planes. Reduced p99 tail latency by 42% across core payment workflows handling 250M daily transactions.',
  },
  sections: {
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        degree: 'B.S. in Electrical Engineering & Computer Sciences (EECS)',
        startDate: 'Aug 2017',
        endDate: 'May 2021',
        gpa: '3.89 / 4.00',
        relevantCoursework: [
          'Distributed Systems',
          'Operating Systems',
          'Database Design',
          'Algorithms & Intractability',
          'Computer Architecture',
        ],
        visible: true,
      },
    ],
    skills: [
      {
        id: 'skl-1',
        category: 'Languages',
        items: ['Go', 'Rust', 'TypeScript', 'Python', 'C++', 'SQL'],
        visible: true,
      },
      {
        id: 'skl-2',
        category: 'Distributed Systems & Cloud',
        items: ['Kubernetes', 'Docker', 'Apache Kafka', 'gRPC', 'AWS (EKS, RDS, S3)', 'Terraform', 'Prometheus'],
        visible: true,
      },
      {
        id: 'skl-3',
        category: 'Databases & Storage',
        items: ['PostgreSQL', 'Redis', 'Cassandra', 'ClickHouse', 'Prisma ORM'],
        visible: true,
      },
    ],
    experience: [
      {
        id: 'exp-1',
        organization: 'Helios Distributed Systems',
        role: 'Senior Infrastructure Engineer',
        location: 'San Francisco, CA',
        startDate: 'Jun 2023',
        endDate: 'Present',
        isCurrent: true,
        bullets: [
          'Designed and deployed an internal zero-trust service mesh across 4 multi-region EKS clusters, reducing network egress cost by $180K/year.',
          'Engineered a distributed deduplication engine processing 45,000 requests/sec with Redis and Kafka, eliminating 99.8% of duplicate event deliveries.',
          'Led architecture review for team of 14 engineers; established automated canary deployments with ArgoCD, driving deploy failure rate from 4.2% to under 0.15%.',
        ],
        visible: true,
      },
      {
        id: 'exp-2',
        organization: 'Apex Ledger Technologies',
        role: 'Distributed Systems Engineer',
        location: 'San Jose, CA',
        startDate: 'Jul 2021',
        endDate: 'May 2023',
        isCurrent: false,
        bullets: [
          'Implemented high-throughput ledger reconciliation worker pool in Go, slashing nightly batch completion window from 5.4 hours to 48 minutes.',
          'Optimized PostgreSQL partitioning and write-ahead log settings, sustaining 14,000 write ops/sec without connection pool starvation.',
          'Constructed telemetry dashboards in Grafana with custom OpenTelemetry exporters to detect memory leaks and goroutine starvation.',
        ],
        visible: true,
      },
    ],
    projects: [
      {
        id: 'prj-1',
        title: 'KubeVault — Ephemeral Secret Injection Controller',
        subtitle: 'Kubernetes Custom Resource & Admission Webhook',
        techStack: ['Go', 'Kubernetes Client-go', 'Vault API', 'Docker'],
        startDate: 'Jan 2024',
        endDate: 'May 2024',
        link: 'https://github.com/alexrivera-sample/kubevault',
        bullets: [
          'Authored a Mutating Admission Webhook that intercepts pod creation requests to inject transient cryptographic tokens directly into shared memory volumes.',
          'Benchmarked pod startup latency overhead to less than 12ms per invocation across 500 concurrent container initializations.',
        ],
        visible: true,
      },
      {
        id: 'prj-2',
        title: 'AuraStream — Distributed CDC Replication Pipe',
        subtitle: 'Change Data Capture Engine for PostgreSQL WAL',
        techStack: ['Rust', 'Tokio', 'PostgreSQL Logical Replication', 'Kafka'],
        startDate: 'Aug 2023',
        endDate: 'Nov 2023',
        link: 'https://github.com/alexrivera-sample/aurastream',
        bullets: [
          'Engineered a Rust-based replication streaming client reading raw Postgres WAL frames and publishing structured Avro payloads to Kafka.',
          'Achieved zero message loss during partition rebalances through custom deterministic offset commit sequencing.',
        ],
        visible: true,
      },
    ],
    honorsAndLeadership: [
      {
        id: 'hnr-1',
        title: '1st Place Winner — CalHacks Open Distributed Infrastructure Track',
        issuerOrOrg: 'CalHacks Foundation',
        date: 'Oct 2020',
        description: 'Built a decentralized fault-tolerant file chunking protocol utilizing erasure coding across mobile ad-hoc networks.',
        visible: true,
      },
      {
        id: 'hnr-2',
        title: 'Dean’s Honor List (6 Consecutive Semesters)',
        issuerOrOrg: 'UC Berkeley College of Engineering',
        date: '2018 – 2021',
        description: 'Awarded for maintaining semester GPA in the top 4% of the engineering class.',
        visible: true,
      },
    ],
    certifications: [
      {
        id: 'crt-1',
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        issueDate: 'Sep 2023',
        credentialUrl: 'https://www.credly.com/sample-badge',
        visible: true,
      },
      {
        id: 'crt-2',
        name: 'AWS Certified Solutions Architect – Professional',
        issuer: 'Amazon Web Services',
        issueDate: 'Jan 2024',
        credentialUrl: 'https://www.credly.com/sample-badge',
        visible: true,
      },
    ],
    customSections: [],
  },
};
