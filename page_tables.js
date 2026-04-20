export const pageTablesContent = {
    id: 'vm-page-tables',
    title: 'Page Tables (Per Process)',
    subtopics: [
        { id: 'vm-pt-logic', title: '1. Translation Logic' },
        { id: 'vm-pt-bits', title: '2. Bit-Level Breakdown' },
        { id: 'vm-ptbr', title: '3. Page Table Base Register (PTBR)' },
        { id: 'vm-pt-pte', title: '4. PTE Anatomy' },
        { id: 'vm-translation-deepdive', title: '5. Deep Dive: Address Translation' },
        { id: 'vm-math', title: '6. Mathematical Foundations' },
        { id: 'vm-addressing-logic', title: '7. Addressing Logic' }
    ],
    content: {
        'vm-pt-logic': {
            title: 'Virtual to Physical Logic Flow',
            html: `
                <div class="space-y-8">
                    
                     <!-- FULL TRANSLATION SCHEMATIC (Slide 14 Replica) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/60 relative overflow-hidden">
                
                <!-- Header Bit Info -->
                <div class="absolute top-4 right-8 text-red-500 font-black text-sm tracking-tighter">1 KB Pages</div>

                <!-- MAIN SVG SCHEMATIC -->
                <div class="relative h-[450px] w-full">
                    <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 450">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#94a3b8" />
                            </marker>
                        </defs>

                        <!-- VIRTUAL ADDRESS BOX -->
                        <g transform="translate(250, 40)">
                            <text x="-120" y="25" fill="#ef4444" font-weight="bold" font-size="14">Virtual address</text>
                            <rect x="0" y="0" width="240" height="40" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" stroke-width="2" />
                            <line x1="150" y1="0" x2="150" y2="40" stroke="#06b6d4" stroke-width="1" />
                            <text x="75" y="-10" fill="#fff" font-size="12" text-anchor="middle">22 bits</text>
                            <text x="195" y="-10" fill="#fff" font-size="12" text-anchor="middle">10 bits</text>
                            <text x="75" y="25" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Page number</text>
                            <text x="195" y="25" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Offset</text>
                            <text x="250" y="15" fill="#fff" font-size="14" font-weight="black">= 32</text>
                        </g>

                        <!-- PAGE TABLE BASE REGISTER -->
                        <g transform="translate(20, 150)">
                            <rect x="0" y="0" width="150" height="60" fill="rgba(167, 243, 208, 0.2)" stroke="#10b981" stroke-width="1" rx="4" />
                            <text x="75" y="25" fill="#a7f3d0" font-weight="bold" font-size="11" text-anchor="middle">Page Table</text>
                            <text x="75" y="45" fill="#a7f3d0" font-weight="bold" font-size="11" text-anchor="middle">Base Register</text>
                        </g>

                        <!-- THE PAGE TABLE -->
                        <g transform="translate(350, 180)">
                            <rect x="0" y="0" width="160" height="200" fill="white" fill-opacity="0.05" stroke="white" stroke-width="1" />
                            <line x1="0" y1="40" x2="160" y2="40" stroke="white" />
                            <line x1="30" y1="0" x2="30" y2="200" stroke="white" />
                            <line x1="90" y1="0" x2="90" y2="200" stroke="white" />
                            <text x="80" y="-15" fill="#ef4444" font-weight="black" font-size="16" text-anchor="middle">Page Table</text>
                            <text x="15" y="25" fill="#fff" font-size="10" text-anchor="middle">V</text>
                            <text x="60" y="20" fill="#fff" font-size="10" text-anchor="middle">Access</text>
                            <text x="60" y="32" fill="#fff" font-size="10" text-anchor="middle">Rights</text>
                            <text x="125" y="25" fill="#fff" font-size="10" text-anchor="middle">Frame</text>
                            <rect x="0" y="70" width="160" height="25" fill="rgba(255,255,255,0.1)" />
                        </g>

                        <!-- PHYSICAL ADDRESS BOX -->
                        <g transform="translate(580, 310)">
                            <rect x="0" y="0" width="220" height="40" fill="rgba(30, 64, 175, 0.4)" stroke="#3b82f6" stroke-width="2" />
                            <line x1="120" y1="0" x2="120" y2="40" stroke="#3b82f6" stroke-width="1" />
                            <text x="60" y="25" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Frame #</text>
                            <text x="170" y="25" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Offset</text>
                            <text x="110" y="65" fill="#ef4444" font-weight="black" font-size="14" text-anchor="middle">Physical address</text>
                            <text x="-50" y="25" fill="#fff" font-weight="black" font-size="14" text-anchor="middle">30 =</text>
                        </g>

                        <!-- WIRING -->
                        <g fill="none" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)">
                            <path d="M 170 180 L 345 180" />
                            <path d="M 325 80 L 325 260 L 345 260" />
                            <path d="M 510 260 L 640 260 L 640 305" />
                            <path d="M 445 80 L 750 80 L 750 305" />
                        </g>
                    </svg>
                </div>

                <!-- DETAIL LEGEND (Based on Handwritten Notes) -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    <div class="flex items-start gap-2">
                        <div class="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                        <div>
                            <h5 class="text-[10px] font-black text-white uppercase mb-1 underline">Valid Bit (V)</h5>
                            <p class="text-[9px] text-gray-400 italic">Indicates if the virtual page is currently mapped to physical memory.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-2 border-l border-white/5 pl-4">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full mt-1"></div>
                        <div>
                            <h5 class="text-[10px] font-black text-white uppercase mb-1 underline">Access Rights</h5>
                            <p class="text-[9px] text-gray-400 italic">Defines legal accesses for the process: <strong>Read, Write, Execute</strong>.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-2 border-l border-white/5 pl-4">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full mt-1"></div>
                        <div>
                            <h5 class="text-[10px] font-black text-white uppercase mb-1 underline">Table Location</h5>
                            <p class="text-[9px] text-gray-400 italic">The Page Table itself is stored within <strong>Physical Memory</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EXPLANATION CARDS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
                    <h4 class="text-indigo-400 font-black text-xs uppercase mb-3 tracking-widest">1. Table Indexing Logic</h4>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        The <strong>Page Number</strong> acts as the index. The hardware looks up this entry in the table to find the corresponding physical frame.
                    </p>
                </div>
                <div class="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                    <h4 class="text-emerald-400 font-black text-xs uppercase mb-3 tracking-widest">2. Contiguous Offset</h4>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        The <strong>Offset</strong> is appended directly to the frame number. It represents the exact byte location within the selected 1KB page.
                    </p>
                </div>
            </div>
            </div>
                </div>
            `
        },
        'vm-pt-bits': {
            title: 'The Address Math',
            html: `
                <div class="space-y-6">
                    <section class="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h4 class="text-accent font-black text-xs uppercase mb-4 tracking-widest">Input Parameters</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-center">
                            <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div class="text-gray-500 text-[10px]">PAGE SIZE</div>
                                <div class="text-lg text-white">1 KB</div>
                                <div class="text-accent text-[10px]">$2^{10}$ Bytes</div>
                            </div>
                            <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div class="text-gray-500 text-[10px]">VIRTUAL SPACE</div>
                                <div class="text-lg text-white">32-bit</div>
                                <div class="text-accent text-[10px]">$2^{32}$ Addressable</div>
                            </div>
                            <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div class="text-gray-500 text-[10px]">PHYSICAL RAM</div>
                                <div class="text-lg text-white">30-bit</div>
                                <div class="text-accent text-[10px]">$2^{30}$ Addressable</div>
                            </div>
                        </div>
                    </section>

                     <div class="step-card">
                <span class="step-title">Calculating Offset Bits</span>
                <p class="text-sm">The number of offset bits is determined strictly by the Page Size.</p>
                <div class="latex-output text-center">
                    $\\text{Offset Bits} = \\log_2(1024) = 10 \\text{ bits}$
                </div>
            </div>

            <div class="step-card border-indigo-500">
                <span class="step-title text-indigo-400">Calculating Page Number Bits</span>
                <p class="text-sm">Remaining bits from the 32-bit pointer are used for the Page Table index.</p>
                <div class="latex-output text-center">
                    $\\text{VPN Bits} = 32 \\text{ (Total)} - 10 \\text{ (Offset)} = 22 \\text{ bits}$
                </div>
            </div>

            <div class="step-card border-emerald-500">
                <span class="step-title text-emerald-400">Physical Address Construction</span>
                <p class="text-sm">The 20-bit Frame Number found in the Page Table is concatenated with the original 10-bit offset.</p>
                <div class="latex-output text-center">
                    $20 \\text{ (Frame)} + 10 \\text{ (Offset)} = 30 \\text{ Total Bits}$
                </div>
            </div>
                </div>
            `
        },

        'vm-ptbr': {
    title: 'Page Table Base Register (PTBR)',
    html: `
        <div class="space-y-8">
            <!-- HARDWARE INTEGRATION PANEL -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/40 relative overflow-hidden">
                <div class="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    
                    <!-- PTBR VISUALIZATION -->
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-32 h-16 bg-gradient-to-br from-indigo-600 to-indigo-900 border-2 border-indigo-400 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                            <span class="text-[10px] font-black text-indigo-200 uppercase tracking-widest">PTBR</span>
                            <span class="text-xs font-mono text-white">0x00A4F000</span>
                        </div>
                        <div class="animate-bounce text-indigo-400">↓</div>
                        <div class="w-40 h-32 border-2 border-dashed border-indigo-500/30 bg-white/5 rounded-sm flex flex-col p-2">
                            <div class="text-[8px] text-gray-500 mb-1 uppercase">Physical RAM</div>
                            <div class="bg-indigo-500/20 flex-1 border border-indigo-500/40 rounded flex items-center justify-center text-center">
                                <span class="text-[10px] font-bold text-indigo-300">Active<br>Page Table</span>
                            </div>
                        </div>
                    </div>

                    <!-- CORE CONCEPTS LIST -->
                    <div class="flex-1 space-y-4">
                        <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h5 class="text-xs font-black text-accent uppercase mb-2 underline">The MMU Connection</h5>
                            <p class="text-xs text-gray-300 leading-relaxed">
                                The OS stores vital metadata for every process inside the <strong>Memory Management Unit (MMU)</strong>. The most critical piece is the <strong>Physical Base Address</strong> of that process's Page Table.
                            </p>
                        </div>
                        <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h5 class="text-xs font-black text-emerald-400 uppercase mb-2 underline">Context Switching Logic</h5>
                            <p class="text-xs text-gray-300 leading-relaxed">
                                Whenever a process is <strong>scheduled for execution</strong>, the OS kernel performs a context switch. It loads that process's specific base address into the <strong>PTBR</strong> hardware register.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- THE SECURITY MODEL (Slide 15 Details) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kernel Control -->
                <div class="step-card border-red-500">
                    <span class="step-title text-red-400">Kernel-Only Access</span>
                    <p class="text-xs text-gray-300">
                        The PTBR is a <strong>Privileged Register</strong>. Only the Kernel (Ring 0) can modify it. If a user-level process could change the PTBR, it could "point" the MMU to another process's memory or the OS kernel itself.
                    </p>
                </div>

                <!-- Process Isolation -->
                <div class="step-card border-indigo-500">
                    <span class="step-title text-indigo-400">Process Isolation</span>
                    <p class="text-xs text-gray-300">
                        Because every process has its own unique Page Table base address, they are physically prevented from ever seeing each other's memory. Switching the PTBR effectively switches the entire <strong>Address Space</strong>.
                    </p>
                </div>
            </div>

            <!-- ANALOGY BOX -->
            <section class="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-xl">
                <h4 class="text-xs font-black text-indigo-300 uppercase mb-3 tracking-widest">Procedural Summary</h4>
                <div class="font-mono text-[11px] space-y-2 text-gray-400">
                    <div class="flex gap-3">
                        <span class="text-indigo-500">1.</span>
                        <span>OS selects <span class="text-white">Process B</span> from the "List of Processes".</span>
                    </div>
                    <div class="flex gap-3">
                        <span class="text-indigo-500">2.</span>
                        <span>Kernel extracts <span class="text-white">Base_Addr_B</span> from MMU metadata.</span>
                    </div>
                    <div class="flex gap-3">
                        <span class="text-indigo-500">3.</span>
                        <span>Kernel executes <span class="text-emerald-400">MOV PTBR, Base_Addr_B</span>.</span>
                    </div>
                    <div class="flex gap-3">
                        <span class="text-indigo-500">4.</span>
                        <span>CPU now translates all instructions using <span class="text-white">Process B's</span> map.</span>
                    </div>
                </div>
            </section>
        </div>
    `
},

        'vm-pt-pte': {
            title: 'Page Table Entry (PTE) Anatomy',
            html: `
                <div class="space-y-6">
                    <p class="text-sm text-gray-300">A PTE is a hardware data structure containing the physical address and protection metadata for a single page.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Valid Bit Logic -->
                        <div class="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold">V</div>
                                <h5 class="text-xs font-black uppercase">Valid Bit (Demand Paging)</h5>
                            </div>
                            <ul class="text-[11px] space-y-2 text-gray-400">
                                <li><strong class="text-indigo-300">V = 1:</strong> Page is in RAM. The PTE contains the Physical Frame Number.</li>
                                <li><strong class="text-red-400">V = 0:</strong> Page is on <strong>Disk</strong>. The MMU triggers a Page Fault; the OS uses the PTE to locate the data in secondary storage.</li>
                            </ul>
                        </div>

                        <!-- Permission Bits -->
                        <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold">P</div>
                                <h5 class="text-xs font-black uppercase">Permission Bits</h5>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono text-emerald-300">
                                <div class="bg-black/20 p-1 rounded">Read-Only</div>
                                <div class="bg-black/20 p-1 rounded">Read-Write</div>
                                <div class="bg-black/20 p-1 rounded">Write-Only</div>
                                <div class="bg-black/20 p-1 rounded italic text-white/50">Suspended</div>
                            </div>
                        </div>
                    </div>

                    <!-- THE VISUAL MAPPING ENGINE (Slide 22 Replica) -->
                    <div class="glass p-8 rounded-3xl border border-white/10 bg-black/40 relative overflow-hidden">
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10">
                            
                            <!-- 1. VIRTUAL MEMORY -->
                            <div class="flex flex-col items-center gap-2">
                                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Virtual Memory</span>
                                <div class="w-24 h-48 border-2 border-white/20 bg-white/5 rounded-sm overflow-hidden flex flex-col font-mono text-[10px]">
                                    <div class="h-1/3 bg-pink-500/60 border-b border-black flex flex-col items-center justify-center">
                                        <span>0x00</span><span class="text-[8px] opacity-70">a,b,c,d</span>
                                    </div>
                                    <div class="h-1/3 bg-cyan-400/60 border-b border-black flex flex-col items-center justify-center">
                                        <span>0x04</span><span class="text-[8px] opacity-70">e,f,g,h</span>
                                    </div>
                                    <div class="h-1/3 bg-green-500/60 flex flex-col items-center justify-center">
                                        <span>0x08</span><span class="text-[8px] opacity-70">i,j,k,l</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 2. ADDRESS MATH BUS (SVG) -->
                            <div class="flex-1 relative h-64 min-w-[300px]">
                                <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 200">
                                    <defs>
                                        <marker id="arr-blk" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                                            <path d="M0,0 L8,4 L0,8 Z" fill="#fff" />
                                        </marker>
                                    </defs>
                                    
                                    <!-- Input Paths from Virt to Table -->
                                    <path d="M 0 50 L 100 80" stroke="white" stroke-width="1.5" opacity="0.4" />
                                    <path d="M 0 100 L 100 100" stroke="white" stroke-width="2" marker-end="url(#arr-blk)" />
                                    <path d="M 0 150 L 100 120" stroke="white" stroke-width="1.5" opacity="0.4" />

                                    <!-- Output Paths from Table to Phys -->
                                    <path d="M 150 85 L 280 160" stroke="white" stroke-width="1.5" marker-end="url(#arr-blk)" />
                                    <path d="M 150 100 L 280 120" stroke="white" stroke-width="1.5" marker-end="url(#arr-blk)" />
                                    <path d="M 150 115 L 280 40" stroke="white" stroke-width="1.5" marker-end="url(#arr-blk)" />

                                    <!-- Binary Explanation Labels -->
                                    <text x="10" y="85" fill="#22d3ee" font-family="monospace" font-size="9">VA: 0000 0100</text>
                                    <text x="180" y="115" fill="#f472b6" font-family="monospace" font-size="9">PA: 0000 1100</text>
                                </svg>

                                <!-- CENTRAL PAGE TABLE -->
                                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 bg-white/10 border border-white/30 rounded flex flex-col font-mono text-xs overflow-hidden">
                                    <div class="bg-pink-500/80 p-2 border-b border-white/20 text-center">4</div>
                                    <div class="bg-cyan-400/80 p-2 border-b border-white/20 text-center">3</div>
                                    <div class="bg-green-500/80 p-2 text-center">1</div>
                                    <div class="absolute -top-4 left-0 text-[8px] text-gray-500 uppercase">Page Table</div>
                                </div>
                            </div>

                            <!-- 3. PHYSICAL MEMORY -->
                            <div class="flex flex-col items-center gap-2">
                                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Physical Memory</span>
                                <div class="w-24 h-64 border-2 border-white/20 bg-white/5 rounded-sm overflow-hidden flex flex-col font-mono text-[10px]">
                                    <div class="h-1/5 border-b border-white/10 flex items-center justify-center italic opacity-30">0x00</div>
                                    <div class="h-1/5 bg-green-500/60 border-b border-white/10 flex flex-col items-center justify-center">
                                        <span>0x04</span><span class="text-[8px] opacity-70">i,j,k,l</span>
                                    </div>
                                    <div class="h-1/5 border-b border-white/10 flex items-center justify-center italic opacity-30">0x08</div>
                                    <div class="h-1/5 bg-cyan-400/60 border-b border-white/10 flex flex-col items-center justify-center">
                                        <span>0x0C</span><span class="text-[8px] opacity-70">e,f,g,h</span>
                                    </div>
                                    <div class="h-1/5 bg-pink-500/60 flex flex-col items-center justify-center">
                                        <span>0x10</span><span class="text-[8px] opacity-70">a,b,c,d</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- THE MATHEMATICAL PROOF (Slide 22 Detailed) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="step-card">
                            <span class="step-title">The Immutable Offset</span>
                            <p class="text-xs text-gray-300 leading-relaxed">
                                Note the binary breakdown for <strong>0x04</strong> (Cyan Block). The offset bits <span class="text-cyan-400 underline decoration-dotted">cannot change</span>.
                            </p>
                            <div class="bg-black/40 p-4 rounded-lg mt-4 font-mono text-[11px] space-y-2">
                                <div class="flex justify-between"><span>Virt:</span> <span class="text-gray-500">0000 01</span><span class="text-cyan-400">00</span></div>
                                <div class="flex justify-between text-indigo-400"><span>Index 1:</span> <span>→ PPN 3 (11)</span></div>
                                <div class="flex justify-between"><span>Phys:</span> <span class="text-gray-500">0000 11</span><span class="text-cyan-400">00</span></div>
                                <div class="border-t border-white/10 pt-1 text-center text-accent">Result: 0x0C</div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <h5 class="text-[10px] font-black text-accent uppercase mb-2 tracking-widest">Logic Breakdown</h5>
                                <ul class="text-[11px] space-y-2 text-gray-400">
                                    <li>• <strong class="text-white">Page 0 (Pink)</strong> $\rightarrow$ Frame 4 (0x10)</li>
                                    <li>• <strong class="text-white">Page 1 (Cyan)</strong> $\rightarrow$ Frame 3 (0x0C)</li>
                                    <li>• <strong class="text-white">Page 2 (Green)</strong> $\rightarrow$ Frame 1 (0x04)</li>
                                </ul>
                            </div>
                            <div class="warn-box">
                                <strong>Observation:</strong> Even though the virtual pages are contiguous (a $\rightarrow$ l), they are completely scattered in Physical Memory to maximize storage efficiency.
                            </div>
                        </div>
                    </div>
                    
                </div>
            `
        },
        'vm-translation-deepdive': {

    title: 'Page Table: Address Translation',
    html: `
        <div class="space-y-8">
            <!-- SCHEMATIC ENGINE: ADDRESS TRANSLATION FLOW -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/60 relative overflow-hidden">
                <div class="relative h-[500px] w-full">
                    <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 500">
                        <defs>
                            <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#22d3ee" />
                            </marker>
                            <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
                            </marker>
                             <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
                            </marker>
                        </defs>

                        <!-- 1. VIRTUAL ADDRESS (INPUT) -->
                        <g transform="translate(300, 30)">
                            <text x="100" y="-10" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Virtual Address</text>
                            <rect x="0" y="0" width="250" height="40" fill="white" fill-opacity="0.05" stroke="white" stroke-width="1.5" />
                            <line x1="160" y1="0" x2="160" y2="40" stroke="white" />
                            <text x="80" y="25" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Virtual Page Number (VPN)</text>
                            <text x="205" y="25" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Offset (VPO)</text>
                        </g>

                        <!-- 2. PTBR (BASE POINTER) -->
                        <g transform="translate(40, 50)">
                            <rect x="0" y="0" width="160" height="60" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" stroke-width="2" rx="4" />
                            <text x="80" y="25" fill="#ef4444" font-weight="black" font-size="11" text-anchor="middle">Page Table Base</text>
                            <text x="80" y="45" fill="#ef4444" font-weight="black" font-size="11" text-anchor="middle">Register (PTBR)</text>
                            <!-- Pointer Arrow -->
                            <path d="M 80 60 L 80 180 L 300 180" stroke="#ef4444" stroke-width="2" fill="none" marker-end="url(#arrow-red)" />
                            <text x="180" y="155" fill="#ef4444" font-size="9" font-weight="bold">Base Address for Process</text>
                        </g>

                        <!-- 3. THE PAGE TABLE (LOOKUP) -->
                        <g transform="translate(300, 180)">
                            <rect x="0" y="-10" width="200" height="150" fill="white" fill-opacity="0.03" stroke="white" stroke-width="1" />
                            <line x1="40" y1="-10" x2="40" y2="140" stroke="white" opacity="0.3" />
                            <text x="100" y="-20" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">Page Table</text>
                            <text x="20" y="10" fill="#fff" font-size="9" text-anchor="middle">Valid</text>
                            <text x="120" y="10" fill="#fff" font-size="9" text-anchor="middle">Physical Page Number (PPN)</text>
                            
                            <!-- Highlighted Row -->
                            <rect x="0" y="40" width="200" height="30" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="1" />
                        </g>

                        <!-- VPN INDEXING ARROW -->
                        <path d="M 380 70 L 380 120 L 260 120 L 260 235 L 295 235" stroke="#22d3ee" stroke-width="2" fill="none" marker-end="url(#arrow-blue)" />

                        <!-- 4. PAGE FAULT LOGIC -->
                        <g transform="translate(40, 250)">
                            <path d="M 320 220 L 320 280 L 180 280" stroke="#fff" stroke-width="1.5" fill="none" marker-end="url(#arrow-blue)" opacity="0.5" />
                            <text x="100" y="270" fill="#ef4444" font-weight="black" font-size="10" text-anchor="end">Valid bit = 0:</text>
                            <text x="100" y="285" fill="#ef4444" font-weight="black" font-size="10" text-anchor="end">Page not in memory</text>
                            <text x="100" y="300" fill="#ef4444" font-weight="black" font-size="10" text-anchor="end">(Page Fault)</text>
                        </g>

                        <!-- 5. PHYSICAL ADDRESS (OUTPUT) -->
                        <g transform="translate(300, 420)">
                            <text x="100" y="60" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Physical Address</text>
                            <rect x="0" y="0" width="300" height="40" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" stroke-width="1.5" />
                            <line x1="200" y1="0" x2="200" y2="40" stroke="#10b981" />
                            <text x="100" y="25" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Physical Page Number (PPN)</text>
                            <text x="250" y="25" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Offset (PPO)</text>
                        </g>

                        <!-- DATA FLOW ARROWS -->
                        <path d="M 420 250 L 420 415" stroke="#10b981" stroke-width="2" fill="none" marker-end="url(#arrow-green)" />
                        <path d="M 505 70 L 505 415" stroke="white" stroke-width="2" fill="none" opacity="0.6" marker-end="url(#arrow-blue)" />

                    </svg>
                </div>
            </div>

            <!-- COMPONENT BREAKDOWN -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
                    <h4 class="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest underline decoration-indigo-500/50 underline-offset-4">The Indexing Phase</h4>
                    <p class="text-xs text-gray-300 leading-relaxed mb-4">
                        The <strong>PTBR</strong> provides the start of the table. The <strong>VPN</strong> (Virtual Page Number) acts as the offset or index. 
                    </p>
                    <div class="bg-black/30 p-3 rounded-lg border border-white/10 font-mono text-[10px] text-cyan-400">
                        Target PTE = PTBR + (VPN * PTE_Size)
                    </div>
                </div>

                <div class="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                    <h4 class="text-red-400 font-black text-xs uppercase mb-4 tracking-widest underline decoration-red-500/50 underline-offset-4">The Validation Phase</h4>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        Before extracting data, the MMU checks the <strong>Valid Bit</strong>. If it is <span class="text-red-500">0</span>, the page is not in physical RAM (it might be in swap space). The hardware triggers a <strong>Page Fault</strong> interrupt for the OS to handle.
                    </p>
                </div>
            </div>

            <!-- KEY TECHNICAL NOTE -->
            <div class="step-card border-emerald-500">
                <span class="step-title text-emerald-400">Final Address Construction</span>
                <p class="text-xs text-gray-300 leading-relaxed">
                    If the page is valid, the <strong>PPN</strong> (Physical Page Number) is retrieved from the table. 
                    Because pages and frames are the same size, the <strong>Offset</strong> remains identical.
                </p>
                <div class="latex-output text-center">
                    $\\text{Physical Address} = (\\text{PPN} \\ll \\text{Offset Bits}) | \\text{VPO}$
                </div>
                <div class="mt-4 p-3 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-gray-400">
                    <span class="text-blue-400 font-bold">Important:</span> The number of rows in the page table is defined by the number of unique VPNs possible ($2^{\\text{VPN bits}}$).
                </div>
            </div>
        </div>
    `
},
'vm-math': {
    title: 'Memory Address Translation: The Bit Breakdown',
    html: `
        <div class="space-y-8">
            <!-- 1. THE BIT-MAPPING DIAGRAM (Slide 18 Replica) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/60 relative overflow-hidden">
                <h4 class="text-accent text-xs font-black uppercase mb-8 tracking-widest text-center">Translation Bit Architecture</h4>
                
                <div class="relative h-[300px] w-full">
                    <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 600 300">
                        <defs>
                            <marker id="arr-blue" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#3b82f6" />
                            </marker>
                            <marker id="arr-red" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
                            </marker>
                            <marker id="arr-green" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
                            </marker>
                        </defs>

                        <!-- VIRTUAL ADDRESS BITS -->
                        <g transform="translate(100, 20)">
                            <text x="0" y="-10" fill="#3b82f6" font-size="10" font-weight="bold">Virtual Address (32-bit)</text>
                            <rect x="0" y="0" width="400" height="35" fill="white" fill-opacity="0.05" stroke="white" />
                            <line x1="300" y1="0" x2="300" y2="35" stroke="white" stroke-width="2" />
                            <text x="5" y="22" fill="#94a3b8" font-size="10">31</text>
                            <text x="280" y="22" fill="#94a3b8" font-size="10">12</text>
                            <text x="310" y="22" fill="#94a3b8" font-size="10">11</text>
                            <text x="390" y="22" fill="#94a3b8" font-size="10">0</text>
                            <text x="150" y="22" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Virtual Page Number (VPN)</text>
                            <text x="350" y="22" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Offset</text>
                        </g>

                        <!-- THE PAGE TABLE ENGINE -->
                        <g transform="translate(200, 110)">
                            <rect x="0" y="0" width="120" height="60" fill="orange" fill-opacity="0.2" stroke="orange" stroke-width="2" />
                            <text x="60" y="35" fill="orange" font-weight="black" font-size="12" text-anchor="middle">PAGE TABLE</text>
                            <!-- Input Arrow -->
                            <path d="M 50 -55 L 50 -10" fill="none" stroke="#3b82f6" stroke-width="3" marker-end="url(#arr-blue)" />
                        </g>

                        <!-- PHYSICAL ADDRESS BITS -->
                        <g transform="translate(100, 230)">
                            <text x="0" y="55" fill="#10b981" font-size="10" font-weight="bold">Physical Address (28-bit)</text>
                            <rect x="0" y="0" width="400" height="35" fill="white" fill-opacity="0.05" stroke="white" />
                            <line x1="280" y1="0" x2="280" y2="35" stroke="white" stroke-width="2" />
                            <text x="5" y="22" fill="#94a3b8" font-size="10">27</text>
                            <text x="260" y="22" fill="#94a3b8" font-size="10">11</text>
                            <text x="290" y="22" fill="#94a3b8" font-size="10">11</text>
                            <text x="390" y="22" fill="#94a3b8" font-size="10">0</text>
                            <text x="140" y="22" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Physical Frame Number</text>
                            <text x="340" y="22" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle">Offset</text>
                        </g>

                        <!-- DATA FLOWS -->
                        <path d="M 260 170 L 260 225" fill="none" stroke="#ef4444" stroke-width="4" marker-end="url(#arr-red)" />
                        <path d="M 450 55 L 450 225" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#arr-green)" />
                    </svg>
                </div>
            </div>

            <!-- 2. THE FORMULA CHEAT SHEET -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h4 class="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest">Address Structure Formulae</h4>
                    <ul class="space-y-4 font-mono text-[11px]">
                        <li class="p-2 bg-black/20 rounded border-l-2 border-indigo-500">
                            $\\text{Offset Bits} = \\log_2(\\text{Page Size in Bytes})$
                        </li>
                        <li class="p-2 bg-black/20 rounded border-l-2 border-indigo-500">
                            $\\text{VPN Bits} = \\text{Virtual Address Bits} - \\text{Offset Bits}$
                        </li>
                        <li class="p-2 bg-black/20 rounded border-l-2 border-indigo-500">
                            $\\text{PPN Bits} = \\text{Physical Address Bits} - \\text{Offset Bits}$
                        </li>
                    </ul>
                </div>
                <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h4 class="text-emerald-400 font-black text-xs uppercase mb-4 tracking-widest">Table Capacity Formulae</h4>
                    <ul class="space-y-4 font-mono text-[11px]">
                        <li class="p-2 bg-black/20 rounded border-l-2 border-emerald-500">
                            $\\text{Total Entries} = 2^{\\text{VPN Bits}}$
                        </li>
                        <li class="p-2 bg-black/20 rounded border-l-2 border-emerald-500">
                            $\\text{Table Memory Size} = \\text{Total Entries} \\times \\text{PTE Size}$
                        </li>
                        <li class="p-2 bg-black/20 rounded border-l-2 border-emerald-500">
                            $\\text{Addressable RAM} = 2^{\\text{Physical Address Bits}}$
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 3. FULL WORKED EXAMPLE (Slide 18 Scenario) -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-black/40">
                <h4 class="text-accent text-xs font-black uppercase mb-6 tracking-widest">Slide 18 Worked Example</h4>
                
                <div class="space-y-6">
                    <div class="step-card">
                        <span class="step-title">1. Identifying Bits from Given Sizes</span>
                        <p class="text-xs text-gray-400 mb-2">Given a 32-bit Virtual Address and 4KB Page Size:</p>
                        <div class="latex-output">
                            $\\text{Offset Bits} = \\log_2(4096) = 12 \\text{ bits}$
                            <br>
                            $\\text{VPN Bits} = 32 - 12 = 20 \\text{ bits}$
                        </div>
                    </div>

                    <div class="step-card border-amber-500">
                        <span class="step-title text-amber-500">2. Determining Table Entries</span>
                        <p class="text-xs text-gray-400 mb-2">The number of rows in the table is $2^{\\text{VPN}}$:</p>
                        <div class="latex-output">
                            $2^{20} = 1,048,576 \\text{ entries}$
                        </div>
                    </div>

                    <div class="step-card border-emerald-500">
                        <span class="step-title text-emerald-400">3. Physical RAM Memory Calculation</span>
                        <p class="text-xs text-gray-400 mb-2">If each PTE is 4 bytes (standard for 32-bit):</p>
                        <div class="latex-output">
                            $2^{20} \\text{ entries} \\times 4 \\text{ bytes} = 2^{22} \\text{ bytes} = 4 \\text{ MB}$
                        </div>
                        <p class="text-[10px] italic text-emerald-300/60 mt-2">
                            Summary: To map 4GB of virtual memory, the OS consumes 4MB of real RAM per process to store the Page Table.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
},

'vm-addressing-logic': {
    title: 'Page Tables and Addressing Logic',
    html: `
        <div class="space-y-8">
            <!-- HARDWARE LOGIC ENGINE: ADDRESSING FLOW -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-slate-950/60 relative overflow-hidden">
                <div class="relative h-[480px] w-full">
                    <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 480">
                        <defs>
                            <marker id="arr-orange" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#f97316" />
                            </marker>
                            <marker id="arr-cyan" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#22d3ee" />
                            </marker>
                        </defs>

                        <!-- VIRTUAL ADDRESS (TOP) -->
                        <g transform="translate(250, 40)">
                            <rect x="0" y="0" width="120" height="50" fill="#f97316" stroke="#fb923c" stroke-width="2" />
                            <rect x="120" y="0" width="100" height="50" fill="#22d3ee" stroke="#67e8f9" stroke-width="2" />
                            <text x="60" y="20" fill="black" font-weight="black" font-size="11" text-anchor="middle">Virtual</text>
                            <text x="60" y="35" fill="black" font-weight="black" font-size="11" text-anchor="middle">Page #</text>
                            <text x="170" y="30" fill="black" font-weight="black" font-size="12" text-anchor="middle">Offset</text>
                            <text x="-120" y="30" fill="#fff" font-weight="black" font-size="14">Virtual Address:</text>
                        </g>

                        <!-- CONTROL REGISTERS (LEFT) -->
                        <g transform="translate(50, 120)">
                            <!-- Ptr Register -->
                            <rect x="0" y="0" width="160" height="30" fill="#ec4899" fill-opacity="0.3" stroke="#ec4899" rx="4" />
                            <text x="80" y="20" fill="#fbcfe8" font-weight="bold" font-size="12" text-anchor="middle">PageTablePtr</text>
                            <!-- Size Register -->
                            <rect x="0" y="100" width="160" height="30" fill="#ec4899" fill-opacity="0.3" stroke="#ec4899" rx="4" />
                            <text x="80" y="120" fill="#fbcfe8" font-weight="bold" font-size="12" text-anchor="middle">PageTableSize</text>
                        </g>

                        <!-- BOUNDS COMPARATOR -->
                        <g transform="translate(280, 220)">
                            <circle cx="0" cy="0" r="22" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899" stroke-width="2" />
                            <text x="0" y="8" fill="#fbcfe8" font-weight="black" font-size="20" text-anchor="middle">></text>
                            <!-- Error branch -->
                            <path d="M 0 22 L 0 50" stroke="#ef4444" stroke-width="2" marker-end="url(#arr-orange)" />
                            <text x="0" y="70" fill="#ef4444" font-weight="black" font-size="12" text-anchor="middle">Access Error</text>
                        </g>

                        <!-- PAGE TABLE (CENTER) -->
                        <g transform="translate(360, 130)">
                            <rect x="0" y="0" width="160" height="220" fill="white" fill-opacity="0.05" stroke="white" stroke-width="1.5" />
                            <line x1="110" y1="0" x2="110" y2="220" stroke="white" opacity="0.3" />
                            <!-- Entries -->
                            <g font-size="10" font-family="monospace">
                                <text x="10" y="20" fill="#fff">page #0</text> <text x="120" y="20" fill="#10b981">V,R</text>
                                <rect x="0" y="30" width="160" height="30" fill="#0891b2" />
                                <text x="10" y="50" fill="#fff" font-weight="bold">page #1</text> <text x="120" y="50" fill="#fff" font-weight="bold">V,R</text>
                                <text x="10" y="80" fill="#fff">page #2</text> <text x="120" y="80" fill="#10b981">V,R,W</text>
                                <text x="10" y="110" fill="#fff">page #3</text> <text x="120" y="110" fill="#10b981">V,R,W</text>
                                <text x="10" y="140" fill="#fff">page #4</text> <text x="120" y="140" fill="#ef4444">N</text>
                                <text x="10" y="170" fill="#fff">page #5</text> <text x="120" y="170" fill="#10b981">V,R,W</text>
                            </g>
                        </g>

                        <!-- PERMISSION CHECK -->
                        <g transform="translate(600, 240)">
                            <rect x="0" y="0" width="180" height="35" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899" rx="10" />
                            <text x="90" y="22" fill="#fbcfe8" font-weight="black" font-size="11" text-anchor="middle">Check Permissions</text>
                            <path d="M 90 35 L 90 70" stroke="#ef4444" stroke-width="2" marker-end="url(#arr-orange)" />
                            <text x="90" y="90" fill="#ef4444" font-weight="black" font-size="12" text-anchor="middle">Access Error</text>
                        </g>

                        <!-- PHYSICAL ADDRESS (RIGHT) -->
                        <g transform="translate(580, 100)">
                            <rect x="0" y="0" width="120" height="50" fill="#f97316" stroke="#fb923c" stroke-width="2" />
                            <rect x="120" y="0" width="100" height="50" fill="#22d3ee" stroke="#67e8f9" stroke-width="2" />
                            <text x="60" y="20" fill="black" font-weight="black" font-size="11" text-anchor="middle">Physical</text>
                            <text x="60" y="35" fill="black" font-weight="black" font-size="11" text-anchor="middle">Page #</text>
                            <text x="170" y="30" fill="black" font-weight="black" font-size="12" text-anchor="middle">Offset</text>
                            <text x="110" y="80" fill="#fff" font-weight="black" font-size="13" text-anchor="middle">Physical Address</text>
                        </g>

                        <!-- WIRING -->
                        <g fill="none" stroke-width="2">
                            <!-- Page Number Path -->
                            <path d="M 310 90 L 310 198" stroke="#f97316" marker-end="url(#arr-orange)" />
                            <path d="M 310 150 L 355 150" stroke="#f97316" marker-end="url(#arr-orange)" />
                            <!-- Offset Path -->
                            <path d="M 470 65 L 700 65 L 700 95" stroke="#22d3ee" marker-end="url(#arr-cyan)" />
                            <!-- Pointer Path -->
                            <path d="M 210 135 L 355 135" stroke="#fff" opacity="0.5" />
                            <!-- Table Size check -->
                            <path d="M 210 220 L 258 220" stroke="#fbcfe8" />
                            <!-- Success Paths to Result -->
                            <path d="M 520 145 L 575 145" stroke="#f97316" marker-end="url(#arr-orange)" />
                            <path d="M 500 160 L 600 240" stroke="#f97316" opacity="0.4" />
                        </g>
                    </svg>
                </div>
            </div>

            <!-- STEP-BY-STEP LOOKUP LOGIC -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Step 1 -->
                <div class="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl">
                    <h4 class="text-xs font-black text-indigo-400 uppercase mb-3">1. Bounds Check</h4>
                    <p class="text-[11px] text-gray-300">
                        The hardware compares the <strong>Virtual Page #</strong> with the <strong>PageTableSize</strong> register. If the index is out of bounds, an <strong>Access Error</strong> is triggered immediately.
                    </p>
                </div>
                <!-- Step 2 -->
                <div class="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl">
                    <h4 class="text-xs font-black text-indigo-400 uppercase mb-3">2. Table Indexing</h4>
                    <p class="text-[11px] text-gray-300">
                        The <strong>PageTablePtr</strong> (Base) is added to the Virtual Page # to find the exact location of the entry in main memory.
                    </p>
                </div>
                <!-- Step 3 -->
                <div class="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl">
                    <h4 class="text-xs font-black text-emerald-400 uppercase mb-3">3. Permissions Verification</h4>
                    <p class="text-[11px] text-gray-300">
                        The MMU checks the bits in the entry (e.g., <strong>V</strong>alid, <strong>R</strong>ead, <strong>W</strong>rite). If a process tries to Write to a Read-Only page, the hardware traps to the OS.
                    </p>
                </div>
            </div>

            <!-- KEY CONCEPT SUMMARY -->
            <section class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h4 class="text-accent font-bold mb-3 text-sm">Hardware-Managed Translation</h4>
                <p class="text-xs text-gray-400 leading-relaxed italic">
                    "Every process has its own unique page table stored in main memory. The Physical Address is the concatenation of the retrieved <strong>Physical Page #</strong> and the original <strong>Offset</strong>."
                </p>
            </section>
        </div>
    `
},
        
    }

}