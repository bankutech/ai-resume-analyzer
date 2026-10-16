import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileCode,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Wrench,
  User,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { SAMPLE_STUDENT_RESUME_DOCUMENT, ResumeDocument } from '@resumeforge/shared';

export const ResumeImportPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [importMode, setImportMode] = useState<'json' | 'text'>('text');
  const [rawText, setRawText] = useState('');
  const [parsedDoc, setParsedDoc] = useState<Partial<ResumeDocument> | null>(null);
  const [resumeTitle, setResumeTitle] = useState('Imported Resume');
  const [targetJobTitle, setTargetJobTitle] = useState('Software Engineer');
  const [templateSlug, setTemplateSlug] = useState('classic-ats');
  const [isParsing, setIsParsing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // File drag & drop for JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(content);
          setParsedDoc(json);
          if (json.basics?.fullName) {
            setResumeTitle(`${json.basics.fullName} Resume`);
          }
          if (json.basics?.headline) {
            setTargetJobTitle(json.basics.headline);
          }
          toast.success('JSON Validated', 'Resume schema loaded successfully.');
        } else {
          // Plain text file
          setRawText(content);
          setImportMode('text');
          toast.info('File Loaded', 'Text extracted from file. Click "Parse with AI".');
        }
      } catch (err: any) {
        setParseError(`Failed to parse file: ${err.message}`);
        toast.error('File Error', 'Invalid JSON or unreadable text format.');
      }
    };
    reader.readAsText(file);
  };

  const handleParseText = async () => {
    if (!rawText.trim() || rawText.length < 30) {
      toast.warning('Input Too Short', 'Please paste at least a paragraph of resume text.');
      return;
    }

    setIsParsing(true);
    setParseError(null);
    try {
      const res = await api.post<{ status: string; document: Partial<ResumeDocument> }>(
        '/ai/parse-resume',
        { rawText }
      );
      if (res.document) {
        setParsedDoc(res.document);
        if (res.document.basics?.fullName) {
          setResumeTitle(`${res.document.basics.fullName} Resume`);
        }
        if (res.document.basics?.headline) {
          setTargetJobTitle(res.document.basics.headline);
        }
        toast.success('Resume Parsed', 'Structured sections extracted with Gemini AI.');
      }
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse resume text.');
      toast.error('Parsing Failed', 'Could not extract structured sections from text.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCreateAndOpen = async () => {
    setIsCreating(true);
    try {
      const mergedDoc: ResumeDocument = {
        ...SAMPLE_STUDENT_RESUME_DOCUMENT,
        ...(parsedDoc || {}),
        basics: {
          ...SAMPLE_STUDENT_RESUME_DOCUMENT.basics,
          ...(parsedDoc?.basics || {}),
        },
        metadata: {
          ...SAMPLE_STUDENT_RESUME_DOCUMENT.metadata,
          templateId: templateSlug as any,
        },
      };

      const res = await api.post<{ status: string; resume: { id: string } }>('/resumes', {
        title: resumeTitle,
        targetJobTitle,
        templateSlug,
        document: mergedDoc,
      });

      toast.success('Resume Imported', 'Opening in Studio editor...');
      navigate(`/app/resumes/${res.resume.id}/edit`);
    } catch (err: any) {
      toast.error('Import Failed', err.message || 'Failed to create imported resume');
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-archival-200 pb-6">
        <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 shadow-paper-xs">
            <UploadCloud className="w-4 h-4" />
          </div>
          Import Existing Resume
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Bring in existing resumes from JSON backups or paste unformatted text from LinkedIn and PDF.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setImportMode('text');
            setParseError(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition ${
            importMode === 'text'
              ? 'bg-royal-50 text-royal-700 border border-royal-600 font-semibold shadow-paper-xs'
              : 'bg-white border border-archival-200 text-slate-400 hover:text-slate-100 hover:bg-archival-50 shadow-paper-xs'
          }`}
        >
          <Sparkles className="w-4 h-4 text-royal-600" />
          <span>Paste Text / AI Extraction</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setImportMode('json');
            setParseError(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition ${
            importMode === 'json'
              ? 'bg-royal-50 text-royal-700 border border-royal-600 font-semibold shadow-paper-xs'
              : 'bg-white border border-archival-200 text-slate-400 hover:text-slate-100 hover:bg-archival-50 shadow-paper-xs'
          }`}
        >
          <FileCode className="w-4 h-4 text-forest-700" />
          <span>Upload JSON Schema Backup</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Input Form */}
        <div className="lg:col-span-2 space-y-4">
          {importMode === 'text' ? (
            <div className="p-5 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 font-semibold">
                  Paste Raw Resume Text
                </label>
                <p className="text-[11px] text-slate-400 mb-2 font-mono">
                  Copy-paste all text from your existing PDF, Word, or LinkedIn profile. Gemini AI will structure it automatically.
                </p>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={14}
                  placeholder="Alex Rivera&#10;San Francisco, CA • alex@example.com • linkedin.com/in/alexrivera&#10;&#10;EXPERIENCE&#10;Software Engineer at Google (2022 - Present)&#10;- Designed distributed caching service reducing p99 latency by 45%...&#10;&#10;EDUCATION&#10;B.S. in Computer Science, UC Berkeley (2018 - 2022)&#10;&#10;SKILLS&#10;TypeScript, React, Node.js, Go, PostgreSQL, Docker"
                  className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none leading-relaxed transition"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {rawText.length} characters entered
                </span>
                <button
                  type="button"
                  onClick={handleParseText}
                  disabled={isParsing || rawText.length < 30}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow-paper-sm transition disabled:opacity-40"
                >
                  {isParsing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{isParsing ? 'Parsing with Gemini...' : 'Parse with AI'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-dashed border-archival-200 text-center space-y-4 shadow-paper-xs">
              <div className="w-12 h-12 rounded-2xl bg-royal-50 border border-royal-200 flex items-center justify-center mx-auto text-royal-600 shadow-paper-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Select a myRmyC / JSON resume file
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Restore an exported JSON backup or transfer a document between environments.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-archival-50 text-slate-100 border border-archival-200 text-xs font-mono cursor-pointer transition shadow-paper-xs">
                <FileCode className="w-4 h-4 text-forest-700" />
                <span>Browse JSON File</span>
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {parseError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Right 1 Col: Preview & Finalization */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold border-b border-archival-200 pb-2">
              Document Setup
            </h2>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Resume Document Title
              </label>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-archival-50/60 border border-archival-200 rounded-lg text-xs font-mono text-slate-100 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Target Job Title / Headline
              </label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-archival-50/60 border border-archival-200 rounded-lg text-xs font-mono text-slate-100 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Visual Template
              </label>
              <select
                value={templateSlug}
                onChange={(e) => setTemplateSlug(e.target.value)}
                className="w-full px-3 py-1.5 bg-archival-50/60 border border-archival-200 rounded-lg text-xs font-mono text-slate-100 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              >
                <option value="classic-ats">Classic ATS (Single Column)</option>
                <option value="software-engineer">SWE Tech (Dense System)</option>
                <option value="modern-professional">Modern Professional</option>
                <option value="student-fresher">Student & Fresher</option>
                <option value="academic-research">Academic CV</option>
                <option value="creative-portfolio">Creative Minimal</option>
              </select>
            </div>

            {/* Detected Structure Checklist */}
            {parsedDoc && (
              <div className="pt-2 border-t border-archival-200 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Detected Structure:
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-forest-700" />
                      Contact Info
                    </span>
                    <span className="text-forest-700 font-semibold">
                      {parsedDoc.basics?.fullName || 'Detected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-royal-600" />
                      Work Experience
                    </span>
                    <span className="text-slate-100 font-medium">
                      {(parsedDoc.experience as any)?.length || 0} roles
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-ochre-600" />
                      Education
                    </span>
                    <span className="text-slate-100 font-medium">
                      {(parsedDoc.education as any)?.length || 0} degrees
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-rose-600" />
                      Skills
                    </span>
                    <span className="text-slate-100 font-medium">
                      {Object.values(parsedDoc.skills || {}).flat().length} items
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isCreating}
              onClick={handleCreateAndOpen}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow-paper-sm transition disabled:opacity-40"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>{isCreating ? 'Creating in Database...' : 'Import & Open in Studio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
