export const pagingAlgosModule = {
    id: 'paging-algos',
    title: 'Page Replacement Algorithms',
    subtopics: [
        { id: 'algo-fifo', title: '1. FIFO (First In First Out)' },
        { id: 'algo-lru', title: '2. LRU (Least Recently Used)' },
        { id: 'algo-opt', title: '3. OPT (Optimal Replacement)' },
        { id: 'algo-clock', title: '4. Clock (Second Chance)' },
        { id: 'prep-setup', title: '5. Practical Test Preparations' }
    ],
    content: {
        'algo-fifo': {
            title: 'FIFO (First In First Out)',
            html: `
                <div class="space-y-8">
                    <!-- THEORY PANEL -->
                    <section class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
                        <h4 class="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest">Core Logic</h4>
                        <ul class="text-sm text-gray-300 space-y-2">
                            <li class="flex items-center gap-2"><span>➡️</span> <strong>Throws oldest page out</strong> regardless of how often it is used.</li>
                            <li class="flex items-center gap-2"><span>⚖️</span> <strong>Fair:</strong> Every page stays in memory for the same amount of time.</li>
                            <li class="flex items-center gap-2"><span>❌</span> <strong>Bad:</strong> Can throw out heavily used pages (e.g., a loop index).</li>
                        </ul>
                    </section>

                    <!-- CALCULATION DIAGRAM -->
<div class="glass p-6 rounded-3xl border border-white/10 bg-black/40 overflow-x-auto">
    <div class="flex items-center justify-between mb-6">
        <h5 class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Step-by-Step FIFO Trace (3 Frames)</h5>
        <div class="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
            <span class="text-[10px] font-black text-red-400 uppercase">Total Faults: 9</span>
        </div>
    </div>

    <div class="flex flex-col gap-4 min-w-[800px]">
        <!-- 1. Reference String Header -->
        <div class="flex gap-2 border-b border-white/5 pb-2">
            <div class="w-24 text-[9px] text-indigo-400 font-bold self-center uppercase tracking-tighter">Ref String</div>
            ${['7','0','1','2','0','3','0','4','2','3'].map(n => `
                <div class="w-10 h-10 flex items-center justify-center font-black text-white bg-white/5 rounded-lg border border-white/10">${n}</div>
            `).join('')}
        </div>

        <!-- 2. The Physical Memory State -->
        <div class="flex gap-2">
            <div class="w-24 text-[9px] text-gray-500 font-bold self-center uppercase tracking-tighter">Memory Frames</div>
            <div class="flex gap-2 font-mono text-[11px]">
                <!-- Step 1: 7 -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5 rounded shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    <span class="text-accent font-black">7</span><span class="opacity-20">-</span><span class="opacity-20">-</span>
                </div>
                <!-- Step 2: 0 -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5 rounded">
                    <span class="text-white">7</span><span class="text-accent font-black">0</span><span class="opacity-20">-</span>
                </div>
                <!-- Step 3: 1 -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5 rounded">
                    <span class="text-white">7</span><span class="text-white">0</span><span class="text-accent font-black">1</span>
                </div>
                <!-- Step 4: 2 (Replaces 7) -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-indigo-500/20 rounded">
                    <span class="text-red-400 font-black">2</span><span class="text-white">0</span><span class="text-white">1</span>
                </div>
                <!-- Step 5: 0 (HIT) -->
                <div class="w-10 flex flex-col border-2 border-emerald-500/30 p-1 bg-emerald-500/5 rounded opacity-60">
                    <span class="text-white">2</span><span class="text-emerald-400 font-black">0</span><span class="text-white">1</span>
                    <div class="absolute -bottom-4 left-0 w-full text-center text-[7px] text-emerald-400 font-black">HIT</div>
                </div>
                <!-- Step 6: 3 (Replaces 0) -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-indigo-500/20 rounded">
                    <span class="text-white">2</span><span class="text-red-400 font-black">3</span><span class="text-white">1</span>
                </div>
                <!-- Step 7: 0 (Replaces 1) -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-indigo-500/20 rounded">
                    <span class="text-white">2</span><span class="text-white">3</span><span class="text-red-400 font-black">0</span>
                </div>
                <!-- Step 8: 4 (Replaces 2) -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-indigo-500/20 rounded">
                    <span class="text-red-400 font-black">4</span><span class="text-white">3</span><span class="text-white">0</span>
                </div>
                <!-- Step 9: 2 (Replaces 3) -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-indigo-500/20 rounded">
                    <span class="text-white">4</span><span class="text-red-400 font-black">2</span><span class="text-white">0</span>
                </div>
                <!-- Step 10: 3 (Replaces 0) -->
                <div class="w-10 flex flex-col border-2 border-red-500/50 p-1 bg-indigo-500/20 rounded">
                    <span class="text-white">4</span><span class="text-white">2</span><span class="text-red-400 font-black">3</span>
                </div>
            </div>
        </div>

        <!-- 3. Fault Result Legend -->
        <div class="flex gap-2 mt-2">
            <div class="w-24 text-[9px] text-gray-500 font-bold self-center uppercase tracking-tighter">Status</div>
            <div class="flex gap-2 font-mono text-[9px] font-black">
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-emerald-400">H</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
                <span class="w-10 text-center text-red-500">F</span>
            </div>
        </div>
    </div>
</div>
                    <!-- JAVA IMPLEMENTATION -->
                    <div class="space-y-4">
                        <h4 class="text-sm font-black text-emerald-400 uppercase">Java Implementation</h4>
                        <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                            <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span class="text-[10px] font-mono text-gray-400 uppercase">FIFO.java</span>
                                <button class="copy-btn text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/30 transition-all">Copy Code</button>
                            </div>
                            <pre class="p-4 text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto code-content">
 public static int firstInFirstOut(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        /**
         * Your code here.
         * 
         * Using the frames memory object, process the pageReferences using the FIFO paging algorithm, returning the number of page faults.
         */
         int frame = 0;
         
         for (int ref : pageReferences)
         {
            
            if (!(frames.contains(ref)))
            {
              if (frames.isEmpty(frame)){
               frames.put(frame,ref);}
               else {
               int currentPage = frames.get(frame); 
               frames.replace(currentPage,ref);
               }
               pageFaults++;
               frame = (frame +1) % frames.size();
               System.out.println(ref + ": " + frames);
            }
            else { System.out.println(ref + ": " + "-");}
            
         }
         
        return pageFaults;
    }
</pre>
                        </div>
                    </div>
                </div>
            `
        },
        'algo-lru': {
    title: 'Least Recently Used (LRU)',
    html: `
        <div class="space-y-8">
            <!-- 1. CORE THEORY (Slide 2) -->
            <section class="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl">
                <h4 class="text-amber-400 font-black text-xs uppercase mb-4 tracking-widest underline decoration-amber-500/30 underline-offset-8">The "Past Knowledge" Strategy</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                    <ul class="space-y-2">
                        <li class="flex items-start gap-2"><span>🧠</span> <span>Uses <strong>past knowledge</strong> rather than future prediction.</span></li>
                        <li class="flex items-start gap-2"><span>⏳</span> <span>Replaces the page that has not been used for the <strong>longest time</strong>.</span></li>
                    </ul>
                    <div class="p-3 bg-black/40 rounded-xl border border-white/5 italic text-[11px] text-gray-400">
                        "Used as a benchmark for measuring how well other page replacement algorithms work."
                    </div>
                </div>
            </section>

            <!-- 2. VISUAL CALCULATION TRACE (Slide 2 Replica) -->
            <div class="glass p-6 rounded-3xl border border-white/10 bg-black/40 overflow-x-auto">
                <div class="flex items-center justify-between mb-8">
                    <h5 class="text-[10px] font-black text-gray-500 uppercase tracking-widest">LRU Execution Trace (3 Frames)</h5>
                    <div class="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                        <span class="text-[10px] font-black text-red-400 uppercase">Total Faults: 8</span>
                    </div>
                </div>

                <div class="flex flex-col gap-6 min-w-[850px]">
                    <!-- Reference String -->
                    <div class="flex gap-2">
                        <div class="w-28 text-[9px] text-amber-400 font-black self-center uppercase">Reference</div>
                        ${['7','0','1','2','0','3','0','4','2','3'].map(n => `
                            <div class="w-12 h-12 flex items-center justify-center font-black text-white bg-white/5 rounded-lg border border-white/10">${n}</div>
                        `).join('')}
                    </div>

                    <!-- History Stack Logic -->
                    <div class="flex gap-2">
                        <div class="w-28 flex flex-col justify-center">
                            <span class="text-[9px] text-indigo-400 font-black uppercase">History List</span>
                            <span class="text-[7px] text-gray-500 italic">(Top = MRU)</span>
                        </div>
                        <div class="flex gap-2 font-mono text-[10px]">
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">7</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">0</span><span class="p-0.5 text-center opacity-40">7</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">1</span><span class="p-0.5 text-center opacity-40">0</span><span class="p-0.5 text-center opacity-40">7</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">2</span><span class="p-0.5 text-center opacity-40">1</span><span class="p-0.5 text-center opacity-40 text-red-400 font-bold">0</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-emerald-500/20 p-1 bg-emerald-500/5"> <span class="bg-emerald-500/40 p-0.5 text-center text-white">0</span><span class="p-0.5 text-center opacity-40">2</span><span class="p-0.5 text-center opacity-40">1</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">3</span><span class="p-0.5 text-center opacity-40">0</span><span class="p-0.5 text-center opacity-40 text-red-400 font-bold">2</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-emerald-500/20 p-1 bg-emerald-500/5"> <span class="bg-emerald-500/40 p-0.5 text-center text-white">0</span><span class="p-0.5 text-center opacity-40">3</span><span class="p-0.5 text-center opacity-40">2</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">4</span><span class="p-0.5 text-center opacity-40">0</span><span class="p-0.5 text-center opacity-40 text-red-400 font-bold">3</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">2</span><span class="p-0.5 text-center opacity-40">4</span><span class="p-0.5 text-center opacity-40 text-red-400 font-bold">0</span> </div>
                            <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> <span class="bg-indigo-500/20 p-0.5 text-center">3</span><span class="p-0.5 text-center opacity-40">2</span><span class="p-0.5 text-center opacity-40 text-red-400 font-bold">4</span> </div>
                        </div>
                    </div>

                    <!-- Memory Frames -->
                    <div class="flex gap-2 border-t border-white/10 pt-4">
                        <div class="w-28 text-[9px] text-gray-500 font-black self-center uppercase">Physical RAM</div>
                        <div class="flex gap-2 font-mono text-[11px]">
                            <div class="w-12 flex flex-col border border-white/20 p-1"><span>7</span><span class="opacity-20">-</span><span class="opacity-20">-</span></div>
                            <div class="w-12 flex flex-col border border-white/20 p-1"><span>7</span><span>0</span><span class="opacity-20">-</span></div>
                            <div class="w-12 flex flex-col border border-white/20 p-1"><span>7</span><span>0</span><span>1</span></div>
                            <div class="w-12 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5"><span>2</span><span>0</span><span>1</span></div>
                            <div class="w-12 flex flex-col border border-emerald-500/40 p-1 bg-emerald-500/10"><span>2</span><span class="text-emerald-400 font-black">0</span><span>1</span></div>
                            <div class="w-12 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5"><span>2</span><span>0</span><span>3</span></div>
                            <div class="w-12 flex flex-col border border-emerald-500/40 p-1 bg-emerald-500/10"><span>2</span><span class="text-emerald-400 font-black">0</span><span>3</span></div>
                            <div class="w-12 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5"><span>4</span><span>0</span><span>3</span></div>
                            <div class="w-12 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5"><span>4</span><span>0</span><span>2</span></div>
                            <div class="w-12 flex flex-col border-2 border-red-500/50 p-1 bg-red-500/5"><span>4</span><span>3</span><span>2</span></div>
                        </div>
                    </div>

                    <!-- Fault/Hit Indicators -->
                    <div class="flex gap-2">
                        <div class="w-28 text-[9px] text-gray-600 font-bold self-center uppercase">Outcome</div>
                        <div class="flex gap-2 font-black text-[10px]">
                            ${['F','F','F','F','H','F','H','F','F','F'].map(x => `
                                <div class="w-12 text-center ${x==='H'?'text-emerald-400':'text-red-500'}">${x==='H'?'HIT':'FAULT'}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. PSEUDOCODE (Slide 2 Mirror) -->
            <div class="bg-slate-900/80 rounded-2xl border border-white/10 p-6">
                <h4 class="text-xs font-black text-gray-400 uppercase mb-4 tracking-tighter">Algorithm Logic (Pseudocode)</h4>
                <pre class="text-[10px] text-indigo-300 leading-relaxed font-mono">
FOR each page IN pageReferences:
    IF page is in frames:
        Remove page from recentHistory // Update usage
        Add page to end of recentHistory (MRU)
    ELSE:
        pageFaults++
        IF empty frame exists:
            Place page in empty frame
            Add page to recentHistory
        ELSE:
            lruPage = recentHistory[0] // Oldest
            Replace lruPage in frames with new page
            Remove lruPage from history
            Add new page to end of history
                </pre>
            </div>

            <!-- 4. JAVA IMPLEMENTATION -->
            <div class="space-y-4">
                <h4 class="text-sm font-black text-emerald-400 uppercase">Java Implementation</h4>
                <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                    <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                        <span class="text-[10px] font-mono text-gray-400 uppercase">LRU_Manager.java</span>
                        <button class="copy-btn text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/30">Copy Code</button>
                    </div>
                    <pre class="p-4 text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto code-content">
import java.util.ArrayList;
import java.util.*;

public class LRU_Algorithm {
     // Least Recently Used (LRU) Page Replacement
    public static int leastRecentlyUsed(final Memory frames, final Integer[] pageReferences) {
        System.out.println("Least Recently Used (LRU)");
        int pageFaults = 0;
        List<Integer> recentHistory = new ArrayList<>(); // Tracks usage order

        for (int page : pageReferences) {
            if (frames.contains(page)) {
                // Move page to the end (most recently used)
                recentHistory.remove((Integer) page);
                recentHistory.add(page);
                System.out.println(page + ": " + "-");
                continue;
            }

            pageFaults++;

            boolean placed = false;
            for (int f = 0; f < frames.size(); f++) {
                if (frames.isEmpty(f)) {
                    frames.put(f, page);
                    recentHistory.add(page);
                    placed = true;
                    System.out.println(page + ": " + frames);
                    break;
                }
            }
            if (placed) continue;

            // Replace least recently used page
            int lruPage = recentHistory.get(0);
            int lruIndex = frames.indexOf(lruPage);
            frames.put(lruIndex, page);

            recentHistory.remove(0);
            recentHistory.add(page);
            System.out.println(page + ": " + frames);
        }

        return pageFaults;
    }


      public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size (number of frames):");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references:");
        final String referenceString = stdIn.nextLine();

        System.out.printf("Page faults: %d.\n", leastRecentlyUsed(new Memory(numFrames), toArray(referenceString)));
    }

    private static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }


}</pre>
                </div>
            </div>
        </div>
    `
},

'algo-opt':  {
            title: 'The "Future" Logic',
            html: `
                <div class="space-y-6">
                    <section class="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
                        <h4 class="text-emerald-400 font-black text-xs uppercase mb-4 tracking-widest underline decoration-emerald-500/30 underline-offset-8">Perfect Knowledge</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                            <ul class="space-y-2">
                                <li class="flex items-start gap-2"><span>🔮</span> <span>Replaces the page that <strong>won't be used for the longest time</strong> in the future.</span></li>
                                <li class="flex items-start gap-2"><span>📈</span> <span>Provides the <strong>lowest possible page-fault rate</strong> for any reference string.</span></li>
                            </ul>
                            <div class="p-3 bg-black/40 rounded-xl border border-white/5 italic text-[11px] text-gray-400">
                                "We cannot know what N pages will be next in a real system — but we can use this to generate test cases."
                            </div>
                        </div>
                    </section>

                    <div class="warn-box border-amber-500/50 text-amber-300">
                        <strong>The $\\infty$ (Infinity) Rule:</strong> If a page currently in memory will never be referenced again, its "next use" index is $\\infty$. If multiple pages have $\\infty$, we replace the one that was loaded first (FIFO tie-break).
                    </div>
                </div>
            
                    <!-- UPDATED OPT CALCULATION DIAGRAM -->
