
import { BloomLevel, Question, Subject } from './types';

export const BLOOM_LEVELS = [
  BloomLevel.KNOWLEDGE,
  BloomLevel.COMPREHENSION,
  BloomLevel.APPLICATION,
  BloomLevel.ANALYSIS
];

export const SUBJECTS = [
  { id: Subject.MATH, icon: '📐', color: 'bg-blue-500' },
  { id: Subject.LITERATURE, icon: '📚', color: 'bg-orange-500' },
  { id: Subject.ENGLISH, icon: '🔤', color: 'bg-purple-500' },
  { id: Subject.PHYSICS, icon: '⚡', color: 'bg-cyan-500' },
  { id: Subject.CHEMISTRY, icon: '🧪', color: 'bg-emerald-500' },
  { id: Subject.BIOLOGY, icon: '🧬', color: 'bg-green-500' },
  { id: Subject.HISTORY, icon: '🏺', color: 'bg-amber-600' },
  { id: Subject.GEOGRAPHY, icon: '🌍', color: 'bg-indigo-500' },
];

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export const QUESTION_COUNTS = [5, 10, 15, 20];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    type: 'MCQ',
    text: 'Đâu là đơn vị đo cường độ dòng điện?',
    options: ['Vôn (V)', 'Ampe (A)', 'Ôm (Ω)', 'Oat (W)'],
    correctIndex: 1,
    explanation: 'Ampe (kí hiệu A) là đơn vị đo cường độ dòng điện trong hệ SI.'
  }
];

export const LOADING_MESSAGES = [
  "Đang đọc tài liệu của bạn...",
  "Đang phân tích từ khóa quan trọng...",
  "Đang vẽ hình minh họa cho các phần khó...",
  "Đang biên soạn câu hỏi trắc nghiệm...",
  "Đang chuẩn bị đáp án chi tiết...",
  "Sắp xong rồi, đợi một chút nhé!"
];
