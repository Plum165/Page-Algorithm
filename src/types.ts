export interface Subtopic {
  id: string;
  title: string;
}

export interface ContentItem {
  title: string;
  explanation: string;
  mathFormula?: string; // Inline LaTeX MathJax formula
  workedExample?: {
    inputs: string;
    steps: string[];
    answer: string;
  };
  interactivePractice?: {
    question: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
  }[];
  realWorldApplications: {
    domain: string;
    scenario: string;
  }[];
  customHtml?: string; // High-fidelity schematics or interactive components
}

export interface TopicModule {
  id: string;
  title: string;
  subtopics: Subtopic[];
  content: Record<string, ContentItem>;
}

export interface SimulatorState {
  referenceString: number[];
  numFrames: number;
  algorithm: 'FIFO' | 'LRU' | 'OPT' | 'Clock';
  currentIndex: number;
  frames: (number | null)[];
  history: {
    step: number;
    incoming: number;
    frames: (number | null)[];
    status: 'HIT' | 'FAULT';
    clockHand?: number; // Clock hand helper
    referenceBits?: number[]; // Reference bits for Clock algorithm
    recentHistory?: number[]; // Usage history (stack) for LRU
  }[];
}

export interface Theme {
  id: string;
  name: string;
  bg1: string;
  bg2: string;
  bg3: string;
  text: string;
  accent: string;
  cardBg: string;
}