<div class="glass p-6 rounded-3xl border border-white/10 bg-black/40 overflow-x-auto">
    <div class="flex items-center justify-between mb-8">
        <h5 class="text-[10px] font-black text-gray-500 uppercase tracking-widest">OPT Distance Stack (3 Frames)</h5>
        <div class="flex gap-4">
            <span class="text-[9px] text-gray-500 italic">Target: Largest Index / $\infty$</span>
            <div class="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full">
                <span class="text-[10px] font-black text-emerald-400 uppercase">Total Faults: 6</span>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-6 min-w-[850px]">
        <!-- 1. Reference String -->
        <div class="flex gap-2 border-b border-white/5 pb-2">
            <div class="w-28 text-[9px] text-emerald-400 font-black self-center uppercase">Ref String</div>
            ${['7','0','1','2','0','3','0','4','2','3'].map((n, i) => `
                <div class="w-12 h-10 flex flex-col items-center justify-center bg-white/5 rounded border border-white/10">
                    <span class="text-xs font-black text-white">${n}</span>
                    <span class="text-[7px] text-gray-600">idx:${i}</span>
                </div>
            `).join('')}
        </div>

        <!-- 2. Future Distance Logic Stack -->
        <div class="flex gap-2">
            <div class="w-28 flex flex-col justify-center">
                <span class="text-[9px] text-indigo-400 font-black uppercase leading-tight">Next Use Stack</span>
                <span class="text-[7px] text-gray-500 italic">(Top = Farthest)</span>
            </div>
            <div class="flex gap-2 font-mono text-[10px]">
                <!-- T1: 7 -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> 
                    <div class="bg-red-500/20 p-1 text-center rounded border border-red-500/30">7 <span class="block text-[7px] opacity-60">Next: $\infty$</span></div> 
                </div>
                <!-- T2: 0 -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> 
                    <div class="bg-red-500/20 p-1 text-center rounded border border-red-500/30">7 <span class="block text-[7px] opacity-60">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">0 <span class="block text-[7px]">Next: 4</span></div>
                </div>
                <!-- T3: 1 -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1"> 
                    <div class="bg-red-500/20 p-1 text-center rounded border border-red-500/30">7 <span class="block text-[7px] opacity-60">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">1 <span class="block text-[7px]">Next: $\infty$</span></div>
                    <div class="p-1 text-center opacity-40">0 <span class="block text-[7px]">Next: 4</span></div>
                </div>
                <!-- T4: 2 (Evict 7) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1 bg-red-500/5"> 
                    <div class="bg-red-500/20 p-1 text-center rounded border border-red-500/30">1 <span class="block text-[7px] opacity-60">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">2 <span class="block text-[7px]">Next: 8</span></div>
                    <div class="p-1 text-center opacity-40">0 <span class="block text-[7px]">Next: 4</span></div>
                </div>
                <!-- T5: 0 (Hit) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-emerald-500/20 p-1 bg-emerald-500/5"> 
                    <div class="p-1 text-center opacity-40">1 <span class="block text-[7px]">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">2 <span class="block text-[7px]">Next: 8</span></div>
                    <div class="bg-emerald-500/20 p-1 text-center rounded">0 <span class="block text-[7px] font-bold">Next: 6</span></div>
                </div>
                <!-- T6: 3 (Evict 1) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1 bg-red-500/5"> 
                    <div class="bg-red-500/20 p-1 text-center rounded border border-red-500/30">3 <span class="block text-[7px] opacity-60">Next: 9</span></div> 
                    <div class="p-1 text-center opacity-40">2 <span class="block text-[7px]">Next: 8</span></div>
                    <div class="p-1 text-center opacity-40">0 <span class="block text-[7px]">Next: 6 (Hit)</span></div>
                </div>
                <!-- T7: 0 (Hit) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-emerald-500/20 p-1 bg-emerald-500/5"> 
                    <div class="p-1 text-center opacity-40">0 <span class="block text-[7px]">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">3 <span class="block text-[7px]">Next: 9</span></div>
                    <div class="bg-emerald-500/20 p-1 text-center rounded">2 <span class="block text-[7px] font-bold">Next: 8</span></div>
                </div>
                <!-- T8: 4 (Evict 0) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-white/10 p-1 bg-red-500/5"> 
                    <div class="bg-red-500/20 p-1 text-center rounded border border-red-500/30">4 <span class="block text-[7px] opacity-60">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">3 <span class="block text-[7px]">Next: 9</span></div>
                    <div class="p-1 text-center opacity-40">2 <span class="block text-[7px]">Next: 8</span></div>
                </div>
                <!-- T9: 2 (Hit) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-emerald-500/20 p-1 bg-emerald-500/5"> 
                    <div class="p-1 text-center opacity-40">4 <span class="block text-[7px]">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">3 <span class="block text-[7px]">Next: 9</span></div>
                    <div class="bg-emerald-500/20 p-1 text-center rounded">2 <span class="block text-[7px] font-bold">Next: $\infty$</span></div>
                </div>
                <!-- T10: 3 (Hit) -->
                <div class="w-12 flex flex-col gap-0.5 border-x border-emerald-500/20 p-1 bg-emerald-500/5"> 
                    <div class="p-1 text-center opacity-40">4 <span class="block text-[7px]">Next: $\infty$</span></div> 
                    <div class="p-1 text-center opacity-40">2 <span class="block text-[7px]">Next: $\infty$</span></div>
                    <div class="bg-emerald-500/20 p-1 text-center rounded">3 <span class="block text-[7px] font-bold">Next: $\infty$</span></div>
                </div>
            </div>
        </div>

        <!-- 3. Physical RAM Output -->
        <div class="flex gap-2 border-t border-white/10 pt-4">
            <div class="w-28 text-[9px] text-gray-500 font-black self-center uppercase">Memory Frames</div>
            <div class="flex gap-2 font-mono text-[11px] text-white">
                <div class="w-12 text-center p-1 border border-white/10">7<br>-<br>-</div>
                <div class="w-12 text-center p-1 border border-white/10">7<br>0<br>-</div>
                <div class="w-12 text-center p-1 border border-white/10">7<br>0<br>1</div>
                <div class="w-12 text-center p-1 border border-red-500/50 bg-red-500/5">2<br>0<br>1</div>
                <div class="w-12 text-center p-1 border border-white/10 opacity-50">2<br>0<br>1</div>
                <div class="w-12 text-center p-1 border border-red-500/50 bg-red-500/5">2<br>0<br>3</div>
                <div class="w-12 text-center p-1 border border-white/10 opacity-50">2<br>0<br>3</div>
                <div class="w-12 text-center p-1 border border-red-500/50 bg-red-500/5">2<br>4<br>3</div>
                <div class="w-12 text-center p-1 border border-white/10 opacity-50">2<br>4<br>3</div>
                <div class="w-12 text-center p-1 border border-white/10 opacity-50">2<br>4<br>3</div>
            </div>
        </div>
    </div>
