import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RefreshCw, BarChart2, Eye, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

// Help trace simulation state for any single algorithm
interface SimulatedStep {
  ref: number;
  frames: (number | null)[];
  status: 'HIT' | 'FAULT';
  evicted: number | null;
  clockHand?: number;
  referenceBits?: number[];
  recentHistory?: number[]; // Chronological list of active values (MRU at the end)
  futureDetails?: { val: number; nextUseIndex: number }[]; // Future index positions
  comment: string;
}

const PRESET_STRINGS = [
  { name: 'Standard Exam Sequence', string: '7, 0, 1, 2, 0, 3, 0, 4, 2, 3' },
  { name: 'Second Chance Slide', string: '0, 4, 1, 4, 2, 4, 3, 4' },
  { name: 'Belady Anomaly Demo', string: '1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5' },
  { name: 'Frequent Hot Loop', string: '2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2' }
];

export default function Simulator() {
  const [inputText, setInputText] = useState('7, 0, 1, 2, 0, 3, 0, 4, 2, 3');
  const [numFrames, setNumFrames] = useState(3);
  const [activeTab, setActiveTab] = useState<'stepper' | 'compare'>('stepper');
  
  // Stepper state
  const [selectedAlgo, setSelectedAlgo] = useState<'FIFO' | 'LRU' | 'OPT' | 'Clock'>('FIFO');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState(1500); // ms
  
  // Compiled traces
  const [simStepList, setSimStepList] = useState<SimulatedStep[]>([]);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse reference sequence
  const parseRefString = (): number[] => {
    return inputText
      .split(',')
      .map(item => parseInt(item.trim(), 10))
      .filter(val => !isNaN(val) && val >= 0);
  };

  const refArray = parseRefString();

  // Regenerate simulations whenever inputs modify
  useEffect(() => {
    compileSimulation(selectedAlgo);
  }, [inputText, numFrames, selectedAlgo]);

  // Autoplay handler
  useEffect(() => {
    if (isAutoplay) {
      autoplayTimerRef.current = setTimeout(() => {
        if (currentStep < refArray.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsAutoplay(false);
        }
      }, autoplaySpeed);
    } else {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    }

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [isAutoplay, currentStep, autoplaySpeed, refArray.length]);

  // Eviction engines inside TypeScript
  const compileSimulation = (algo: 'FIFO' | 'LRU' | 'OPT' | 'Clock') => {
    const refs = parseRefString();
    if (refs.length === 0) {
      setSimStepList([]);
      setCurrentStep(0);
      return;
    }

    const steps: SimulatedStep[] = [];
    const currentMemory: (number | null)[] = Array(numFrames).fill(null);
    
    // Core states
    let clockHand = 0;
    const refBits: number[] = Array(numFrames).fill(0);
    const fifoLoadIndex: number[] = Array(numFrames).fill(-1); // Frame index loaded ages
    const lruHistory: number[] = []; // Most recently used on end

    for (let i = 0; i < refs.length; i++) {
      const page = refs[i];
      const isHit = currentMemory.includes(page);
      
      let status: 'HIT' | 'FAULT' = isHit ? 'HIT' : 'FAULT';
      let evicted: number | null = null;
      let comment = '';

      if (isHit) {
        // Hit logic
        const frameIndex = currentMemory.indexOf(page);
        comment = `Page ${page} found in Frame ${frameIndex} (Hit).`;

        if (algo === 'LRU') {
          // Push to end of LRU chronological index
          const historyIndex = lruHistory.indexOf(page);
          if (historyIndex !== -1) lruHistory.splice(historyIndex, 1);
          lruHistory.push(page);
          comment += ` Recent usage stack updated.`;
        } else if (algo === 'Clock') {
          refBits[frameIndex] = 1;
          comment += ` Reference bit for Frame ${frameIndex} set to 1.`;
        }
      } else {
        // Fault Logic
        // Find empty slot
        let freeFrameIndex = currentMemory.indexOf(null);

        if (freeFrameIndex !== -1) {
          currentMemory[freeFrameIndex] = page;
          fifoLoadIndex[freeFrameIndex] = i;
          
          if (algo === 'LRU') {
            lruHistory.push(page);
          } else if (algo === 'Clock') {
            refBits[freeFrameIndex] = 1;
            clockHand = (freeFrameIndex + 1) % numFrames;
          }

          comment = `Page Fault! Memory has empty Frame ${freeFrameIndex}. Page ${page} loaded.`;
        } else {
          // Replacement occurs
          let evictFrameIndex = -1;

          if (algo === 'FIFO') {
            // Find frame index compiled with oldest absolute index
            let oldestStep = Integer_MAX();
            for (let f = 0; f < numFrames; f++) {
              if (fifoLoadIndex[f] < oldestStep) {
                oldestStep = fifoLoadIndex[f];
                evictFrameIndex = f;
              }
            }
            evicted = currentMemory[evictFrameIndex];
            comment = `Page Fault! Evicting oldest frame: Page ${evicted} from Frame ${evictFrameIndex}.`;
            
            // replace
            currentMemory[evictFrameIndex] = page;
            fifoLoadIndex[evictFrameIndex] = i;

          } else if (algo === 'LRU') {
            // Find active element that is placed at bottom of LRU history
            const lruPage = lruHistory[0];
            evictFrameIndex = currentMemory.indexOf(lruPage);
            evicted = lruPage;

            comment = `Page Fault! Evicting least recently used page: ${lruPage} from Frame ${evictFrameIndex}.`;

            currentMemory[evictFrameIndex] = page;
            lruHistory.shift();
            lruHistory.push(page);

          } else if (algo === 'OPT') {
            // Investigate future access occurrences
            let furthestUse = -1;
            for (let f = 0; f < numFrames; f++) {
              const currentPage = currentMemory[f];
              let nextUseIndex = Integer_MAX();

              for (let j = i + 1; j < refs.length; j++) {
                if (refs[j] === currentPage) {
                  nextUseIndex = j;
                  break;
                }
              }

              if (nextUseIndex > furthestUse) {
                furthestUse = nextUseIndex;
                evictFrameIndex = f;
              }
            }
            evicted = currentMemory[evictFrameIndex];
            const displayDist = furthestUse === Integer_MAX() ? 'infinity' : `step ${furthestUse}`;
            comment = `Page Fault! Evicting page ${evicted} because its future access is furthest (${displayDist}).`;

            currentMemory[evictFrameIndex] = page;

          } else if (algo === 'Clock') {
            // Sweep circular needle
            let found = false;
            let sweeps = 0;
            comment = `Page Fault! Initiating Clock needle sweep from Frame ${clockHand}: `;
            
            while (!found) {
              if (refBits[clockHand] === 0) {
                evictFrameIndex = clockHand;
                evicted = currentMemory[clockHand];
                refBits[clockHand] = 1; // Newly loaded page bit becomes 1
                currentMemory[clockHand] = page;
                
                comment += `Evicted Page ${evicted} at frame ${clockHand}.`;
                clockHand = (clockHand + 1) % numFrames;
                found = true;
              } else {
                refBits[clockHand] = 0; // Offer second chance
                comment += `Reset high Frame ${clockHand} ref bit to 0. `;
                clockHand = (clockHand + 1) % numFrames;
              }
              sweeps++;
              if (sweeps > 30) break; // Infinite check break
            }
          }
        }
      }

      // Collect auxiliary visual details
      const futureDetailsList = currentMemory
        .filter((val): val is number => val !== null)
        .map(val => {
          let nextIdx = Integer_MAX();
          for (let j = i + 1; j < refs.length; j++) {
            if (refs[j] === val) {
              nextIdx = j;
              break;
            }
          }
          return { val, nextUseIndex: nextIdx };
        });

      steps.push({
        ref: page,
        frames: [...currentMemory],
        status,
        evicted,
        clockHand: algo === 'Clock' ? clockHand : undefined,
        referenceBits: algo === 'Clock' ? [...refBits] : undefined,
        recentHistory: algo === 'LRU' ? [...lruHistory] : undefined,
        futureDetails: algo === 'OPT' ? futureDetailsList : undefined,
        comment
      });
    }

    setSimStepList(steps);
    // Boundary lock current step
    if (currentStep >= refs.length) {
      setCurrentStep(refs.length - 1);
    }
  };

  const Integer_MAX = () => 9999999;

  // Run a standalone full trace helper for Comparison table
  const compileFullTrace = (algo: 'FIFO' | 'LRU' | 'OPT' | 'Clock') => {
    const refs = parseRefString();
    const steps: { ref: number; frames: (number | null)[]; status: 'H' | 'F' }[] = [];
    const currentMemory: (number | null)[] = Array(numFrames).fill(null);
    
    let clockHand = 0;
    const refBits: number[] = Array(numFrames).fill(0);
    const fifoIndex: number[] = Array(numFrames).fill(-1);
    const lruHist: number[] = [];

    for (let i = 0; i < refs.length; i++) {
      const page = refs[i];
      const isHit = currentMemory.includes(page);
      
      if (isHit) {
        const frameIndex = currentMemory.indexOf(page);
        if (algo === 'LRU') {
          const idx = lruHist.indexOf(page);
          if (idx !== -1) lruHist.splice(idx, 1);
          lruHist.push(page);
        } else if (algo === 'Clock') {
          refBits[frameIndex] = 1;
        }
        steps.push({ ref: page, frames: [...currentMemory], status: 'H' });
      } else {
        const freeIndex = currentMemory.indexOf(null);
        if (freeIndex !== -1) {
          currentMemory[freeIndex] = page;
          fifoIndex[freeIndex] = i;
          if (algo === 'LRU') lruHist.push(page);
          else if (algo === 'Clock') {
            refBits[freeIndex] = 1;
            clockHand = (freeIndex + 1) % numFrames;
          }
          steps.push({ ref: page, frames: [...currentMemory], status: 'F' });
        } else {
          let replaceIdx = -1;
          if (algo === 'FIFO') {
            let oldest = 9999999;
            for (let f = 0; f < numFrames; f++) {
              if (fifoIndex[f] < oldest) {
                oldest = fifoIndex[f];
                replaceIdx = f;
              }
            }
            currentMemory[replaceIdx] = page;
            fifoIndex[replaceIdx] = i;
          } else if (algo === 'LRU') {
            const lruPage = lruHist[0];
            replaceIdx = currentMemory.indexOf(lruPage);
            currentMemory[replaceIdx] = page;
            lruHist.shift();
            lruHist.push(page);
          } else if (algo === 'OPT') {
            let furthest = -1;
            for (let f = 0; f < numFrames; f++) {
              let nextIdx = 9999999;
              for (let j = i + 1; j < refs.length; j++) {
                if (refs[j] === currentMemory[f]) {
                  nextIdx = j;
                  break;
                }
              }
              if (nextIdx > furthest) {
                furthest = nextIdx;
                replaceIdx = f;
              }
            }
            currentMemory[replaceIdx] = page;
          } else if (algo === 'Clock') {
            while (true) {
              if (refBits[clockHand] === 0) {
                replaceIdx = clockHand;
                refBits[clockHand] = 1;
                currentMemory[clockHand] = page;
                clockHand = (clockHand + 1) % numFrames;
                break;
              } else {
                refBits[clockHand] = 0;
                clockHand = (clockHand + 1) % numFrames;
              }
            }
          }
          steps.push({ ref: page, frames: [...currentMemory], status: 'F' });
        }
      }
    }
    return steps;
  };

  const handlePresetSelect = (presetString: string) => {
    setInputText(presetString);
    setCurrentStep(0);
    setIsAutoplay(false);
  };

  const handleStepForward = () => {
    if (currentStep < refArray.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Compile full steps for side-by-side view
  const fifoTrace = compileFullTrace('FIFO');
  const lruTrace = compileFullTrace('LRU');
  const optTrace = compileFullTrace('OPT');
  const clockTrace = compileFullTrace('Clock');

  const countFaults = (trace: { status: 'H' | 'F' }[]) => trace.filter(t => t.status === 'F').length;

  const fifoFaults = countFaults(fifoTrace);
  const lruFaults = countFaults(lruTrace);
  const optFaults = countFaults(optTrace);
  const clockFaults = countFaults(clockTrace);

  // Active step details
  const currentStepData = simStepList[currentStep] || null;

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        {/* Background glow strip */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Interactive Page Placement Sandbox</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualize physical frame replacement in real-time. Input indices, adjust scale, and watch standard memory queues evict pages.
            </p>
          </div>
          
          {/* Custom Tabs */}
          <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('stepper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'stepper'
                  ? 'bg-indigo-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Analyse step-by-step</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'compare'
                  ? 'bg-indigo-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Side-by-side Matrix</span>
            </button>
          </div>
        </div>

        {/* Configurations Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-950/40 p-5 rounded-2xl border border-white/5 mb-6">
          {/* Preset Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Select Preset Workload
            </label>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {PRESET_STRINGS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(p.string)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                    inputText === p.string
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="block font-bold">{p.name}</span>
                  <span className="block text-[10px] font-mono opacity-65 truncate max-w-[250px]">
                    {p.string}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Strings */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex justify-between">
              <span>Reference string indices</span>
              <span className="text-[9px] font-mono text-slate-500">Comma separated sequence</span>
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setCurrentStep(0);
              }}
              className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 flex-1"
              placeholder="e.g. 7, 0, 1, 2, 0, 3, 0"
            />
            <p className="text-[10px] text-slate-500">
              Valid inputs is filtered automatically. Double commas or blank spaces are safety-skipped.
            </p>
          </div>

          {/* Frame Number Range Slider */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex justify-between">
              <span>Physical frames ({numFrames})</span>
              <span className="text-[9px] text-emerald-400">Motherboard Slots</span>
            </label>
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/60 p-2.5 rounded-xl">
              <input
                type="range"
                min="2"
                max="6"
                value={numFrames}
                onChange={(e) => {
                  setNumFrames(parseInt(e.target.value, 10));
                  setCurrentStep(0);
                }}
                className="w-full accent-indigo-500 cursor-ew-resize"
              />
              <span className="font-bold font-mono text-sm px-3 py-1 bg-slate-950 rounded border border-slate-700">
                {numFrames}
              </span>
            </div>
            {/* Belady warning detector */}
            {selectedAlgo === 'FIFO' && numFrames === 4 && inputText.startsWith('1, 2, 3, 4, 1, 2, 5') && (
              <span className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Belady anomaly active! Faults may rise!</span>
              </span>
            )}
          </div>
        </div>

        {/* SUBTAB CONTENT 1: STEPPER COMPONENT */}
        {activeTab === 'stepper' && (
          <div className="space-y-6">
            {/* Alg Nav Select Row */}
            <div className="flex border-b border-white/5 pb-4 gap-2 overflow-x-auto">
              {(['FIFO', 'LRU', 'OPT', 'Clock'] as const).map((algo) => (
                <button
                  key={algo}
                  onClick={() => {
                    setSelectedAlgo(algo);
                    setCurrentStep(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedAlgo === algo
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900/50 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {algo === 'Clock' ? 'Clock (Second Chance)' : algo}
                </button>
              ))}
            </div>

            {/* Step Stepper Header Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              {/* Stepper Details */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Step:</span>
                <span className="font-mono text-sm font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-700 text-slate-200">
                  {currentStep + 1} / {refArray.length}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-400">Incoming value:</span>
                <span className="font-mono text-sm font-black text-white bg-indigo-500 px-3 py-1 rounded-sm shadow">
                  {refArray[currentStep] ?? '-'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStep === 0}
                  className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
                    isAutoplay
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isAutoplay ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Autoplay</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={currentStep === refArray.length - 1}
                  className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setIsAutoplay(false);
                  }}
                  className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-slate-300 transition-all font-mono text-xs font-bold"
                  title="Reset to step 1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Config */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Speed:</span>
                <select
                  value={autoplaySpeed}
                  onChange={(e) => setAutoplaySpeed(parseInt(e.target.value, 10))}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="2000">Slow (2s)</option>
                  <option value="1500">Normal (1.5s)</option>
                  <option value="800">Fast (0.8s)</option>
                </select>
              </div>
            </div>

            {/* VISUAL PHYSICAL STAGE SIMULATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Physical Memory Node Boxes */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Physical Frame slots (RAM)
                    </span>
                    {currentStepData && (
                      <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                        currentStepData.status === 'HIT'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {currentStepData.status === 'HIT' ? '● PAGE HIT' : '▲ PAGE FAULT'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array(numFrames).fill(null).map((_, index) => {
                      const value = currentStepData?.frames[index];
                      const isEmpty = value === undefined || value === null;
                      
                      // Highlight if hit/modified
                      const isClockHandActive = selectedAlgo === 'Clock' && currentStepData?.clockHand === index;
                      const hasLruRecentWeight = selectedAlgo === 'LRU' && value !== null && currentStepData?.recentHistory?.indexOf(value) === 0;

                      return (
                        <div
                          key={index}
                          className={`relative h-28 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 shadow ${
                            isEmpty
                              ? 'bg-slate-900/30 border-dashed border-slate-800 text-slate-600'
                              : isClockHandActive && selectedAlgo === 'Clock'
                              ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-cyan-100'
                              : 'bg-slate-900 border-slate-700 text-white'
                          }`}
                        >
                          <span className="absolute top-2 left-3 text-[9px] font-mono text-slate-500 font-bold uppercase">
                            Frame {index}
                          </span>

                          {/* Clock specific bits */}
                          {selectedAlgo === 'Clock' && !isEmpty && currentStepData?.referenceBits && (
                            <span className="absolute top-2 right-3 text-[9px] font-mono bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">
                              Ref: {currentStepData.referenceBits[index]}
                            </span>
                          )}

                          {/* LRU metadata indicator */}
                          {selectedAlgo === 'LRU' && !isEmpty && value !== null && hasLruRecentWeight && (
                            <span className="absolute top-2 right-3 text-[8px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                              LRU (Oldest)
                            </span>
                          )}

                          {/* Main cell value */}
                          <div className="text-3xl font-extrabold font-mono tracking-tight select-none">
                            {isEmpty ? '-' : value}
                          </div>

                          {/* Clock indicator status pointer */}
                          {isClockHandActive && (
                            <div className="absolute -bottom-2 bg-cyan-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest shadow animate-pulse">
                              ☛ CLOCK HAND
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Explanation and Trace path */}
                {currentStepData && (
                  <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex gap-3 text-xs leading-relaxed">
                    {currentStepData.status === 'HIT' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-200">Execution narrative:</span>
                      <p className="text-slate-400 mt-1">{currentStepData.comment}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Custom algorithm state tables */}
              <div className="lg:col-span-4 space-y-4">
                {/* Stats Summary Card */}
                <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Diagnostic counters (Running)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 font-mono text-center">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-500 uppercase">Page Faults</div>
                      <div className="text-2xl font-black text-indigo-400">
                        {simStepList.slice(0, currentStep + 1).filter(s => s.status === 'FAULT').length}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-500 uppercase">Hits</div>
                      <div className="text-2xl font-black text-emerald-400">
                        {simStepList.slice(0, currentStep + 1).filter(s => s.status === 'HIT').length}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Hit Rate:</span>
                      <span className="font-bold text-slate-200 font-mono">
                        {refArray.length > 0 
                          ? ((simStepList.slice(0, currentStep + 1).filter(s => s.status === 'HIT').length / (currentStep + 1)) * 100).toFixed(1)
                          : '0.0'}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-algorithm custom data detail panels (LRU queue, Clock pointers, or OPT Future list) */}
                {selectedAlgo === 'LRU' && currentStepData?.recentHistory && (
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block flex justify-between">
                      <span>CHRONOLOGICAL USAGE STACK</span>
                      <span className="text-[9px] text-amber-400">Top = MRU</span>
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 font-mono text-xs">
                      {currentStepData.recentHistory.map((val, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className={`px-2.5 py-1.5 rounded-lg border font-bold ${
                            idx === 0 
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                              : idx === currentStepData.recentHistory!.length - 1
                              ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}>
                            {val}
                          </span>
                          {idx < currentStepData.recentHistory!.length - 1 && (
                            <span className="text-slate-600">→</span>
                          )}
                        </div>
                      ))}
                      {currentStepData.recentHistory.length === 0 && (
                        <span className="text-slate-500 italic">No usage recorded yet</span>
                      )}
                    </div>
                  </div>
                )}

                {selectedAlgo === 'OPT' && currentStepData?.futureDetails && (
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      FUTURE LOOKAHEAD METRICS (Distance to next use)
                    </span>
                    <div className="space-y-2 font-mono text-xs">
                      {currentStepData.futureDetails.map((item, idx) => {
                        const dist = item.nextUseIndex === Integer_MAX() ? '∞ (Infinity)' : `Index ${item.nextUseIndex}`;
                        return (
                          <div key={idx} className="flex justify-between bg-slate-900/60 p-2 rounded border border-slate-800">
                            <span className="text-slate-200">Page {item.val}:</span>
                            <span className={item.nextUseIndex === Integer_MAX() ? 'text-red-400 font-bold' : 'text-slate-400'}>
                              {dist}
                            </span>
                          </div>
                        );
                      })}
                      {currentStepData.futureDetails.length === 0 && (
                        <span className="text-slate-500 italic">No frames allocated yet</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom visual trace bar array */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 overflow-x-auto">
              <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider block mb-4">
                Chronological Traces timeline list
              </span>
              
              <div className="flex gap-2 min-w-[600px] pb-2 font-mono">
                {refArray.map((val, idx) => {
                  const stepReport = simStepList[idx];
                  const isCurrent = idx === currentStep;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentStep(idx);
                        setIsAutoplay(false);
                      }}
                      className={`w-11 h-14 shrink-0 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                          : idx < currentStep
                          ? 'border-slate-800 bg-slate-900/40 opacity-70'
                          : 'border-slate-850 bg-transparent opacity-45'
                      }`}
                    >
                      <span className="text-[8px] text-slate-500 font-bold">t={idx}</span>
                      <span className="text-sm font-extrabold text-white mt-0.5">{val}</span>
                      {stepReport && (
                        <span className={`text-[9px] font-bold mt-1 ${
                          stepReport.status === 'HIT' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {stepReport.status === 'HIT' ? 'H' : 'F'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB CONTENT 2: COMPARATIVE MATRIX BLOCK */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p>
                <strong>The Side-by-Side matrix trace:</strong> Below, you can see how FIFO, LRU, OPT and Clock execute the exact same entry references side-by-side. 
                Compare total page fault counts, understand Belady's FIFO anomalies, and monitor mathematical optimization targets.
              </p>
            </div>

            {/* Matrix comparison statistics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
              <div className="bg-slate-950/80 border-2 border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500">FIFO Faults</span>
                  <div className="text-3xl font-black text-red-400/90 mt-1">{fifoFaults}</div>
                </div>
                <div className="text-[9px] text-slate-500 mt-2">Oldest Replacement</div>
              </div>

              <div className="bg-slate-950/80 border-2 border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500">LRU Faults</span>
                  <div className="text-3xl font-black text-amber-400/90 mt-1">{lruFaults}</div>
                </div>
                <div className="text-[9px] text-slate-500 mt-2">Historical Usage</div>
              </div>

              <div className="bg-slate-950/80 border-2 border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500">OPT Faults</span>
                  <div className="text-3xl font-black text-emerald-400/90 mt-1">{optFaults}</div>
                </div>
                <div className="text-[9px] text-emerald-500 font-bold mt-2">Optimal Minimum</div>
              </div>

              <div className="bg-slate-950/80 border-2 border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500">Clock Faults</span>
                  <div className="text-3xl font-black text-cyan-400/90 mt-1">{clockFaults}</div>
                </div>
                <div className="text-[9px] text-slate-500 mt-2">Second Chance Approximator</div>
              </div>
            </div>

            {/* Side-by-side Scrolling table */}
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <div className="min-w-[850px] space-y-4">
                
                {/* 1. References String row */}
                <div className="flex gap-2 items-center border-b border-white/5 pb-3">
                  <div className="w-32 uppercase text-[9px] font-black text-slate-500 tracking-wider">
                    Reference Indices
                  </div>
                  <div className="flex-1 flex gap-1.5 font-mono">
                    {refArray.map((val, idx) => (
                      <div 
                        key={idx} 
                        className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-sm font-black flex items-center justify-center text-white"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. FIFO Row */}
                <div className="flex gap-2 items-center py-2.5">
                  <div className="w-32 flex flex-col">
                    <span className="text-xs font-bold text-slate-200">First-In First-Out</span>
                    <span className="text-[9px] text-indigo-400 font-mono">FIFO Trace</span>
                  </div>
                  <div className="flex-1 flex gap-1.5 font-mono text-center">
                    {fifoTrace.map((item, idx) => (
                      <div key={idx} className="w-10 flex flex-col gap-0.5">
                        <div className={`p-1 text-[10px] rounded border flex flex-col items-center justify-center h-12 select-none ${
                          item.status === 'F' ? 'bg-red-500/10 border-red-500/20 text-white' : 'bg-slate-900 border-slate-850 opacity-60 text-slate-400'
                        }`}>
                          <span className="font-extrabold text-xs">
                            {item.frames.filter(f => f !== null).join('') || '-'}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold mt-1 ${item.status === 'F' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.status === 'F' ? 'FAULT' : 'HIT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. LRU Row */}
                <div className="flex gap-2 items-center py-2.5 border-t border-white/5">
                  <div className="w-32 flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Least Recently Used</span>
                    <span className="text-[9px] text-amber-400 font-mono">LRU Trace</span>
                  </div>
                  <div className="flex-1 flex gap-1.5 font-mono text-center">
                    {lruTrace.map((item, idx) => (
                      <div key={idx} className="w-10 flex flex-col gap-0.5">
                        <div className={`p-1 text-[10px] rounded border flex flex-col items-center justify-center h-12 select-none ${
                          item.status === 'F' ? 'bg-amber-500/10 border-amber-500/20 text-white' : 'bg-slate-900 border-slate-850 opacity-60 text-slate-400'
                        }`}>
                          <span className="font-extrabold text-xs">
                            {item.frames.filter(f => f !== null).join('') || '-'}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold mt-1 ${item.status === 'F' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.status === 'F' ? 'FAULT' : 'HIT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. OPT Row */}
                <div className="flex gap-2 items-center py-2.5 border-t border-white/5">
                  <div className="w-32 flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Optimal Theoretical</span>
                    <span className="text-[9px] text-emerald-400 font-mono">OPT Trace</span>
                  </div>
                  <div className="flex-1 flex gap-1.5 font-mono text-center">
                    {optTrace.map((item, idx) => (
                      <div key={idx} className="w-10 flex flex-col gap-0.5">
                        <div className={`p-1 text-[10px] rounded border flex flex-col items-center justify-center h-12 select-none ${
                          item.status === 'F' ? 'bg-emerald-500/10 border-emerald-500/20 text-white' : 'bg-slate-900 border-slate-850 opacity-60 text-slate-400'
                        }`}>
                          <span className="font-extrabold text-xs">
                            {item.frames.filter(f => f !== null).join('') || '-'}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold mt-1 ${item.status === 'F' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.status === 'F' ? 'FAULT' : 'HIT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Clock Row */}
                <div className="flex gap-2 items-center py-2.5 border-t border-white/5">
                  <div className="w-32 flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Clock Second-Chance</span>
                    <span className="text-[9px] text-cyan-400 font-mono">Clock Trace</span>
                  </div>
                  <div className="flex-1 flex gap-1.5 font-mono text-center">
                    {clockTrace.map((item, idx) => (
                      <div key={idx} className="w-10 flex flex-col gap-0.5">
                        <div className={`p-1 text-[10px] rounded border flex flex-col items-center justify-center h-12 select-none ${
                          item.status === 'F' ? 'bg-cyan-500/10 border-cyan-500/20 text-white' : 'bg-slate-900 border-slate-850 opacity-60 text-slate-400'
                        }`}>
                          <span className="font-extrabold text-xs">
                            {item.frames.filter(f => f !== null).join('') || '-'}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold mt-1 ${item.status === 'F' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.status === 'F' ? 'FAULT' : 'HIT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
