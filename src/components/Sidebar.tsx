import React from 'react';
import { BookOpen, Layers, RefreshCw, Code, ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  activeSubtopicId: string;
  onSelectSubtopic: (subtopicId: string) => void;
  categorySubtopics: { id: string; title: string }[];
}

export default function Sidebar({
  activeCategory,
  onSelectCategory,
  activeSubtopicId,
  onSelectSubtopic,
  categorySubtopics
}: SidebarProps) {

  const categories = [
    { id: 'vm2', label: '1. Virtual Memory II', icon: BookOpen },
    { id: 'pgt', label: '2. Page Tables', icon: Layers },
    { id: 'swa', label: '3. Swapping & Swaps', icon: RefreshCw },
    { id: 'sha', label: '4. Sharing & Guarding', icon: ShieldCheck },
    { id: 'multi', label: '5. Multi-Level Tables', icon: Layers },
    { id: 'algo', label: '6. Page Eviction Theory', icon: BookOpen },
    { id: 'simulator', label: '7. Live Sandbox Simulator', icon: CpuIcon },
    { id: 'quiz', label: '8. Diagnostic Practice Exam', icon: ClipboardCheck },
    { id: 'java', label: '9. Original Java Preservation', icon: Code },
    { id: 'practice', label: '10. Practice Prac & Automarker', icon: ClipboardCheck }
  ];

  return (
    <aside className="glass-card rounded-2xl p-5 flex flex-col h-full gap-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
          <span>Curriculum Modules</span>
        </h2>
        <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full text-indigo-300 font-mono font-bold">
          OS Core
        </span>
      </div>

      <p className="text-[11px] text-slate-400 -mt-1 leading-normal italic">
        Select a structured chapter, interactive trace sandbox, or code validation suite below:
      </p>

      {/* Main Tab Category Navigation */}
      <nav className="flex flex-col gap-1.5" aria-label="Course Curriculum Navigation">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 border ${
                isActive
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Separator divider */}
      {categorySubtopics.length > 0 && (
        <>
          <div className="border-t border-white/5 my-3" />
          
          {/* Detailed Subtopic Directory scroll list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider pl-1">
              Section Topics
            </span>
            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {categorySubtopics.map((sub) => {
                const isSubActive = activeSubtopicId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubtopic(sub.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-between group border ${
                      isSubActive
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <span className="truncate mr-2 group-hover:pl-0.5 transition-all duration-200">
                      {sub.title}
                    </span>
                    <ArrowRight 
                      className={`w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        isSubActive ? 'text-emerald-400' : 'text-slate-400'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}


    </aside>
  );
}

// Temporary CPU icon to prevent lucide-react resolution differences
function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 15h3" />
      <path d="M1 9h3" />
      <path d="M1 15h3" />
    </svg>
  );
}
