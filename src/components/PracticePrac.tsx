import React, { useState } from 'react';
import { JAVA_SOURCES } from '../data/javaSources';

export default function PracticePrac() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
    });
  };

  const getDownloadHref = (content: string) => {
    return `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-5 mb-6">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block mb-1">
            Coursework & Submissions
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Practice Prac Test & Instructions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete the standard operating systems practical algorithms, download simulation helper classes, and test your files against the official judge.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* STEP 1: DOWNLOAD */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-indigo-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-xl shrink-0">📂</div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1">Step 1: Download Support Files</h4>
              <p className="text-xs text-gray-400 mb-4">You need the base Memory class to handle the physical frame simulations.</p>
              <a 
                href={getDownloadHref(JAVA_SOURCES['Memory.java'])} 
                download="Memory.java" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Download Memory.java</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* STEP 2: AUTOMARKER */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-emerald-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl shrink-0">✅</div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1">Step 2: Code & Test</h4>
              <p className="text-xs text-gray-400 mb-4">Once you have implemented your logic in the templates provided, upload them to the judge for verification.</p>
              <a 
                href="https://automark-code-judge.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/20 text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open Automarker</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Files download Block */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-emerald-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl shrink-0">✅</div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1">Link to the GitHub Repository</h4>
              <p className="text-xs text-gray-400 mb-4">If you require the zip file to download the correct code, here is the GitHub link.</p>
              <a 
                href="https://github.com/Plum165/pgAlgo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/20 text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open GitHub</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* FIFO */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-indigo-500">FIFO Implementation</h4>
          <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-[10px] font-mono text-gray-400">FIFO_Algorithm.java</span>
              <button 
                onClick={() => handleCopy('fifo', JAVA_SOURCES['FIFO_Algorithm.java'])}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 hover:text-white text-[10px] font-mono text-indigo-300 rounded transition-all cursor-pointer"
              >
                {copiedKey === 'fifo' ? 'Copied Template!' : 'Copy Template'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-indigo-300 overflow-x-auto bg-slate-950/40 leading-relaxed">
              {JAVA_SOURCES['FIFO_Algorithm.java']}
            </pre>
          </div>
        </div>

        {/* LRU */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-amber-500">LRU Implementation</h4>
          <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-[10px] font-mono text-gray-400">LRU_Algorithm.java</span>
              <button 
                onClick={() => handleCopy('lru', JAVA_SOURCES['LRU_Algorithm.java'])}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 hover:text-white text-[10px] font-mono text-amber-200 rounded transition-all cursor-pointer"
              >
                {copiedKey === 'lru' ? 'Copied Template!' : 'Copy Template'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-amber-200 overflow-x-auto bg-slate-950/40 leading-relaxed">
              {JAVA_SOURCES['LRU_Algorithm.java']}
            </pre>
          </div>
        </div>

        {/* CLOCK */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-cyan-500">Clock Second-Chance Implementation</h4>
          <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-[10px] font-mono text-gray-400">ClockSecondChance_Algorithm.java</span>
              <button 
                onClick={() => handleCopy('clock', JAVA_SOURCES['ClockSecondChance_Algorithm.java'])}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 hover:text-white text-[10px] font-mono text-cyan-200 rounded transition-all cursor-pointer"
              >
                {copiedKey === 'clock' ? 'Copied Template!' : 'Copy Template'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-cyan-200 overflow-x-auto bg-slate-950/40 leading-relaxed">
              {JAVA_SOURCES['ClockSecondChance_Algorithm.java']}
            </pre>
          </div>
        </div>

        {/* OPT */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-emerald-500">Optimal Implementation</h4>
          <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-[10px] font-mono text-gray-400">OPT_Algorithm.java</span>
              <button 
                onClick={() => handleCopy('opt', JAVA_SOURCES['OPT_Algorithm.java'])}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 hover:text-white text-[10px] font-mono text-emerald-200 rounded transition-all cursor-pointer"
              >
                {copiedKey === 'opt' ? 'Copied Template!' : 'Copy Template'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-emerald-200 overflow-x-auto bg-slate-950/40 leading-relaxed">
              {JAVA_SOURCES['OPT_Algorithm.java']}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
