import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';
import { ClassicAtsTemplate } from './ClassicAtsTemplate';
import { ModernProTemplate } from './ModernProTemplate';
import { StudentFresherTemplate } from './StudentFresherTemplate';
import { SweTechTemplate } from './SweTechTemplate';
import { AcademicCvTemplate } from './AcademicCvTemplate';
import { CreativeMinimalTemplate } from './CreativeMinimalTemplate';

interface TemplateRendererProps {
  document: ResumeDocument;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ document }) => {
  const templateId = document.metadata?.templateId || 'classic-ats';

  switch (templateId) {
    case 'modern-professional':
      return <ModernProTemplate document={document} />;
    case 'student-fresher':
      return <StudentFresherTemplate document={document} />;
    case 'software-engineer':
      return <SweTechTemplate document={document} />;
    case 'academic-research':
      return <AcademicCvTemplate document={document} />;
    case 'creative-portfolio':
      return <CreativeMinimalTemplate document={document} />;
    case 'classic-ats':
    default:
      return <ClassicAtsTemplate document={document} />;
  }
};
