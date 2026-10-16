import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Target,
  LogOut,
  Database,
  Wand2,
  ChevronRight,
  Briefcase,
  FileEdit,
  Bookmark,
  Bell,
  User,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Server,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

interface NavGroup {
  label: string;
  items: {
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: number;
  }[];
}

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Career', 'Tools', 'Account']);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get<{ unreadCount: number }>('/notifications');
        setUnreadNotifications((res as any).unreadCount || 0);
      } catch {
        // Ignore silently
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        {
          label: 'Notifications',
          path: '/app/notifications',
          icon: Bell,
          badge: unreadNotifications,
        },
      ],
    },
    {
      label: 'Resumes',
      items: [
        { label: 'My Resumes', path: '/app/resumes', icon: FileText },
        { label: 'New Resume', path: '/app/resumes/new', icon: PlusCircle },
        { label: 'Import Resume', path: '/app/resumes/import', icon: UploadCloud },
        { label: 'Cover Letters', path: '/app/cover-letters', icon: FileEdit },
      ],
    },
    {
      label: 'Career',
      items: [
        { label: 'Applications', path: '/app/applications', icon: Briefcase },
        { label: 'Saved Jobs', path: '/app/saved-jobs', icon: Bookmark },
      ],
    },
    {
      label: 'Tools',
      items: [
        { label: 'ATS Diagnostic', path: '/app/ats-checker', icon: Sparkles },
        { label: 'Job Tailoring', path: '/app/job-matcher', icon: Target },
        { label: 'AI Studio', path: '/app/tailor', icon: Wand2 },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile & Settings', path: '/app/profile', icon: User },
        { label: 'Admin Telemetry', path: '/app/admin', icon: Server },
      ],
    },
  ];

  const isPathActive = (path: string) => {
    if (path === '/app/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-carbon-950 text-slate-100 flex flex-col md:flex-row selection:bg-royal-500/15 selection:text-royal-500 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-carbon-700/80 bg-white flex flex-col justify-between flex-shrink-0 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-y-auto">
          {/* Logo & Platform Badge */}
          <div className="p-4 border-b border-carbon-700/60 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
            <div
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-royal-500 flex items-center justify-center text-white font-bold font-mono text-xs tracking-tight shadow-sm">
                mR
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-slate-100 block">
                  myRmyC
                </span>
                <span className="text-[10px] font-mono text-slate-400">myresume mycareer</span>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-royal-50 text-royal-600 border border-royal-100 font-bold">
              v1.0
            </span>
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 space-y-1">
            {navGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.label);
              return (
                <div key={group.label} className="pt-1">
                  {/* Group header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-200 transition font-bold"
                  >
                    {group.label}
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>

                  {/* Group items */}
                  {isExpanded && (
                    <div className="space-y-0.5 mt-1 mb-2">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isPathActive(item.path);
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={() =>
                              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                                active
                                  ? 'bg-royal-50 text-royal-600 border border-royal-200/80 font-bold shadow-xs'
                                  : 'text-slate-300 hover:text-slate-100 hover:bg-carbon-850'
                              }`
                            }
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${active ? 'text-royal-500' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {item.badge != null && item.badge > 0 && (
                                <span className="w-4 h-4 rounded-full bg-royal-500 text-white text-[9px] font-bold flex items-center justify-center">
                                  {item.badge > 9 ? '9+' : item.badge}
                                </span>
                              )}
                              {active && <ChevronRight className="w-3.5 h-3.5 text-royal-500" />}
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Telemetry & User Card */}
        <div className="p-3 border-t border-carbon-700/60 space-y-2.5 flex-shrink-0 bg-white">
          {/* Neon Database Status */}
          <div className="p-2.5 rounded-xl bg-carbon-850 border border-carbon-700/70 space-y-1 text-[11px] font-mono shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Database className="w-3 h-3 text-royal-500" />
                Neon Cloud
              </span>
              <span className="text-forest-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Branch: <span className="text-slate-200 font-semibold">production</span>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-carbon-850/80 border border-carbon-700/60 shadow-xs">
            <div
              className="min-w-0 pr-2 flex-1 cursor-pointer"
              onClick={() => navigate('/app/profile')}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-100 truncate block">
                  {user?.name || 'Candidate Engineer'}
                </span>
                {user?.role === 'ADMIN' && (
                  <span className="text-[9px] font-mono px-1 rounded bg-ochre-50 text-ochre-600 border border-ochre-100 font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-[10.5px] font-mono text-slate-400 truncate block">
                {user?.email}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-carbon-800 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main data-lenis-prevent className="flex-1 overflow-y-auto bg-carbon-950 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
