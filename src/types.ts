export type EffortLevel = 'none' | 'minimum' | 'medium' | 'great';

export interface Habit {
  id: string;
  name: string;
  minimumDesc: string;
  mediumDesc: string;
  greatDesc: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  habits: Record<string, EffortLevel>; // habitId -> effort
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  xp: number;
  streak: number;
  lastActive: string;
  roadmapLevel: number;
}

export interface QuizQuestion {
  id: string;
  type: 'riddle' | 'spatial' | 'problem_identification' | 'design_awareness';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DrawingTutorial {
  id: string;
  title: string;
  youtubeId: string;
  category: string;
  steps: string[];
}
