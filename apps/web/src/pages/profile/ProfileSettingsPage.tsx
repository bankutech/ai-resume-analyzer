import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Award,
  Lock,
  KeyRound,
  Check,
  CheckCircle2,
  X,
  Plus,
  Loader2,
  Save,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const LinkedInIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
  </svg>
);

const GitHubIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export type ExperienceLevel =
  | 'STUDENT'
  | 'JUNIOR'
  | 'MID'
  | 'SENIOR'
  | 'PRINCIPAL'
  | 'EXECUTIVE';

interface ProfileData {
  id?: string;
  fullName?: string;
  headline?: string;
  location?: string;
  experienceLevel?: ExperienceLevel | string;
  targetRoles?: string[];
  phone?: string;
  linkedIn?: string;
  gitHub?: string;
  website?: string;
  summary?: string;
  masterData?: {
    phone?: string;
    linkedIn?: string;
    gitHub?: string;
    website?: string;
    summary?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: unknown;
  };
  updatedAt?: string;
}

const EXPERIENCE_LEVELS: Array<{
  value: ExperienceLevel;
  label: string;
  desc: string;
}> = [
  { value: 'STUDENT', label: 'Student / Intern', desc: '0 years, pursuing degree or entry internship' },
  { value: 'JUNIOR', label: 'Junior Engineer', desc: '0 – 2 years full-time engineering experience' },
  { value: 'MID', label: 'Mid-Level Engineer', desc: '2 – 5 years production software ownership' },
  { value: 'SENIOR', label: 'Senior Engineer', desc: '5 – 8 years distributed systems & architectural scope' },
  { value: 'PRINCIPAL', label: 'Principal / Staff', desc: '8+ years org-wide engineering strategy & tech leadership' },
  { value: 'EXECUTIVE', label: 'Executive / VP', desc: '10+ years engineering management & VP scope' },
];

