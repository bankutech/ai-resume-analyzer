import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';

export const ModernProTemplate: React.FC<{ document: ResumeDocument }> = ({ document }) => {
  const { basics, summary, education, skills, experience, projects, honors, certifications, metadata } = document;
  const { sectionOrder, sectionTitles = {}, accentColor = '#2563EB' } = metadata;

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center gap-3 mb-2 mt-4 first:mt-0">
      <h2
        className="text-[11pt] font-bold tracking-wider uppercase font-sans"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <div className="flex-1 h-[1.5px]" style={{ backgroundColor: `${accentColor}33` }} />
    </div>
  );

  return (
    <div className="text-slate-900 leading-normal text-[9.5pt] font-sans">
      {/* Header with modern left-aligned accent border */}
      <div className="border-l-4 pl-4 py-1 mb-4" style={{ borderColor: accentColor }}>
        <h1 className="text-[22pt] font-display font-extrabold tracking-tight text-slate-950">
          {basics.fullName || 'Alex Rivera'}
        </h1>
        {basics.headline && (
          <p className="text-[11pt] font-semibold text-slate-700 mt-0.5" style={{ color: accentColor }}>
            {basics.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 text-[8.5pt] text-slate-600 mt-2 font-mono">
          {basics.location && <span>📍 {basics.location}</span>}
          {basics.phone && <span>📞 {basics.phone}</span>}
          {basics.email && (
            <span>
              ✉️ <a href={`mailto:${basics.email}`} className="hover:underline">{basics.email}</a>
            </span>
          )}
          {basics.links?.map((link) => (
            <span key={link.id}>
              🔗 <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
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
                {renderSectionHeader(sectionTitles.summary || 'Executive Summary')}
                <p className="text-slate-800 text-[9.5pt] leading-relaxed">
                  {summary.content}
                </p>
              </section>
            );

          case 'experience':
            if (!experience || experience.length === 0) return null;
            return (
              <section key="experience" className="mb-3">
                {renderSectionHeader(sectionTitles.experience || 'Experience')}
                <div className="space-y-3">
                  {experience.filter((e) => e.visible !== false).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[10pt] text-slate-900">{exp.role}</span>
                        <span className="text-[8.5pt] font-mono text-slate-500">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[9pt] text-slate-600 mb-1">
                        <span className="font-medium" style={{ color: accentColor }}>{exp.organization}</span>
                        <span>{exp.location}</span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-slate-700">
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

          case 'skills':
            if (!skills || skills.length === 0) return null;
            return (
              <section key="skills" className="mb-3">
                {renderSectionHeader(sectionTitles.skills || 'Core Competencies')}
                <div className="grid grid-cols-1 gap-1.5">
                  {skills.filter((s) => s.visible !== false).map((group) => (
                    <div key={group.id} className="flex items-center gap-2 text-[9pt]">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wider w-36 flex-shrink-0">
                        {group.category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {group.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[8.5pt] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'projects':
            if (!projects || projects.length === 0) return null;
            return (
              <section key="projects" className="mb-3">
                {renderSectionHeader(sectionTitles.projects || 'Key Projects')}
                <div className="space-y-2.5">
                  {projects.filter((p) => p.visible !== false).map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[9.5pt] text-slate-900">{proj.title}</span>
                        {proj.date && <span className="text-[8.5pt] font-mono text-slate-500">{proj.date}</span>}
                      </div>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-0.5">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="text-[8pt] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-slate-700">
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

          case 'education':
            if (!education || education.length === 0) return null;
            return (
              <section key="education" className="mb-3">
                {renderSectionHeader(sectionTitles.education || 'Education')}
                <div className="space-y-2">
                  {education.filter((e) => e.visible !== false).map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline font-bold text-[9.5pt]">
                        <span>{edu.institution}</span>
                        <span className="text-[8.5pt] font-mono font-normal text-slate-500">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      <div className="text-[9pt] text-slate-700">{edu.degree}</div>
                      {edu.gpa && <div className="text-[8.5pt] text-slate-600">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'honors':
            if (!honors || honors.length === 0) return null;
            return (
              <section key="honors" className="mb-3">
                {renderSectionHeader(sectionTitles.honors || 'Honors')}
                <div className="space-y-1 text-[9pt]">
                  {honors.filter((h) => h.visible !== false).map((hon) => (
                    <div key={hon.id} className="flex justify-between">
                      <span><strong>{hon.title}</strong> — {hon.issuer}</span>
                      <span className="font-mono text-[8.5pt] text-slate-500">{hon.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'certifications':
            if (!certifications || certifications.length === 0) return null;
            return (
              <section key="certifications" className="mb-3">
                {renderSectionHeader(sectionTitles.certifications || 'Certifications')}
                <div className="space-y-1 text-[9pt]">
                  {certifications.filter((c) => c.visible !== false).map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span><strong>{cert.name}</strong> ({cert.issuer})</span>
                      <span className="font-mono text-[8.5pt] text-slate-500">{cert.date}</span>
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
