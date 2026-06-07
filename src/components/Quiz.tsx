import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, Trophy, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'On a 32-bit Virtual Address system with a 4 KB page size, how many total bits form the Virtual Page Number (VPN) suffix used to index the flat Page Table?',
    choices: [
      '12 bits',
      '20 bits',
      '32 bits',
      '10 bits'
    ],
    correctIndex: 1,
    explanation: 'A 4 KB page size equals 4096 bytes ($2^{12}$), which consumes 12 bits of offset. The remaining bits in the 32-bit address make up the Virtual Page Number index, which is $32 - 12 = 20$ bits.'
  },
  {
    id: 2,
    question: 'What occurs during Belady\'s Anomaly in operating systems page replacement calculations?',
    choices: [
      'The CPU cache context-switches repeatedly, triggering a hard lock',
      'Adding more physical frames/RAM space to a process under FIFO replacement results in an unexpected INCREASE in total page faults',
      'The dirty bit fails to copy back to storage disks',
      'The supervisor bit is bypassed by a user-mode exception'
    ],
    correctIndex: 1,
    explanation: 'First-In-First-Out (FIFO) replacement does not respect stack boundaries. For specific reference strings, giving the OS more physical frames can lead to more total page faults, an anomaly first proven by Laszlo Belady.'
  },
  {
    id: 3,
    question: 'Why does a Multi-Level (Hierarchical) page table structure consume far less physical RAM than a simple Flat page table for a typical virtual process?',
    choices: [
      'It uses deep disk swap regions to compress indices',
      'If a top-level Directory Pointer is marked invalid (null), the OS completely omits the entire level-2 page table it represents, preventing allocation of empty space gaps',
      'It restricts virtual address scope to 16 bits',
      'It automatically merges page frames'
    ],
    correctIndex: 1,
    explanation: 'Since process address spaces are sparse (large empty gaps exist between the Code at the bottom, Heap in the middle, and Stack at the top), flat schemas require million-row arrays. In contrast, directories in multi-level structures point to null, omitting entire tables.'
  },
  {
    id: 4,
    question: 'Under the Clock (Second Chance) algorithm, what are the sequence of bit modifications when a page fault evicts a page if all current frames have Reference Bits set to 1?',
    choices: [
      'All pages are evicted simultaneously',
      'The Clock Hand sweeps, clearing all reference bits from 1 to 0, and evicts the first page it evaluated upon returning to its starting position',
      'The clock hand halts, generating a hardware translation error',
      'All reference bits are immediately set to 1'
    ],
    correctIndex: 1,
    explanation: 'If all reference bits are 1, the clock hand circles. It clears each page\'s bit to 0, granting a second chance. Upon wrapping to its start position, the hand encounters the first cleared page (bit is now 0) and replaces it.'
  },
  {
    id: 5,
    question: 'What is the main physical performance constraint that the Translation Lookaside Buffer (TLB) resolves in multi-level page tables?',
    choices: [
      'It expands physical motherboard capacity',
      'It prevents page swaps to hard disks',
      'It resolves the delay of looking up multiple hierarchical page folders (PML4, PDPT, etc.) in RAM by caching translations directly inside a high-speed CPU hardware buffer',
      'It eliminates the need for supervisor context switches'
    ],
    correctIndex: 2,
    explanation: 'Reading hierarchical page trees requires multiple memory fetches before retrieving the actual instruction. The TLB holds recent translations, resolving memory latency issues.'
  }
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentStepIndex] = useState(0);
  const [userSelectedChoices, setUserSelectedChoices] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  // Trigger MathJax typesetting whenever the question index changes, an answer is checked, or the quiz completes/restarts
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
            console.warn('MathJax Quiz typeset deferred:', err);
          });
        } catch (e) {
          console.warn('MathJax execution error:', e);
        }
      }
    };

    // Run cascade of timers to ensure typesetting after transition and hydration
    triggerTypeset();
    const t1 = setTimeout(triggerTypeset, 50);
    const t2 = setTimeout(triggerTypeset, 150);
    const t3 = setTimeout(triggerTypeset, 350);
    const t4 = setTimeout(triggerTypeset, 700);

    window.addEventListener('mathjax-ready', triggerTypeset);

    return () => {
      active = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('mathjax-ready', triggerTypeset);
    };
  }, [currentQuestionIndex, isAnswered, isExamCompleted]);

  const activeQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleChoiceSelect = (choiceIndex: number) => {
    if (isAnswered) return;

    const correct = choiceIndex === activeQuestion.correctIndex;
    setUserSelectedChoices(prev => ({ ...prev, [activeQuestion.id]: choiceIndex }));
    setIsAnswered(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsExamCompleted(true);
    }
  };

  const resetExam = () => {
    setCurrentStepIndex(0);
    setUserSelectedChoices({});
    setIsAnswered(false);
    setScore(0);
    setIsExamCompleted(false);
  };

  const getCompetenceBadge = (sc: number) => {
    const pct = (sc / QUIZ_QUESTIONS.length) * 100;
    if (pct === 100) return { title: ' Ring 0 Supervisor Kernel Architect ', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (pct >= 80) return { title: ' High-Performance MMU Memory Controller ', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (pct >= 60) return { title: ' User Space Process Thread ', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    return { title: ' Wasted Internal Fragment (Compaction Required)', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  const badge = getCompetenceBadge(score);

  if (isExamCompleted) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center space-y-6 relative overflow-hidden">
        {/* Confetti background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 relative z-10 animate-bounce">
          <Trophy className="w-8 h-8 text-slate-900" />
        </div>

        <div className="relative z-10 space-y-2">
          <h3 className="text-2xl font-black text-white">Diagnostic Exam Complete!</h3>
          <p className="text-sm text-slate-400">
            You scored <strong className="text-white font-mono">{score}</strong> out of <strong className="text-white font-mono">{QUIZ_QUESTIONS.length}</strong> correct.
          </p>
        </div>

        <div className="relative z-10 py-5 max-w-md mx-auto">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
            Assigned Memory boundary Rank
          </span>
          <div className={`mt-2 border p-4 rounded-2xl font-mono text-xs font-bold leading-normal ${badge.color}`}>
            {badge.title}
          </div>
        </div>

        <button
          onClick={resetExam}
          className="relative z-10 px-5 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold font-mono inline-flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  const selectedChoice = userSelectedChoices[activeQuestion.id];

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden min-h-[450px]">
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-transparent" />
      
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Memory Management Diagnostic</h3>
        </div>
        <span className="font-mono text-xs bg-slate-900 px-3 py-1 rounded text-slate-400">
          Q: {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      {/* Progress Bar indicator */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="space-y-6">
        <h4 className="text-base md:text-lg font-bold text-white leading-relaxed">
          {activeQuestion.question}
        </h4>

        {/* Options List */}
        <div className="grid grid-cols-1 gap-3">
          {activeQuestion.choices.map((choice, index) => {
            const isSelected = selectedChoice === index;
            const isCorrect = index === activeQuestion.correctIndex;
            
            let btnClass = 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:text-white';
            
            if (isAnswered) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold';
              } else if (isSelected) {
                btnClass = 'bg-red-500/10 border-red-500/40 text-red-300 font-bold';
              } else {
                btnClass = 'bg-slate-950 border-slate-900 text-slate-600';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleChoiceSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl text-xs transition-all duration-200 border flex items-center justify-between group select-none ${btnClass} ${
                  !isAnswered && 'cursor-pointer'
                }`}
              >
                <span>{choice}</span>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanations section */}
        {isAnswered && (
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed space-y-2 animate-fadeIn">
            <span className="font-extrabold uppercase text-indigo-400 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Translation explanation:</span>
            </span>
            <p className="text-slate-400 leading-normal">{activeQuestion.explanation}</p>
            
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all text-xs"
              >
                {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'View Competence Score'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
