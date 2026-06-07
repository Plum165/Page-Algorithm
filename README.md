# OS Memory Management & Page Replacement Simulator

An elite, high-fidelity, offline-first educational web platform designed to teaches operating system memory layout architectures, virtual address translations, sharing, protection levels, hierarchical mapping, and page replacement algorithm structures.

This platform modernizes legacy command-line or Java Swing desktop apps into a fully responsive, visually gorgeous glassmorphic digital workspace.

---

## 🌟 Core Features

### 1. Unified Textbook & Curriculum
Comprehensive article chapters covering 6-8 core segments of CSC3002F syllabus:
*   **Virtual Memory Fundamentals**: Decentralized mapping, Base and Bounds hardware relocation, and contiguous fragmentation holes.
*   **Page Tables**: Address translations, bit splits (VPN vs offset widths), PTBR context switches, and PTE anatomical bits (Valid, No-Execute NX, user-supervisor SUP).
*   **Swapping & Categories**: Virtual address states (RAM Hit, Page Fault, Segfault) and swaps.
*   **Sharing and Protection**: Copy-on-write sharing channels, page-size tradeoffs, and permissions security maps.
*   **Hierarchical Mapping**: Space-saving tree directories, Intel Core i7 4-level maps, and 57-bit 5-level translations.

### 2. Live Interactive Sandbox Simulator
*   **Custom Page Sequences**: Users can input any custom string of integers or test using curriculum-compliant presets.
*   **Step-by-Step Chronology**: Live controls (Prev, Next, Autoplay with speed controls) with text narrative detailing the "what" and "why" of every logical replacement step.
*   **Multi-Algorithm Comparative Table**: Displays **FIFO**, **LRU**, **OPT**, and **Clock (Second-Chance)** executing the exact same references simultaneously and side-by-side. Spot **Belady's Anomaly** and compare fault counts dynamically.
*   **Specialized State Inspectors**: Monitors structural queues such as LRU usage heaps, OPT lookahead index metrics, and Clock's circular reference bits.

### 3. Practice & Self-Assessment
*   **Embedded Checkpoints**: Diagnostic interactive quizzes inside each page, providing instant correction and detailed explanations.
*   **System Competence Exam**: A 5-question comprehensive quiz grading learners and awarding rank badges (e.g. *Supervisor Kernel Architect*).

### 4. Legacy Java Parity Lab
Preserves the exact five original `.java` classroom files, providing elegant syntax-highlighted render structures, Copy buttons, and direct client-side downloadable `.java` assets.

---

## 🎨 Theme Matrix Engine
Includes a selection of **18 custom-themed color ways** (including Dark Blue, Cat Noir, Cyberpunk, Forrest, Coral, and Plum Gold) updating layout variables dynamically using CSS custom property mappings.

---

## 🛠️ Build & Installation

### Local Development
To run this application on your local machine:

1.  Clone this repository or download the ZIP.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Boot the Vite development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Compilation
To compile a minimized, production-ready static site bundle (located under `dist/`):
```bash
npm run build
```

---

## 📂 Project Architecture
```txt
/
├── index.html              # Custom page shell with Inter fonts & MathJax Math compiler
├── package.json            # Node dependencies (uses latest React 19 + Motion)
├── README.md               # User & Developer documentation
├── src/
│   ├── main.tsx            # Main React SPA bootstrap mount
│   ├── App.tsx             # Master Layout shell, lesson routes, and dynamic typesetter
│   ├── index.css           # Tailwind v4 theme, interactive glimmers, and responsive scrollbars
│   ├── types.ts            # Type definitions and Simulator models
│   ├── data/
│   │   ├── curriculum.ts   # Interactive database (text, math, worked logs, checks)
│   │   └── javaSources.ts  # Pre-packed and preserved Legacy Java class sources
│   └── components/
│       ├── Header.tsx      # Palette selectors, systemic clocks, and info chips
│       ├── Sidebar.tsx     # Chapter routes & Subtopic directories
│       ├── Simulator.tsx   # Paging sandboxes & Side-by-Side comparison maps
│       ├── Quiz.tsx        # System competence diagnostic and scoring rank badges
│       └── JavaPreservation.tsx # Syntax copy nodes & encoded download triggers
```

---

## 🎓 Educational Value
This platform serves as a complete offline instruction tool. It provides deep, interactive connections between abstract OS concepts (such as pointer bit manipulation) and live, observable physical effects (such as memory cache replacement sweeps). It is ideal for computer science students and system engineers.
