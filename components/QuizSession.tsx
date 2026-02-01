
import React, { useState } from 'react';
import { Question, UserAnswer } from '../types';

interface QuizSessionProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  onCancel: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ questions, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    
    if (existingIndex > -1) {
      newAnswers[existingIndex] = { questionId: currentQuestion.id, selectedIndex: index };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, selectedIndex: index });
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Progress & Navigation Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onCancel}
            className="group flex items-center text-slate-400 hover:text-red-500 transition-all duration-300 font-medium text-sm"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 mr-2 group-hover:border-red-100 group-hover:bg-red-50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            Dừng làm bài
          </button>
          
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Câu hỏi hiện tại</span>
            <span className="text-xl font-black text-blue-600">
              {currentIndex + 1} <span className="text-slate-300 font-medium">/ {questions.length}</span>
            </span>
          </div>
        </div>

        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-white">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-blue-50 p-8 md:p-12 mb-10 relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-100 shadow-sm">
              {currentQuestion.topic || 'Kiến thức tổng hợp'}
            </div>
          </div>

          {/* Diagram Section: FIXED POSITION AT TOP */}
          {currentQuestion.diagram && (
            <div className="mb-8 flex justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-inner overflow-hidden">
              <div 
                className="w-full max-w-[280px] flex items-center justify-center text-blue-900 drop-shadow-sm"
                dangerouslySetInnerHTML={{ __html: currentQuestion.diagram }}
              />
            </div>
          )}
          
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-[1.5] mb-4">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentAnswer?.selectedIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`group relative w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 flex items-center hover:scale-[1.01] active:scale-[0.99] ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-50'
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl mr-5 font-black text-lg transition-all duration-300 shrink-0 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  
                  <span className={`text-lg font-medium leading-relaxed transition-colors duration-300 ${
                    isSelected ? 'text-indigo-900' : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {option}
                  </span>

                  {isSelected && (
                    <div className="ml-auto bg-indigo-600 p-1.5 rounded-full text-white animate-in zoom-in duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation Controls */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold flex items-center justify-center transition-all duration-300 ${
            currentIndex === 0 
              ? 'bg-slate-50 text-slate-300 border border-slate-100 opacity-50 cursor-not-allowed' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-95'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>

        <button
          onClick={handleNext}
          disabled={currentAnswer === undefined}
          className={`flex-[2] md:flex-none md:min-w-[240px] px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center shadow-xl ${
            currentAnswer === undefined
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:-translate-y-1 hover:shadow-indigo-200 active:scale-95'
          }`}
        >
          {currentIndex === questions.length - 1 ? (
            <>
              Nộp bài luyện tập
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          ) : (
            <>
              Câu tiếp theo
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 7l5 5-5 5" />
              </svg>
            </>
          )}
        </button>
      </div>
      
      <div className="mt-8 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        Lựa chọn đáp án để tiếp tục cuộc hành trình
      </div>
    </div>
  );
};

export default QuizSession;
