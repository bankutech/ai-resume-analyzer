import React, { useState } from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2, GraduationCap, X } from 'lucide-react';

const inputCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

export const EducationSection: React.FC = () => {
  const education = useResumeEditorStore((state) => state.document.education);
  const updateEducation = useResumeEditorStore((state) => state.updateEducation);
  const addEducation = useResumeEditorStore((state) => state.addEducation);
  const removeEducation = useResumeEditorStore((state) => state.removeEducation);

  const [courseInput, setCourseInput] = useState<{ [id: string]: string }>({});

  const handleAddCourse = (eduId: string) => {
    const course = courseInput[eduId]?.trim();
    if (!course) return;
    const edu = education.find((e) => e.id === eduId);
    if (!edu) return;
    const current = edu.relevantCoursework || [];
    if (!current.includes(course)) {
      updateEducation(eduId, { relevantCoursework: [...current, course] });
    }
    setCourseInput({ ...courseInput, [eduId]: '' });
  };

  const handleRemoveCourse = (eduId: string, course: string) => {
    const edu = education.find((e) => e.id === eduId);
    if (!edu) return;
    updateEducation(eduId, {
      relevantCoursework: (edu.relevantCoursework || []).filter((c) => c !== course),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Degrees & Academic Credentials ({education.length})
        </span>
        <button
          type="button"
          onClick={() => addEducation()}
          className="flex items-center gap-1.5 text-xs font-mono text-royal-600 hover:text-royal-700 px-2.5 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Degree
        </button>
      </div>

      {education.map((edu, index) => (
        <div
          key={edu.id}
          className="p-4 bg-archival-50 rounded-xl border border-archival-200 space-y-3 relative group shadow-paper-xs"
        >
          <div className="flex items-center justify-between border-b border-archival-200 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-100 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-royal-600" />
              Degree #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="text-slate-400 hover:text-rose-500 transition"
              title="Delete degree"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">Institution / University</label>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="e.g. Stanford University or National Institute of Technology"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Degree & Major</label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="e.g. B.Tech in Computer Science"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Campus Location</label>
              <input
                type="text"
                value={edu.location || ''}
                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                placeholder="e.g. Stanford, CA"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Start Date</label>
              <input
                type="text"
                value={edu.startDate || ''}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                placeholder="e.g. Aug 2024"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">End Date / Expected</label>
              <input
                type="text"
                value={edu.endDate || ''}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                placeholder="e.g. May 2028 or Present"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">GPA / Marks</label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                placeholder="e.g. 3.8 / 4.0 or 8.65 / 10.0"
                className={inputCls}
              />
            </div>
          </div>

          {/* Coursework Tags */}
          <div className="pt-2 border-t border-archival-200">
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Relevant Coursework</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {edu.relevantCoursework?.map((course) => (
                <span
                  key={course}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-royal-50 text-royal-700 border border-royal-200"
                >
                  {course}
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(edu.id, course)}
                    className="hover:text-rose-500 text-royal-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={courseInput[edu.id] || ''}
                onChange={(e) => setCourseInput({ ...courseInput, [edu.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCourse(edu.id);
                  }
                }}
                placeholder="Type course name (e.g. Operating Systems) and press Enter"
                className="flex-1 px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => handleAddCourse(edu.id)}
                className="px-3 py-1.5 bg-royal-50 hover:bg-royal-100 border border-royal-200 rounded-lg text-xs font-mono text-royal-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