const SUGGESTED_ROLES = [
  'Full-Stack Software Engineer',
  'Frontend Engineer',
  'Backend Systems Engineer',
  'Platform / DevOps Engineer',
  'Machine Learning Engineer',
  'Engineering Manager',
  'Product Engineer',
];

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Personal Info Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [gitHub, setGitHub] = useState('');
  const [website, setWebsite] = useState('');

  // Career Identity Form State
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('STUDENT');

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  // Dirty state tracking
  const [isDirty, setIsDirty] = useState(false);

  // Query profile from API
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const res = await api.get<{ status?: string; profile?: ProfileData } | ProfileData>('/profile/me');
        if ('profile' in res && res.profile) {
          return res.profile;
        }
        return res as ProfileData;
      } catch (err: unknown) {
        // Fallback to minimal profile if endpoint returns 404 or profile not yet created
        return {
          fullName: user?.name || '',
          targetRoles: [],
          experienceLevel: 'STUDENT',
          masterData: {},
        };
      }
    },
  });

  // Populate state when profile loads
  useEffect(() => {
    if (profile) {
      const full = profile.fullName || user?.name || '';
      const parts = full.trim().split(' ');
      const mData = profile.masterData || {};

      setFirstName(mData.firstName || parts[0] || '');
      setLastName(mData.lastName || (parts.length > 1 ? parts.slice(1).join(' ') : ''));
      setPhone(profile.phone || mData.phone || '');
      setLocation(profile.location || '');
      setLinkedIn(profile.linkedIn || mData.linkedIn || '');
      setGitHub(profile.gitHub || mData.gitHub || '');
      setWebsite(profile.website || mData.website || '');
      setHeadline(profile.headline || '');
      setSummary(profile.summary || mData.summary || '');
      setTargetRoles(profile.targetRoles || []);

      const rawLevel = (profile.experienceLevel || 'STUDENT').toUpperCase();
      const matchedLevel = EXPERIENCE_LEVELS.find((l) => l.value === rawLevel)?.value || 'STUDENT';
      setExperienceLevel(matchedLevel);
      setIsDirty(false);
    }
  }, [profile, user]);

  const handleFieldChange = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Add Target Role tag
  const handleAddRole = (roleToAdd?: string) => {
    const role = (roleToAdd || newRoleInput).trim();
    if (!role) return;

    if (targetRoles.some((r) => r.toLowerCase() === role.toLowerCase())) {
      toast.warning('Tag Already Exists', `"${role}" is already in your target roles list.`);
      setNewRoleInput('');
      return;
    }

    setTargetRoles((prev) => [...prev, role]);
    setNewRoleInput('');
    setIsDirty(true);
    toast.info('Role Added', `Added "${role}" to target pipeline.`);
  };

  // Remove Target Role tag
  const handleRemoveRole = (roleToRemove: string) => {
    setTargetRoles((prev) => prev.filter((r) => r !== roleToRemove));
    setIsDirty(true);
  };

  // Profile Save Mutation
  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const combinedFullName = `${firstName.trim()} ${lastName.trim()}`.trim() || user?.name || '';
      const payload = {
        fullName: combinedFullName,
        headline: headline.trim(),
        location: location.trim(),
        experienceLevel,
        targetRoles,
        phone: phone.trim(),
        linkedIn: linkedIn.trim(),
        gitHub: gitHub.trim(),
        website: website.trim(),
        summary: summary.trim(),
        masterData: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          linkedIn: linkedIn.trim(),
          gitHub: gitHub.trim(),
          website: website.trim(),
          summary: summary.trim(),
        },
      };

      return api.put<{ status: string; profile: ProfileData }>('/profile/me', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsDirty(false);
      toast.success('Career Profile Updated', 'All profile details and master vault data synchronized.');
    },
    onError: (err: Error) => {
      toast.error('Profile Save Failed', err.message || 'Unable to persist profile changes to Neon database.');
    },
  });

  // Password Change Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return api.put<{ status: string; message: string }>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwError(null);
      toast.success('Password Changed', 'Your account credentials have been securely updated.');
    },
    onError: (err: Error) => {
      setPwError(err.message || 'Failed to change password. Please check your current password.');
      toast.error('Password Update Failed', err.message || 'Verification rejected.');
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (!currentPassword) {
      setPwError('Please enter your current account password.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation do not match.');
      return;
    }

    changePasswordMutation.mutate();
  };

  // Render Shimmer Skeletons during initial load
  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
        <div className="space-y-2 border-b border-archival-200 pb-6">
          <div className="animate-pulse bg-archival-100 rounded-xl h-8 w-64" />
          <div className="animate-pulse bg-archival-100 rounded-xl h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse bg-archival-100 border border-archival-200 rounded-2xl h-80 w-full" />
          <div className="animate-pulse bg-archival-100 border border-archival-200 rounded-2xl h-80 w-full" />
        </div>
        <div className="animate-pulse bg-archival-100 border border-archival-200 rounded-2xl h-64 w-full" />
        <div className="animate-pulse bg-archival-100 border border-archival-200 rounded-2xl h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-archival-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700 shadow-paper-xs">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight">
              Career Profile & Identity Vault
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Maintain your master candidate baseline, ATS contact telemetry, and career level settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-archival-200 text-xs font-mono shadow-paper-xs">
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-ochre-500 animate-pulse" />
                <span className="text-ochre-600 font-medium">Unsaved Changes</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                <span className="text-slate-400">All Changes Saved</span>
              </>
            )}
          </div>

          {/* Primary Save Button */}
          <button
            type="button"
            onClick={() => saveProfileMutation.mutate()}
            disabled={saveProfileMutation.isPending || !isDirty}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow-paper-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saveProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveProfileMutation.isPending ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-ochre-50 border border-ochre-200 text-ochre-700 text-xs font-mono flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-ochre-600" />
          <span>Notice: Initialized new profile vault session for your authenticated user.</span>
        </div>
      )}

      {/* 2. Personal Info Card */}
      <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm hover:border-royal-300 transition-all space-y-5">
        <div className="flex items-center justify-between border-b border-archival-200 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <User className="w-4 h-4 text-forest-700" />
            <span>Personal Information</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">ATS Primary Contact Block</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                handleFieldChange();
              }}
              placeholder="e.g. Alex"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                handleFieldChange();
              }}
              placeholder="e.g. Rivera"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address (Account ID)</span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-2 bg-archival-100 border border-archival-200 rounded-xl text-xs font-mono text-slate-400 cursor-not-allowed opacity-80"
              title="Account email is managed through authentication security"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleFieldChange();
              }}
              placeholder="+1 (555) 234-5678"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location (City, State / Country)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                handleFieldChange();
              }}
              placeholder="e.g. San Francisco, CA or Remote (US Timezones)"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <LinkedInIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>LinkedIn Profile URL</span>
            </label>
            <input
              type="url"
              value={linkedIn}
              onChange={(e) => {
                setLinkedIn(e.target.value);
                handleFieldChange();
              }}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <GitHubIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Profile URL</span>
            </label>
            <input
              type="url"
              value={gitHub}
              onChange={(e) => {
                setGitHub(e.target.value);
                handleFieldChange();
              }}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Portfolio / Personal Website URL</span>
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                handleFieldChange();
              }}
              placeholder="https://alexrivera.dev"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* 3. Career Identity Card */}
      <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm hover:border-royal-300 transition-all space-y-5">
        <div className="flex items-center justify-between border-b border-archival-200 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Briefcase className="w-4 h-4 text-forest-700" />
            <span>Career Identity & Pitch</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Positioning & Summary</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Professional Headline *
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                handleFieldChange();
              }}
              placeholder="e.g. Senior Software Engineer at Google • Distributed Systems & AI Infrastructure"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Used across top-line resume headings and quick application autofill.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-400">
                Professional Summary / Executive Vault
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {summary.length} characters
              </span>
            </div>
            <textarea
              rows={5}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                handleFieldChange();
              }}
              placeholder="e.g. Results-driven Software Engineer with 5+ years of experience architecting high-throughput microservices in TypeScript, Go, and PostgreSQL. Led migration to Neon serverless DB reducing p99 latency by 42%..."
              className="w-full p-3 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition leading-relaxed"
            />
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              A comprehensive career summary that our AI studio leverages to automatically tailor resume intros.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Target Roles & Experience Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Roles Card */}
        <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm hover:border-royal-300 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-archival-200 pb-3 mb-4">
              <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-forest-700" />
                <span>Target Roles</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-50 text-forest-700 border border-forest-200">
                {targetRoles.length} active
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans mb-3">
              Add specific job titles you are actively targeting. Used to tune ATS keyword match engines.
            </p>

            {/* Input to add new role */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
                placeholder="Type role & press Enter..."
                className="flex-1 px-3 py-1.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => handleAddRole()}
                disabled={!newRoleInput.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-forest-50 text-forest-700 border border-forest-200 text-xs font-mono transition disabled:opacity-40 disabled:cursor-not-allowed shadow-paper-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-archival-50/60 rounded-xl border border-archival-200">
              {targetRoles.length === 0 ? (
                <span className="text-xs font-mono text-slate-400 italic p-1">
                  No target roles added yet.
                </span>
              ) : (
                targetRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-royal-50 text-royal-700 border border-royal-200 text-xs font-mono"
                  >
                    <span>{role}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      className="text-royal-600/70 hover:text-rose-500 hover:bg-rose-50 rounded p-0.5 transition"
                      title={`Remove ${role}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-3 border-t border-archival-200">
            <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
              Suggested Engineering Roles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_ROLES.filter((s) => !targetRoles.includes(s)).slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddRole(suggestion)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-archival-50 hover:bg-archival-100 text-slate-400 hover:text-royal-600 border border-archival-200 transition"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Experience Level Card */}
        <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm hover:border-royal-300 transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-archival-200 pb-3">
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
              <Award className="w-4 h-4 text-forest-700" />
              <span>Experience Level</span>
            </div>
            <span className="text-[11px] font-mono text-forest-700 font-bold">
              {experienceLevel}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans">
            Calibrates the ATS scoring rubric, expected bullet density, and executive summary tone.
          </p>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Seniority Tier</label>
            <select
              value={experienceLevel}
              onChange={(e) => {
                setExperienceLevel(e.target.value as ExperienceLevel);
                handleFieldChange();
              }}
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label} ({lvl.value})
                </option>
              ))}
            </select>
          </div>

          {/* Level Details Card */}
          <div className="p-3.5 rounded-xl bg-archival-100 border border-archival-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-forest-700 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>
                {EXPERIENCE_LEVELS.find((l) => l.value === experienceLevel)?.label}
              </span>
            </div>
            <p className="text-[11.5px] font-sans text-slate-400 leading-relaxed">
              {EXPERIENCE_LEVELS.find((l) => l.value === experienceLevel)?.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-sm">
        <div className="text-xs font-mono text-slate-400">
          {isDirty ? (
            <span className="text-ochre-600 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-ochre-500 animate-pulse" />
              You have unsaved changes in your profile.
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
              Profile configuration is current in Neon PostgreSQL.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => saveProfileMutation.mutate()}
          disabled={saveProfileMutation.isPending || !isDirty}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow-paper-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saveProfileMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saveProfileMutation.isPending ? 'Saving...' : 'Save All Profile Changes'}</span>
        </button>
      </div>

      {/* 7. Account Settings Section — Change Password */}
      <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm hover:border-royal-300 transition-all space-y-5">
        <div className="flex items-center justify-between border-b border-archival-200 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Shield className="w-4 h-4 text-royal-600" />
            <span>Account Security & Password Credentials</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Bcrypt Salted Encryption</span>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          {pwError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{pwError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Password *</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-10 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition"
              >
                {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>New Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-3 pr-10 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition"
                >
                  {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Confirm New Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-3 pr-10 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition"
                >
                  {showConfirmPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending || !currentPassword || !newPassword}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-royal-200 text-royal-600 hover:bg-royal-50 hover:border-royal-300 font-mono text-xs font-semibold shadow-paper-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>{changePasswordMutation.isPending ? 'Updating Credentials...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