</div>
                            <!-- Lookahead Logic (Math Explanation) -->
                            <div class="flex gap-2 mt-4 bg-white/5 p-4 rounded-xl">
                                <div class="w-28 flex flex-col">
                                    <span class="text-[9px] text-amber-400 font-black uppercase tracking-tighter">Lookahead Logic</span>
                                    <span class="text-[7px] text-gray-500 italic">Finding farthest index</span>
                                </div>
                                <div class="flex-1 grid grid-cols-2 gap-4 text-[10px] text-gray-400">
                                    <div class="border-l border-white/10 pl-3">
                                        <span class="text-white font-bold block mb-1">Replace 1 (at Step 4):</span>
                                        Frames contain {7, 0, 1}. Next 7 is at $\\infty$, next 0 at Step 5, next 1 at $\\infty$. 
                                        Replace oldest $\\infty$ (7) with 2.
                                    </div>
                                    <div class="border-l border-white/10 pl-3">
                                        <span class="text-white font-bold block mb-1">Replace 3 (at Step 8):</span>
                                        Frames contain {2, 0, 3}. Next 2 at Step 9, next 0 is $\\infty$, next 3 at Step 10.
                                        Replace $\\infty$ (0) with 4.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     <!-- PSEUDOCODE (Slide 3 Transcription) -->
                    <div class="bg-slate-900/80 rounded-2xl border border-white/10 p-6">
                        <h4 class="text-xs font-black text-gray-400 uppercase mb-4">Algorithm Logic (Pseudocode)</h4>
                        <pre class="text-[10px] text-emerald-300 leading-relaxed font-mono">
