import React, { useEffect, useState } from 'react';
import { Cpu, RotateCcw, Palette, GraduationCap } from 'lucide-react';
import { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'bento-grid-dark',
    name: 'Bento Grid',
    bg1: '#0a0c10', bg2: '#0f1219', bg3: '#06070a',
    text: '#f1f5f9', accent: '#6366f1', cardBg: 'rgba(255, 255, 255, 0.05)'
  },
  {
    id: 'dark-blue-indigo',
    name: 'Dark Blue & Indigo',
    bg1: '#0a1a35', bg2: '#101f4a', bg3: '#081c3e',
    text: '#e0e7ff', accent: '#6366f1', cardBg: 'rgba(16, 31, 74, 0.3)'
  },
  {
    id: 'cat-noir',
    name: 'Cat Noir',
    bg1: '#1F1F1F', bg2: '#0D0D0D', bg3: '#2D2D2D',
    text: '#81e733', accent: '#81e733', cardBg: 'rgba(129, 231, 51, 0.08)'
  },
  {
    id: 'blood-red',
    name: 'Blood Red',
    bg1: '#250202', bg2: '#450a0a', bg3: '#180202',
    text: '#fee2e2', accent: '#ef4444', cardBg: 'rgba(239, 68, 68, 0.08)'
  },
  {
    id: 'sapphire-steel',
    name: 'Sapphire & Steel',
    bg1: '#0f172a', bg2: '#1e293b', bg3: '#334155',
    text: '#f8fafc', accent: '#38bdf8', cardBg: 'rgba(56, 189, 248, 0.08)'
  },
  {
    id: 'emerald-charcoal',
    name: 'Emerald & Charcoal',
    bg1: '#022c22', bg2: '#064e4b', bg3: '#111827',
    text: '#e6f4ea', accent: '#10b981', cardBg: 'rgba(16, 185, 129, 0.08)'
  },
  {
    id: 'digital-twilight',
    name: 'Digital Twilight',
    bg1: '#120b24', bg2: '#1e113c', bg3: '#0d071a',
    text: '#fae8ff', accent: '#d946ef', cardBg: 'rgba(217, 70, 239, 0.08)'
  },
  {
    id: 'coral-aqua',
    name: 'Coral & Aqua',
    bg1: '#062c30', bg2: '#0f3d3e', bg3: '#e2d784',
    text: '#f5f5f5', accent: '#f28585', cardBg: 'rgba(242, 133, 133, 0.08)'
  },
  {
    id: 'electric-citrus',
    name: 'Electric Citrus',
    bg1: '#1a1002', bg2: '#2a1a04', bg3: '#0f0a01',
    text: '#fffdf5', accent: '#f59e0b', cardBg: 'rgba(245, 158, 11, 0.08)'
  },
  {
    id: 'forest-canopy',
    name: 'Forest Canopy',
    bg1: '#071e16', bg2: '#0d3225', bg3: '#040f0b',
    text: '#ecfdf5', accent: '#34d399', cardBg: 'rgba(52, 211, 153, 0.08)'
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    bg1: '#051622', bg2: '#1a2238', bg3: '#111b24',
    text: '#e0f2fe', accent: '#0284c7', cardBg: 'rgba(2, 132, 199, 0.08)'
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    bg1: '#241015', bg2: '#3d1620', bg3: '#130509',
    text: '#ffe4e6', accent: '#fb7185', cardBg: 'rgba(251, 113, 133, 0.08)'
  },
  {
    id: 'monochrome-focus',
    name: 'Monochrome Focus',
    bg1: '#090a0f', bg2: '#181a20', bg3: '#1f2937',
    text: '#ffffff', accent: '#9ca3af', cardBg: 'rgba(255, 255, 255, 0.05)'
  },
  {
    id: 'cyberpunk-glow',
    name: 'Cyberpunk Glow',
    bg1: '#07020d', bg2: '#0d0614', bg3: '#000000',
    text: '#ffffff', accent: '#00f5ff', cardBg: 'rgba(0, 245, 255, 0.08)'
  },
  {
    id: 'plum-gold',
    name: 'Plum & Gold',
    bg1: '#1e0524', bg2: '#2e0f3a', bg3: '#0d0111',
    text: '#fae8ff', accent: '#fbbf24', cardBg: 'rgba(251, 191, 36, 0.08)'
  },
  {
    id: 'dark-blue-cyan',
    name: 'Dark Blue & Cyan',
    bg1: '#08162b', bg2: '#0e243d', bg3: '#050c1b',
    text: '#ecfeff', accent: '#22d3ee', cardBg: 'rgba(34, 211, 238, 0.08)'
  },
  {
    id: 'dark-blue-electric',
    name: 'Dark Blue & Electric',
    bg1: '#041029', bg2: '#081d4a', bg3: '#020714',
    text: '#eff6ff', accent: '#3b82f6', cardBg: 'rgba(59, 130, 246, 0.08)'
  },
  {
    id: 'dark-blue-teal',
    name: 'Dark Blue & Teal',
    bg1: '#051722', bg2: '#0a2335', bg3: '#020b12',
    text: '#f0fdfa', accent: '#0d9488', cardBg: 'rgba(13, 148, 136, 0.08)'
  },
  {
    id: 'dark-emerald-blue',
    name: 'Dark Emerald Blue',
    bg1: '#012022', bg2: '#04343a', bg3: '#011012',
    text: '#f0f9ff', accent: '#0ea5e9', cardBg: 'rgba(14, 165, 233, 0.08)'
  }
];

