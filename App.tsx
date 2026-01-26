
import React, { useState, useEffect } from 'react';
import { AppState, QuizSettings, BloomLevel, Question, Subject } from './types';
import { BLOOM_LEVELS, QUESTION_COUNTS, LOADING_MESSAGES, MOCK_QUESTIONS, SUBJECTS, GRADES } from './constants';
import { generateQuestions } from './services/geminiService';

// --- Sub-components ---

const Header = () => (
  <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
    <div className="max-w-5xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg transition-all group-hover:rotate-12 group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-900 tracking-tighter leading-none">
            SmartLearn <span className="text-blue-500">THCS</span>
          </h1>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Hệ thống ôn tập AI</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="hidden lg:flex gap-4 text-sm font-bold text-slate-400">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Tài liệu</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Cộng đồng</span>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-blue-100 animate-pulse">
          PREMIUM AI
        </div>
      </div>
    </div>
  </header>
);

const InputSection = ({ onStart }: { onStart: (settings: QuizSettings) => void }) => {
  const [content, setContent] = useState('');
  const [count, setCount] = useState(10);
  const [level, setLevel] = useState<BloomLevel>(BloomLevel.KNOWLEDGE);
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [grade, setGrade] = useState<number>(6); // Default Grade 6

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Left: Settings */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-[2rem] shadow-xl p-6 border border-blue-50">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-xl text-blue-600">🎯</span>
            Thiết lập bài học
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Chọn lớp học</label>
              <div className="relative group">
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 appearance-none shadow-sm cursor-pointer transition-all hover:bg-white"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>
                      Lớp {g}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Chọn môn học</label>
              <div className="relative group">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700 appearance-none shadow-sm cursor-pointer transition-all hover:bg-white"
                >
                  {SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.id}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Độ khó</label>
              <div className="space-y-2">
                {BLOOM_LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                      level === l ? 'border-blue-500 bg-blue-600 text-white shadow-lg' : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Số lượng câu</label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {QUESTION_COUNTS.map(c => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${
                      count === c ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Content Area */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 border border-blue-50 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span className="text-3xl">📝</span>
              Nội dung bài học
            </h2>
            <div className={`px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-tighter ${SUBJECTS.find(s => s.id === subject)?.color || 'bg-blue-600'}`}>
              Lớp {grade} • {subject}
            </div>
          </div>
          
          <textarea
            className="flex-grow w-full min-h-[350px] p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-600 resize-none shadow-inner leading-relaxed"
            placeholder="Dán nội dung bài học, định nghĩa, bài toán... AI sẽ chỉ vẽ hình cho những phần trừu tượng khó hiểu!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={() => onStart({ content, questionCount: count, level, subject, grade })}
            className="mt-8 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 text-xl"
          >
            Tạo bài tập thông minh
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const QuizSection = ({ 
  questions, 
  onFinish 
}: { 
  questions: Question[], 
  onFinish: (answers: Record<string, number>) => void 
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleSelect = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const isLast = currentIdx === questions.length - 1;
  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 animate-in fade-in duration-500 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between px-4">
        <div className="flex gap-2 flex-grow">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentIdx ? 'flex-grow bg-blue-600' : 
                answers[questions[i].id] !== undefined ? 'w-4 bg-green-500' : 'w-4 bg-slate-200'
              }`} 
            />
          ))}
        </div>
        <div className="ml-6 text-sm font-black text-slate-400 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-50">
          CÂU {currentIdx + 1} / {questions.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Question Text & Options */}
        <div className={`lg:col-span-${currentQ.svgCode ? '7' : '12'} bg-white rounded-[3rem] shadow-2xl p-8 md:p-10 border border-blue-50 flex flex-col min-h-[450px]`}>
          <div className="mb-6">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 tracking-tighter ${
              currentQ.type === 'TRUE_FALSE' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {currentQ.type === 'TRUE_FALSE' ? 'Thử thách Đúng/Sai' : 'Trắc nghiệm kiến thức'}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
              {currentQ.text}
            </h3>
          </div>

          <div className={`grid gap-4 mt-auto pt-6 ${currentQ.type === 'TRUE_FALSE' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(currentQ.id, i)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group relative overflow-hidden ${
                  answers[currentQ.id] === i
                    ? 'border-blue-600 bg-blue-50 text-blue-700 scale-[1.02] shadow-xl shadow-blue-100'
                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-all ${
                  answers[currentQ.id] === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-200'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-bold text-lg">{opt}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-slate-50 pt-8">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="px-6 py-3 font-black text-slate-400 hover:text-blue-600 disabled:opacity-0 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Trước
            </button>

            {isLast ? (
              <button
                disabled={answers[currentQ.id] === undefined}
                onClick={() => onFinish(answers)}
                className="px-10 py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center gap-2"
              >
                Nộp bài tập
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            ) : (
              <button
                disabled={answers[currentQ.id] === undefined}
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
              >
                Tiếp theo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* SVG Diagram Area */}
        {currentQ.svgCode && (
          <div className="lg:col-span-5 bg-white rounded-[3rem] shadow-xl p-8 border border-blue-50 flex flex-col items-center justify-center animate-in slide-in-from-right-8 duration-700">
            <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-6">Trực quan hóa thông minh</h4>
            <div 
              className="w-full h-auto flex items-center justify-center p-4 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: currentQ.svgCode }}
            />
            <p className="mt-6 text-xs text-slate-400 text-center italic font-medium px-4 leading-relaxed">
              Hình minh họa
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultSection = ({ 
  questions, 
  userAnswers, 
  onRestart 
}: { 
  questions: Question[], 
  userAnswers: Record<string, number>,
  onRestart: () => void 
}) => {
  const score = questions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0), 0);
  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    if (percentage >= 80) {
      (window as any).confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
      });
    }
  }, [percentage]);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 mb-24 animate-in zoom-in duration-700">
      <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-blue-50">
        <div className={`p-12 text-center text-white relative overflow-hidden ${
          percentage >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 
          percentage >= 50 ? 'bg-gradient-to-br from-blue-600 to-indigo-800' : 
          'bg-gradient-to-br from-orange-500 to-red-600'
        }`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-6xl mb-4 animate-bounce-subtle">
              {percentage >= 80 ? '👑' : percentage >= 50 ? '🥈' : '📚'}
            </div>
            <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">
              {percentage >= 80 ? 'Bậc thầy kiến thức!' : percentage >= 50 ? 'Kết quả rất tốt!' : 'Tiếp tục luyện tập nhé!'}
            </h2>
            <div className="bg-white/20 backdrop-blur-xl rounded-[2.5rem] px-8 py-4 border border-white/30 mb-6">
               <span className="text-6xl font-black">{percentage}%</span>
            </div>
            <p className="text-white/90 font-bold text-xl tracking-wide">
              {score} / {questions.length} câu chính xác
            </p>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="p-8 md:p-14 space-y-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
               <h3 className="font-black text-slate-800 text-2xl">Phân tích chi tiết</h3>
               <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Xem lại bài giải</span>
            </div>
            
            <div className="grid gap-8">
              {questions.map((q, i) => {
                const isCorrect = userAnswers[q.id] === q.correctIndex;
                return (
                  <div key={q.id} className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.01] ${
                    isCorrect ? 'bg-green-50/20 border-green-100' : 'bg-red-50/20 border-red-100'
                  }`}>
                    <div className="flex gap-5 mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-lg ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {i + 1}
                      </div>
                      <p className="font-black text-slate-800 text-xl leading-tight pt-1.5">{q.text}</p>
                    </div>
                    
                    <div className="ml-16 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-2xl border flex flex-col ${isCorrect ? 'bg-white border-green-200 shadow-sm' : 'bg-white border-red-100 shadow-sm'}`}>
                          <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Lựa chọn của bạn</span>
                          <p className={`font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                            {userAnswers[q.id] !== undefined ? q.options[userAnswers[q.id]] : 'Bỏ qua'}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-200 shadow-sm flex flex-col">
                            <span className="text-[10px] font-black uppercase text-green-400 mb-1">Đáp án đúng</span>
                            <p className="font-bold text-lg text-green-700">{q.options[q.correctIndex]}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-blue-600/5 p-6 rounded-[2rem] border border-blue-100 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 text-blue-600/10 group-hover:scale-125 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                          </svg>
                        </div>
                        <h5 className="text-[10px] font-black uppercase text-blue-400 mb-2">Phân tích chuyên môn</h5>
                        <p className="text-slate-600 font-bold italic leading-relaxed relative z-10">
                          "{q.explanation}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-6 bg-slate-900 hover:bg-black text-white font-black rounded-[2.5rem] transition-all shadow-2xl shadow-slate-200 transform hover:scale-[1.02] active:scale-95 text-xl tracking-tight"
          >
            Làm bài mới, điểm cao hơn!
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    let interval: any;
    if (appState === AppState.LOADING) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleStart = async (settings: QuizSettings) => {
    setAppState(AppState.LOADING);
    try {
      const generated = await generateQuestions(settings);
      setQuestions(generated);
      setAppState(AppState.QUIZ);
    } catch (error) {
      console.warn("API error, using fallback questions");
      setTimeout(() => {
        setQuestions(MOCK_QUESTIONS);
        setAppState(AppState.QUIZ);
      }, 3000);
    }
  };

  const handleFinish = (answers: Record<string, number>) => {
    setUserAnswers(answers);
    setAppState(AppState.RESULT);
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAppState(AppState.INPUT);
    setUserAnswers({});
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] pb-20 selection:bg-blue-200">
      <Header />

      <main>
        {appState === AppState.INPUT && (
          <InputSection onStart={handleStart} />
        )}

        {appState === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] p-8 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute inset-0 border-[8px] border-blue-50 rounded-full"></div>
              <div className="absolute inset-0 border-[8px] border-t-blue-600 border-r-indigo-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-7xl animate-bounce-subtle shadow-inner rounded-full bg-white/50 backdrop-blur-sm">⚡</div>
            </div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tighter mb-4 animate-pulse">
              {loadingMsg}
            </h2>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
            <div className="mt-12 bg-white px-6 py-3 rounded-full shadow-lg border border-blue-50">
               <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                 Đang xử lý bởi hệ thống Gemini 3 Pro
               </p>
            </div>
          </div>
        )}

        {appState === AppState.QUIZ && (
          <QuizSection 
            questions={questions} 
            onFinish={handleFinish} 
          />
        )}

        {appState === AppState.RESULT && (
          <ResultSection 
            questions={questions} 
            userAnswers={userAnswers} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      <footer className="text-center text-slate-300 text-[10px] mt-16 mb-12 px-4 font-black uppercase tracking-[0.2em] opacity-80">
        <p>SmartLearn THCS © 2026</p>
      </footer>
    </div>
  );
};

export default App;