FOR each ref IN references:
    IF ref is already in frames: CONTINUE
    
    pageFaults++
    IF frames not full:
        Add ref to empty frame
    ELSE:
        frameToReplace = -1, farthestUse = -1
        FOR each f IN frames:
            nextUse = FIND first occurrence of frames[f] in FUTURE refs
            IF nextUse > farthestUse:
                farthestUse = nextUse
                frameToReplace = f
        
        frames[frameToReplace] = ref
                        </pre>
                    </div>

                    <!-- JAVA CODE -->
                    <div class="space-y-4">
                        <h4 class="text-sm font-black text-emerald-400 uppercase">Production Implementation</h4>
                        <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                            <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span class="text-[10px] font-mono text-gray-400 uppercase">OptimalReplacement.java</span>
                                <button class="copy-btn text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Copy Code</button>
                            </div>
                            <pre class="p-4 text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto code-content">
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class OPT_Algorithm {

    
    public static int optimal(final Memory frames, final Integer[] pageReferences) {
            int pageFaults = 0;

    for (int i = 0; i < pageReferences.length; i++) {
        int page = pageReferences[i];

        if (frames.contains(page)) 
        {
        System.out.println(page + ": " +"-" );
        continue;
         
        }

        pageFaults++;
        //increase
        //if empty
        //if replace


        boolean added = false;
        for (int f = 0; f < frames.size(); f++) {
            if (frames.isEmpty(f)) { // check if frames are empty
                frames.put(f, page);
                added = true;
                System.out.println(page + ": " +frames);
                break;
            }
        }
        if (added) continue;

 
        int frameToReplace = -1;
        int furthest = -1;

        for (int f = 0; f < frames.size(); f++) {
            int currentPage = frames.get(f);
            int nextUse = Integer.MAX_VALUE;
            for (int j = i + 1; j < pageReferences.length; j++) {
                if (pageReferences[j] == currentPage) {
                    nextUse = j;
                    break;
                }
            }
            if (nextUse > furthest) {  //finds the largest value in future
                furthest = nextUse;
                frameToReplace = f;
            }
        }

        frames.put(frameToReplace, page);
        System.out.println(page + ": " +frames);
    }
        return pageFaults;
    }


    public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size (number of frames):");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references:");
        final String referenceString = stdIn.nextLine();

        System.out.printf("Page faults: %d.\n", optimal(new Memory(numFrames), toArray(referenceString)));
    }

    private static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }
}</pre>
                        </div>
                    </div>
                </div>
            `
        
        
},
      'algo-clock': {
    title: 'Clock (Second Chance) Algorithm',
    html: `
        <div class="space-y-10">
            <!-- 1. CORE THEORY (Slide 4) -->
            <section class="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                <h4 class="text-cyan-400 font-black text-xs uppercase mb-4 tracking-widest underline decoration-cyan-500/30 underline-offset-8">Approximate LRU Logic</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300">
                    <div class="space-y-3">
                        <p><strong class="text-white">The Reference Bit:</strong></p>
                        <ul class="text-[11px] space-y-2 list-disc pl-4 opacity-80">
                            <li><strong>Page Hit:</strong> If the page is already in memory, set its Ref Bit to <span class="text-emerald-400 font-bold">1</span>.</li>
                            <li><strong>Page Fault:</strong> If the bit at the clock hand is <span class="text-amber-400 font-bold">1</span>, set it to <span class="text-red-400 font-bold">0</span> and advance the hand (Second Chance).</li>
                            <li><strong>Replacement:</strong> If the bit is <span class="text-red-400 font-bold">0</span>, replace that page.</li>
                        </ul>
                    </div>
                    <div class="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center text-center">
                         <span class="text-[10px] font-bold text-cyan-400 uppercase mb-2 italic">Handwritten Rule:</span>
                         <p class="text-[11px] text-gray-400 leading-relaxed">
                            "Advance clock hand whenever there is a page fault. If bit was 1, it becomes 0 and we keep looking."
                         </p>
                    </div>
                </div>
            </section>

            <!-- 2. VISUAL EXECUTION TRACE (Step-by-Step from notes) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/50 overflow-x-auto">
                <h5 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10 text-center">Clock Algorithm Step-by-Step (3 Frames)</h5>
                
                <div class="flex flex-col gap-12 min-w-[900px]">
                    <!-- Reference String -->
                    <div class="flex gap-2 border-b border-white/5 pb-4">
                        <div class="w-32 text-[9px] text-cyan-400 font-black self-center uppercase">Ref String</div>
                        ${['0','4','1','4','2','4','3','4'].map((n, i) => `
                            <div class="w-14 h-14 flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/10 relative">
                                <span class="text-lg font-black text-white">${n}</span>
                                <span class="text-[8px] text-gray-600">t=${i}</span>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Visual Clock Trace -->
                    <div class="flex gap-2">
                        <div class="w-32 flex flex-col justify-center">
                            <span class="text-[9px] text-indigo-400 font-black uppercase">Clock State</span>
                            <span class="text-[7px] text-gray-500 italic">Frame [Ref Bit]</span>
                        </div>
                        <div class="flex gap-2 font-mono text-[11px]">
                            <!-- t=0: 0 -->
                            <div class="w-14 flex flex-col gap-1 border-x border-red-500/20 p-1 bg-red-500/5">
                                <div class="bg-cyan-500/20 p-1 rounded text-center text-cyan-300">0 [1] ☚</div>
                                <div class="p-1 rounded text-center opacity-20">- [0]</div>
                                <div class="p-1 rounded text-center opacity-20">- [0]</div>
                            </div>
                            <!-- t=1: 4 -->
                            <div class="w-14 flex flex-col gap-1 border-x border-red-500/20 p-1 bg-red-500/5">
                                <div class="p-1 rounded text-center">0 [1]</div>
                                <div class="bg-cyan-500/20 p-1 rounded text-center text-cyan-300">4 [1] ☚</div>
                                <div class="p-1 rounded text-center opacity-20">- [0]</div>
                            </div>
                            <!-- t=2: 1 -->
                            <div class="w-14 flex flex-col gap-1 border-x border-red-500/20 p-1 bg-red-500/5">
                                <div class="p-1 rounded text-center">0 [1]</div>
                                <div class="p-1 rounded text-center">4 [1]</div>
                                <div class="bg-cyan-500/20 p-1 rounded text-center text-cyan-300">1 [1] ☚</div>
                            </div>
                            <!-- t=3: 4 (HIT) -->
                            <div class="w-14 flex flex-col gap-1 border-x border-emerald-500/20 p-1 bg-emerald-500/5">
                                <div class="p-1 rounded text-center">0 [1]</div>
                                <div class="bg-emerald-500/40 p-1 rounded text-center text-white">4 [1]</div>
                                <div class="p-1 rounded text-center">1 [1] ☚</div>
                            </div>
                            <!-- t=4: 2 (FAULT - Full Rotation) -->
                            <div class="w-14 flex flex-col gap-1 border-x border-red-500/20 p-1 bg-red-500/5">
                                <div class="bg-red-500/40 p-1 rounded text-center text-white">2 [1]</div>
                                <div class="p-1 rounded text-center opacity-50">4 [0]</div>
                                <div class="p-1 rounded text-center opacity-50">1 [0] ☚</div>
                                <div class="absolute -bottom-6 left-0 w-full text-[6px] text-amber-500 text-center uppercase">Bits flipped</div>
                            </div>
                            <!-- t=5: 4 (HIT) -->
                            <div class="w-14 flex flex-col gap-1 border-x border-emerald-500/20 p-1 bg-emerald-500/5">
                                <div class="p-1 rounded text-center">2 [1]</div>
                                <div class="bg-emerald-500/40 p-1 rounded text-center text-white">4 [1]</div>
                                <div class="p-1 rounded text-center">1 [0] ☚</div>
                            </div>
                            <!-- t=6: 3 (FAULT) -->
                            <div class="w-14 flex flex-col gap-1 border-x border-red-500/20 p-1 bg-red-500/5">
                                <div class="p-1 rounded text-center opacity-50">2 [1]</div>
                                <div class="p-1 rounded text-center opacity-50">4 [1]</div>
                                <div class="bg-red-500/40 p-1 rounded text-center text-white">3 [1]</div>
                            </div>
                            <!-- t=7: 4 (HIT) -->
                            <div class="w-14 flex flex-col gap-1 border-x border-emerald-500/20 p-1 bg-emerald-500/5">
                                <div class="p-1 rounded text-center">2 [1]</div>
                                <div class="bg-emerald-500/40 p-1 rounded text-center text-white">4 [1]</div>
                                <div class="p-1 rounded text-center">3 [1]</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Outcome row -->
                    <div class="flex gap-2">
                        <div class="w-32 text-[9px] text-gray-500 font-black self-center uppercase">Result</div>
                        <div class="flex gap-2 text-[9px] font-black">
                            <span class="w-14 text-center text-red-500">FAULT</span>
                            <span class="w-14 text-center text-red-500">FAULT</span>
                            <span class="w-14 text-center text-red-500">FAULT</span>
                            <span class="w-14 text-center text-emerald-400">HIT</span>
                            <span class="w-14 text-center text-red-500">FAULT</span>
                            <span class="w-14 text-center text-emerald-400">HIT</span>
                            <span class="w-14 text-center text-red-500">FAULT</span>
                            <span class="w-14 text-center text-emerald-400">HIT</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. DETAILED LOGIC NOTES (From Slide 4 Annotations) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h5 class="text-indigo-300 font-bold text-xs uppercase mb-3">Replacement Procedure</h5>
                    <p class="text-[11px] text-gray-400 leading-relaxed">
                        When a fault occurs at <strong>t=4 (element 2)</strong>, all reference bits are currently 1. 
                        <br><br>
                        1. Hand looks at 0: Bit=1 $\rightarrow$ Set to 0, move hand.<br>
                        2. Hand looks at 4: Bit=1 $\rightarrow$ Set to 0, move hand.<br>
                        3. Hand looks at 1: Bit=1 $\rightarrow$ Set to 0, move hand.<br>
                        4. Hand returns to top: Bit=0 $\rightarrow$ <strong>REPLACE with 2</strong>.
                    </p>
                </div>
                <div class="space-y-4">
                    <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                         <span class="text-[10px] font-black text-emerald-400 uppercase">Total Faults for String: 5</span>
                    </div>
                    <div class="warn-box">
                        <strong>The Bit Flip:</strong> As you replace a value, the new page's reference bit is automatically set to <strong>1</strong>.
                    </div>
                </div>
            </div>

            <!-- 4. JAVA CODE -->
            <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                    <span class="text-[10px] font-mono text-gray-400 uppercase">ClockAlgorithm.java</span>
                    <button class="copy-btn text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Copy Code</button>
                </div>
                <pre class="p-4 text-[11px] font-mono text-gray-300 code-content overflow-x-auto">
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class ClockSecondChance_Algorithm {
// Clock Second-Chance Algorithm
    public static int clockSecondChance(final Memory frames, final Integer[] pageReferences) {
      //  System.out.println("Clock Second Chance");
        int pageFaults = 0;
        int clockHand = 0; // Pointer for clock rotation
        Integer[] ref = new Integer[frames.size()]; // Reference bits

        for (int i = 0; i < frames.size(); i++) ref[i] = 0;

        for (int page : pageReferences) {
            if (frames.contains(page)) {
                ref[frames.indexOf(page)] = 1;
                System.out.println(page + ": -");
                continue;
            }

            pageFaults++;

            while (true) {
                if (frames.isEmpty(clockHand)) {
                    frames.put(clockHand, page);
                    ref[frames.indexOf(page)] = 1;
                    clockHand = (clockHand + 1) % frames.size();
                    break;
                } else if (ref[clockHand] == 0) {
                    ref[clockHand] = 1;
                    frames.put(clockHand, page);
                    clockHand = (clockHand + 1) % frames.size();
                    break;
                } else {
                    ref[clockHand] = 0;
                    clockHand = (clockHand + 1) % frames.size();
                }
            }
            
            System.out.println(page + ": " + frames);
        }

        return pageFaults;
    }
    
     // Helper: Converts Integer array to string for display
    public static String print(Integer[] arr) {
        return Arrays.toString(arr);
    }

    public static void main(final String[] args) {
        final Scanner stdIn = new Scanner(System.in);

        System.out.println("Enter the physical memory size (number of frames):");
        final int numFrames = stdIn.nextInt();
        stdIn.nextLine();

        System.out.println("Enter the string of page references:");
        final String referenceString = stdIn.nextLine();

        System.out.printf("Page faults: %d.\n", clockSecondChance( new Memory(numFrames), toArray(referenceString)));
    }

    public static Integer[] toArray(final String referenceString) {
        final Integer[] result = new Integer[referenceString.length()];
        
        for(int i=0; i < referenceString.length(); i++) {
            result[i] = Character.digit(referenceString.charAt(i), 10);
        }
        return result;
    }

}</pre>
            </div>
        </div>
    `
},


        'prep-setup': {
            title: 'Setup & Instructions',
            html: `
                <div class="space-y-6">
                    <!-- STEP 1: DOWNLOAD -->
                    <div class="glass p-6 rounded-2xl border border-white/10 bg-indigo-500/5">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-xl">📂</div>
                            <div class="flex-1">
                                <h4 class="text-white font-bold mb-1">Step 1: Download Support Files</h4>
                                <p class="text-xs text-gray-400 mb-4">You need the base Memory class to handle the physical frame simulations.</p>
                                <a href="Memory.java" download class="btn btn-primary text-xs inline-flex items-center gap-2">
                                    <span>Download Memory.java</span>
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- STEP 2: AUTOMARKER -->
                    <div class="glass p-6 rounded-2xl border border-white/10 bg-emerald-500/5">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl">✅</div>
                            <div class="flex-1">
                                <h4 class="text-white font-bold mb-1">Step 2: Code & Test</h4>
                                <p class="text-xs text-gray-400 mb-4">Once you have implemented your logic in the templates provided, upload them to the judge for verification.</p>
                                <a href="https://automark-code-judge.vercel.app/" target="_blank" class="btn btn-ghost text-xs text-emerald-400 border-emerald-500/30 inline-flex items-center gap-2">
                                    <span>Open Automarker</span>
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                
                    <!-- FIFO -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-indigo-500">FIFO Implementation</h4>
                        <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                            <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span class="text-[10px] font-mono text-gray-500">FIFO_Algorithm.java</span>
                                <button class="copy-btn btn-ghost text-[10px] py-1 px-3">Copy Template</button>
                            </div>
                            <pre class="p-4 text-[11px] font-mono text-indigo-300 overflow-x-auto code-content">
public class FIFO_Algorithm {
    public static int firstInFirstOut(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        
        return pageFaults;
    }
}</pre>
                        </div>
                    </div>

                    <!-- LRU -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-amber-500">LRU Implementation</h4>
                        <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                            <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span class="text-[10px] font-mono text-gray-500">LRU_Algorithm.java</span>
                                <button class="copy-btn btn-ghost text-[10px] py-1 px-3">Copy Template</button>
                            </div>
                            <pre class="p-4 text-[11px] font-mono text-amber-200 overflow-x-auto code-content">
import java.util.LinkedList;

public class LRU_Algorithm {
    public static int leastRecentlyUsed(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        
        return pageFaults;
    }
}</pre>
                        </div>
                    </div>

                    <!-- CLOCK -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-cyan-500">Clock Second-Chance Implementation</h4>
                        <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                            <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span class="text-[10px] font-mono text-gray-500">ClockSecondChance_Algorithm.java</span>
                                <button class="copy-btn btn-ghost text-[10px] py-1 px-3">Copy Template</button>
                            </div>
                            <pre class="p-4 text-[11px] font-mono text-cyan-200 overflow-x-auto code-content">
public class ClockSecondChance_Algorithm {
    public static int clockSecondChance(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;
        
        return pageFaults;
    }
}</pre>
                        </div>
                    </div>

                    <!-- OPT -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-white uppercase tracking-widest pl-2 border-l-2 border-emerald-500">Optimal Implementation</h4>
                        <div class="code-container glass border border-white/10 rounded-xl overflow-hidden">
                            <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span class="text-[10px] font-mono text-gray-500">OPT_Algorithm.java</span>
                                <button class="copy-btn btn-ghost text-[10px] py-1 px-3">Copy Template</button>
                            </div>
                            <pre class="p-4 text-[11px] font-mono text-emerald-200 overflow-x-auto code-content">
public class OPT_Algorithm {
    public static int optimal(final Memory frames, final Integer[] pageReferences) {
        int pageFaults = 0;

       
        return pageFaults;
    }

    
}</pre>
                        </div>
                    </div>
                </div>
            `
        }

    }
};