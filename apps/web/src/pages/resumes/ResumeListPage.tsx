import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  FileText,
  Search,
  Plus,
  Copy,
  Trash2,
  LayoutGrid,
  List,
  Loader2,
  Calendar,
  Pin,
  UploadCloud,
  Share2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ShareResumeModal } from '../../components/resumes/ShareResumeModal';

interface ResumeItem {
  id: string;
  title: string;
  targetJobTitle?: string;
  templateSlug?: string;
  lastAtsScore?: number;
  isPinned?: boolean;
  isSample?: boolean;
  updatedAt: string;
}

export const ResumeListPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedShareResume, setSelectedShareResume] = useState<{ id: string; title: string } | null>(null);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ status: string; resumes: ResumeItem[] }>('/resumes');
      setResumes(res.resumes || []);
    } catch (err: any) {
      console.error('[Fetch Resumes Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post(`/resumes/${id}/duplicate`);
      toast.success('Resume Duplicated', 'Cloned document with initial version checkpoint.');
      fetchResumes();
    } catch (err: any) {
      toast.error('Duplication Failed', err.message || 'Failed to duplicate resume');
    }
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete resume "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Resume Deleted', `"${title}" has been removed.`);
      fetchResumes();
    } catch (err: any) {
      toast.error('Deletion Failed', err.message || 'Failed to delete resume');
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.put(`/resumes/${id}`, { isPinned: !currentPinned });
      toast.success(currentPinned ? 'Resume Unpinned' : 'Resume Pinned to Top');
      fetchResumes();
    } catch (err: any) {
      toast.error('Pin Failed', err.message || 'Failed to update pin');
    }
  };

  const filteredResumes = resumes
    .filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.targetJobTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemplate =
        selectedTemplate === 'all' || r.templateSlug === selectedTemplate;
      return matchesSearch && matchesTemplate;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-carbon-700 pb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight">
            Resume Documents
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage, version, analyze, and duplicate your ATS-tailored resumes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/app/resumes/import')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-carbon-850 text-slate-200 border border-carbon-700 font-semibold text-xs font-mono shadow-sm transition"
          >
            <UploadCloud className="w-4 h-4 text-royal-600" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/resumes/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, target role or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-carbon-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:border-royal-500 font-mono shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-200 shadow-sm"
          >
            <option value="all">All Templates</option>
            <option value="classic-ats">Classic ATS</option>
            <option value="modern-professional">Modern Professional</option>
            <option value="student-fresher">Student & Fresher</option>
            <option value="software-engineer">SWE Tech</option>
            <option value="academic-research">Academic CV</option>
            <option value="creative-portfolio">Creative Minimal</option>
          </select>

          <div className="flex items-center bg-white border border-carbon-700 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid' ? 'bg-carbon-850 text-royal-700 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'table' ? 'bg-carbon-850 text-royal-700 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="p-16 flex items-center justify-center gap-3 text-xs font-mono text-slate-400 bg-white border border-carbon-700 rounded-2xl shadow-sm">
          <Loader2 className="w-4 h-4 animate-spin text-royal-600" />
          Loading resume directory...
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white border border-dashed border-carbon-700 rounded-2xl shadow-sm">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-100">No resumes match your criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or create a new document.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => navigate(`/app/resumes/${resume.id}/edit`)}
              className="p-5 rounded-2xl bg-white hover:bg-carbon-850/60 border border-carbon-700 hover:border-royal-400/80 shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-carbon-850 text-slate-300 border border-carbon-700 uppercase font-medium">
                      {resume.templateSlug || 'classic-ats'}
                    </span>
                    {resume.isPinned && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 font-bold">
                        <Pin className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                        Pinned
                      </span>
                    )}
                  </div>
                  <div className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-forest-50 text-forest-700 border border-forest-300">
                    ATS {resume.lastAtsScore || 85}
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-royal-700 transition line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1 line-clamp-1">
                  {resume.targetJobTitle || 'General Engineering'}
                </p>
              </div>

              <div className="pt-3 border-t border-carbon-700 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleTogglePin(resume.id, !!resume.isPinned, e)}
                    className={`p-1 rounded transition ${
                      resume.isPinned
                        ? 'text-amber-700 bg-amber-100'
                        : 'text-slate-400 hover:text-amber-700 hover:bg-carbon-800'
                    }`}
                    title={resume.isPinned ? 'Unpin from Top' : 'Pin to Top'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${resume.isPinned ? 'fill-amber-700' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShareResume({ id: resume.id, title: resume.title });
                    }}
                    className="p-1 text-slate-400 hover:text-royal-600 hover:bg-carbon-800 rounded transition"
                    title="Share & QR Code"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDuplicate(resume.id, e)}
                    className="p-1 text-slate-400 hover:text-slate-100 hover:bg-carbon-800 rounded transition"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(resume.id, resume.title, e)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-carbon-800 rounded transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-carbon-700 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-carbon-850 border-b border-carbon-700 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Target Role</th>
                <th className="px-4 py-3 font-semibold">Template</th>
                <th className="px-4 py-3 font-semibold">ATS Score</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-700 text-slate-200">
              {filteredResumes.map((resume) => (
                <tr
                  key={resume.id}
                  onClick={() => navigate(`/app/resumes/${resume.id}/edit`)}
                  className="hover:bg-carbon-850/50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                    {resume.isPinned && (
                      <Pin className="w-3 h-3 text-amber-700 fill-amber-700 shrink-0" />
                    )}
                    <span>{resume.title}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{resume.targetJobTitle || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{resume.templateSlug || 'classic-ats'}</td>
                  <td className="px-4 py-3">
                    <span className="text-forest-700 font-bold">{resume.lastAtsScore || 85}/100</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(resume.id, !!resume.isPinned, e)}
                        className={`p-1 rounded ${
                          resume.isPinned ? 'text-amber-700 bg-amber-100' : 'text-slate-400 hover:text-amber-700'
                        }`}
                        title={resume.isPinned ? 'Unpin' : 'Pin to Top'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${resume.isPinned ? 'fill-amber-700' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShareResume({ id: resume.id, title: resume.title });
                        }}
                        className="p-1 text-slate-400 hover:text-royal-600 hover:bg-carbon-800 rounded transition"
                        title="Share & QR Code"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(resume.id, e)}
                        className="p-1 text-slate-400 hover:text-slate-100 hover:bg-carbon-800 rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(resume.id, resume.title, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-carbon-800 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedShareResume && (
        <ShareResumeModal
          isOpen={!!selectedShareResume}
          onClose={() => setSelectedShareResume(null)}
          resumeId={selectedShareResume.id}
          resumeTitle={selectedShareResume.title}
        />
      )}
    </div>
  );
};
