import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Info, HelpCircle, GraduationCap, ChevronRight, Award, Layers, CheckCircle2, FileQuestion } from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Simulator from './components/Simulator';
import Quiz from './components/Quiz';
import JavaPreservation from './components/JavaPreservation';
import PracticePrac from './components/PracticePrac';
import { CURRICULUM } from './data/curriculum';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('vm2');
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>('vm-intro');
  const [selectedPracticeChoice, setSelectedPracticeChoice] = useState<number | null>(null);

  // Sync subtopic selection when category modifications occur
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    setSelectedPracticeChoice(null);

    // Default to the first subtopic key in our registry
    if (catId !== 'simulator' && catId !== 'quiz' && catId !== 'java' && catId !== 'practice') {
      const subtopics = CURRICULUM[catId]?.subtopics || [];
      if (subtopics.length > 0) {
        setActiveSubtopicId(subtopics[0].id);
      }
    } else {
      setActiveSubtopicId('');
    }
  };

  const handleSelectSubtopic = (subId: string) => {
    setActiveSubtopicId(subId);
    setSelectedPracticeChoice(null);
  };

  // Re-typeset MathJax equations on content transitions
  useEffect(() => {
    let active = true;

    const triggerTypeset = () => {
      if (!active) return;
      const anyWindow = window as any;
      if (anyWindow.MathJax && typeof anyWindow.MathJax.typesetPromise === 'function') {
        try {
          if (typeof anyWindow.MathJax.typesetClear === 'function') {
            anyWindow.MathJax.typesetClear();
          }
          anyWindow.MathJax.typesetPromise().catch((err: any) => {
            console.warn('MathJax incremental typeset deferred:', err);
          });
        } catch (e) {
          console.warn('MathJax execution error:', e);
        }
      }
    };

    // Run cascade of timers to ensure typesetting after transitions (250ms delay) and hydration
    triggerTypeset();
    const t1 = setTimeout(triggerTypeset, 50);
    const t2 = setTimeout(triggerTypeset, 150);
    const t3 = setTimeout(triggerTypeset, 350); // After Framer Motion transition closes
    const t4 = setTimeout(triggerTypeset, 700); // Backstop fail-safe
    const t5 = setTimeout(triggerTypeset, 1500); // Backstop fail-safe 2

    window.addEventListener('mathjax-ready', triggerTypeset);

    return () => {
      active = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener('mathjax-ready', triggerTypeset);
    };
  }, [activeCategory, activeSubtopicId, selectedPracticeChoice]);

  // Retrieve current category dataset elements
  const currentCategoryData = CURRICULUM[activeCategory] || null;
  const currentSubtopics = currentCategoryData?.subtopics || [];
  const currentArticle = currentCategoryData?.content[activeSubtopicId] || null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen flex flex-col gap-2">
      {/* Header controls select element bar layout */}
      <Header onResetLayout={() => handleSelectCategory('vm2')} />

      {/* Main Structural Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* Left column sidebar lists */}
        <div className="lg:col-span-4 h-full">
          <Sidebar
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            activeSubtopicId={activeSubtopicId}
            onSelectSubtopic={handleSelectSubtopic}
            categorySubtopics={currentSubtopics}
          />
        </div>

        {/* Right column main content stage */}
        <main className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeSubtopicId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              {/* Dynamic route selection */}
              {activeCategory === 'simulator' && <Simulator />}
              {activeCategory === 'quiz' && <Quiz />}
              {activeCategory === 'java' && <JavaPreservation />}
              {activeCategory === 'practice' && <PracticePrac />}

              {/* Traditional article sections content rendering */}
              {activeCategory !== 'simulator' && activeCategory !== 'quiz' && activeCategory !== 'java' && activeCategory !== 'practice' && currentArticle && (
                <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden">
                  
                  {/* Subtle layout boundary line */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-transparent" />

                  {/* Header Title block */}
                  <div className="border-b border-white/5 pb-5">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block mb-1">
                      {currentCategoryData?.title || 'OS Core Tutorial'}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white text-balance leading-normal">
                      {currentArticle.title}
                    </h2>
                  </div>

                  {/* Core explanation section */}
                  <div className="space-y-4">
                    <p className="text-[13px] md:text-sm text-slate-350 leading-relaxed font-normal">
                      {currentArticle.explanation}
                    </p>
                  </div>

                  {/* Formula Section */}
                  {currentArticle.mathFormula && (
                    <section className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 space-y-3">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Core mathematical translation formulas</span>
                      </span>
                      <div className="latex-output px-4 py-6 text-center select-all font-mono leading-normal text-white">
                        {currentArticle.mathFormula}
                      </div>
                    </section>
                  )}

                  {/* High fidelity schematic block, if present */}
                  {currentArticle.customHtml && (
                    <div 
                      className="w-full relative py-2 animate-fadeIn" 
                      dangerouslySetInnerHTML={{ __html: currentArticle.customHtml }} 
                    />
                  )}

                  {/* Worked Example Section */}
                  {currentArticle.workedExample && (
                    <div className="bg-slate-950/40 rounded-2xl p-5 md:p-6 border border-white/5 space-y-4">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1 border-b border-white/5 pb-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Step-by-step worked practical problem</span>
                      </span>
                      
                      <div className="space-y-3">
                        <div className="text-xs">
                          <span className="font-bold text-slate-300 block mb-1">System parameters / Inputs:</span>
                          <p className="text-slate-400">{currentArticle.workedExample.inputs}</p>
                        </div>

                        <div className="space-y-2 pt-2">
                          <span className="font-bold text-slate-300 block text-xs">Evaluation steps:</span>
                          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-400">
                            {currentArticle.workedExample.steps.map((step, sIdx) => (
                              <li key={sIdx}>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="pt-3 border-t border-white/5 text-xs">
                          <span className="font-bold text-emerald-400 block mb-1">Final translated output:</span>
                          <p className="font-mono text-emerald-300 bg-emerald-500/5 px-3 py-2.5 rounded border border-emerald-500/20">
                            {currentArticle.workedExample.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real World Applications Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentArticle.realWorldApplications.map((app, appIdx) => (
                      <div key={appIdx} className="bg-slate-900/35 border border-white/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                          Real-world: {app.domain}
                        </span>
                        <p className="text-xs text-slate-400 leading-normal">
                          {app.scenario}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Practice Question */}
                  {currentArticle.interactivePractice && currentArticle.interactivePractice.length > 0 && (
                    <div className="bg-indigo-500/5 border border-indigo-500/15 p-5 md:p-6 rounded-2xl space-y-4">
                      <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5 border-b border-indigo-500/10 pb-2">
                        <FileQuestion className="w-4 h-4 text-indigo-400" />
                        <span>Self-assessment checkpoint</span>
                      </span>

                      {currentArticle.interactivePractice.map((pSet, pIdx) => (
                        <div key={pIdx} className="space-y-3">
                          <p className="text-xs font-bold text-slate-200 leading-relaxed">
                            {pSet.question}
                          </p>

                          <div className="grid grid-cols-1 gap-2">
                            {pSet.choices.map((choice, cIdx) => {
                              const isSelected = selectedPracticeChoice === cIdx;
                              const isCorrect = cIdx === pSet.correctIndex;
                              const isAnswered = selectedPracticeChoice !== null;

                              let btnClass = 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/20 hover:text-white';
                              if (isAnswered) {
                                if (isCorrect) {
                                  btnClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold';
                                } else if (isSelected) {
                                  btnClass = 'bg-red-500/10 border-red-500/30 text-red-300 font-bold';
                                } else {
                                  btnClass = 'bg-slate-950/20 border-slate-900 text-slate-650 opacity-40';
                                }
                              }

                              return (
                                <button
                                  key={cIdx}
                                  onClick={() => setSelectedPracticeChoice(cIdx)}
                                  disabled={isAnswered}
                                  className={`w-full text-left p-3.5 rounded-xl text-xs transition-all duration-200 border flex items-center justify-between group ${btnClass}`}
                                >
                                  <span>{choice}</span>
                                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          {selectedPracticeChoice !== null && (
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900 border-l-2 border-l-indigo-400 font-mono text-[11px] leading-relaxed text-slate-400 animate-fadeIn">
                              <span className="font-bold text-indigo-300 block mb-1">Diagnostic insight:</span>
                              <p className="text-slate-400 leading-normal">{pSet.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Shared layout copyright footer */}
      <footer className="glass-card mt-8 p-6 text-center rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 relative z-10 font-mono">
        <span>© 2026 operating systems curriculum repository. All rights reserved.</span>
        <span>2026 Moegamat Samsodien</span>
      </footer>
    </div>
  );
}
