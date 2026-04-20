export const multi = {
id: 'vm-multilevel', 
    title: 'Multi-level Page Tables',
    subtopics: [
        { id: 'ml-theory', title: '1. Why N-levels?' },
        { id: 'ml-intel-i7', title: '2. Intel Core i7 Case Study' },
        { id: 'ml-math', title: '3. Hierarchical Math' },
        { id: 'vm-5level', title: '1. 57-bit Address Hierarchy' },
        { id: '5level-math', title: '2. Memory Reach & Overhead' }
    ],
    content: {
        'ml-theory': {
            title: 'Reducing Memory Requirements',
            html: `
                <div class="space-y-6">
                    <section class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
                        <h4 class="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest">The Efficiency Breakthrough</h4>
                        <p class="text-sm text-gray-300 leading-relaxed mb-4">
                            In a flat page table, we need an entry for every possible virtual page, even if the process never uses them. <strong>Multi-level tables</strong> solve this by creating a tree structure.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <span class="text-emerald-400 font-bold text-xs uppercase">Sparse Storage</span>
                                <p class="text-[11px] text-gray-400 mt-2">If a PTE in the <strong>Level-1</strong> table is null, the entire <strong>Level-2</strong> table it would have pointed to <strong>does not have to exist</strong>.</p>
                            </div>
                            <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <span class="text-white font-bold text-xs uppercase">On-Demand Creation</span>
                                <p class="text-[11px] text-gray-400 mt-2">Only the Level-1 table must be in RAM at all times. Lower levels can be paged in and out by the MMU only when needed.</p>
                            </div>
                        </div>
                    </section>
                </div>
            `
        },
        'ml-intel-i7': {
    title: 'Intel Core i7 Memory System (Full Schematic)',
    html: `
        <div class="space-y-8">
            <!-- SCHEMATIC ENGINE CONTAINER -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/90 relative overflow-x-auto">
                <h4 class="text-center text-[11px] font-black text-white uppercase tracking-[0.4em] mb-12">x86-64 Hardware Translation Hierarchy</h4>
                
                <!-- Fixed Width Schematic Area to ensure alignment -->
                <div class="relative w-[1000px] h-[650px] mx-auto font-mono">
                    
                    <!-- 1. VIRTUAL ADDRESS BAR (TOP) -->
                    <div class="absolute top-0 left-[180px] flex border-2 border-slate-700 rounded-sm bg-black/60 shadow-2xl text-[10px] text-center">
                        <div class="w-24 p-2 bg-pink-500/20 border-r border-slate-700">
                            <span class="block text-pink-400 font-bold mb-1">9</span><span class="text-white">VPN 1</span>
                        </div>
                        <div class="w-24 p-2 bg-emerald-500/20 border-r border-slate-700">
                            <span class="block text-emerald-400 font-bold mb-1">9</span><span class="text-white">VPN 2</span>
                        </div>
                        <div class="w-24 p-2 bg-indigo-500/20 border-r border-slate-700">
                            <span class="block text-indigo-400 font-bold mb-1">9</span><span class="text-white">VPN 3</span>
                        </div>
                        <div class="w-24 p-2 bg-yellow-500/20 border-r border-slate-700">
                            <span class="block text-yellow-400 font-bold mb-1">9</span><span class="text-white">VPN 4</span>
                        </div>
                        <div class="w-32 p-2 bg-slate-700/30">
                            <span class="block text-slate-400 font-bold mb-1">12</span><span class="text-white">VPO</span>
                        </div>
                        <div class="absolute -right-24 top-4 text-[10px] font-bold text-slate-500 uppercase">Virtual address</div>
                    </div>

                    <!-- 2. THE HARDWARE DIRECTORIES (TABLES) -->
                    <!-- Positioned absolutely to match SVG Coordinates -->
                    
                    <!-- L1 -->
                    <div class="absolute left-[180px] top-[140px] w-24 flex flex-col items-center gap-2">
                        <span class="text-[8px] text-slate-500 text-center font-bold">L1 PT<br>Global Dir</span>
                        <div class="w-full h-44 border border-slate-700 bg-black/40 rounded flex flex-col items-center relative">
                            <div class="absolute top-20 w-full h-5 bg-pink-500/40 border-y border-pink-400/50 flex items-center justify-center text-[8px] text-white">L1 PTE</div>
                        </div>
                        <span class="text-[7px] text-slate-500 text-center italic">512 GB<br>region/entry</span>
                    </div>

                    <!-- L2 -->
                    <div class="absolute left-[340px] top-[140px] w-24 flex flex-col items-center gap-2">
                        <span class="text-[8px] text-slate-500 text-center font-bold">L2 PT<br>Upper Dir</span>
                        <div class="w-full h-44 border border-slate-700 bg-black/40 rounded flex flex-col items-center relative">
                            <div class="absolute top-20 w-full h-5 bg-emerald-500/40 border-y border-emerald-400/50 flex items-center justify-center text-[8px] text-white">L2 PTE</div>
                        </div>
                        <span class="text-[7px] text-slate-500 text-center italic">1 GB<br>region/entry</span>
                    </div>

                    <!-- L3 -->
                    <div class="absolute left-[500px] top-[140px] w-24 flex flex-col items-center gap-2">
                        <span class="text-[8px] text-slate-500 text-center font-bold">L3 PT<br>Middle Dir</span>
                        <div class="w-full h-44 border border-slate-700 bg-black/40 rounded flex flex-col items-center relative">
                            <div class="absolute top-20 w-full h-5 bg-indigo-500/40 border-y border-indigo-400/50 flex items-center justify-center text-[8px] text-white">L3 PTE</div>
                        </div>
                        <span class="text-[7px] text-slate-500 text-center italic">2 MB<br>region/entry</span>
                    </div>

                    <!-- L4 -->
                    <div class="absolute left-[660px] top-[140px] w-24 flex flex-col items-center gap-2">
                        <span class="text-[8px] text-slate-500 text-center font-bold">L4 PT<br>Page Table</span>
                        <div class="w-full h-44 border border-slate-700 bg-black/40 rounded flex flex-col items-center relative">
                            <div class="absolute top-20 w-full h-5 bg-yellow-500/40 border-y border-yellow-400/50 flex items-center justify-center text-[8px] text-white">L4 PTE</div>
                        </div>
                        <span class="text-[7px] text-slate-500 text-center italic">4 KB<br>region/entry</span>
                    </div>

                    <!-- 3. SVG WIRING OVERLAY (PIXEL-PERFECT) -->
                    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 650">
                        <defs>
                            <marker id="ptr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <path d="M0,0 L10,3.5 L0,7 Z" fill="#64748b" />
                            </marker>
                        </defs>

                        <!-- CR3 to L1 Entry -->
                        <path d="M 50 250 L 180 250" stroke="#64748b" stroke-width="2" marker-end="url(#ptr)" />
                        <text x="50" y="240" fill="#fff" font-size="12" font-weight="bold">CR3</text>
                        <text x="30" y="270" fill="#64748b" font-size="9" font-style="italic">Phys addr of L1 PT</text>

                        <!-- VPN Lines dropping from Top Bar -->
                        <g stroke="#64748b" stroke-width="1" fill="none" opacity="0.5">
                            <path d="M 228 50 L 228 230 L 180 230" /> <!-- VPN 1 -->
                            <path d="M 324 50 L 324 230 L 340 230" /> <!-- VPN 2 -->
                            <path d="M 420 50 L 420 230 L 500 230" /> <!-- VPN 3 -->
                            <path d="M 516 50 L 516 230 L 660 230" /> <!-- VPN 4 -->
                        </g>

                        <!-- Pointers between Table Levels -->
                        <g stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#ptr)">
                            <path d="M 276 250 L 340 250" /> <!-- L1 to L2 -->
                            <path d="M 436 250 L 500 250" /> <!-- L2 to L3 -->
                            <path d="M 596 250 L 660 250" /> <!-- L3 to L4 -->
                        </g>

                        <!-- VPO Bypass (Long Straight Line) -->
                        <path d="M 645 50 L 645 580" stroke="#64748b" stroke-width="1.5" fill="none" marker-end="url(#ptr)" />
                        <text x="655" y="400" fill="#64748b" font-size="10" font-style="italic">Offset into physical and virtual page</text>

                        <!-- L4 PTE to Physical PPN Output -->
                        <path d="M 756 250 L 800 250 L 800 450 L 500 450 L 500 560" stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#ptr)" />
                        <text x="810" y="350" fill="#64748b" font-size="10" font-style="italic">Physical address of page</text>
                    </svg>

                    <!-- 4. RED MATH BOX (Slide Detail) -->
                    <div class="absolute left-10 bottom-[180px] bg-red-600/10 border border-red-500/40 p-4 rounded-xl">
                        <span class="text-lg font-black text-red-500 uppercase tracking-tighter">
                            1GB / 2MB = 512: <br>
                            <span class="text-sm font-normal">If all PTEs at L3 are full!</span>
                        </span>
                    </div>

                    <!-- 5. PHYSICAL ADDRESS RESULT (BOTTOM) -->
                    <div class="absolute bottom-4 left-[250px] flex border-2 border-slate-700 rounded-sm bg-black/60 shadow-2xl text-[10px] text-center">
                        <div class="relative w-[400px] p-3 bg-yellow-400/10 border-r border-slate-700">
                            <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-yellow-400 font-bold">40</span>
                            <span class="text-white font-black tracking-widest">PPN</span>
                        </div>
                        <div class="relative w-32 p-3 bg-indigo-500/10">
                            <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-indigo-400 font-bold">12</span>
                            <span class="text-white font-black tracking-widest">PPO</span>
                        </div>
                        <div class="absolute -right-28 top-4 text-[10px] font-bold text-slate-500 uppercase">Physical address</div>
                    </div>
                </div>
            </div>

            <!-- CORE THEORY NOTES -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
                    <h5 class="text-indigo-400 font-black text-xs uppercase mb-3">Multi-Level Efficiency</h5>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        If a PTE in the top-level table (L1) is <strong>null</strong>, the hardware knows that the entire 512GB region it represents is unmapped. It doesn't even bother creating the L2, L3, or L4 tables for that region. 
                        <br><br>
                        This is how modern systems support massive 64-bit addresses without using terabytes of RAM just for the page tables themselves.
                    </p>
                </div>
                <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h5 class="text-gray-400 font-black text-xs uppercase mb-3">Hardware Resident Sets</h5>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        Only the <strong>L1 Global Directory</strong> is guaranteed to be in physical RAM. Because L2-L4 tables are just 4KB pages themselves, the OS can <strong>page them out to disk</strong> if memory is tight, only loading them when a translation actually hits that region.
                    </p>
                </div>
            </div>
        </div>
    `
},
        'ml-math': {
            title: 'Calculation: Hierarchical Fan-out',
            html: `
                <div class="space-y-6">
                    <div class="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl">
                        <h4 class="text-red-400 font-black text-xs uppercase mb-3 underline underline-offset-4 decoration-red-500/30">The $2\\text{MB} / 4\\text{KB}$ Observation</h4>
                        <p class="text-xs text-gray-300 leading-relaxed">
                            Looking at the <strong>L3 Middle Directory</strong> to <strong>L4 Page Table</strong> relationship:
                        </p>
                        <div class="latex-output text-center">
    $\\frac{2 \\text{ MB (L3 Region)}}{4 \\text{ KB (L4 Page Size)}} = 512 \\text{ Entries}$
</div>
                        <p class="text-[10px] text-gray-400 italic mt-3">
                            <strong>Handwritten Slide Note:</strong> "If all PTEs at L4 full!" – This signifies that one entry in L3 manages a table that covers exactly 2MB of memory.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <span class="text-indigo-400 font-bold text-[10px] uppercase">Pointer Bit Width</span>
                            <p class="text-[11px] text-gray-400 mt-2">Each level in the i7 uses <strong>9 bits</strong> ($2^9 = 512$ entries). Since each entry is 8 bytes, each table fits exactly into one 4KB page ($512 \times 8 = 4096$).</p>
                        </div>
                        <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <span class="text-emerald-400 font-bold text-[10px] uppercase">Memory Reach</span>
                            <p class="text-[11px] text-gray-400 mt-2">48-bit Virtual Address Split: 9+9+9+9+12. This allows the i7 to address up to 256 Terabytes of virtual space with only a small physical RAM overhead.</p>
                        </div>
                    </div>
                </div>
            `
        },

        'vm-5level': {
    title: 'Intel 5-Level Page Tables (High Fidelity)',
    html: `
        <div class="space-y-12">
            <!-- SCHEMATIC ENGINE CONTAINER -->
            <div class="glass p-10 rounded-3xl border border-white/10 bg-slate-950/90 relative overflow-x-auto">
                <h4 class="text-center text-[11px] font-black text-white uppercase tracking-[0.5em] mb-12">Intel 64 (57-bit) Address Translation Schematic</h4>
                
                <!-- Fixed Width Schematic Area (1100px) -->
                <div class="relative w-[1100px] h-[650px] mx-auto font-mono">
                    
                    <!-- 1. VIRTUAL ADDRESS BAR (COLOR-CODED) -->
                    <div class="absolute top-0 left-[180px] flex border-2 border-slate-700 rounded-sm bg-black/60 shadow-2xl text-[10px] text-center overflow-hidden">
                        <div class="w-20 p-2 bg-slate-900 text-slate-500 font-bold border-r border-slate-700">Reserved</div>
                        <div class="w-20 p-2 bg-red-600/40 border-r border-slate-700 text-white font-black">5</div>
                        <div class="w-20 p-2 bg-indigo-600/40 border-r border-slate-700 text-white font-black">4</div>
                        <div class="w-20 p-2 bg-emerald-600/40 border-r border-slate-700 text-white font-black">3</div>
                        <div class="w-20 p-2 bg-yellow-500/40 border-r border-slate-700 text-black font-black">2</div>
                        <div class="w-20 p-2 bg-pink-600/40 border-r border-slate-700 text-white font-black">1</div>
                        <div class="w-32 p-2 bg-white text-black font-black">Low (Offset)</div>
                        <div class="absolute -right-28 top-4 text-[11px] font-black text-white uppercase italic">Virtual Address</div>
                    </div>

                    <!-- 2. THE DIRECTORY HIERARCHY (STAIRCASE TABLES) -->
                    <!-- Level 5 (Red) -->
                    <div class="absolute left-[180px] top-[140px] w-20 flex flex-col items-center gap-2">
                        <div class="w-full h-44 border-2 border-red-500/50 bg-black/40 rounded flex flex-col items-center relative shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <div class="absolute top-10 w-full h-5 bg-red-500/40 border-y border-red-400/50 flex items-center justify-center text-[8px] text-white">L5 PTE</div>
                            <div class="w-full h-[1px] bg-white/5 mt-2"></div><div class="w-full h-[1px] bg-white/5 mt-4"></div>
                        </div>
                        <span class="text-[9px] text-white font-black">128 PB</span>
                    </div>

                    <!-- Level 4 (Indigo) -->
                    <div class="absolute left-[330px] top-[180px] w-20 flex flex-col items-center gap-2">
                        <div class="w-full h-44 border-2 border-indigo-500/50 bg-black/40 rounded flex flex-col items-center relative shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <div class="absolute top-10 w-full h-5 bg-indigo-500/40 border-y border-indigo-400/50 flex items-center justify-center text-[8px] text-white">L4 PTE</div>
                            <div class="w-full h-[1px] bg-white/5 mt-2"></div><div class="w-full h-[1px] bg-white/5 mt-4"></div>
                        </div>
                        <span class="text-[9px] text-white font-black">256 TB</span>
                    </div>

                    <!-- Level 3 (Green) -->
                    <div class="absolute left-[480px] top-[220px] w-20 flex flex-col items-center gap-2">
                        <div class="w-full h-44 border-2 border-emerald-500/50 bg-black/40 rounded flex flex-col items-center relative shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <div class="absolute top-10 w-full h-5 bg-emerald-500/40 border-y border-emerald-400/50 flex items-center justify-center text-[8px] text-white">L3 PTE</div>
                            <div class="w-full h-[1px] bg-white/5 mt-2"></div><div class="w-full h-[1px] bg-white/5 mt-4"></div>
                        </div>
                        <span class="text-[9px] text-white font-black">512 GB</span>
                    </div>

                    <!-- Level 2 (Yellow) -->
                    <div class="absolute left-[630px] top-[260px] w-20 flex flex-col items-center gap-2">
                        <div class="w-full h-44 border-2 border-yellow-500/50 bg-black/40 rounded flex flex-col items-center relative shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                            <div class="absolute top-10 w-full h-5 bg-yellow-500/40 border-y border-yellow-400/50 flex items-center justify-center text-[8px] text-black font-black">L2 PTE</div>
                            <div class="w-full h-[1px] bg-white/5 mt-2"></div><div class="w-full h-[1px] bg-white/5 mt-4"></div>
                        </div>
                        <span class="text-[9px] text-white font-black">1 GB</span>
                    </div>

                    <!-- Level 1 (Pink) -->
                    <div class="absolute left-[780px] top-[300px] w-20 flex flex-col items-center gap-2">
                        <div class="w-full h-44 border-2 border-pink-500/50 bg-black/40 rounded flex flex-col items-center relative shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                            <div class="absolute top-10 w-full h-5 bg-pink-500/40 border-y border-pink-400/50 flex items-center justify-center text-[8px] text-white">L1 PTE</div>
                            <div class="w-full h-[1px] bg-white/5 mt-2"></div><div class="w-full h-[1px] bg-white/5 mt-4"></div>
                        </div>
                        <span class="text-[8px] text-white/60 text-center font-bold">512 entries<br>2 MB</span>
                    </div>

                    <!-- 3. SVG WIRING (PIXEL-PERFECT STAIRCASE) -->
                    <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1100 650">
                        <defs>
                            <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                                <circle cx="3" cy="3" r="2" fill="white" />
                            </marker>
                            <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <path d="M0,0 L10,3.5 L0,7 Z" fill="#94a3b8" />
                            </marker>
                        </defs>

                        <!-- CR3 Path -->
                        <path d="M 50 160 L 175 160" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />
                        <text x="50" y="150" fill="white" font-weight="black" font-size="14">CR3</text>

                        <!-- INDEXING LINES FROM VA BAR (Verticals) -->
                        <path d="M 230 45 L 230 145" stroke="#ef4444" stroke-width="1.5" opacity="0.6" marker-end="url(#arrow)" /> <!-- L5 -->
                        <path d="M 330 45 L 330 185" stroke="#6366f1" stroke-width="1.5" opacity="0.6" marker-end="url(#arrow)" /> <!-- L4 -->
                        <path d="M 430 45 L 430 225" stroke="#10b981" stroke-width="1.5" opacity="0.6" marker-end="url(#arrow)" /> <!-- L3 -->
                        <path d="M 530 45 L 530 265" stroke="#eab308" stroke-width="1.5" opacity="0.6" marker-end="url(#arrow)" /> <!-- L2 -->
                        <path d="M 630 45 L 630 305" stroke="#ec4899" stroke-width="1.5" opacity="0.6" marker-end="url(#arrow)" /> <!-- L1 -->

                        <!-- POINTERS BETWEEN LEVELS (Horizontal Stairs) -->
                        <path d="M 260 160 L 325 160" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)" /> <!-- L5 -> L4 -->
                        <path d="M 410 200 L 475 200" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)" /> <!-- L4 -> L3 -->
                        <path d="M 560 240 L 625 240" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)" /> <!-- L3 -> L2 -->
                        <path d="M 710 280 L 775 280" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)" /> <!-- L2 -> L1 -->

                        <!-- OFFSET BYPASS (Far Right Long Line) -->
                        <path d="M 750 45 L 750 560 L 850 560" stroke="white" stroke-width="1.5" fill="none" opacity="0.4" marker-end="url(#arrow)" />

                        <!-- RESULT PATH -->
                        <path d="M 860 320 L 900 320 L 900 480 L 800 480" stroke="#94a3b8" stroke-width="2" fill="none" marker-end="url(#arrow)" />
                        <text x="910" y="400" fill="#94a3b8" font-size="14" font-weight="black">Add</text>
                    </svg>

                    <!-- 3. THE PHYSICAL MEMORY TARGET (Slide Result) -->
                    <div class="absolute bottom-10 left-[450px]">
                        <div class="w-[350px] h-40 border-4 border-slate-700 bg-white p-6 relative shadow-2xl">
                            <div class="text-black space-y-4">
                                <h5 class="text-xs font-black border-b border-black/20 pb-2">Page of physical memory</h5>
                                <p class="text-xl font-bold">4 Kilobytes</p>
                            </div>
                            <!-- Result Frame -->
                            <div class="absolute top-4 right-6 border-4 border-black p-3 text-4xl font-black text-black">42</div>
                            <!-- "Hello World" label -->
                            <div class="absolute bottom-4 right-6 border-2 border-black/10 px-3 py-1 bg-black/5 text-black font-serif italic text-xs">
                                Hello World
                            </div>
                        </div>
                    </div>

                    <!-- 4. RED WARNING TEXT (Slide 21 Detail) -->
                    <div class="absolute left-0 bottom-40 w-48 space-y-2">
                        <div class="text-red-500 animate-pulse">
                            <span class="text-3xl font-black">➡</span>
                        </div>
                        <p class="text-[11px] font-black text-red-500 leading-tight">
                            We would need <br>
                            <span class="text-lg underline">128PB</span> of memory <br>
                            to store this page-table <br>
                            if first 4 layers full!
                        </p>
                    </div>
                </div>
            </div>

            <!-- COMPARATIVE ANALYSIS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl relative">
                    <div class="absolute -top-3 -left-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-red-500/50">!</div>
                    <h5 class="text-red-400 font-black text-xs uppercase mb-3 underline decoration-red-500/30 underline-offset-8">The Massive Scaling Problem</h5>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        With 57-bit addressing, the potential address space is so vast ($128\text{ Petabytes}$) that a flat table would be larger than most modern supercomputers' entire RAM capacity.
                    </p>
                </div>
                <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h5 class="text-gray-400 font-black text-xs uppercase mb-3">Processor Implementation</h5>
                    <p class="text-xs text-slate-300 leading-relaxed mb-4">
                        Modern Intel Core and Xeon processors implement this 5-level structure to ensure memory protection across massive virtualized workloads. 
                    </p>
                    <div class="p-3 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-accent">
                        Virtual Bits: (5 levels × 9 index bits) + 12 offset bits = 57 bits.
                    </div>
                </div>
            </div>
        </div>
    `
},
        '5level-math': {
            title: 'Memory Reach & The 128 PB Warning',
            html: `
                <div class="space-y-6">
                    <!-- SLIDE 21 WARNING BOX -->
                    <div class="bg-red-600 border-4 border-red-400 p-8 rounded-3xl relative overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.3)]">
                        <div class="relative z-10">
                            <h4 class="text-white font-black text-2xl uppercase tracking-tighter mb-4">Memory Overhead Warning</h4>
                            <p class="text-red-100 text-lg leading-snug font-bold">
                                "We would need <span class="bg-white text-red-600 px-2 rounded">128 PB</span> of memory just to store this page-table if the first 4 layers were full!"
                            </p>
                            <p class="text-red-200 text-xs mt-4 italic opacity-80">
                                This highlights why "Sparse Addressing" is critical. Modern OSs only allocate the sub-tables that are actually being used.
                            </p>
                        </div>
                        <div class="absolute -right-10 -bottom-10 text-9xl text-red-800/20 font-black rotate-12">57-BIT</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                            <span class="text-gray-500 text-[10px] uppercase font-black">Level 1 Reach</span>
                            <div class="text-xl font-mono text-white mt-1">2 MB</div>
                            <p class="text-[9px] text-gray-500 mt-1">512 entries per table</p>
                        </div>
                        <div class="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                            <span class="text-gray-500 text-[10px] uppercase font-black">Level 2 Reach</span>
                            <div class="text-xl font-mono text-white mt-1">1 GB</div>
                        </div>
                        <div class="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                            <span class="text-gray-500 text-[10px] uppercase font-black">Full Addressable</span>
                            <div class="text-xl font-mono text-accent mt-1">128 PB</div>
                            <p class="text-[9px] text-accent/60 mt-1">$2^{57}$ Bytes</p>
                        </div>
                    </div>

                    <div class="latex-output">
                        $\\text{Virtual Bits} = (5 \\text{ levels} \\times 9 \\text{ index bits}) + 12 \\text{ offset bits} = 57 \\text{ bits}$
                    </div>
                </div>
            `
        }
    }
    
}