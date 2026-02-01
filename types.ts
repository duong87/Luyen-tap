
export type UserRole = 'STUDENT' | 'TEACHER' | null;

export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface User {
  username: string;
  role: UserRole;
  fullName: string;
  teacherId?: string; // ID của giáo viên phụ trách (dành cho học sinh)
}

export interface AppSettings {
  appName: string;
  appSubtitle: string;
  logoUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  diagram?: string; // Trường mới chứa mã SVG minh họa
  grade?: number;
  topic?: string;
  subject?: string;
  isCustom?: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
}

export interface QuizResultNotification {
  id: string;
  studentName: string;
  studentId: string;
  teacherId: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  timestamp: number;
  read: boolean;
}

export enum AppState {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  GENERATING = 'GENERATING',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export interface QuizSettings {
  grade: number;
  topic: string;
  subject: string;
  numQuestions: number;
  source: 'AI' | 'LIBRARY';
  difficulty: DifficultyLevel;
}

export const AVAILABLE_SUBJECTS = [
  'Toán học',
  'Ngữ văn',
  'Tiếng Anh',
  'Vật lí',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lí',
  'GDCD',
  'Tin học',
  'Công nghệ',
  'Toán bằng tiếng Anh',
  'Vật lí bằng tiếng Anh',
  'Hóa học bằng tiếng Anh',
  'Sinh học bằng tiếng Anh'
];
