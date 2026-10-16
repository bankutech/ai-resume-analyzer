import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';

export const CreativeMinimalTemplate: React.FC<{ document: ResumeDocument }> = ({ document }) => {
  const { basics, summary, education, skills, experience, projects, honors, certifications, metadata } = document;
  const { sectionOrder, sectionTitles = {}, accentColor = '#4338CA' } = metadata;

  const renderSectionHeader = (title: string) => (
    <div className="flex items-baseline gap-2 mb-2 mt-4 first:mt-0">
      <span className="text-[10pt] font-mono text-indigo-500 font-bold">0{sectionOrder.indexOf(title.toLowerCase()) + 1}.</span>
      <h2
        className="text-[11pt] font-display font-bold uppercase tracking-wider text-slate-100"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div className="text-slate-100 leading-normal text-[9.5pt] font-sans">
      {/* Contemporary Minimal Header */}
      <div className="grid grid-cols-12 gap-4 pb-4 mb-3 border-b-2 border-slate-100">
        <div className="col-span-8">
          <h1 className="text-[24pt] font-display font-black tracking-tight text-slate-100 uppercase leading-none">
            {basics.fullName || 'Alex Rivera'}
          </h1>
          {basics.headline && (
            <p className="text-[10.5pt] font-medium text-slate-400 mt-1" style={{ color: accentColor }}>
              {basics.headline}
            </p>
          )}
        </div>
        <div className="col-span-4 text-right text-[8.5pt] font-mono text-slate-400 space-y-0.5">
          {basics.location && <div>{basics.location}</div>}
          {basics.email && (
            <div>
              <a href={`mailto:${basics.email}`} className="text-slate-100 underline hover:text-indigo-600">
                {basics.email}
              </a>
            </div>
          )}
          {basics.phone && <div>{basics.phone}</div>}
          {basics.links?.map((l) => (
            <div key={l.id}>
              <a href={l.url} target="_blank" rel="noreferrer" className="underline hover:text-indigo-600">
                {l.displayHandle || l.label}
              </a>
            </div>
          ))}
        </div>
      </div>

      {sectionOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'summary':
            if (!summary?.visible || !summary?.content) return null;
            return (
              <section key="summary" className="mb-3">
                {renderSectionHeader(sectionTitles.summary || 'Perspective')}
                <p className="text-slate-200 text-[9.5pt] leading-relaxed">{summary.content}</p>
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
                      <div className="flex justify-between items-baseline font-display font-bold text-[10pt] text-slate-100">
                        <span>{exp.role}</span>
                        <span className="font-mono text-[8.5pt] font-normal text-slate-400">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-[9pt] font-medium text-slate-400 mb-1" style={{ color: accentColor }}>
                        {exp.organization} — {exp.location}
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-slate-200">
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
                {renderSectionHeader(sectionTitles.projects || 'Selected Works')}
                <div className="space-y-2.5">
                  {projects.filter((p) => p.visible !== false).map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline font-display font-bold text-[9.5pt]">
                        <span className="text-slate-100">{proj.title}</span>
                        {proj.date && <span className="font-mono text-[8.5pt] font-normal text-slate-400">{proj.date}</span>}
                      </div>
                      {proj.subtitle && <p className="text-[8.5pt] text-slate-400 italic">{proj.subtitle}</p>}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-0.5 font-mono text-[8pt] text-slate-400">
                          {proj.techStack.join(' / ')}
                        </div>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-slate-200">
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
                {renderSectionHeader(sectionTitles.skills || 'Capabilities')}
                <div className="space-y-1 text-[9pt]">
                  {skills.filter((s) => s.visible !== false).map((cat) => (
                    <div key={cat.id} className="flex items-baseline">
                      <span className="font-display font-bold text-slate-100 w-40 flex-shrink-0">{cat.category}</span>
                      <span className="text-slate-200">{cat.items.join(', ')}</span>
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
                        <span className="text-slate-100">{edu.institution}</span>
                        <span className="font-mono text-[8.5pt] font-normal text-slate-400">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      <div className="text-[9pt] text-slate-200">{edu.degree}</div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'honors':
            if (!honors || honors.length === 0) return null;
            return (
              <section key="honors" className="mb-3">
                {renderSectionHeader(sectionTitles.honors || 'Recognition')}
                <div className="space-y-1 text-[9pt]">
                  {honors.filter((h) => h.visible !== false).map((hon) => (
                    <div key={hon.id} className="flex justify-between">
                      <span><strong>{hon.title}</strong> — {hon.issuer}</span>
                      <span className="font-mono text-[8.5pt] text-slate-400">{hon.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'certifications':
            if (!certifications || certifications.length === 0) return null;
            return (
              <section key="certifications" className="mb-3">
                {renderSectionHeader(sectionTitles.certifications || 'Credentials')}
                <div className="space-y-1 text-[9pt]">
                  {certifications.filter((c) => c.visible !== false).map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span><strong>{cert.name}</strong> ({cert.issuer})</span>
                      <span className="font-mono text-[8.5pt] text-slate-400">{cert.date}</span>
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
