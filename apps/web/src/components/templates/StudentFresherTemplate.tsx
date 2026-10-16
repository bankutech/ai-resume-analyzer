import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';

export const StudentFresherTemplate: React.FC<{ document: ResumeDocument }> = ({ document }) => {
  const { basics, summary, education, skills, experience, projects, honors, certifications, metadata } = document;
  const { sectionTitles = {}, accentColor = '#0D9488' } = metadata;

  // Enforce student hierarchy: Summary -> Education -> Projects -> Skills -> Experience -> Honors
  const studentOrder = ['summary', 'education', 'projects', 'skills', 'experience', 'honors', 'certifications'];

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center gap-2 mb-2 mt-3.5 first:mt-0">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
      <h2
        className="text-[10.5pt] font-bold tracking-wide uppercase font-sans text-slate-900"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <div className="flex-1 border-b border-dashed border-slate-300" />
    </div>
  );

  return (
    <div className="text-slate-800 leading-normal text-[9.5pt] font-sans">
      {/* Student Centered Header */}
      <div className="text-center pb-2.5 mb-2 border-b border-slate-200">
        <h1 className="text-[20pt] font-bold tracking-tight text-slate-900">
          {basics.fullName || 'Alex Rivera'}
        </h1>
        {basics.headline && (
          <p className="text-[10pt] font-medium text-slate-700 mt-0.5">{basics.headline}</p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-[8.5pt] text-slate-600 mt-1.5 font-mono">
          {basics.location && <span>{basics.location}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.email && (
            <span>
              • <a href={`mailto:${basics.email}`} className="text-teal-700 underline">{basics.email}</a>
            </span>
          )}
          {basics.links?.map((link) => (
            <span key={link.id}>
              • <a href={link.url} target="_blank" rel="noreferrer" className="text-teal-700 underline font-medium">
                {link.displayHandle || link.label}
              </a>
            </span>
          ))}
        </div>
      </div>

      {studentOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'summary':
            if (!summary?.visible || !summary?.content) return null;
            return (
              <section key="summary" className="mb-2.5">
                {renderSectionHeader(sectionTitles.summary || 'Profile Summary')}
                <p className="text-[9.5pt] text-slate-700 leading-relaxed">{summary.content}</p>
              </section>
            );

          case 'education':
            if (!education || education.length === 0) return null;
            return (
              <section key="education" className="mb-2.5">
                {renderSectionHeader(sectionTitles.education || 'Education')}
                <div className="space-y-2">
                  {education.filter((e) => e.visible !== false).map((edu) => (
                    <div key={edu.id} className="bg-slate-50/60 p-2 rounded border border-slate-100">
                      <div className="flex justify-between items-baseline font-bold text-[9.5pt] text-slate-900">
                        <span>{edu.institution}</span>
                        <span className="text-[8.5pt] font-mono font-normal text-slate-500">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[9pt] text-slate-700">
                        <span className="font-medium text-teal-800">{edu.degree}</span>
                        <span>{edu.location}</span>
                      </div>
                      {edu.gpa && (
                        <div className="mt-1">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[8pt] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            CGPA: {edu.gpa}
                          </span>
                        </div>
                      )}
                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                        <div className="text-[8.5pt] text-slate-600 mt-1">
                          <span className="font-semibold text-slate-700">Relevant Coursework:</span>{' '}
                          {edu.relevantCoursework.join(', ')}
                        </div>
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
                {renderSectionHeader(sectionTitles.projects || 'Key Engineering Projects')}
                <div className="space-y-2">
                  {projects.filter((p) => p.visible !== false).map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[9.5pt] text-slate-900">{proj.title}</span>
                          {proj.repoUrl && (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[8pt] font-mono text-teal-700 underline">
                              [Code Repo]
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[8pt] font-mono text-teal-700 underline">
                              [Live Demo]
                            </a>
                          )}
                        </div>
                        {proj.date && <span className="text-[8.5pt] font-mono text-slate-500">{proj.date}</span>}
                      </div>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="text-[8.5pt] font-mono text-teal-800 mt-0.5">
                          Tech Stack: {proj.techStack.join(' • ')}
                        </div>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-slate-700 mt-1">
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
              <section key="skills" className="mb-2.5">
                {renderSectionHeader(sectionTitles.skills || 'Technical Skills')}
                <div className="space-y-1 text-[9pt]">
                  {skills.filter((s) => s.visible !== false).map((cat) => (
                    <div key={cat.id} className="flex items-baseline">
                      <span className="font-bold text-slate-900 w-44 flex-shrink-0">{cat.category}:</span>
                      <span className="text-slate-700">{cat.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'experience':
            if (!experience || experience.length === 0) return null;
            return (
              <section key="experience" className="mb-2.5">
                {renderSectionHeader(sectionTitles.experience || 'Leadership & Internships')}
                <div className="space-y-2">
                  {experience.filter((e) => e.visible !== false).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-[9.5pt]">
                        <span>{exp.organization}</span>
                        <span className="text-[8.5pt] font-mono font-normal text-slate-500">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-[9pt] text-teal-800 italic">{exp.role}</div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-slate-700 mt-0.5">
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

          case 'honors':
            if (!honors || honors.length === 0) return null;
            return (
              <section key="honors" className="mb-2.5">
                {renderSectionHeader(sectionTitles.honors || 'Hackathons & Honors')}
                <div className="space-y-1 text-[9pt]">
                  {honors.filter((h) => h.visible !== false).map((hon) => (
                    <div key={hon.id} className="flex justify-between">
                      <span><strong>{hon.title}</strong> — {hon.issuer} ({hon.description})</span>
                      <span className="font-mono text-[8.5pt] text-slate-500">{hon.date}</span>
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
                <div className="space-y-1 text-[9pt]">
                  {certifications.filter((c) => c.visible !== false).map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span><strong>{cert.name}</strong> — {cert.issuer}</span>
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
