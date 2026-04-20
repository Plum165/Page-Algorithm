// vm2.js
export const vm2Module = {
    id: 'vm2',
    title: 'Virtual Memory II: Translation & Paging',
    subtopics: [
        { id: 'vm-intro', title: '1. Address Translation Overview' },
        { id: 'vm-base-bounds', title: '2. Base and Bounds Translation' },   
        { id: 'vm-fragmentation', title: '3. Memory Fragmentation' },
        { id: 'vm-paging-concept', title: '4. Paging Concept' },
        { id: 'vm-page-tables', title: '5. Page Tables (Per Process)' },
        { id: 'vm-pte', title: '6. Page Table Entries (PTE)' },
       
    ],
    content: {
        'vm-intro': {
    title: 'Virtual to Physical Translation',
    html: `
        <div class="space-y-8">
            <!-- THE ADDRESS TRANSLATION DIAGRAM -->
            <div class="glass p-6 rounded-2xl border border-white/10 bg-black/20">
                <div class="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
                    
                    <!-- 1. VIRTUAL ADDRESS SPACE -->
                    <div class="flex flex-col items-center gap-2">
                        <span class="text-[10px] font-bold text-accent uppercase tracking-widest">Virtual Address Space</span>
                        <div class="relative w-32 h-64 border-2 border-white/20 bg-white/5 rounded-sm flex flex-col">
                            <div class="absolute -left-6 top-0 text-[10px] font-mono text-gray-500">0</div>
                            <div class="absolute -left-8 top-[15%] text-[10px] font-mono text-gray-500">$2^{12}$</div>
                            <div class="absolute -left-10 bottom-0 text-[10px] font-mono text-gray-500">$2^{32}-1$</div>
                            
                            <div class="h-[15%] bg-orange-500/60 border-b border-white/20 flex items-center justify-center text-xs font-bold">A</div>
                            <div class="h-[15%] bg-emerald-500/60 border-b border-white/20 flex items-center justify-center text-xs font-bold">B</div>
                            <div class="flex-1"></div> <!-- Empty Space -->
                            <div class="h-[12%] bg-yellow-400/60 border-y border-white/20 flex items-center justify-center text-xs font-bold">C</div>
                            <div class="h-[20%]"></div> <!-- Empty Space -->
                            <div class="h-[12%] bg-indigo-500/60 border-t border-white/20 flex items-center justify-center text-xs font-bold">D</div>
                        </div>
                    </div>

                    <!-- 2. MAPPING AGENTS (ARROWS) -->
<div class="flex flex-col justify-around h-64 flex-1 min-w-[150px] py-4">
    
    <!-- Hardware/OS Arrow (Pointing to RAM) -->
    <div class="relative flex flex-col items-center group">
        <span class="text-[10px] font-mono mb-2 text-orange-400 group-hover:text-orange-300 transition-colors">Hardware / OS</span>
        <svg class="w-full h-16 filter drop-shadow-md overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
            <!-- Defining a gradient for that "slide" look -->
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:rgb(249,115,22);stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:rgb(249,115,22);stop-opacity:0.7" />
                </linearGradient>
            </defs>
            <!-- Proper block arrow path: shaft + triangle head -->
            <path d="M 0 15 L 75 15 L 75 5 L 98 20 L 75 35 L 75 25 L 0 25 Z" 
                  fill="url(#grad1)" 
                  stroke="rgba(249,115,22,0.4)" 
                  stroke-width="1.5"
                  class="transform transition-transform duration-700 group-hover:translate-x-1 rotate-[10deg] origin-left" />
        </svg>
    </div>

    <!-- OS VMM Arrow (Pointing to DISK) -->
    <div class="relative flex flex-col items-center group">
        <span class="text-[10px] font-mono mb-2 text-orange-700 group-hover:text-orange-600 transition-colors">OS VM Manager</span>
        <svg class="w-full h-16 filter drop-shadow-md overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:rgb(194,65,12);stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:rgb(194,65,12);stop-opacity:0.7" />
                </linearGradient>
            </defs>
            <!-- Same arrow shape but rotated more to point to disk -->
            <path d="M 0 15 L 75 15 L 75 5 L 98 20 L 75 35 L 75 25 L 0 25 Z" 
                  fill="url(#grad2)" 
                  stroke="rgba(194,65,12,0.4)" 
                  stroke-width="1.5"
                  class="transform transition-transform duration-700 group-hover:translate-x-1 rotate-[25deg] origin-left" />
        </svg>
    </div>
</div>

                    <!-- 3. PHYSICAL MEMORY & DISK -->
                    <div class="flex flex-col gap-6 items-center">
                        <!-- RAM -->
                        <div class="flex flex-col items-center gap-2">
                            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Physical Memory</span>
                            <div class="relative w-32 h-40 border-2 border-emerald-500/20 bg-white/5 rounded-sm flex flex-col">
                                <div class="absolute -left-4 top-0 text-[10px] font-mono text-gray-500">0</div>
                                <div class="absolute -left-12 bottom-0 text-[10px] font-mono text-emerald-500/80">$2^{24}-1$</div>
                                
                                <div class="h-[20%] bg-orange-500/60 border-b border-white/10 flex items-center justify-center text-[10px] font-bold">A</div>
                                <div class="h-[20%]"></div> <!-- Fragment -->
                                <div class="h-[20%] bg-yellow-400/60 border-y border-white/10 flex items-center justify-center text-[10px] font-bold">C</div>
                                <div class="h-[15%]"></div> <!-- Fragment -->
                                <div class="h-[20%] bg-emerald-500/60 border-t border-white/10 flex items-center justify-center text-[10px] font-bold text-black">B</div>
                            </div>
                        </div>
                        <!-- DISK -->
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-24 h-12 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div class="absolute inset-0 bg-indigo-500/40 flex items-center justify-center text-[10px] font-bold italic text-white">Segment D</div>
                            </div>
                            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secondary Disk</span>
                        </div>
                    </div>

                </div>
                <div class="mt-4 pt-4 border-t border-white/5 text-center">
                   <p class="text-[11px] text-gray-400 italic italic">Visual Observation: Segment B and C are swapped in RAM relative to their Logical positions.</p>
                </div>
            </div>

            <!-- TECHNICAL DEEP DIVE -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Column 1: Logical Constraints -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-accent border-l-2 border-accent pl-2">1. Virtual Address Space</h4>
                    <ul class="space-y-3 text-xs text-gray-300">
                        <li class="flex items-start gap-2">
                            <span class="text-accent">▶</span>
                            <span><strong>Addressability:</strong> 32-bit pointers allow for $2^{32} \approx 4GB$ of logical addresses.</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-accent">▶</span>
                            <span><strong>Contiguity:</strong> Programs view memory as a single unbroken sequence. <strong>Segment B</strong> follows <strong>Segment A</strong> directly at the $2^{12}$ mark.</span>
                        </li>
                    </ul>
                </div>

                <!-- Column 2: Physical Constraints -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-emerald-400 border-l-2 border-emerald-400 pl-2">2. Physical RAM</h4>
                    <ul class="space-y-3 text-xs text-gray-300">
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-400">▶</span>
                            <span><strong>Addressability:</strong> Based on diagram annotations, physical RAM is limited to $2^{24} \approx 16MB$.</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-400">▶</span>
                            <span><strong>Scattered Storage:</strong> Memory segments are loaded wherever space is available. Notice the "holes" (white space) between A, C, and B.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- THE SWAPPING MECHANISM -->
            <section class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-xl">
                <h4 class="text-indigo-300 font-bold mb-4 text-sm uppercase tracking-tighter">OS Virtual Memory Manager (VMM)</h4>
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex-1">
                        <p class="text-xs text-gray-300 leading-relaxed">
                            Since Physical RAM ($2^{24}$) is significantly smaller than the Virtual Space ($2^{32}$), the OS cannot keep all segments loaded at once.
                            <br><br>
                            The <strong>VMM</strong> manages "Segment D" by offloading it to the <strong>Disk</strong>. This process is transparent to the CPU, which still thinks D is at the end of the logical address space.
                        </p>
                    </div>
                    <div class="bg-black/40 p-4 rounded-lg border border-indigo-500/30 flex flex-col justify-center">
                        <span class="text-[10px] text-indigo-400 font-bold mb-1 underline text-center">Translation Key</span>
                        <div class="font-mono text-[11px] space-y-1">
                            <div class="flex justify-between gap-4"><span>Virt A</span><span class="text-gray-500">→</span><span class="text-emerald-400">Phys A</span></div>
                            <div class="flex justify-between gap-4"><span>Virt B</span><span class="text-gray-500">→</span><span class="text-emerald-400">Phys B (Offset)</span></div>
                            <div class="flex justify-between gap-4"><span>Virt D</span><span class="text-gray-500">→</span><span class="text-indigo-400">DISK</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `
},
        'vm-base-bounds': {
            title: 'Base and Bounds Translation',
            html: `
                <div class="space-y-4">
                    <p>A simple hardware-based dynamic translation happening at <strong>load time</strong>.</p>
                    <div class="latex-output text-center">
                        Physical Address = Virtual Address + Base
                    </div>
                    <div class="warn-box">
                        <strong>The Bound Check:</strong> If (Virtual Address > Limit) $\\Rightarrow$ <span class="text-red-400">Memory Protection Error!</span>
                    </div>
                    <ul class="list-disc pl-5 space-y-2 text-sm text-gray-400">
                        <li>Gives the illusion that the program starts at address 0.</li>
                        <li>Requires a contiguous region of physical memory.</li>
                        <li>Addresses are not relocated when new programs load; only the Base register changes.</li>
                    </ul>

                    <!-- HIGH-FIDELITY SCHEMATIC ENGINE -->
            <div class="glass p-10 rounded-3xl border border-white/10 bg-slate-950/50 relative overflow-hidden">
                
                <div class="flex items-center justify-between gap-4 relative z-10">
                    
                    <!-- LEFT: INPUT STACK -->
                    <div class="flex flex-col gap-6 w-48">
                        <div class="bg-indigo-500/20 border border-indigo-400/40 p-4 rounded-xl shadow-lg">
                            <div class="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Virtual Address</div>
                            <div class="text-lg font-mono text-white">0x0040</div>
                        </div>
                        <div class="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
                            <span class="text-xs font-serif italic text-gray-400">Page Table</span>
                        </div>
                    </div>

                    <!-- CENTER: THE UNIFIED LOGIC BUS -->
                    <div class="relative flex-1 h-80 min-w-[500px]">
                        <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 500 200">
                            <defs>
                                <marker id="head" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                    <path d="M0,0 L10,3.5 L0,7 Z" fill="#94a3b8" />
                                </marker>
                            </defs>
                            
                            <!-- MAIN BUS LINE -->
                            <path d="M 0 100 L 380 100" stroke="white" stroke-width="3" fill="none" opacity="0.8" />
                            
                            <!-- BRANCH TO COMPARATOR -->
                            <path d="M 100 100 L 100 140" stroke="white" stroke-width="3" fill="none" />
                            
                            <!-- BOUND INPUT LINE -->
                            <path d="M 40 160 L 80 160" stroke="#94a3b8" stroke-width="2" fill="none" marker-end="url(#head)" />
                            
                            <!-- BASE INPUT LINE -->
                            <path d="M 330 40 L 330 80" stroke="#22d3ee" stroke-width="2" fill="none" marker-end="url(#head)" />

                            <!-- OUTPUT TO RAM LINE -->
                            <path d="M 420 100 L 460 100" stroke="white" stroke-width="3" fill="none" marker-end="url(#head)" opacity="0.8" />
                        </svg>

                        <!-- COMPARATOR GATE (>?) -->
                        <div class="absolute left-[100px] top-[160px] -translate-x-1/2 -translate-y-1/2 group">
                            <div class="w-14 h-14 rounded-full bg-cyan-400 border-4 border-slate-900 flex items-center justify-center text-slate-900 font-black text-xl shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-transform group-hover:scale-110">
                                >?
                            </div>
                            <div class="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-transparent"></div>
                                <span class="text-xs font-black text-red-500 tracking-[0.2em] animate-pulse">ERROR!</span>
                            </div>
                            <!-- Bound Label -->
                            <div class="absolute -left-20 top-1/2 -translate-y-1/2 text-right w-16">
                                <span class="block text-[10px] font-black text-slate-400 leading-tight">BOUND</span>
                                <span class="block text-[8px] text-slate-500 uppercase tracking-tighter">(LIMIT)</span>
                            </div>
                        </div>

                        <!-- ADDER GATE (+) -->
                        <div class="absolute left-[330px] top-[100px] -translate-x-1/2 -translate-y-1/2 group">
                            <div class="w-16 h-16 rounded-full bg-cyan-400 border-4 border-slate-900 flex items-center justify-center text-slate-900 font-black text-3xl shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-transform group-hover:scale-110">
                                +
                            </div>
                            <!-- Base Label -->
                            <div class="absolute -top-16 left-1/2 -translate-x-1/2 text-center w-20">
                                <span class="text-xs font-black text-white uppercase tracking-widest border-b-2 border-cyan-400 pb-1">Base</span>
                            </div>
                            <!-- Physical Address Label -->
                            <div class="absolute -right-32 top-1/2 -translate-y-1/2 w-28">
                                <div class="bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded">
                                    <span class="block text-[9px] font-black text-emerald-400 uppercase leading-none mb-1">Physical Address</span>
                                    <span class="block text-xs font-mono text-emerald-200">VA + Base</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: RAM TARGET -->
                    <div class="flex flex-col items-center gap-3">
                        <div class="w-32 h-20 bg-blue-200 border-4 border-slate-900 rounded-xl shadow-[8px_8px_0px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-900">
                            <span class="text-lg font-black tracking-widest">RAM</span>
                        </div>
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Memory</span>
                    </div>

                </div>

                <!-- Grid Background Detail -->
                <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style="background-image: radial-gradient(#fff 2px, transparent 2px); background-size: 30px 30px;">
                </div>
            </div>

            <!-- COMPARATIVE ANALYSIS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <h4 class="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
                        Relocation Illusion
                    </h4>
                    <p class="text-xs text-slate-400 leading-relaxed pl-4 border-l border-slate-800">
                        The program believes it is in a dedicated space starting at address <strong>0</strong>. 
                        The <strong>Base</strong> register allows the OS to transparently shift this entire logical 
                        block to any available slot in physical RAM without modifying program code.
                    </p>
                </div>
                <div class="space-y-4">
                    <h4 class="text-sm font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Protection Bounds
                    </h4>
                    <p class="text-xs text-slate-400 leading-relaxed pl-4 border-l border-slate-800">
                        Before the addition occurs, the hardware checks the <strong>Bound (Limit)</strong>. 
                        If the request exceeds this value, the gate triggers an immediate interrupt, 
                        preventing processes from "bleeding" into other memory regions or the OS itself.
                    </p>
                </div>
            </div>
            <!-- CORE THEORY -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-accent uppercase tracking-widest border-b border-white/10 pb-2">Load-Time Translation</h4>
                    <p class="text-xs text-gray-400 leading-relaxed">
                        Translation happens dynamically at <strong>load time</strong>. The CPU modifies every memory reference before it reaches the bus.
                    </p>
                    <div class="p-4 bg-black/20 rounded-lg border border-white/5 font-mono text-[11px] text-emerald-400">
                        PA = VA + Base_Register
                    </div>
                </div>

                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-red-400 uppercase tracking-widest border-b border-white/10 pb-2">Protection Logic</h4>
                    <ul class="space-y-2 text-xs text-gray-300">
                        <li class="flex items-center gap-2">
                            <span class="text-red-500">●</span>
                            <span>CPU generates error if <strong>VA > Bound (Limit)</strong>.</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-cyan-400">●</span>
                            <span>Ensures processes cannot access memory outside their allocated region.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- THE ILLUSION -->
            <section class="bg-white/5 p-6 rounded-xl border border-white/10 italic">
                <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">The Programmer's Illusion</h4>
                <p class="text-sm text-gray-300 leading-relaxed">
                    "This gives the program the illusion that it is running on its own dedicated machine with memory starting at 0. Because of the <strong>Base</strong> offset, the OS can place this 'Address 0' anywhere in physical RAM."
                </p>
            </section>


             
            <!-- 2. THE PROGRAMMER'S PERSPECTIVE (From Slide 7) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                    <h4 class="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest">The Programmer's Illusion</h4>
                    <ul class="space-y-4 text-sm text-gray-300">
                        <li class="flex items-start gap-3">
                            <span class="text-indigo-400 mt-1">✓</span>
                            <span>Program "thinks" it has its <strong>own dedicated machine</strong> with memory starting at 0.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="text-indigo-400 mt-1">✓</span>
                            <span>Gets a single <strong>continuous region</strong> of memory.</span>
                        </li>
                    </ul>
                </div>
                <div class="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                    <h4 class="text-emerald-400 font-black text-xs uppercase mb-4 tracking-widest">Relocation Freedom</h4>
                    <p class="text-sm text-gray-300 leading-relaxed">
                        Addresses are <strong>not relocated</strong> when new programs are loaded. The code stays identical; only the hardware <strong>Base Register</strong> is updated to point to the new physical starting point.
                    </p>
                </div>
            </div>

            <!-- 3. DYNAMIC ALLOCATION LIFECYCLE (From Slides 8 & 9) -->
            <div class="glass p-8 rounded-2xl border border-white/10 bg-black/30">
                <h4 class="text-accent text-xs font-black uppercase mb-6 tracking-widest text-center">Dynamic Memory Timeline</h4>
                <div class="flex flex-wrap justify-center gap-8">
                    <!-- T1: Initial -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-24 h-40 border-2 border-white/20 bg-white/5 rounded flex flex-col text-[9px] font-bold">
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 5</div>
                            <div class="flex-1 bg-blue-500/40 flex items-center justify-center">Proc 2</div>
                            <div class="h-1/5 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-gray-500">Initial State</span>
                    </div>

                    <div class="self-center text-accent">→</div>

                    <!-- T2: Finish -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-24 h-40 border-2 border-white/20 bg-white/5 rounded flex flex-col text-[9px] font-bold">
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 5</div>
                            <div class="flex-1 border-b border-white/5 bg-emerald-500/5 flex flex-col items-center justify-center text-emerald-400/50">
                                <span>HOLE</span>
                                <span class="text-[7px] italic">(Proc 2 finish)</span>
                            </div>
                            <div class="h-1/5 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-gray-500">Process Exit</span>
                    </div>

                    <div class="self-center text-accent">→</div>

                    <!-- T3: Arrival -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-24 h-40 border-2 border-white/20 bg-white/5 rounded flex flex-col text-[9px] font-bold">
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 5</div>
                            <div class="h-[25%] bg-emerald-500/5"></div>
                            <div class="h-[15%] bg-blue-500/60 border-y border-white/20 flex items-center justify-center">Proc 9</div>
                            <div class="h-1/5 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-gray-500">Proc 9 Arrives</span>
                    </div>

                    <div class="self-center text-accent">→</div>

                    <!-- T4: The Problem -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-24 h-40 border-2 border-white/20 bg-white/5 rounded flex flex-col text-[9px] font-bold">
                            <div class="h-1/5 bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-[20%] bg-emerald-500/5"></div>
                            <div class="h-[15%] bg-blue-500/60 border-y border-white/20 flex items-center justify-center text-[7px]">Proc 10</div>
                            <div class="h-[15%] bg-emerald-500/5"></div>
                            <div class="h-[15%] bg-blue-500/60 border-y border-white/20 flex items-center justify-center">Proc 9</div>
                            <div class="h-1/5 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-red-400 font-bold tracking-widest">PROBLEMS?</span>
                    </div>
                </div>
                <div class="mt-8 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <p class="text-xs text-center text-red-300">
                        Notice how memory becomes <strong>fragmented</strong> over time. The "holes" between processes are too small for large programs, leading to wasted space!
                    </p>
                </div>
            </div>



                </div>
            `
        },
        'vm-fragmentation': {
    title: 'Fragmentation & Sparse Address Spaces',
    html: `
        <div class="space-y-10">
            <!-- 1. EXTERNAL FRAGMENTATION LIFECYCLE (Slides 10 & 11) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-black/40">
                <h4 class="text-accent text-xs font-black uppercase mb-8 tracking-widest text-center">External Fragmentation: The "Process 11" Problem</h4>
                
                <div class="flex flex-wrap justify-center items-end gap-6 overflow-x-auto pb-4">
                    <!-- State 1 -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-20 h-48 border border-white/20 bg-white/5 rounded flex flex-col text-[8px] font-bold">
                            <div class="h-[15%] bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-[15%] bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 5</div>
                            <div class="h-[50%] bg-blue-500/50 border-b border-white/10 flex items-center justify-center">Proc 2</div>
                            <div class="flex-1 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-gray-500 italic">Initial</span>
                    </div>

                    <div class="mb-20 text-white/20">→</div>

                    <!-- State 2 (Hole creation) -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-20 h-48 border border-white/20 bg-white/5 rounded flex flex-col text-[8px] font-bold">
                            <div class="h-[15%] bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-[15%] bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 5</div>
                            <div class="h-[50%] bg-emerald-500/5 flex items-center justify-center text-emerald-500/40">HOLE</div>
                            <div class="flex-1 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-gray-500 italic">Proc 2 Exits</span>
                    </div>

                    <div class="mb-20 text-white/20">→</div>

                    <!-- State 3 (Partial Fill) -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-20 h-48 border border-white/20 bg-white/5 rounded flex flex-col text-[8px] font-bold">
                            <div class="h-[15%] bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-[15%] bg-emerald-500/5"></div>
                            <div class="h-[15%] bg-blue-500/40 border-y border-white/10 flex items-center justify-center">Proc 10</div>
                            <div class="h-[15%] bg-emerald-500/5"></div>
                            <div class="h-[20%] bg-blue-500/30 border-b border-white/10 flex items-center justify-center">Proc 9</div>
                            <div class="flex-1 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-gray-500 italic">Interleaving</span>
                    </div>

                    <div class="mb-20 text-white/20">→</div>

                    <!-- State 4 (The Failure) -->
                    <div class="flex relative flex-col items-center gap-2">
                        <!-- Process 11 attempting to enter -->
                        <div class="absolute -right-16 top-1/4 w-12 h-24 bg-red-500/40 border-2 border-red-500 flex items-center justify-center text-[10px] font-black animate-pulse z-10">
                            Proc 11
                            <div class="absolute top-0 -left-4 text-red-500">hookleftarrow;</div>
                            <div class="absolute bottom-0 -left-4 text-red-500">hookleftarrow;</div>
                        </div>

                        <div class="w-20 h-48 border-2 border-red-500/50 bg-white/5 rounded flex flex-col text-[8px] font-bold">
                            <div class="h-[15%] bg-blue-500/20 border-b border-white/10 flex items-center justify-center">Proc 6</div>
                            <div class="h-[15%] bg-emerald-500/20 flex items-center justify-center text-emerald-400">Hole 1</div>
                            <div class="h-[15%] bg-blue-500/20 border-y border-white/10 flex items-center justify-center">Proc 10</div>
                            <div class="h-[15%] bg-emerald-500/20 flex items-center justify-center text-emerald-400">Hole 2</div>
                            <div class="h-[20%] bg-blue-500/20 border-b border-white/10 flex items-center justify-center">Proc 9</div>
                            <div class="flex-1 bg-slate-700/50 flex items-center justify-center">OS</div>
                        </div>
                        <span class="text-[9px] text-red-400 font-bold">ALLOC FAILURE</span>
                    </div>
                </div>

                <div class="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p class="text-xs text-center text-red-200 italic">
                        <strong>Problem:</strong> Process 11 cannot fit. Even though Total Free Space (Hole 1 + Hole 2) is enough, Base/Bounds requires <strong>contiguous</strong> memory.
                    </p>
                </div>
            </div>

            <!-- 2. SPARSE ADDRESS SPACE (Slide 12) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Visual Stack -->
                <div class="glass p-6 rounded-2xl border border-white/10 bg-black/20 flex flex-col items-center">
                    <h4 class="text-indigo-400 text-[10px] font-black uppercase mb-4 tracking-tighter">Process Address Space Layout</h4>
                    
                    <div class="w-48 h-80 border-2 border-white/20 rounded flex flex-col relative font-mono text-[9px]">
                        <!-- Kernel Space -->
                        <div class="h-[25%] bg-red-500/20 border-b-2 border-white/40 flex flex-col items-center justify-center text-center p-1">
                            <span class="text-red-300 font-bold">Kernel Memory</span>
                            <span class="text-[7px] opacity-60">(PTables, Stacks)</span>
                        </div>
                        
                        <!-- User Stack -->
                        <div class="h-[10%] bg-emerald-500/30 border-b border-white/10 flex items-center justify-center">
                            User Stack ↓
                        </div>
                        
                        <!-- HUGE HOLE -->
                        <div class="flex-1 bg-slate-800/50 flex items-center justify-center text-slate-500 font-bold italic">
                            SPARSE GAP
                        </div>
                        
                        <!-- Heap -->
                        <div class="h-[10%] bg-emerald-500/30 border-t border-white/10 flex items-center justify-center">
                            ↑ Runtime Heap
                        </div>
                        
                        <!-- Code/Data -->
                        <div class="h-[15%] bg-indigo-500/30 border-t border-white/10 flex flex-col items-center justify-center">
                            <span>Data (.bss / .data)</span>
                            <span class="font-bold">Program Text</span>
                        </div>

                        <!-- Labels for Slide 12 -->
                        <div class="absolute -right-24 top-0 h-1/4 flex items-center text-[8px] text-gray-500 border-l border-gray-700 pl-2">Kernel Virtual</div>
                        <div class="absolute -right-24 top-1/4 h-3/4 flex items-center text-[8px] text-gray-500 border-l border-gray-700 pl-2">Process Virtual</div>
                    </div>
                </div>

                <!-- Analysis Content -->
                <div class="space-y-6">
                    <div class="step-card border-indigo-500">
                        <span class="step-title">The "Sparse" Reality</span>
                        <p class="text-xs text-gray-300 leading-relaxed">
                            Modern processes don't use a solid block of memory. The <strong>Stack</strong> (grows down) and <strong>Heap</strong> (grows up) are separated by a massive "void" to allow for growth.
                        </p>
                    </div>
                    
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                        <h5 class="text-amber-400 font-bold text-[10px] uppercase mb-2">Base & Bounds Failure</h5>
                        <p class="text-xs text-gray-300">
                            Because Base and Bounds maps <strong>one contiguous range</strong>, the OS must allocate physical RAM for the <strong>entire</strong> space—including the massive empty gap.
                        </p>
                        <div class="mt-2 text-[10px] font-black text-amber-500 uppercase">Result: Massive Internal Fragmentation.</div>
                    </div>

                    <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <h5 class="text-indigo-400 font-bold text-[10px] uppercase mb-2">Summary</h5>
                        <ul class="text-[10px] space-y-1 text-gray-400">
                            <li>• Each process needs a <strong>different amount</strong> of memory.</li>
                            <li>• Memory becomes <strong>fragmented</strong> over time as processes exit.</li>
                            <li>• <strong>No support</strong> for gaps in the address space.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
},

'vm-paging-concept': {
    title: 'Multi-Process Mapping & Translation',
    html: `
        <div class="space-y-8">
            <!-- FULL SCHEMATIC DIAGRAM: VIRTUAL TO PHYSICAL MAP -->
            <div class="glass p-6 rounded-3xl border border-white/10 bg-slate-950/40 overflow-hidden relative">
                
                <div class="flex flex-col xl:flex-row items-center justify-between gap-4 relative z-10 min-h-[600px]">
                    
                    <!-- PROCESS 1: VIRTUAL SPACE -->
                    <div class="flex flex-col items-center gap-4 w-40">
                        <div class="text-center">
                            <h5 class="text-xs font-black text-cyan-400 uppercase tracking-widest">Process 1</h5>
                            <span class="text-[9px] text-gray-500 uppercase">Virtual Address Space</span>
                        </div>
                        <div class="w-full border-4 border-blue-600 bg-white/5 rounded-sm flex flex-col font-bold text-xs">
                            <div class="p-3 border-b-2 border-blue-600/50 flex justify-center text-blue-400">Code</div>
                            <div class="p-3 border-b-2 border-blue-600/50 flex justify-center text-blue-400">Data</div>
                            <div class="p-3 border-b-2 border-blue-600/50 flex justify-center text-blue-400">Heap</div>
                            <div class="p-3 flex justify-center text-blue-400">Stack</div>
                        </div>
                    </div>

                    <!-- MAPPING ENGINE (SVG WIRING) -->
                    <div class="flex-1 relative h-[500px] min-w-[500px]">
                        <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 500 500">
                            <!-- TRANSLATION MAP OVALS -->
                            <ellipse cx="100" cy="200" rx="25" ry="100" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 2" />
                            <ellipse cx="400" cy="210" rx="25" ry="110" fill="rgba(249, 115, 22, 0.4)" stroke="#f97316" stroke-width="2" stroke-dasharray="4 2" />

                            <!-- LABELS FOR OVALS -->
                            <text x="30" y="350" fill="#06b6d4" font-size="12" font-weight="bold">Translation Map 1</text>
                            <text x="30" y="370" fill="#06b6d4" font-size="10" font-style="italic">Page Tables</text>
                            
                            <text x="330" y="350" fill="#f97316" font-size="12" font-weight="bold">Translation Map 2</text>
                            <text x="330" y="370" fill="#f97316" font-size="10" font-style="italic">???</text>

                            <!-- ARROWS FROM P1 (Virtual to Physical) -->
                            <g stroke="#000" stroke-width="3" opacity="0.8">
                                <line x1="20" y1="90" x2="230" y2="185" /> <!-- Code 1 -->
                                <line x1="20" y1="130" x2="230" y2="280" /> <!-- Data 1 -->
                                <line x1="20" y1="170" x2="230" y2="135" /> <!-- Heap 1 -->
                                <line x1="20" y1="210" x2="230" y2="95" />  <!-- Stack 1 -->
                            </g>

                            <!-- ARROWS FROM P2 (Virtual to Physical) -->
                            <g stroke="#000" stroke-width="3" opacity="0.8">
                                <line x1="480" y1="100" x2="270" y2="55" />  <!-- Data 2 -->
                                <line x1="480" y1="140" x2="270" y2="230" /> <!-- Stack 2 -->
                                <line x1="480" y1="180" x2="270" y2="330" /> <!-- Heap 2 -->
                                <line x1="480" y1="220" x2="270" y2="380" /> <!-- Code 2 -->
                            </g>
                        </svg>

                        <!-- CENTRAL PHYSICAL MEMORY BAR -->
                        <div class="absolute left-1/2 top-0 -translate-x-1/2 w-24 border-4 border-blue-700 bg-white/5 flex flex-col font-black text-[9px] text-black">
                            <div class="h-[40px] bg-green-600 flex items-center justify-center border-b border-black">Data 2</div>
                            <div class="h-[40px] bg-cyan-400 flex items-center justify-center border-b border-black">Stack 1</div>
                            <div class="h-[40px] bg-indigo-400 flex items-center justify-center border-b border-black">Heap 1</div>
                            <div class="h-[40px] bg-indigo-500 flex items-center justify-center border-b border-black">Code 1</div>
                            <div class="h-[40px] bg-green-600 flex items-center justify-center border-b border-black text-white">Stack 2</div>
                            <div class="h-[40px] bg-indigo-400 flex items-center justify-center border-b border-black">Data 1</div>
                            <div class="h-[40px] bg-orange-500 flex items-center justify-center border-b border-black">Heap 2</div>
                            <div class="h-[40px] bg-green-600 flex items-center justify-center border-b border-black text-white">Code 2</div>
                            <!-- OS SEGMENTS -->
                            <div class="h-[40px] bg-white flex items-center justify-center border-b border-black">OS code</div>
                            <div class="h-[40px] bg-white flex items-center justify-center border-b border-black">OS data</div>
                            <div class="h-[60px] bg-white flex items-center justify-center text-center">OS heap &<br>Stacks</div>
                        </div>
                    </div>

                    <!-- PROCESS 2: VIRTUAL SPACE -->
                    <div class="flex flex-col items-center gap-4 w-40">
                        <div class="text-center">
                            <h5 class="text-xs font-black text-orange-400 uppercase tracking-widest">Process 2</h5>
                            <span class="text-[9px] text-gray-500 uppercase">Virtual Address Space</span>
                        </div>
                        <div class="w-full border-4 border-orange-500 bg-white/5 rounded-sm flex flex-col font-bold text-xs">
                            <div class="p-3 border-b-2 border-orange-500/50 flex justify-center text-orange-400">Code</div>
                            <div class="p-3 border-b-2 border-orange-500/50 flex justify-center text-orange-400">Data</div>
                            <div class="p-3 border-b-2 border-orange-500/50 flex justify-center text-orange-400">Heap</div>
                            <div class="p-3 flex justify-center text-orange-400">Stack</div>
                        </div>
                    </div>

                </div>

                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                    Physical Address Space
                </div>
            </div>

            <!-- EXPLANATORY FOOTER -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                    <h4 class="text-blue-400 font-black text-xs uppercase mb-2">Translation Map 1</h4>
                    <p class="text-xs text-gray-300">Maps <strong>Process 1's</strong> logical components (Blue) into scattered slots in RAM. Notice that P1's Stack is physically *above* its Code, despite being logically *below* it.</p>
                </div>
                <div class="p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                    <h4 class="text-orange-400 font-black text-xs uppercase mb-2">Translation Map 2</h4>
                    <p class="text-xs text-gray-300">Maps <strong>Process 2's</strong> components (Orange) into the remaining gaps. The OS ensures that P1 and P2 components never overlap in the physical bar.</p>
                </div>
            </div>
        </div>
    `
},

        'vm-math': {
            title: '32-bit Address Translation Math',
            html: `
                <div class="space-y-6">
                    <section class="bg-white/5 p-4 rounded-lg">
                        <h4 class="text-accent font-bold mb-2">Example Parameters</h4>
                        <ul class="font-mono text-xs space-y-1">
                            <li>32-bit OS $\Rightarrow 2^{32}$ Addressable Bytes</li>
                            <li>Page Size: 4KB ($2^{12}$ bytes)</li>
                            <li>Physical Memory: 4GB ($2^{32}$)</li>
                        </ul>
                    </section>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-black/20 rounded-lg border border-white/5">
                            <h5 class="text-sm font-bold mb-2">Virtual Address Split</h5>
                            <p class="text-xs text-gray-400">32 bits total:</p>
                            <div class="flex mt-2 font-mono text-center">
                                <div class="bg-indigo-500/30 p-2 w-2/3 border border-indigo-500/50">VPN (20 bits)</div>
                                <div class="bg-emerald-500/30 p-2 w-1/3 border border-emerald-500/50">Offset (12 bits)</div>
                            </div>
                        </div>
                        <div class="p-4 bg-black/20 rounded-lg border border-white/5">
                            <h5 class="text-sm font-bold mb-2">Page Table Size</h5>
                            <p class="text-sm">
                                Number of Entries = $2^{VPN\_bits} = 2^{20}$ entries.<br>
                                Total size $\approx$ 4GB if not managed carefully.
                            </p>
                        </div>
                    </div>
                </div>
            `
        },
        'vm-pte': {
            title: 'Page Table Entry (PTE)',
            html: `
                <div class="space-y-4">
                    <p class="text-sm">Each entry in the Page Table contains more than just a address; it contains status bits:</p>
                    <div class="grid grid-cols-1 gap-2">
                        <div class="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                            <span class="w-24 font-mono text-accent">Valid Bit</span>
                            <span class="text-xs text-gray-400">1: In RAM | 0: On Disk (Swap)</span>
                        </div>
                        <div class="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                            <span class="w-24 font-mono text-accent">Perms</span>
                            <span class="text-xs text-gray-400">Read, Write, Execute, Supervisor</span>
                        </div>
                        <div class="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                            <span class="w-24 font-mono text-accent">Pointer</span>
                            <span class="text-xs text-gray-400">Physical Page Frame Number (PPN)</span>
                        </div>
                    </div>
                </div>
            `
        }
    }
};