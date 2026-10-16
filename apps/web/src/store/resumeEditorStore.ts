import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  ResumeDocument,
  ResumeBasics,
  ResumeMetadata,
  EducationItem,
  SkillCategory,
  ExperienceItem,
  ProjectItem,
  HonorItem,
  CertificationItem,
  SAMPLE_STUDENT_RESUME_DOCUMENT,
  STRONG_ACTION_VERBS,
} from '@resumeforge/shared';

// Deterministic heuristic score calculation
export function calculateLocalAtsScore(doc: ResumeDocument): number {
  let score = 0;

  // 1. Contact & Header Completeness (up to 20 pts)
  if (doc.basics.fullName && doc.basics.fullName.trim().length > 2) score += 5;
  if (doc.basics.email && doc.basics.email.includes('@')) score += 5;
  if (doc.basics.phone && doc.basics.phone.trim().length >= 6) score += 4;
  if (doc.basics.location && doc.basics.location.trim().length > 2) score += 3;
  if (doc.basics.links && doc.basics.links.length > 0) score += 3;

  // 2. Standard Core Sections Present & Populated (up to 25 pts)
  if (doc.education && doc.education.length > 0) score += 7;
  if (doc.skills && doc.skills.length > 0) score += 6;
  if (doc.experience && doc.experience.length > 0) score += 7;
  if (doc.projects && doc.projects.length > 0) score += 5;

  // 3. Action Verb Strength in Bullets (up to 25 pts)
  const allBullets: string[] = [
    ...(doc.experience?.flatMap((e) => e.bullets) || []),
    ...(doc.projects?.flatMap((p) => p.bullets) || []),
  ];

  if (allBullets.length > 0) {
    const verbsLower = new Set(STRONG_ACTION_VERBS.map((v) => v.toLowerCase()));
    let strongCount = 0;

    allBullets.forEach((bullet) => {
      const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
      if (firstWord && verbsLower.has(firstWord)) {
        strongCount++;
      }
    });

    const strongRatio = strongCount / allBullets.length;
    score += Math.min(25, Math.round(strongRatio * 25));
  } else {
    score += 5; // minimal default
  }

  // 4. Quantifiable Impact & Metrics (up to 20 pts)
  if (allBullets.length > 0) {
    const metricRegex = /\b\d+(\.\d+)?%|\$\d+|\b\d+\s*(ms|s|hours|users|req\/s|rps|million|billion|k|X|x)\b|\b\d{2,}\b/i;
    const metricCount = allBullets.filter((b) => metricRegex.test(b)).length;
    const metricRatio = metricCount / allBullets.length;
    score += Math.min(20, Math.round(metricRatio * 20));
  }

  // 5. Summary / Objective (up to 10 pts)
  if (doc.summary?.content && doc.summary.content.length > 50 && doc.summary.content.length < 500) {
    score += 10;
  } else if (doc.summary?.content && doc.summary.content.length > 0) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

export interface ResumeEditorState {
  resumeId: string | null;
  title: string;
  targetJobTitle: string;
  document: ResumeDocument;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: string | null;
  zoom: number;
  activeSection: string;
  atsScore: number;

  // Actions
  initialize: (resumeId: string, title: string, doc: ResumeDocument, targetJobTitle?: string) => void;
  setTitle: (title: string) => void;
  setTargetJobTitle: (role: string) => void;
  setDocument: (doc: ResumeDocument) => void;
  updateMetadata: (patch: Partial<ResumeMetadata>) => void;
  updateBasics: (patch: Partial<ResumeBasics>) => void;
  updateSummary: (content: string, visible?: boolean) => void;
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionKey: string) => void;

  // Education
  updateEducation: (id: string, patch: Partial<EducationItem>) => void;
  addEducation: (item?: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  // Skills
  updateSkillCategory: (id: string, patch: Partial<SkillCategory>) => void;
  addSkillCategory: (cat?: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;

  // Experience
  updateExperience: (id: string, patch: Partial<ExperienceItem>) => void;
  addExperience: (item?: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (expId: string, text?: string) => void;
  updateExperienceBullet: (expId: string, bulletIdx: number, text: string) => void;
  removeExperienceBullet: (expId: string, bulletIdx: number) => void;

  // Projects
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  addProject: (item?: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  addProjectBullet: (projId: string, text?: string) => void;
  updateProjectBullet: (projId: string, bulletIdx: number, text: string) => void;
  removeProjectBullet: (projId: string, bulletIdx: number) => void;

  // Honors
  updateHonor: (id: string, patch: Partial<HonorItem>) => void;
  addHonor: (item?: Partial<HonorItem>) => void;
  removeHonor: (id: string) => void;

  // Certifications
  updateCertification: (id: string, patch: Partial<CertificationItem>) => void;
  addCertification: (item?: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Editor UI Controls
  setZoom: (zoom: number) => void;
  setActiveSection: (section: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  markSaved: () => void;
}

export const useResumeEditorStore = create<ResumeEditorState>()(
  temporal(
    (set, _get) => ({
      resumeId: null,
      title: 'Untitled Resume',
      targetJobTitle: '',
      document: JSON.parse(JSON.stringify(SAMPLE_STUDENT_RESUME_DOCUMENT)),
      isSaving: false,
      isDirty: false,
      lastSavedAt: null,
      zoom: 1,
      activeSection: 'basics',
      atsScore: calculateLocalAtsScore(SAMPLE_STUDENT_RESUME_DOCUMENT),

      initialize: (resumeId, title, doc, targetJobTitle = '') => {
        set({
          resumeId,
          title: title || 'Untitled Resume',
          targetJobTitle: targetJobTitle || '',
          document: doc,
          isDirty: false,
          atsScore: calculateLocalAtsScore(doc),
        });
      },

      setTitle: (title) => set({ title, isDirty: true }),
      setTargetJobTitle: (targetJobTitle) => set({ targetJobTitle, isDirty: true }),

      setDocument: (document) =>
        set({
          document,
          isDirty: true,
          atsScore: calculateLocalAtsScore(document),
        }),

      updateMetadata: (patch) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            metadata: { ...state.document.metadata, ...patch },
          };
          return {
            document: updatedDoc,
            isDirty: true,
          };
        }),

      updateBasics: (patch) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            basics: { ...state.document.basics, ...patch },
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      updateSummary: (content, visible = true) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            summary: { content, visible },
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      reorderSections: (sectionOrder) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            metadata: { ...state.document.metadata, sectionOrder },
          };
          return {
            document: updatedDoc,
            isDirty: true,
          };
        }),

      toggleSectionVisibility: (sectionKey) =>
        set((state) => {
          // Toggle section in document
          const doc = state.document;
          const currentOrder = doc.metadata.sectionOrder || [];
          let newOrder = [...currentOrder];
          if (newOrder.includes(sectionKey)) {
            newOrder = newOrder.filter((k) => k !== sectionKey);
          } else {
            newOrder.push(sectionKey);
          }
          const updatedDoc = {
            ...doc,
            metadata: { ...doc.metadata, sectionOrder: newOrder },
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      // Education
      updateEducation: (id, patch) =>
        set((state) => {
          const updatedEdu = state.document.education.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          );
          const updatedDoc = { ...state.document, education: updatedEdu };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      addEducation: (item) =>
        set((state) => {
          const newItem: EducationItem = {
            id: `edu-${Date.now()}`,
            institution: '',
            degree: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
            relevantCoursework: [],
            highlights: [],
            visible: true,
            ...item,
          };
          const updatedDoc = {
            ...state.document,
            education: [...state.document.education, newItem],
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      removeEducation: (id) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            education: state.document.education.filter((i) => i.id !== id),
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      // Skills
      updateSkillCategory: (id, patch) =>
        set((state) => {
          const updatedSkills = state.document.skills.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          );
          const updatedDoc = { ...state.document, skills: updatedSkills };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      addSkillCategory: (cat) =>
        set((state) => {
          const newCat: SkillCategory = {
            id: `sk-${Date.now()}`,
            category: 'Technologies & Tools',
            items: ['TypeScript', 'React'],
            visible: true,
            ...cat,
          };
          const updatedDoc = {
            ...state.document,
            skills: [...state.document.skills, newCat],
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      removeSkillCategory: (id) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            skills: state.document.skills.filter((i) => i.id !== id),
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      // Experience
      updateExperience: (id, patch) =>
        set((state) => {
          const updatedExp = state.document.experience.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          );
          const updatedDoc = { ...state.document, experience: updatedExp };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      addExperience: (item) =>
        set((state) => {
          const newItem: ExperienceItem = {
            id: `exp-${Date.now()}`,
            organization: '',
            role: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            bullets: ['Spearheaded development of scalable features improving throughput by 25%.'],
            visible: true,
            ...item,
          };
          const updatedDoc = {
            ...state.document,
            experience: [...state.document.experience, newItem],
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      removeExperience: (id) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            experience: state.document.experience.filter((i) => i.id !== id),
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      addExperienceBullet: (expId, text = 'Engineered automated pipeline reducing latency by 30%.') =>
        set((state) => {
          const updatedExp = state.document.experience.map((item) => {
            if (item.id === expId) {
              return { ...item, bullets: [...item.bullets, text] };
            }
            return item;
          });
          const updatedDoc = { ...state.document, experience: updatedExp };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      updateExperienceBullet: (expId, bulletIdx, text) =>
        set((state) => {
          const updatedExp = state.document.experience.map((item) => {
            if (item.id === expId) {
              const bullets = [...item.bullets];
              bullets[bulletIdx] = text;
              return { ...item, bullets };
            }
            return item;
          });
          const updatedDoc = { ...state.document, experience: updatedExp };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      removeExperienceBullet: (expId, bulletIdx) =>
        set((state) => {
          const updatedExp = state.document.experience.map((item) => {
            if (item.id === expId) {
              const bullets = item.bullets.filter((_, idx) => idx !== bulletIdx);
              return { ...item, bullets };
            }
            return item;
          });
          const updatedDoc = { ...state.document, experience: updatedExp };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      // Projects
      updateProject: (id, patch) =>
        set((state) => {
          const updatedProjects = state.document.projects.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          );
          const updatedDoc = { ...state.document, projects: updatedProjects };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      addProject: (item) =>
        set((state) => {
          const newItem: ProjectItem = {
            id: `proj-${Date.now()}`,
            title: '',
            subtitle: '',
            techStack: ['TypeScript', 'PostgreSQL'],
            date: '',
            liveUrl: '',
            repoUrl: '',
            bullets: ['Architected microservice resolving 10,000+ requests per second.'],
            visible: true,
            ...item,
          };
          const updatedDoc = {
            ...state.document,
            projects: [...state.document.projects, newItem],
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      removeProject: (id) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            projects: state.document.projects.filter((i) => i.id !== id),
          };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      addProjectBullet: (projId, text = 'Designed high-concurrency event bus.') =>
        set((state) => {
          const updatedProjects = state.document.projects.map((item) => {
            if (item.id === projId) {
              return { ...item, bullets: [...item.bullets, text] };
            }
            return item;
          });
          const updatedDoc = { ...state.document, projects: updatedProjects };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      updateProjectBullet: (projId, bulletIdx, text) =>
        set((state) => {
          const updatedProjects = state.document.projects.map((item) => {
            if (item.id === projId) {
              const bullets = [...item.bullets];
              bullets[bulletIdx] = text;
              return { ...item, bullets };
            }
            return item;
          });
          const updatedDoc = { ...state.document, projects: updatedProjects };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      removeProjectBullet: (projId, bulletIdx) =>
        set((state) => {
          const updatedProjects = state.document.projects.map((item) => {
            if (item.id === projId) {
              const bullets = item.bullets.filter((_, idx) => idx !== bulletIdx);
              return { ...item, bullets };
            }
            return item;
          });
          const updatedDoc = { ...state.document, projects: updatedProjects };
          return {
            document: updatedDoc,
            isDirty: true,
            atsScore: calculateLocalAtsScore(updatedDoc),
          };
        }),

      // Honors
      updateHonor: (id, patch) =>
        set((state) => {
          const updatedHonors = state.document.honors.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          );
          const updatedDoc = { ...state.document, honors: updatedHonors };
          return { document: updatedDoc, isDirty: true };
        }),

      addHonor: (item) =>
        set((state) => {
          const newItem: HonorItem = {
            id: `hon-${Date.now()}`,
            title: '',
            issuer: '',
            date: '',
            description: '',
            visible: true,
            ...item,
          };
          const updatedDoc = {
            ...state.document,
            honors: [...state.document.honors, newItem],
          };
          return { document: updatedDoc, isDirty: true };
        }),

      removeHonor: (id) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            honors: state.document.honors.filter((i) => i.id !== id),
          };
          return { document: updatedDoc, isDirty: true };
        }),

      // Certifications
      updateCertification: (id, patch) =>
        set((state) => {
          const updatedCerts = state.document.certifications.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          );
          const updatedDoc = { ...state.document, certifications: updatedCerts };
          return { document: updatedDoc, isDirty: true };
        }),

      addCertification: (item) =>
        set((state) => {
          const newItem: CertificationItem = {
            id: `cert-${Date.now()}`,
            name: '',
            issuer: '',
            date: '',
            credentialId: '',
            credentialUrl: '',
            visible: true,
            ...item,
          };
          const updatedDoc = {
            ...state.document,
            certifications: [...state.document.certifications, newItem],
          };
          return { document: updatedDoc, isDirty: true };
        }),

      removeCertification: (id) =>
        set((state) => {
          const updatedDoc = {
            ...state.document,
            certifications: state.document.certifications.filter((i) => i.id !== id),
          };
          return { document: updatedDoc, isDirty: true };
        }),

      // UI controls
      setZoom: (zoom) => set({ zoom }),
      setActiveSection: (activeSection) => set({ activeSection }),
      setIsSaving: (isSaving) => set({ isSaving }),
      markSaved: () => set({ isDirty: false, isSaving: false, lastSavedAt: new Date().toLocaleTimeString() }),
    }),
    {
      limit: 40,
      partialize: (state) => ({
        document: state.document,
        title: state.title,
        targetJobTitle: state.targetJobTitle,
      }),
    }
  )
);
