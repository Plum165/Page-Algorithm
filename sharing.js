export const sharingContent = {
id: 'vm-sharing-protection',
    title: 'Paging: Protection & Memory Sharing',
    subtopics: [
        { id: 'paging-chunks', title: '1. Fixed Chunks & Page Size' },
        { id: 'sharing-logic', title: '2. Memory Sharing Mechanics' },
        { id: 'protection-bits', title: '3. Protection & Permissions' },
        { id: 'vm-protection-matrix', title: '4. Virtual Memory Protection Matrix' },
        { id: 'layout-logical', title: '5. Logical Memory Layout' },
        { id: 'layout-mapping', title: '6. Sparse Mapping Engine' },
        { id: 'layout-growth', title: '7. Dynamic Stack Growth' }
    ],
    content: {
        'paging-chunks': {
            title: 'Pages: Chunks of Physical Memory',
            html: `
                <div class="space-y-6">
                    <section class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
                        <h4 class="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest">Fixed Sized Chunks</h4>
                        <p class="text-sm text-gray-300 leading-relaxed mb-4">
                            Unlike segments, <strong>Pages</strong> divide physical memory into fixed-sized blocks. This design choice is a trade-off between management overhead and memory waste.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <span class="text-accent font-bold text-xs">Standard Page Sizes</span>
                                <p class="text-[11px] text-gray-400 mt-2">Range: 512 – 8192 bytes.<br><strong class="text-white">4096 bytes (4KB)</strong> is the industry typical.</p>
                            </div>
                            <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <span class="text-red-400 font-bold text-xs">The Size Problem</span>
                                <p class="text-[11px] text-gray-400 mt-2">Pages should not be too big. Large pages lead to high <strong>Internal Fragmentation</strong> (wasted space inside the last page of a process).</p>
                            </div>
                        </div>
                    </section>
                    <div class="p-4 bg-black/30 border border-white/5 rounded-xl font-mono text-[11px] text-gray-400">
                        <span class="text-indigo-300">Dynamic Segments:</span> Conceptually, a segment in modern OS is just a "set of multiple pages" grouped logically.
                    </div>

                    <!-- 1. VIRTUAL ADDRESS DECONSTRUCTION -->
            <div class="flex flex-col items-center gap-4">
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.2em]">3-Part Hardware Address</span>
                <div class="flex border-2 border-white/20 rounded-xl overflow-hidden font-mono text-xs shadow-2xl bg-black/40">
                    <div class="p-4 bg-orange-500/30 border-r border-white/10 text-center min-w-[120px]">
                        <span class="block text-[9px] text-orange-200 mb-1">LOGICAL UNIT</span>
                        <span class="text-white font-black">Segment #</span>
                    </div>
                    <div class="p-4 bg-orange-600/30 border-r border-white/10 text-center min-w-[120px]">
                        <span class="block text-[9px] text-orange-100 mb-1">INDEX UNIT</span>
                        <span class="text-white font-black">Page #</span>
                    </div>
                    <div class="p-4 bg-cyan-500/30 text-center min-w-[120px]">
                        <span class="block text-[9px] text-cyan-100 mb-1">RELATIVE UNIT</span>
                        <span class="text-white font-black">Offset</span>
                    </div>
                </div>
            </div>

            <!-- 2. MULTI-PROCESS INTERACTION ENGINE (SVG) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/80 relative overflow-hidden">
                <h4 class="text-center text-[11px] font-black text-white uppercase tracking-[0.4em] mb-12">The Shared Segment Mechanism</h4>
                
                <div class="relative h-[450px] w-full">
                    <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 450">
                        <defs>
                            <marker id="arr-logic" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                                <path d="M0,0 L8,4 L0,8 Z" fill="#f97316" />
                            </marker>
                        </defs>

                        <!-- PROCESS A: SEGMENT TABLE (GREEN) -->
                        <g transform="translate(50, 20)">
                            <text x="70" y="-15" fill="#10b981" font-size="11" font-weight="black" text-anchor="middle">PROCESS A SEG. TABLE</text>
                            <rect width="140" height="180" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" stroke-width="2" rx="4" />
                            <!-- Active Row -->
                            <rect y="60" width="140" height="30" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" stroke-width="1" />
                            <text x="70" y="80" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">Base2 | Limit2 | V</text>
                            <!-- Other Rows -->
                            <g font-size="8" fill="#4ade80" opacity="0.5">
                                <text x="10" y="25">Base0 | Limit0 | V</text>
                                <text x="10" y="50">Base1 | Limit1 | V</text>
                                <text x="10" y="110">Base3 | Limit3 | N</text>
                            </g>
                        </g>

                        <!-- PROCESS B: SEGMENT TABLE (YELLOW) -->
                        <g transform="translate(50, 240)">
                            <text x="70" y="-15" fill="#facc15" font-size="11" font-weight="black" text-anchor="middle">PROCESS B SEG. TABLE</text>
                            <rect width="140" height="180" fill="rgba(250, 204, 21, 0.05)" stroke="#facc15" stroke-width="2" rx="4" />
                            <!-- Blocked Row -->
                            <rect y="60" width="140" height="30" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="1" />
                            <text x="70" y="80" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">Base2 | Limit2 | N</text>
                        </g>

                        <!-- LOGIC GATE: THE LIMIT CHECK -->
                        <g transform="translate(250, 100)">
                            <circle r="30" fill="rgba(255,255,255,0.05)" stroke="white" stroke-width="1" stroke-dasharray="4 2" />
                            <text y="-40" fill="#94a3b8" font-size="9" text-anchor="middle" font-style="italic">Handwritten Detail:</text>
                            <text y="-25" fill="#fff" font-size="10" text-anchor="middle">Limit > Page Range?</text>
                            <path d="M -20 0 L 20 0 M 0 -20 L 0 20" stroke="white" opacity="0.3" />
                        </g>

                        <!-- THE SHARED PAGE TABLE (CYAN) -->
                        <g transform="translate(450, 110)">
                            <text x="80" y="-20" fill="#22d3ee" font-size="12" font-weight="black" text-anchor="middle">SHARED PAGE TABLE</text>
                            <rect width="160" height="200" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" stroke-width="3" rx="8" />
                            <g font-size="10" fill="#fff" font-family="monospace">
                                <text x="20" y="30">page #0 | V, R</text>
                                <text x="20" y="60">page #1 | V, R</text>
                                <rect x="5" y="75" width="150" height="25" fill="rgba(249, 115, 22, 0.3)" rx="4" />
                                <text x="20" y="92" font-weight="black">page #2 | V, R, W</text>
                                <text x="20" y="120">page #3 | V, R, W</text>
                                <text x="20" y="150" fill="#ef4444">page #4 | N</text>
                            </g>
                        </g>

                        <!-- CONNECTION PATHWAYS -->
                        <path d="M 190 80 L 440 130" fill="none" stroke="#06b6d4" stroke-width="3" marker-end="url(#arr-logic)" />
                        <path d="M 190 300 L 440 280" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8 4" opacity="0.5" />
                        
                        <!-- FINAL TARGET -->
                        <path d="M 610 190 L 720 190" fill="none" stroke="#f97316" stroke-width="4" marker-end="url(#arr-logic)" />
                        <text x="750" y="180" fill="#94a3b8" font-size="10" text-anchor="middle">PHYSICAL</text>
                        <text x="750" y="200" fill="#fff" font-size="14" font-weight="black" text-anchor="middle">RAM</text>
                    </svg>
                </div>
            </div>

            <!-- 3. DEEP LOGIC ANALYSIS -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- THE ISOLATION LAYER -->
                <div class="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
                    <h5 class="text-emerald-400 font-black text-xs uppercase mb-3 underline decoration-emerald-500/30 underline-offset-8">1. Per-Process Isolation</h5>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        Even though they share the same physical hardware, <strong>Process A</strong> and <strong>Process B</strong> have unique Segment Tables. 
                        <br><br>
                        Look at <strong class="text-white">Segment 2</strong>: Process A has it marked <strong>Valid (V)</strong>, but Process B has it marked <strong>Invalid (N)</strong>. Process B is physically blinded to this entire memory region.
                    </p>
                </div>

                <!-- THE GUARD LAYER -->
                <div class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
                    <h5 class="text-indigo-400 font-black text-xs uppercase mb-3 underline decoration-indigo-500/30 underline-offset-8">2. The Limit Guard</h5>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        Based on the handwritten note <strong>"limit > p.o range"</strong>, the hardware performs a bounds check before it even looks at the page table.
                        <br><br>
                        It ensures the <strong>Virtual Page #</strong> is not higher than what the segment allows. This prevents a process from indexing past the end of its logical segment.
                    </p>
                </div>

                <!-- THE SHARING LAYER -->
                <div class="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
                    <h5 class="text-orange-400 font-black text-xs uppercase mb-3 underline decoration-orange-500/30 underline-offset-8">3. Indirection Sharing</h5>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        This is the "Hybrid" power: Instead of pointing to RAM, the segment points to a <strong>Page Table</strong>.
                        <br><br>
                        By giving Process A and B the same <strong>Base2</strong> pointer, they share a <strong>Shared Segment</strong>. This allows lightning-fast inter-process communication or shared libraries while maintaining individual permissions.
                    </p>
                </div>
            </div>

            <!-- CRITICAL SUMMARY -->
            <div class="p-6 bg-white/5 border border-white/10 rounded-2xl italic text-center">
                <p class="text-sm text-gray-400">
                    "This architecture solves the <strong>Sparse Address Space</strong> problem. By using segments to define large logical blocks and pages to manage physical storage, the OS doesn't have to allocate RAM for the 'empty gaps' between a process's heap and stack."
                </p>
            </div>

            <!-- DETAILED TECHNICAL BREAKDOWN -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- SEGMENTATION LAYER -->
                <div class="step-card">
                    <span class="step-title">Level 1: The Segment Lookup</span>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        The <strong>Virtual Segment #</strong> indexes into a Segment Table. In this model, the "Base" isn't a RAM address—it is a <strong>pointer to a Page Table</strong>. 
                        <br><br>
                        This allows the OS to share an entire "logical segment" (like a shared library) between processes by simply pointing their Segment Table entries to the same Page Table.
                    </p>
                </div>

                <!-- PAGING LAYER -->
                <div class="step-card border-cyan-500">
                    <span class="step-title text-cyan-400">Level 2: The Page Lookup</span>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        The <strong>Virtual Page #</strong> then indexes into the specific Page Table found in Level 1. This retrieves the <strong>Physical Frame Number</strong>. 
                        <br><br>
                        By combining these, we get the best of both worlds: Logical protection of segments with the physical efficiency (no external fragmentation) of paging.
                    </p>
                </div>
            </div>

            <!-- THE "SHARED SEGMENT" INSIGHT (From your Image) -->
            <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
                <h5 class="text-accent font-black text-[10px] uppercase mb-4 tracking-widest">Case Study: Shared Segments (Process A & B)</h5>
                <div class="flex flex-col md:flex-row gap-6 items-center">
                    <div class="flex-1 text-xs text-gray-400 space-y-2">
                        <p>• <strong class="text-white">Process A:</strong> Segment 2 points to the Page Table.</p>
                        <p>• <strong class="text-white">Process B:</strong> Segment 2 is marked <span class="text-red-400">"N" (Not Valid)</span>.</p>
                        <p>This allows <span class="italic">Process A</span> to use the shared memory while <span class="italic">Process B</span> is physically blocked from accessing it, even if they share the same hardware registers.</p>
                    </div>
                    <div class="p-4 bg-black/40 rounded-xl border border-white/10 font-mono text-[10px]">
                        <div class="text-emerald-400 mb-1">Protection Logic:</div>
                        <div class="text-gray-500">If (Segment_Entry.Valid == N)</div>
                        <div class="text-red-400 pl-4">Raise Segmentation Fault;</div>
                    </div>
                </div>
            </div>

            <!-- PAGE SIZE TRADEOFFS -->
            <section class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h4 class="text-sm font-bold text-gray-300 mb-4">The Trade-off Matrix</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <span class="text-[10px] font-bold text-red-400">LARGE PAGES</span>
                        <p class="text-[10px] text-gray-400 mt-1">Smaller Page Tables (less overhead), but massive <strong>Internal Fragmentation</strong>.</p>
                    </div>
                    <div class="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <span class="text-[10px] font-bold text-emerald-400">SMALL PAGES</span>
                        <p class="text-[10px] text-gray-400 mt-1">Efficient RAM usage, but <strong>Huge Page Tables</strong> that might not fit in memory themselves.</p>
                    </div>
                </div>
            </section>
                </div>
            `
        },

        'sharing-logic': {
            title: 'Memory Sharing Mechanics',
            html: `
                <div class="space-y-8">
                    <!-- SHARING DIAGRAM ENGINE -->
                    <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/60 relative overflow-hidden">
                        <h4 class="text-center text-[10px] font-black text-white uppercase tracking-[0.3em] mb-10">Shared Physical Page Logic</h4>
                        
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10">
                            
                            <!-- PROCESS A TABLE -->
                            <div class="flex flex-col items-center gap-2">
                                <div class="text-[9px] font-bold text-indigo-400 uppercase">Process A Table</div>
                                <div class="w-32 h-40 border border-white/20 bg-white/5 rounded overflow-hidden flex flex-col font-mono text-[9px]">
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-40"><span>p#0</span><span>V,R</span></div>
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-40"><span>p#1</span><span>V,R</span></div>
                                    <div class="h-1/5 bg-indigo-500/40 border-b border-white/10 flex justify-around items-center font-bold"><span>p#2</span><span>V,R,W</span></div>
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-40"><span>p#3</span><span>V,R,W</span></div>
                                    <div class="h-1/5 flex justify-around items-center opacity-40"><span>p#4</span><span>N</span></div>
                                </div>
                            </div>

                            <!-- MAPPING BUS (SVG) -->
                            <div class="flex-1 relative h-64 min-w-[200px]">
                                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                                    <defs>
                                        <marker id="arr-sh" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                                            <path d="M0,0 L8,4 L0,8 Z" fill="#f97316" />
                                        </marker>
                                    </defs>
                                    <!-- Arrow from A to Shared -->
                                    <path d="M 10 80 L 190 100" stroke="#f97316" stroke-width="2" marker-end="url(#arr-sh)" />
                                    <!-- Arrow from B to Shared -->
                                    <path d="M 10 160 L 190 110" stroke="#f97316" stroke-width="2" marker-end="url(#arr-sh)" />
                                </svg>
                            </div>

                            <!-- SHARED PHYSICAL PAGE -->
                            <div class="flex flex-col items-center gap-4">
                                <div class="w-32 h-48 bg-orange-500/20 border-4 border-orange-500 rounded-xl flex items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                                    <div>
                                        <h5 class="text-xs font-black text-orange-400 uppercase">Shared Physical Page</h5>
                                        <p class="text-[9px] text-gray-400 mt-2">Appears in address space of BOTH Process A and B</p>
                                    </div>
                                </div>
                            </div>

                            <!-- PROCESS B TABLE (REVERSED) -->
                            <div class="flex-1 relative lg:hidden h-16"></div> <!-- Spacer for mobile -->
                            <div class="flex flex-col items-center gap-2">
                                <div class="text-[9px] font-bold text-emerald-400 uppercase">Process B Table</div>
                                <div class="w-32 h-40 border border-white/20 bg-white/5 rounded overflow-hidden flex flex-col font-mono text-[9px]">
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-40"><span>p#0</span><span>V,R</span></div>
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-20"><span>p#1</span><span>N</span></div>
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-40"><span>p#2</span><span>V,R,W</span></div>
                                    <div class="h-1/5 border-b border-white/5 flex justify-around items-center opacity-20"><span>p#3</span><span>N</span></div>
                                    <div class="h-1/5 bg-emerald-500/40 flex justify-around items-center font-bold"><span>p#4</span><span>V,R</span></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
                        <h4 class="text-orange-400 font-black text-xs uppercase mb-3">The "How" of Sharing</h4>
                        <p class="text-xs text-gray-300 leading-relaxed">
                            Memory sharing is accomplished by simply having entries in different page tables point to the <strong>same physical page address</strong>. 
                            <br><br>
                            In the example above, Process A's <strong>Virtual Page #2</strong> and Process B's <strong>Virtual Page #4</strong> both translate to the same physical location.
                        </p>
                    </div>
                </div>
            `
        },
        'protection-bits': {
            title: 'Protection & Permissions Matrix',
            html: `
                <div class="space-y-6">
                    <p class="text-sm text-gray-300">Paging enables per-page protection. Even if memory is shared, the access rights are independent for each process.</p>
                    
                    <!-- PERMISSIONS TABLE (Slide 37) -->
                    <div class="overflow-x-auto glass rounded-xl border border-white/10">
                        <table class="w-full text-[11px] font-mono">
                            <thead class="bg-white/5 text-accent">
                                <tr>
                                    <th class="p-3 text-left">Process Map</th>
                                    <th class="p-3 text-center">SUP (Privileged)</th>
                                    <th class="p-3 text-center">READ</th>
                                    <th class="p-3 text-center">WRITE</th>
                                    <th class="p-3 text-right">Phys. Target</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                <tr>
                                    <td class="p-3 font-bold text-gray-300">Proc i : VP 0</td>
                                    <td class="p-3 text-center text-red-400">NO</td>
                                    <td class="p-3 text-center text-emerald-400">YES</td>
                                    <td class="p-3 text-center text-red-400">NO</td>
                                    <td class="p-3 text-right text-indigo-400">PP 6</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-bold text-gray-300">Proc i : VP 2</td>
                                    <td class="p-3 text-center text-emerald-400">YES</td>
                                    <td class="p-3 text-center text-emerald-400">YES</td>
                                    <td class="p-3 text-center text-emerald-400">YES</td>
                                    <td class="p-3 text-right text-indigo-400">PP 2</td>
                                </tr>
                                <tr class="bg-orange-500/10">
                                    <td class="p-3 font-bold text-orange-300">Proc j : VP 1</td>
                                    <td class="p-3 text-center text-emerald-400">YES</td>
                                    <td class="p-3 text-center text-emerald-400">YES</td>
                                    <td class="p-3 text-center text-red-400">NO</td>
                                    <td class="p-3 text-right text-orange-400">PP 6 (Shared)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="step-card border-accent">
                        <span class="step-title">Security Insight</span>
                        <p class="text-xs text-gray-300">
                            Note <strong>PP 6</strong> in the table. Process $i$ can read it but not write to it. Process $j$ can read it and requires Supervisor (SUP) privileges. 
                            Sharing does not mean identical access; the OS uses the individual PTEs to enforce specific security policies for each user.
                        </p>
                    </div>
                </div>
            `
        },
        'vm-protection-matrix': {
    title: 'Protection Matrix & Access Control',
    html: `
        <div class="space-y-10">
            <!-- 1. HIGH-FIDELITY PROTECTION ENGINE (SVG + HTML) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/80 relative overflow-hidden">
                <h4 class="text-center text-[11px] font-black text-white uppercase tracking-[0.4em] mb-12">Hardware Access Control Matrix</h4>
                
                <div class="flex flex-col xl:flex-row items-center justify-between gap-8 relative z-10 min-h-[500px]">
                    
                    <!-- LEFT COLUMN: PROCESS TABLES -->
                    <div class="flex flex-col gap-16 w-full lg:w-auto">
                        
                        <!-- PROCESS I: TABLE -->
                        <div class="space-y-2 group">
                            <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-2">Process i (User)</span>
                            <div class="border-2 border-indigo-500/30 rounded-xl overflow-hidden bg-black/40 shadow-xl">
                                <table class="w-full text-center font-mono text-[9px]">
                                    <thead class="bg-indigo-500/10 text-gray-400">
                                        <tr class="border-b border-white/10">
                                            <th class="p-2 border-r border-white/10">VP</th>
                                            <th class="p-2 border-r border-white/10">SUP</th>
                                            <th class="p-2 border-r border-white/10">READ</th>
                                            <th class="p-2 border-r border-white/10">WRITE</th>
                                            <th class="p-2">ADDR</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-white">
                                        <tr class="border-b border-white/5 bg-red-500/5">
                                            <td class="p-2 border-r border-white/10 text-indigo-300">0</td>
                                            <td class="p-2 border-r border-white/10 text-red-400">NO</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-red-400">NO</td>
                                            <td class="p-2 font-bold text-accent">PP 6</td>
                                        </tr>
                                        <tr class="border-b border-white/5">
                                            <td class="p-2 border-r border-white/10 text-indigo-300">1</td>
                                            <td class="p-2 border-r border-white/10 text-red-400">NO</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 font-bold">PP 4</td>
                                        </tr>
                                        <tr class="bg-indigo-500/20">
                                            <td class="p-2 border-r border-white/10 text-indigo-300">2</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 font-bold">PP 2</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- PROCESS J: TABLE -->
                        <div class="space-y-2 group">
                            <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest pl-2">Process j (Kernel)</span>
                            <div class="border-2 border-emerald-500/30 rounded-xl overflow-hidden bg-black/40 shadow-xl">
                                <table class="w-full text-center font-mono text-[9px]">
                                    <thead class="bg-emerald-500/10 text-gray-400">
                                        <tr class="border-b border-white/10">
                                            <th class="p-2 border-r border-white/10">VP</th>
                                            <th class="p-2 border-r border-white/10">SUP</th>
                                            <th class="p-2 border-r border-white/10">READ</th>
                                            <th class="p-2 border-r border-white/10">WRITE</th>
                                            <th class="p-2">ADDR</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-white">
                                        <tr class="border-b border-white/5">
                                            <td class="p-2 border-r border-white/10 text-emerald-300">0</td>
                                            <td class="p-2 border-r border-white/10 text-red-400">NO</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 font-bold">PP 9</td>
                                        </tr>
                                        <tr class="border-b border-white/5 bg-red-500/5">
                                            <td class="p-2 border-r border-white/10 text-emerald-300 font-black">1</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-red-400">NO</td>
                                            <td class="p-2 font-bold text-accent">PP 6</td>
                                        </tr>
                                        <tr>
                                            <td class="p-2 border-r border-white/10 text-emerald-300">2</td>
                                            <td class="p-2 border-r border-white/10 text-red-400">NO</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 border-r border-white/10 text-emerald-400">YES</td>
                                            <td class="p-2 font-bold">PP 11</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- CENTER: SVG MAPPING WIRING -->
                    <div class="flex-1 relative h-[500px] min-w-[300px]">
                        <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 500">
                            <!-- DEFINITIONS -->
                            <defs>
                                <marker id="arrow-blk" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                                    <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
                                </marker>
                            </defs>

                            <!-- PROCESS i ARROWS -->
                            <g stroke="#3b82f6" stroke-width="1.5" opacity="0.6">
                                <line x1="10" y1="95" x2="280" y2="285" marker-end="url(#arrow-blk)" /> <!-- VP0 -> PP6 -->
                                <line x1="10" y1="120" x2="280" y2="215" marker-end="url(#arrow-blk)" /> <!-- VP1 -> PP4 -->
                                <line x1="10" y1="145" x2="280" y2="145" marker-end="url(#arrow-blk)" /> <!-- VP2 -> PP2 -->
                            </g>

                            <!-- PROCESS j ARROWS -->
                            <g stroke="#10b981" stroke-width="1.5" opacity="0.6">
                                <line x1="10" y1="365" x2="280" y2="355" marker-end="url(#arrow-blk)" /> <!-- VP0 -> PP9 -->
                                <line x1="10" y1="390" x2="280" y2="285" marker-end="url(#arrow-blk)" /> <!-- VP1 -> PP6 (SHARED) -->
                                <line x1="10" y1="415" x2="280" y2="425" marker-end="url(#arrow-blk)" /> <!-- VP2 -> PP11 -->
                            </g>
                        </svg>
                    </div>

                    <!-- RIGHT COLUMN: PHYSICAL ADDRESS SPACE -->
                    <div class="w-32 flex flex-col items-center">
                        <span class="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Physical RAM</span>
                        <div class="w-full h-[450px] border-2 border-white/10 rounded flex flex-col font-mono text-[9px] overflow-hidden">
                            <div class="flex-1 border-b border-white/5 opacity-20 bg-white/5"></div>
                            <div class="h-10 bg-indigo-500/40 border-b border-black flex items-center justify-center font-bold">PP 2</div>
                            <div class="h-6 border-b border-white/5 opacity-20"></div>
                            <div class="h-10 bg-indigo-500/40 border-b border-black flex items-center justify-center font-bold">PP 4</div>
                            <div class="h-6 border-b border-white/5 opacity-20"></div>
                            <!-- SHARED PAGE -->
                            <div class="h-10 bg-accent border-b border-black flex items-center justify-center font-black text-black">PP 6</div>
                            <div class="h-6 border-b border-white/5 opacity-20"></div>
                            <div class="h-6 bg-slate-800/50 border-b border-black flex items-center justify-center text-[7px]">PP 8</div>
                            <div class="h-10 bg-emerald-500/40 border-b border-black flex items-center justify-center font-bold">PP 9</div>
                            <div class="h-6 border-b border-white/5 opacity-20"></div>
                            <div class="h-10 bg-emerald-500/40 border-b border-black flex items-center justify-center font-bold">PP 11</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. THEORETICAL DEEP DIVE -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- SHARED PAGE ANALYSIS -->
                <div class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl relative">
                    <div class="absolute top-4 right-4 bg-accent/20 px-2 py-1 rounded text-[9px] font-black text-accent">SHARED ACCESS</div>
                    <h5 class="text-indigo-400 font-black text-xs uppercase mb-4 underline decoration-indigo-400/30 underline-offset-8">The PP 6 Case Study</h5>
                    <p class="text-xs text-gray-300 leading-relaxed mb-4">
                        Physical Page <strong>PP 6</strong> is mapped by both processes, but look at the protection bits:
                    </p>
                    <div class="space-y-2 font-mono text-[10px]">
                        <div class="flex justify-between p-2 bg-black/40 rounded border-l-2 border-indigo-400">
                            <span>Proc i : VP 0</span>
                            <span class="text-red-400">Read-Only (User)</span>
                        </div>
                        <div class="flex justify-between p-2 bg-black/40 rounded border-l-2 border-emerald-400">
                            <span>Proc j : VP 1</span>
                            <span class="text-emerald-400">Supervisor (Privileged)</span>
                        </div>
                    </div>
                    <p class="mt-4 text-[10px] text-gray-400 italic">
                        Result: Process $i$ can read common data, but only the kernel-level Process $j$ can manage/configure it.
                    </p>
                </div>

                <!-- ACL PRINCIPLES -->
                <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h5 class="text-gray-400 font-black text-xs uppercase mb-4 tracking-widest">Protection Principles</h5>
                    <ul class="space-y-4 text-xs text-gray-300">
                        <li class="flex items-start gap-3">
                            <span class="text-red-500">🚫</span>
                            <span><strong>No SUP (Supervisor):</strong> The hardware block prevents user-mode processes from executing kernel-level code, even if mapped.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="text-red-500">🚫</span>
                            <span><strong>No WRITE:</strong> Prevents processes from accidentally (or maliciously) overwriting shared libraries or read-only constants.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- KEY TAKEAWAY -->
            <div class="warn-box border-accent bg-accent/5">
                <span class="text-[10px] font-black uppercase text-accent">Architecture Summary:</span>
                <p class="text-xs text-gray-300 mt-1">
                    Protection is enforced <strong>during translation</strong>. Before the CPU sends the address to RAM, the MMU checks the <strong>YES/NO</strong> bits. Any violation triggers a <strong>Hardware Trap</strong> (Segmentation Fault) before the data is ever touched.
                </p>
            </div>
        </div>
    `
},
'layout-logical': {
            title: 'Standard Process Layout',
            html: `
                <div class="space-y-8">
                    <p class="text-sm text-gray-300">Modern OSs arrange process memory to allow for maximum flexibility and growth of dynamic structures.</p>
                    
                    <div class="flex flex-col md:flex-row gap-10 items-center justify-center">
                        <!-- THE MEMORY STACK VISUAL (Slide 39) -->
                        <div class="w-56 border-2 border-white/20 rounded-xl overflow-hidden bg-black/40 shadow-2xl flex flex-col font-mono text-[10px]">
                            <!-- Kernel -->
                            <div class="h-12 bg-blue-500/20 border-b border-white/30 flex items-center justify-center text-blue-300">
                                <span>0xc0000000 (Kernel)</span>
                            </div>
                            <!-- Stack -->
                            <div class="h-14 bg-pink-500/30 border-b border-white/10 flex flex-col items-center justify-center relative">
                                <span class="font-bold">STACK</span>
                                <span class="text-[14px] absolute -bottom-2">↓</span>
                            </div>
                            <!-- Sparse Gap -->
                            <div class="h-20 bg-white/5 border-b border-dashed border-white/10 flex items-center justify-center text-gray-600 italic">
                                Sparse (null) gap
                            </div>
                            <!-- mmap -->
                            <div class="h-12 bg-indigo-500/20 border-b border-white/10 flex items-center justify-center">
                                mmap (libraries)
                            </div>
                             <!-- Sparse Gap -->
                             <div class="h-10 bg-white/5 border-b border-dashed border-white/10"></div>
                            <!-- Heap -->
                            <div class="h-12 bg-emerald-500/30 border-b border-white/10 flex flex-col items-center justify-center relative">
                                <span class="text-[14px] absolute -top-2">↑</span>
                                <span class="font-bold">HEAP</span>
                            </div>
                            <!-- Text/Data -->
                            <div class="h-16 bg-orange-500/20 flex flex-col items-center justify-center text-center">
                                <span>Data / BSS</span>
                                <span class="font-bold">TEXT (CODE)</span>
                                <span class="text-[8px] opacity-50 mt-1">0x00000000</span>
                            </div>
                        </div>

                        <!-- LOGICAL RULES -->
                        <div class="flex-1 space-y-4">
                            <div class="step-card border-pink-500">
                                <span class="step-title text-pink-400">The Stack</span>
                                <p class="text-xs text-gray-300">Starts at the maximum logical address and <strong>grows downward</strong> toward lower addresses.</p>
                            </div>
                            <div class="step-card border-emerald-500">
                                <span class="step-title text-emerald-400">The Heap</span>
                                <p class="text-xs text-gray-300">Starts just above the program data and <strong>grows upward</strong> into the sparse space.</p>
                            </div>
                            <div class="warn-box border-indigo-400">
                                <strong>Sparse Memory:</strong> The space between stack and heap is "null." No physical RAM is allocated for this gap unless one of them grows into it.
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'layout-mapping': {
            title: 'The Sparse Mapping Engine',
            html: `
                <div class="space-y-8">
                    <!-- FULL MAPPING INTERFACE (Slide 40/41) -->
                    <div class="glass p-6 rounded-3xl border border-white/10 bg-slate-950/80 relative overflow-hidden">
                        <div class="grid grid-cols-3 gap-2 relative z-10 h-[450px]">
                            
                            <!-- 1. VIRTUAL VIEW -->
                            <div class="flex flex-col items-center gap-2">
                                <span class="text-[9px] font-black text-white/40 uppercase">Virtual View</span>
                                <div class="w-full h-full border-2 border-white/10 rounded-lg flex flex-col overflow-hidden font-mono text-[8px]">
                                    <div class="h-[10%] bg-yellow-500/40 border-b border-black p-1">1111 1001: stack</div>
                                    <div class="flex-1 bg-white/5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_15px]"></div>
                                    <div class="h-[15%] bg-emerald-500/40 border-y border-black p-1">1000 0001: heap</div>
                                    <div class="h-[15%] bg-orange-500/40 border-b border-black p-1">0100 0001: data</div>
                                    <div class="h-[15%] bg-cyan-500/40 p-1">0011 0001: code</div>
                                </div>
                            </div>

                            <!-- 2. PAGE TABLE (MIDDLE) -->
                            <div class="flex flex-col items-center gap-2 px-4">
                                <span class="text-[9px] font-black text-white/40 uppercase">Page Table</span>
                                <div class="w-full h-full border border-white/20 bg-black/40 rounded flex flex-col p-2 gap-4">
                                    <div class="flex justify-between items-center p-1 bg-yellow-500/20 rounded border border-yellow-500/50">
                                        <span class="text-[7px] text-yellow-200">11111</span>
                                        <span class="text-[7px] text-emerald-400">11111</span>
                                    </div>
                                    <div class="flex-1 border-y border-white/5"></div>
                                    <div class="flex justify-between items-center p-1 bg-emerald-500/20 rounded border border-emerald-500/50">
                                        <span class="text-[7px] text-yellow-200">10000</span>
                                        <span class="text-[7px] text-emerald-400">10000</span>
                                    </div>
                                    <div class="flex justify-between items-center p-1 bg-orange-500/20 rounded border border-orange-500/50">
                                        <span class="text-[7px] text-yellow-200">01000</span>
                                        <span class="text-[7px] text-emerald-400">01000</span>
                                    </div>
                                    <div class="flex justify-between items-center p-1 bg-cyan-500/20 rounded border border-cyan-500/50">
                                        <span class="text-[7px] text-yellow-200">00110</span>
                                        <span class="text-[7px] text-emerald-400">00110</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 3. PHYSICAL VIEW -->
                            <div class="flex flex-col items-center gap-2">
                                <span class="text-[9px] font-black text-white/40 uppercase">Physical RAM</span>
                                <div class="w-full h-full border-2 border-white/10 rounded-lg flex flex-col overflow-hidden font-mono text-[8px]">
                                    <div class="h-4 bg-slate-800 border-b border-black"></div>
                                    <div class="h-[10%] bg-yellow-500/40 border-b border-black flex items-center justify-center">stack</div>
                                    <div class="h-8 bg-white/5 border-b border-white/5"></div>
                                    <div class="h-[15%] bg-emerald-500/40 border-b border-black flex items-center justify-center">heap</div>
                                    <div class="h-[15%] bg-orange-500/40 border-b border-black flex items-center justify-center">data</div>
                                    <div class="h-[25%] bg-cyan-500/40 flex items-center justify-center font-bold">code</div>
                                </div>
                            </div>

                            <!-- SVG OVERLAY FOR MAPPING LINES -->
                            <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450">
                                <g stroke="white" stroke-width="0.5" opacity="0.3">
                                    <line x1="200" y1="45" x2="215" y2="45" />
                                    <line x1="385" y1="45" x2="400" y2="45" />
                                    
                                    <line x1="200" y1="400" x2="215" y2="400" />
                                    <line x1="385" y1="400" x2="400" y2="400" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div class="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                        <p class="text-xs text-gray-400">Each process has <strong>One (1) Page-Table</strong>. The virtual address is split into <span class="text-blue-400 font-bold">page #</span> and <span class="text-white font-bold">offset</span>.</p>
                    </div>
                </div>
            `
        },
        'layout-growth': {
            title: 'Case Study: Stack Growth Allocation',
            html: `
                <div class="space-y-8">
                    <!-- THE GROWTH ANIMATION VIEW (Slide 42/43) -->
                    <div class="glass p-8 rounded-3xl border border-pink-500/30 bg-pink-500/5 relative overflow-hidden">
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                            
                            <!-- VIRTUAL GROWTH -->
                            <div class="flex flex-col items-center gap-4">
                                <h5 class="text-[10px] font-black text-pink-400 uppercase underline">Step 1: Grow Stack</h5>
                                <div class="w-32 h-64 border-2 border-white/10 bg-black/40 rounded flex flex-col font-mono text-[9px]">
                                    <div class="h-[10%] bg-yellow-500/40 border-b border-black flex items-center justify-center">1111 1001</div>
                                    <div class="h-[10%] bg-yellow-500/80 border-b border-pink-500 flex items-center justify-center animate-pulse text-white font-black">1110 0000</div>
                                    <div class="flex-1 bg-white/5 flex items-center justify-center italic text-white/20">Empty</div>
                                </div>
                            </div>

                            <!-- THE OS DECISION -->
                            <div class="flex-1 text-center space-y-4 px-6">
                                <div class="p-4 bg-black/60 rounded-2xl border-2 border-white/10 shadow-xl">
                                    <h4 class="text-xs font-black text-white uppercase mb-2">OS Allocation Logic</h4>
                                    <p class="text-[11px] text-gray-400 leading-relaxed">
                                        "What happens if stack grows to 1110 0000? 
                                        <br>The OS must <span class="text-emerald-400 font-bold">allocate new pages where room exists</span> in Physical RAM!"
                                    </p>
                                </div>
                                <div class="text-2xl animate-pulse">➡</div>
                            </div>

                            <!-- PHYSICAL RAM (Interleaved) -->
                            <div class="flex flex-col items-center gap-4">
                                <h5 class="text-[10px] font-black text-emerald-400 uppercase underline">Step 2: Map to RAM</h5>
                                <div class="w-32 h-64 border-2 border-white/10 bg-black/40 rounded flex flex-col font-mono text-[9px]">
                                    <div class="h-[10%] bg-slate-800"></div>
                                    <div class="h-[10%] bg-yellow-500/40 border-b border-black flex items-center justify-center">stack old</div>
                                    <div class="h-[10%] bg-yellow-500/80 border-b border-pink-500 flex items-center justify-center text-white font-black animate-pulse">stack NEW</div>
                                    <div class="h-4 bg-slate-800"></div>
                                    <div class="h-[15%] bg-emerald-500/20 flex items-center justify-center opacity-40">heap</div>
                                    <div class="flex-1 bg-white/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
                            <h4 class="text-indigo-400 font-black text-xs uppercase mb-3">Hardware Limit Check</h4>
                            <p class="text-xs text-gray-300">
                                Based on the handwritten note: <strong>"Limit size of page tables."</strong> 
                                The OS checks the segment size before allowing the stack to grow further into the sparse region.
                            </p>
                        </div>
                        <div class="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                            <h4 class="text-emerald-400 font-black text-xs uppercase mb-3">Non-Contiguous Freedom</h4>
                            <p class="text-xs text-gray-300">
                                Notice that the "stack NEW" page in RAM was placed directly below "stack old." 
                                This is only possible because of <strong>Paging</strong>. Any free physical frame can represent any virtual page.
                            </p>
                        </div>
                    </div>
                </div>
            `
        }
    
    }
};