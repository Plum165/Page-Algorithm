import React, { useState } from 'react';
import { Download, Copy, Code, FileCode, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { JAVA_SOURCES } from '../data/javaSources';

export default function JavaPreservation() {
  const [selectedFile, setSelectedFile] = useState<string>('Memory.java');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const fileKeys = Object.keys(JAVA_SOURCES);

  const handleCopy = (fileName: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
    });
  };

  const getDownloadHref = (content: string) => {
    return `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-transparent" />
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" />
              <span>Legacy Java Source Preservation Lab</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Compare the interactive modern TypeScript web trace modules with the native terminal-based Java operating system algorithms.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Download entire source files packet mock */}
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                fileKeys.map(k => `// === ${k} ===\n${JAVA_SOURCES[k as keyof typeof JAVA_SOURCES]}\n\n`).join('\n')
              )}`}
              download="OS_Memory_Algorithms_Legacy.txt"
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/60 hover:bg-slate-800 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Combined Sources</span>
            </a>
          </div>
        </div>

        {/* Informative Guidance Panel */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 mb-6 space-y-2 leading-relaxed">
          <p>
            <strong>Educational Parity:</strong> The Java source code provided here represents the exact programmatic models used by academics in operating system labs. 
            The auxiliary memory frame arrays mimic RAM slots inside a physical layout. Download these files, compile using <code className="font-mono text-white bg-slate-950 px-1 py-0.5 rounded">javac</code>, and execute locally!
          </p>
        </div>

        {/* Tab File Selector Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* File selector sidebar buttons */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider pl-1">
              Java Files
            </span>
            <div className="flex flex-col gap-1.5">
              {fileKeys.map((fileName) => {
                const isActive = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors border ${
                      isActive
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-white'
                        : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="truncate">{fileName}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'opacity-100 text-indigo-400' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>

            {/* Instruction on how to run locally */}
            <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40 mt-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Compile Locally:</span>
              </span>
              <pre className="text-[9px] font-mono bg-slate-950 p-2.5 rounded text-white overflow-x-auto border border-white/5 space-y-1">
                <div>javac Memory.java</div>
                <div>javac FIFO_Algorithm.java</div>
                <div>java FIFO_Algorithm</div>
              </pre>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-8 flex flex-col h-[550px] bg-slate-950/80 border border-slate-850 rounded-2xl overflow-hidden relative">
            {/* Embedded custom toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-white/5 relative z-10">
              <span className="text-xs font-mono font-bold text-slate-300">
                {selectedFile}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(selectedFile, JAVA_SOURCES[selectedFile as keyof typeof JAVA_SOURCES])}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  {copiedFile === selectedFile ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Download Button */}
                <a
                  href={getDownloadHref(JAVA_SOURCES[selectedFile as keyof typeof JAVA_SOURCES])}
                  download={selectedFile}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 hover:text-white text-xs font-bold text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Main Pre Code Box */}
            <div className="flex-1 overflow-auto p-5 font-mono text-xs text-slate-300 leading-normal scrollbar-thin">
              <pre className="whitespace-pre">
                {JAVA_SOURCES[selectedFile as keyof typeof JAVA_SOURCES]}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