interface HeaderProps {
  onResetLayout?: () => void;
}

export default function Header({ onResetLayout }: HeaderProps) {
  const [activeTheme, setActiveTheme] = useState<string>('bento-grid-dark');

  useEffect(() => {
    // Initial theme layout loading
    applyTheme('bento-grid-dark');
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;

    setActiveTheme(themeId);

    // Apply beautiful variables as local document style modifications
    const root = document.documentElement;
    root.style.setProperty('--bg1', theme.bg1);
    root.style.setProperty('--bg2', theme.bg2);
    root.style.setProperty('--bg3', theme.bg3);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--card', theme.cardBg);

    // Also inject custom theme body classes
    document.body.style.background = `linear-gradient(135deg, ${theme.bg1}, ${theme.bg2}, ${theme.bg3})`;
  };

  return (
    <header className="glass-card rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
      {/* Visual background ambient color */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: 'var(--accent)', transition: 'background-color 0.4s ease' }}
      />
      
      {/* Title block */}
      <div className="flex items-center gap-4 relative z-10">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center p-1 text-white shadow-lg transition-transform duration-300 hover:rotate-12"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
          }}
        >
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              OS Memory Management Simulator
            </h1>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono font-bold">
              v2.1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive Paging Algorithms & Hardware Translators
          </p>
        </div>
      </div>

      {/* Control Tools block */}
      <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto justify-end">
        {/* Course details index label */}
        <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-800/40 border border-slate-700/50 px-3 py-1.5 rounded-lg text-slate-400 font-mono">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>OS CORE: CSC3002F</span>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/60 rounded-xl px-2.5 py-1.5">
          <Palette className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5">
            <span 
              className="w-3.5 h-3.5 rounded-full inline-block transition-transform duration-300 shadow"
              style={{ 
                backgroundColor: 'var(--accent)', 
                boxShadow: '0 0 8px var(--accent)'
              }}
            />
            <select
              value={activeTheme}
              onChange={(e) => applyTheme(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 border-none outline-none cursor-pointer focus:ring-0"
              style={{ color: 'var(--text)' }}
            >
              {THEMES.map((theme) => (
                <option 
                  key={theme.id} 
                  value={theme.id}
                  className="bg-slate-950 text-slate-200"
                >
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Reset/Clear Button */}
        {onResetLayout && (
          <button
            onClick={onResetLayout}
            className="p-2.5 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors duration-200"
            title="Reset Simulator Settings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
