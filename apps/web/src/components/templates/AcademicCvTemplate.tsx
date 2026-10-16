import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';

export const AcademicCvTemplate: React.FC<{ document: ResumeDocument }> = ({ document }) => {
  const { basics, summary, education, skills, experience, projects, honors, certifications, metadata } = document;
  const { sectionOrder, sectionTitles = {}, accentColor = '#7C2D12' } = metadata;

  const renderSectionHeader = (title: string) => (
    <div className="border-b-2 border-stone-800 pb-0.5 mb-2 mt-4 first:mt-0">
      <h2
        className="text-[11.5pt] font-serif font-bold tracking-widest uppercase text-stone-900"
        style={{ color: accentColor !== '#1E3A8A' ? accentColor : '#7C2D12' }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div className="text-stone-900 leading-normal text-[9.5pt] font-serif">
      {/* Elegant Academic Header */}
      <div className="text-center pb-3 mb-2 border-b border-stone-300">
        <h1 className="text-[22pt] font-serif tracking-tight text-stone-950 font-normal">
          {basics.fullName || 'Alex Rivera'}
        </h1>
        {basics.headline && (
          <p className="text-[10pt] italic text-stone-700 mt-0.5">{basics.headline}</p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-[8.5pt] text-stone-600 mt-1 font-sans">
          {basics.location && <span>{basics.location}</span>}
          {basics.email && <span>• {basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.links?.map((link) => (
            <span key={link.id}>
              • <a href={link.url} target="_blank" rel="noreferrer" className="underline text-stone-800">
                {link.displayHandle || link.label}
              </a>
            </span>
          ))}
        </div>
      </div>

      {sectionOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'summary':
            if (!summary?.visible || !summary?.content) return null;
            return (
              <section key="summary" className="mb-3">
                {renderSectionHeader(sectionTitles.summary || 'Research Focus & Summary')}
                <p className="text-justify text-[9.5pt] text-stone-800 leading-relaxed font-serif">
                  {summary.content}
                </p>
              </section>
            );

          case 'education':
            if (!education || education.length === 0) return null;
            return (
              <section key="education" className="mb-3">
                {renderSectionHeader(sectionTitles.education || 'Academic Background')}
                <div className="space-y-2">
                  {education.filter((e) => e.visible !== false).map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline font-bold text-[10pt]">
                        <span>{edu.institution}</span>
                        <span className="text-[9pt] font-normal italic text-stone-600">{edu.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-[9.5pt] text-stone-800">
                        <span>{edu.degree}</span>
                        <span className="text-[9pt] not-italic font-sans text-stone-600">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      {edu.gpa && <div className="text-[9pt] text-stone-700">GPA / Marks: {edu.gpa}</div>}
                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                        <div className="text-[8.5pt] text-stone-600 mt-0.5">
                          <em>Curriculum Focus:</em> {edu.relevantCoursework.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'experience':
            if (!experience || experience.length === 0) return null;
            return (
              <section key="experience" className="mb-3">
                {renderSectionHeader(sectionTitles.experience || 'Research & Professional Appointments')}
                <div className="space-y-3">
                  {experience.filter((e) => e.visible !== false).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-[10pt]">
                        <span>{exp.organization}</span>
                        <span className="text-[9pt] font-normal italic text-stone-600">{exp.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-[9.5pt] text-stone-800 mb-1">
                        <span>{exp.role}</span>
                        <span className="text-[8.5pt] font-sans not-italic text-stone-600">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-5 space-y-0.5 text-[9pt] text-stone-800">
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
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
              <section key="projects" className="mb-3">
                {renderSectionHeader(sectionTitles.projects || 'Scholarly Projects & Implementations')}
                <div className="space-y-2">
                  {projects.filter((p) => p.visible !== false).map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[9.5pt] text-stone-900">{proj.title}</span>
                        {proj.date && <span className="text-[8.5pt] font-sans text-stone-600">{proj.date}</span>}
                      </div>
                      {proj.subtitle && <p className="text-[8.5pt] italic text-stone-700">{proj.subtitle}</p>}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-5 space-y-0.5 text-[9pt] text-stone-800 mt-0.5">
                          {proj.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'skills':
            if (!skills || skills.length === 0) return null;
            return (
              <section key="skills" className="mb-3">
                {renderSectionHeader(sectionTitles.skills || 'Technical & Scientific Competencies')}
                <div className="space-y-1 text-[9pt]">
                  {skills.filter((s) => s.visible !== false).map((cat) => (
                    <div key={cat.id} className="flex items-baseline">
                      <span className="font-bold text-stone-900 w-44 flex-shrink-0">{cat.category}:</span>
                      <span className="text-stone-800">{cat.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'honors':
            if (!honors || honors.length === 0) return null;
            return (
              <section key="honors" className="mb-3">
                {renderSectionHeader(sectionTitles.honors || 'Fellowships & Awards')}
                <div className="space-y-1 text-[9pt]">
                  {honors.filter((h) => h.visible !== false).map((hon) => (
                    <div key={hon.id} className="flex justify-between">
                      <span><strong>{hon.title}</strong>, {hon.issuer}</span>
                      <span className="font-sans text-[8.5pt] text-stone-600">{hon.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'certifications':
            if (!certifications || certifications.length === 0) return null;
            return (
              <section key="certifications" className="mb-3">
                {renderSectionHeader(sectionTitles.certifications || 'Accreditations')}
                <div className="space-y-1 text-[9pt]">
                  {certifications.filter((c) => c.visible !== false).map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span><strong>{cert.name}</strong> — {cert.issuer}</span>
                      <span className="font-sans text-[8.5pt] text-stone-600">{cert.date}</span>
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
