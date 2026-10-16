import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';

export const SweTechTemplate: React.FC<{ document: ResumeDocument }> = ({ document }) => {
  const { basics, summary, education, skills, experience, projects, honors, certifications, metadata } = document;
  const { sectionOrder, sectionTitles = {}, accentColor = '#059669' } = metadata;

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center gap-2 mb-2 mt-3.5 first:mt-0 font-mono">
      <span className="text-[10pt] font-bold" style={{ color: accentColor }}>//</span>
      <h2 className="text-[10.5pt] font-bold tracking-tight uppercase text-slate-900">
        {title}
      </h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );

  return (
    <div className="text-slate-900 leading-normal text-[9pt] font-sans">
      {/* Tech Top Header with Monospace Telemetry */}
      <div className="border-b-2 border-slate-900 pb-2.5 mb-3">
        <div className="flex justify-between items-baseline">
          <h1 className="text-[22pt] font-display font-extrabold tracking-tight text-slate-950">
            {basics.fullName || 'Alex Rivera'}
          </h1>
          <span className="font-mono text-[8pt] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            SWE / INFRA ARCHETYPE
          </span>
        </div>
        {basics.headline && (
          <p className="font-mono text-[9.5pt] font-medium text-slate-700 mt-0.5" style={{ color: accentColor }}>
            &gt; {basics.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 text-[8.5pt] font-mono text-slate-600 mt-1.5">
          {basics.email && (
            <a href={`mailto:${basics.email}`} className="hover:underline text-slate-800">
              {basics.email}
            </a>
          )}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.location && <span>• {basics.location}</span>}
          {basics.links?.map((link) => (
            <span key={link.id}>
              • <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline font-semibold" style={{ color: accentColor }}>
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
              <section key="summary" className="mb-2.5">
                {renderSectionHeader(sectionTitles.summary || 'Engineering Profile')}
                <p className="text-[9pt] text-slate-700 leading-relaxed font-sans">{summary.content}</p>
              </section>
            );

          case 'skills':
            if (!skills || skills.length === 0) return null;
            return (
              <section key="skills" className="mb-2.5 font-mono">
                {renderSectionHeader(sectionTitles.skills || 'Technical Stack')}
                <div className="space-y-1 text-[8.5pt]">
                  {skills.filter((s) => s.visible !== false).map((cat) => (
                    <div key={cat.id} className="flex items-baseline">
                      <span className="font-bold text-slate-900 w-44 flex-shrink-0 text-[8.5pt]">
                        [{cat.category}]
                      </span>
                      <span className="text-slate-800 font-sans font-medium">{cat.items.join(' • ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'experience':
            if (!experience || experience.length === 0) return null;
            return (
              <section key="experience" className="mb-2.5">
                {renderSectionHeader(sectionTitles.experience || 'Experience & Impact')}
                <div className="space-y-3">
                  {experience.filter((e) => e.visible !== false).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-mono text-[9pt]">
                        <span className="font-bold text-slate-900 font-sans text-[9.5pt]">{exp.role}</span>
                        <span className="text-slate-500 text-[8pt]">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[8.5pt] font-mono text-slate-600 mb-1">
                        <span className="font-bold" style={{ color: accentColor }}>@ {exp.organization}</span>
                        <span>{exp.location}</span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[8.5pt] text-slate-700 leading-normal">
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
              <section key="projects" className="mb-2.5">
                {renderSectionHeader(sectionTitles.projects || 'Systems & Projects')}
                <div className="space-y-2.5">
                  {projects.filter((p) => p.visible !== false).map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline font-mono text-[9pt]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-sans text-[9.5pt]">{proj.title}</span>
                          {proj.repoUrl && (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[7.5pt] text-emerald-700 hover:underline">
                              github.com
                            </a>
                          )}
                        </div>
                        {proj.date && <span className="text-[8pt] text-slate-500">{proj.date}</span>}
                      </div>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="font-mono text-[8pt] text-slate-600 my-0.5">
                          Stack: {proj.techStack.join(', ')}
                        </div>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[8.5pt] text-slate-700">
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
              <section key="education" className="mb-2.5">
                {renderSectionHeader(sectionTitles.education || 'Education')}
                <div className="space-y-1.5">
                  {education.filter((e) => e.visible !== false).map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline font-mono text-[9pt]">
                        <span className="font-bold font-sans text-slate-900">{edu.institution}</span>
                        <span className="text-[8pt] text-slate-500">{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <div className="text-[8.5pt] text-slate-700">{edu.degree}</div>
                      {edu.gpa && <div className="text-[8pt] font-mono text-slate-600">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'honors':
            if (!honors || honors.length === 0) return null;
            return (
              <section key="honors" className="mb-2.5">
                {renderSectionHeader(sectionTitles.honors || 'Honors')}
                <div className="space-y-1 text-[8.5pt]">
                  {honors.filter((h) => h.visible !== false).map((hon) => (
                    <div key={hon.id} className="flex justify-between">
                      <span><strong>{hon.title}</strong> — {hon.issuer}</span>
                      <span className="font-mono text-[8pt] text-slate-500">{hon.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'certifications':
            if (!certifications || certifications.length === 0) return null;
            return (
              <section key="certifications" className="mb-2.5">
                {renderSectionHeader(sectionTitles.certifications || 'Certifications')}
                <div className="space-y-1 text-[8.5pt]">
                  {certifications.filter((c) => c.visible !== false).map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span><strong>{cert.name}</strong> ({cert.issuer})</span>
                      <span className="font-mono text-[8pt] text-slate-500">{cert.date}</span>
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
