import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';

interface TemplateProps {
  document: ResumeDocument;
}

export const ClassicAtsTemplate: React.FC<TemplateProps> = ({ document }) => {
  const { basics, summary, education, skills, experience, projects, honors, certifications, metadata } = document;
  const { sectionOrder, sectionTitles = {}, accentColor = '#111827' } = metadata;

  const renderSectionHeader = (title: string) => (
    <div className="border-b border-gray-400 pb-0.5 mb-2 mt-3.5 first:mt-0">
      <h2
        className="text-[12pt] font-bold tracking-wide uppercase font-serif text-gray-900"
        style={{ color: accentColor !== '#1E3A8A' ? accentColor : '#111827' }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div className="text-gray-900 leading-snug text-[10pt] font-serif">
      {/* Header */}
      <div className="text-center pb-2 border-b border-gray-300">
        <h1 className="text-[20pt] font-bold tracking-tight text-gray-900 uppercase">
          {basics.fullName || 'Alex Rivera'}
        </h1>
        {basics.headline && (
          <p className="text-[10.5pt] font-medium text-gray-700 mt-0.5">{basics.headline}</p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-[9pt] text-gray-600 mt-1">
          {basics.location && <span>{basics.location}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.email && (
            <span>
              • <a href={`mailto:${basics.email}`} className="text-gray-800 underline">{basics.email}</a>
            </span>
          )}
          {basics.links?.map((link) => (
            <span key={link.id}>
              • <a href={link.url} target="_blank" rel="noreferrer" className="text-gray-800 underline">
                {link.displayHandle || link.label}
              </a>
            </span>
          ))}
        </div>
      </div>

      {/* Sections driven by dynamic sectionOrder */}
      {sectionOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'summary':
            if (!summary?.visible || !summary?.content) return null;
            return (
              <section key="summary" className="mb-2">
                {renderSectionHeader(sectionTitles.summary || 'Professional Summary')}
                <p className="text-justify text-[9.5pt] text-gray-800 leading-relaxed">
                  {summary.content}
                </p>
              </section>
            );

          case 'education':
            if (!education || education.length === 0) return null;
            return (
              <section key="education" className="mb-2">
                {renderSectionHeader(sectionTitles.education || 'Education')}
                <div className="space-y-2">
                  {education.filter((e) => e.visible !== false).map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline font-bold text-[10pt]">
                        <span>{edu.institution}</span>
                        <span className="text-[9pt] font-normal text-gray-700">{edu.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-[9.5pt] text-gray-800">
                        <span>{edu.degree}</span>
                        <span className="text-[9pt] not-italic text-gray-600">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      {edu.gpa && (
                        <div className="text-[9pt] text-gray-700 mt-0.5">
                          <span className="font-semibold">Cumulative GPA:</span> {edu.gpa}
                        </div>
                      )}
                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                        <div className="text-[8.5pt] text-gray-700 mt-0.5">
                          <span className="font-semibold">Relevant Coursework:</span>{' '}
                          {edu.relevantCoursework.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'skills':
            if (!skills || skills.length === 0) return null;
            return (
              <section key="skills" className="mb-2">
                {renderSectionHeader(sectionTitles.skills || 'Technical Skills')}
                <div className="space-y-1 text-[9.5pt]">
                  {skills.filter((s) => s.visible !== false).map((skillGroup) => (
                    <div key={skillGroup.id} className="flex items-baseline">
                      <span className="font-bold text-gray-900 w-44 flex-shrink-0">
                        {skillGroup.category}:
                      </span>
                      <span className="text-gray-800">{skillGroup.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'experience':
            if (!experience || experience.length === 0) return null;
            return (
              <section key="experience" className="mb-2">
                {renderSectionHeader(sectionTitles.experience || 'Professional Experience')}
                <div className="space-y-3">
                  {experience.filter((e) => e.visible !== false).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-[10pt]">
                        <span>{exp.organization}</span>
                        <span className="text-[9pt] font-normal text-gray-700">{exp.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-[9.5pt] text-gray-800 mb-1">
                        <span>{exp.role}</span>
                        <span className="text-[9pt] not-italic text-gray-600">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-5 space-y-0.5 text-[9.5pt] text-gray-800">
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-normal">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'projects':
            if (!projects || projects.length === 0) return null;
            return (
              <section key="projects" className="mb-2">
                {renderSectionHeader(sectionTitles.projects || 'Projects')}
                <div className="space-y-2.5">
                  {projects.filter((p) => p.visible !== false).map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-[10pt] text-gray-900 flex items-center gap-2">
                          <span>{proj.title}</span>
                          {proj.techStack && proj.techStack.length > 0 && (
                            <span className="font-normal italic text-[8.5pt] text-gray-600">
                              | {proj.techStack.join(', ')}
                            </span>
                          )}
                        </div>
                        {proj.date && <span className="text-[9pt] text-gray-600">{proj.date}</span>}
                      </div>
                      {proj.subtitle && (
                        <p className="text-[9pt] text-gray-700 italic">{proj.subtitle}</p>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-5 space-y-0.5 text-[9.5pt] text-gray-800 mt-0.5">
                          {proj.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-normal">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'honors':
            if (!honors || honors.length === 0) return null;
            return (
              <section key="honors" className="mb-2">
                {renderSectionHeader(sectionTitles.honors || 'Honors & Awards')}
                <div className="space-y-1">
                  {honors.filter((h) => h.visible !== false).map((honor) => (
                    <div key={honor.id} className="flex justify-between items-baseline text-[9.5pt]">
                      <div>
                        <span className="font-bold">{honor.title}</span>
                        {honor.issuer && <span className="text-gray-700"> — {honor.issuer}</span>}
                        {honor.description && <span className="text-gray-600 text-[8.5pt]"> ({honor.description})</span>}
                      </div>
                      {honor.date && <span className="text-[9pt] text-gray-600">{honor.date}</span>}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'certifications':
            if (!certifications || certifications.length === 0) return null;
            return (
              <section key="certifications" className="mb-2">
                {renderSectionHeader(sectionTitles.certifications || 'Certifications')}
                <div className="space-y-1">
                  {certifications.filter((c) => c.visible !== false).map((cert) => (
                    <div key={cert.id} className="flex justify-between items-baseline text-[9.5pt]">
                      <div>
                        <span className="font-bold">{cert.name}</span>
                        <span className="text-gray-700"> — {cert.issuer}</span>
                      </div>
                      {cert.date && <span className="text-[9pt] text-gray-600">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
