
import React from 'react';
import { Question, UserAnswer, User } from '../types';

interface ResultViewProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentUser: User | null;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ questions, userAnswers, currentUser, onRestart }) => {
  const score = userAnswers.filter(
    (ans, idx) => ans.selectedIndex === questions[idx].correctAnswerIndex
  ).length;

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto p-4 animate-in zoom-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl border border-blue-50 overflow-hidden mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-center text-white relative">
          <div className="inline-block p-4 rounded-full bg-white/20 backdrop-blur-md mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Hoàn thành bài luyện tập!</h2>
          <p className="text-blue-100 text-lg opacity-90">Dưới đây là kết quả chi tiết và lời giải từ AI.</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="text-3xl font-bold">{score}/{questions.length}</div>
              <div className="text-xs uppercase tracking-wider opacity-70">Số câu đúng</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="text-3xl font-bold">{percentage}%</div>
              <div className="text-xs uppercase tracking-wider opacity-70">Điểm số</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Xem lại đáp án & Giải thích</h3>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAns = userAnswers.find(a => a.questionId === q.id);
              const isCorrect = userAns?.selectedIndex === q.correctAnswerIndex;

              return (
                <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex items-start mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold mr-3 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      {q.diagram && (
                        <div className="mb-4 flex justify-center p-3 bg-slate-50 rounded-xl border border-slate-100 max-w-sm">
                          <div 
                            className="w-full h-auto text-blue-900"
                            dangerouslySetInnerHTML={{ __html: q.diagram }}
                          />
                        </div>
                      )}
                      <p className="text-slate-800 font-medium leading-relaxed">{q.text}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 pl-11">
                    {q.options.map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className={`text-sm p-3 rounded-lg border flex items-center ${
                          oIdx === q.correctAnswerIndex
                            ? 'bg-green-50 border-green-200 text-green-700 font-medium'
                            : oIdx === userAns?.selectedIndex && !isCorrect
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-slate-50 border-slate-100 text-slate-500'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                        {opt}
                        {oIdx === q.correctAnswerIndex && <svg className="w-4 h-4 ml-auto text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 pl-4 ml-11">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM6.464 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" /></svg>
                      Giải thích Equation:
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed italic">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center"
        >
          Làm bài thi mới
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ResultView;
