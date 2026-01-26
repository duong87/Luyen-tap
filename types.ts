
export enum BloomLevel {
  KNOWLEDGE = 'Nhận biết',
  COMPREHENSION = 'Thông hiểu',
  APPLICATION = 'Vận dụng',
  ANALYSIS = 'Vận dụng cao'
}

export type QuestionType = 'MCQ' | 'TRUE_FALSE';

export enum Subject {
  MATH = 'Toán học',
  LITERATURE = 'Ngữ văn',
  ENGLISH = 'Tiếng Anh',
  PHYSICS = 'Vật lý',
  CHEMISTRY = 'Hóa học',
  BIOLOGY = 'Sinh học',
  HISTORY = 'Lịch sử',
  GEOGRAPHY = 'Địa lý'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  svgCode?: string; // Standard SVG code for complex visualizations
}

export interface QuizSettings {
  questionCount: number;
  level: BloomLevel;
  content: string;
  subject: Subject;
  grade: number; // Added grade (1-12)
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT'
}
