import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  User,
  AlignLeft,
  GraduationCap,
  Cpu,
  Briefcase,
  FolderGit2,
  Award,
  ShieldCheck,
  Palette,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useResumeEditorStore } from '../../store/resumeEditorStore';
import { BasicsSection } from './sections/BasicsSection';
import { SummarySection } from './sections/SummarySection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { HonorsSection } from './sections/HonorsSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { DesignSection } from './sections/DesignSection';

interface SectionConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface SortableItemProps {
  id: string;
  config: SectionConfig;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  children: React.ReactNode;
}

const SortableSectionItem: React.FC<SortableItemProps> = ({
  id,
  config,
  isOpen,
  onToggle,
  isVisible,
  onToggleVisibility,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-carbon-700 rounded-xl bg-white overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between px-3 py-2.5 bg-carbon-850/80 hover:bg-carbon-800/80 transition cursor-pointer select-none">
        <div className="flex items-center gap-2 flex-1" onClick={onToggle}>
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 text-slate-400 hover:text-slate-200 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder section"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs text-slate-100">{config.label}</span>
          {config.count !== undefined && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-carbon-800 text-slate-400 border border-carbon-700 font-medium">
              {config.count}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-1 text-slate-400 hover:text-slate-200"
            title={isVisible ? 'Hide from resume' : 'Show on resume'}
          >
            {isVisible ? <Eye className="w-3.5 h-3.5 text-forest-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          </button>
          <button type="button" onClick={onToggle} className="p-1 text-slate-400 hover:text-slate-200">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && <div className="p-3 border-t border-carbon-700 bg-white">{children}</div>}
    </div>
  );
};

export const SectionAccordion: React.FC = () => {
  const sectionOrder = useResumeEditorStore((state) => state.document.metadata.sectionOrder || []);
  const reorderSections = useResumeEditorStore((state) => state.reorderSections);
  const toggleSectionVisibility = useResumeEditorStore((state) => state.toggleSectionVisibility);
  const doc = useResumeEditorStore((state) => state.document);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    basics: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    summary: false,
    honors: false,
    certifications: false,
    design: false,
  });

  const toggleOpen = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(String(active.id));
      const newIndex = sectionOrder.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
        reorderSections(newOrder);
      }
    }
  };

  const sectionMetaMap: Record<string, SectionConfig> = {
    summary: { key: 'summary', label: 'Summary / Objective', icon: AlignLeft },
    education: { key: 'education', label: 'Education', icon: GraduationCap, count: doc.education?.length },
    skills: { key: 'skills', label: 'Technical Skills', icon: Cpu, count: doc.skills?.length },
    experience: { key: 'experience', label: 'Work Experience', icon: Briefcase, count: doc.experience?.length },
    projects: { key: 'projects', label: 'Key Projects', icon: FolderGit2, count: doc.projects?.length },
    honors: { key: 'honors', label: 'Honors & Awards', icon: Award, count: doc.honors?.length },
    certifications: { key: 'certifications', label: 'Certifications', icon: ShieldCheck, count: doc.certifications?.length },
  };

  const renderSectionContent = (key: string) => {
    switch (key) {
      case 'summary':
        return <SummarySection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'honors':
        return <HonorsSection />;
      case 'certifications':
        return <CertificationsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 pb-12">
      {/* Pinned: Basics Section */}
      <div className="border border-carbon-700 rounded-xl bg-white overflow-hidden shadow-sm">
        <div
          onClick={() => toggleOpen('basics')}
          className="flex items-center justify-between px-3.5 py-3 bg-carbon-850/80 hover:bg-carbon-800/80 transition cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-100 block">Personal Info & Header</span>
              <span className="text-[10.5px] font-mono text-slate-400">
                {doc.basics.fullName || 'Alex Rivera'} • {doc.basics.email || 'No email set'}
              </span>
            </div>
          </div>
          <button type="button" className="p-1 text-slate-400">
            {openSections['basics'] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {openSections['basics'] && <div className="p-3 border-t border-carbon-700 bg-white"><BasicsSection /></div>}
      </div>

      {/* Pinned: Design & Templates */}
      <div className="border border-carbon-700 rounded-xl bg-white overflow-hidden shadow-sm">
        <div
          onClick={() => toggleOpen('design')}
          className="flex items-center justify-between px-3.5 py-3 bg-carbon-850/80 hover:bg-carbon-800/80 transition cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-ochre-700">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-100 block">Design & Templates</span>
              <span className="text-[10.5px] font-mono text-royal-700 font-medium">
                Active: {doc.metadata.templateId} ({doc.metadata.pageSize})
              </span>
            </div>
          </div>
          <button type="button" className="p-1 text-slate-400">
            {openSections['design'] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {openSections['design'] && <div className="p-3 border-t border-carbon-700 bg-white"><DesignSection /></div>}
      </div>

      <div className="flex items-center justify-between pt-2 px-1">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Reorderable Content Rail
        </span>
        <span className="text-[10px] font-mono text-slate-500">Drag to change hierarchy</span>
      </div>

      {/* Reorderable Content Sections using @dnd-kit */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {sectionOrder.map((key) => {
              const config = sectionMetaMap[key];
              if (!config) return null;
              const isVisible = sectionOrder.includes(key);
              return (
                <SortableSectionItem
                  key={key}
                  id={key}
                  config={config}
                  isOpen={!!openSections[key]}
                  onToggle={() => toggleOpen(key)}
                  isVisible={isVisible}
                  onToggleVisibility={() => toggleSectionVisibility(key)}
                >
                  {renderSectionContent(key)}
                </SortableSectionItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
