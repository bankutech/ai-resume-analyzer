import { resumeRepository, ResumeRepository } from '../repositories/resume.repository';
import { AppError } from '../lib/errors';
import { ResumeDocument, ResumeDocumentSchema, SAMPLE_STUDENT_RESUME_DOCUMENT } from '@resumeforge/shared';

export class ResumeService {
  constructor(private resumeRepo: ResumeRepository = resumeRepository) {}

  async listResumes(userId: string, search?: string) {
    return this.resumeRepo.findByUserId(userId, search);
  }

  async getResume(id: string, userId: string, role: string) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw AppError.notFound('Resume not found');
    }

    if (resume.userId !== userId && role !== 'ADMIN') {
      throw AppError.forbidden('You do not have permission to view this resume');
    }

    return resume;
  }

  async getResumeForPrint(id: string) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw AppError.notFound('Resume not found');
    }
    return resume;
  }

  async createResume(
    userId: string,
    data: {
      title?: string;
      targetJobTitle?: string;
      templateSlug?: string;
      document?: Partial<ResumeDocument>;
      isSample?: boolean;
    }
  ) {
    const baseDocument = data.document
      ? ResumeDocumentSchema.parse({ ...SAMPLE_STUDENT_RESUME_DOCUMENT, ...data.document })
      : SAMPLE_STUDENT_RESUME_DOCUMENT;

    const title = data.title || `${baseDocument.basics.fullName || 'Untitled'} Resume`;
    const targetJobTitle = data.targetJobTitle || baseDocument.basics.headline || '';

    return this.resumeRepo.create({
      userId,
      title,
      targetJobTitle,
      templateSlug: data.templateSlug || 'classic-ats',
      document: baseDocument,
      lastAtsScore: 84,
      isSample: data.isSample ?? false,
    });
  }

  async updateResume(
    id: string,
    userId: string,
    role: string,
    data: {
      title?: string;
      targetJobTitle?: string | null;
      templateSlug?: string;
      document?: any;
      lastAtsScore?: number | null;
      lastAtsReport?: any;
      isPinned?: boolean;
    }
  ) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw AppError.notFound('Resume not found');
    }

    if (resume.userId !== userId && role !== 'ADMIN') {
      throw AppError.forbidden('You do not have permission to update this resume');
    }

    let parsedDocument = resume.document;
    if (data.document) {
      parsedDocument = ResumeDocumentSchema.parse(data.document);
    }

    return this.resumeRepo.update(id, {
      title: data.title ?? resume.title,
      targetJobTitle: data.targetJobTitle !== undefined ? data.targetJobTitle : resume.targetJobTitle,
      templateSlug: data.templateSlug ?? resume.templateSlug,
      document: parsedDocument,
      lastAtsScore: data.lastAtsScore !== undefined ? data.lastAtsScore : resume.lastAtsScore,
      lastAtsReport: data.lastAtsReport !== undefined ? data.lastAtsReport : resume.lastAtsReport,
      isPinned: data.isPinned !== undefined ? data.isPinned : resume.isPinned,
    });
  }

  async deleteResume(id: string, userId: string, role: string) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw AppError.notFound('Resume not found');
    }

    if (resume.userId !== userId && role !== 'ADMIN') {
      throw AppError.forbidden('You do not have permission to delete this resume');
    }

    return this.resumeRepo.delete(id);
  }

  async duplicateResume(id: string, userId: string, role: string) {
    const resume = await this.getResume(id, userId, role);

    return this.resumeRepo.create({
      userId,
      title: `${resume.title} (Copy)`,
      targetJobTitle: resume.targetJobTitle || '',
      templateSlug: resume.templateSlug,
      document: resume.document,
      lastAtsScore: resume.lastAtsScore ?? 0,
      isSample: false,
    });
  }

  async getPublicResume(id: string) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw AppError.notFound('Resume not found');
    }
    return resume;
  }

  async listVersions(resumeId: string, userId: string, role: string) {
    await this.getResume(resumeId, userId, role);
    return this.resumeRepo.getVersions(resumeId);
  }

  async createSnapshot(id: string, userId: string, role: string, label: string) {
    const resume = await this.getResume(id, userId, role);
    const existingVersions = await this.resumeRepo.getVersions(id);
    const versionNumber = existingVersions.length + 1;

    return this.resumeRepo.createVersion({
      resumeId: id,
      userId,
      versionNumber,
      label: label || `Snapshot ${versionNumber} (${new Date().toLocaleDateString()})`,
      documentSnapshot: resume.document,
      atsScoreSnapshot: resume.lastAtsScore,
    });
  }

  async restoreSnapshot(resumeId: string, versionId: string, userId: string, role: string) {
    await this.getResume(resumeId, userId, role);
    const version = await this.resumeRepo.getVersionById(versionId);

    if (!version || version.resumeId !== resumeId) {
      throw AppError.notFound('Version snapshot not found');
    }

    return this.resumeRepo.update(resumeId, {
      document: version.documentSnapshot,
      lastAtsScore: version.atsScoreSnapshot,
    });
  }
}

export const resumeService = new ResumeService();
