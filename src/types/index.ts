export type Subject = 'physics' | 'maths';

export type Category =
  | 'kinematics'
  | 'dynamics'
  | 'energy'
  | 'waves'
  | 'optics'
  | 'algebra'
  | 'trigonometry'
  | 'calculus'
  | 'geometry';

export interface InteractiveParameter {
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  unit: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  category: Category;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: {
    overview: string;
    keyConcepts: string[];
    equations: {
      name: string;
      latex: string;
      explanation: string;
    }[];
    realWorldExample: string;
    interactiveParams?: InteractiveParameter[];
    computeResult?: (params: Record<string, number>) => { label: string; value: string; unit: string }[];
  };
}

export interface Formula {
  id: string;
  name: string;
  subject: Subject;
  category: Category;
  expression: string;
  description: string;
  variables: {
    symbol: string;
    name: string;
    unit: string;
  }[];
  calculate?: (inputs: Record<string, number>, solveFor: string) => number | string;
}

export interface QuizQuestion {
  id: string;
  subject: Subject;
  category: Category;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  formulaHint?: string;
}

export interface UserStats {
  completedLessons: string[];
  quizHighScores: Record<string, number>;
  streakDays: number;
  totalPoints: number;
}
