
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuizSession from './components/QuizSession';
import ResultView from './components/ResultView';
import TeacherDashboard from './components/TeacherDashboard';
import Login from './components/Login';
import AdminSettings from './components/AdminSettings';
import NotificationCenter from './components/NotificationCenter';
import { generateMathQuiz } from './services/geminiService';
import { AppState, Question, UserAnswer, QuizSettings, User, AVAILABLE_SUBJECTS, AppSettings, QuizResultNotification, DifficultyLevel } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<AppState>(AppState.LOGIN);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<Question[]>([]);
  const [notifications, setNotifications] = useState<QuizResultNotification[]>([]);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'THCS TTGL',
    appSubtitle: 'Luyện tập'
  });

  const [settings, setSettings] = useState<QuizSettings>({
    grade: 6,
    topic: '',
    subject: AVAILABLE_SUBJECTS[0],
    numQuestions: 5,
    source: 'AI',
    difficulty: 1
  });

  useEffect(() => {
    const savedLib = localStorage.getItem('math_library');
    if (savedLib) {
      try { setLibrary(JSON.parse(savedLib)); } catch (e) { console.error(e); }
    }

    const savedSettings = localStorage.getItem('thcsttgl_settings');
    if (savedSettings) {
      try { setAppSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }

    const savedNotifs = localStorage.getItem('thcsttgl_notifications');
    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveLibrary = (newLib: Question[]) => {
    setLibrary(newLib);
    localStorage.setItem('math_library', JSON.stringify(newLib));
  };

  const saveAppSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('thcsttgl_settings', JSON.stringify(newSettings));
    setState(AppState.HOME);
  };

  const saveNotifications = (newNotifs: QuizResultNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('thcsttgl_notifications', JSON.stringify(newNotifs));
  };

  const startQuiz = async () => {
    setError(null);
    if (settings.source === 'LIBRARY') {
      const filtered = library.filter(q => 
        q.grade === settings.grade && 
        q.subject === settings.subject &&
        (settings.topic ? q.topic?.toLowerCase().includes(settings.topic.toLowerCase()) : true)
      );
      if (filtered.length === 0) {
        setError(`Không tìm thấy câu hỏi phù hợp trong thư viện.`);
        return;
      }
      setQuestions([...filtered].sort(() => 0.5 - Math.random()).slice(0, settings.numQuestions));
      setState(AppState.QUIZ);
    } else {
      setState(AppState.GENERATING);
      try {
        const generatedQuestions = await generateMathQuiz(settings);
        setQuestions(generatedQuestions);
        setState(AppState.QUIZ);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
        setState(AppState.HOME);
      }
    }
  };

  const finishQuiz = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setState(AppState.RESULT);
  };

  const sendResultToTeacher = (score: number, total: number) => {
    if (!user || !user.teacherId) return;
    
    // Nếu là AI chọn chủ đề ngẫu nhiên, ta ghi là 'Kiến thức tổng hợp'
    const displayTopic = settings.topic || 'Kiến thức tổng hợp';

    const newNotif: QuizResultNotification = {
      id: Date.now().toString(),
      studentName: user.fullName,
      studentId: user.username,
      teacherId: user.teacherId,
      subject: settings.subject,
      topic: displayTopic,
      score,
      total,
      timestamp: Date.now(),
      read: false
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    saveNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    if (isAdmin) saveNotifications([]);
    else if (user) saveNotifications(notifications.filter(n => n.teacherId !== user.username));
  };

  const reset = () => {
    setState(AppState.HOME);
    setQuestions([]);
    setUserAnswers([]);
    setError(null);
  };

  const isAdmin = user?.username === 'admin';
  
  const userNotifications = isAdmin 
    ? notifications 
    : notifications.filter(n => n.teacherId === user?.username);
  
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getDifficultyText = (level: DifficultyLevel) => {
    switch (level) {
      case 1: return "Nhận biết";
      case 2: return "Thông hiểu";
      case 3: return "Vận dụng";
      case 4: return "Vận dụng cao";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        role={user?.role || null} 
        userName={user?.fullName} 
        usernameId={user?.username}
        settings={appSettings}
        notificationCount={unreadCount}
        onLogout={() => { setUser(null); setState(AppState.LOGIN); reset(); }} 
        onOpenSettings={() => setState(AppState.ADMIN_SETTINGS)}
        onOpenNotifications={() => setState(AppState.NOTIFICATIONS)}
      />
      
      <main className="flex-grow pt-8 pb-16 px-4">
        {state === AppState.LOGIN && (
          <Login onLoginSuccess={(u) => { setUser(u); setState(AppState.HOME); }} />
        )}

        {state === AppState.HOME && user && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            {(isAdmin || user.role === 'TEACHER') && (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <button 
                  onClick={() => setState(AppState.TEACHER_DASHBOARD)}
                  className="group p-8 bg-white border-2 border-blue-50 rounded-3xl shadow-xl hover:border-blue-500 transition-all hover:-translate-y-2 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <svg className="w-8 h-8 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Thư viện trường</h3>
                  <p className="text-slate-500 text-sm mt-1">Quản lý kho câu hỏi dữ liệu trường.</p>
                </button>
                <button 
                  onClick={() => setState(AppState.NOTIFICATIONS)}
                  className="group p-8 bg-indigo-50 border-2 border-indigo-100 rounded-3xl shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center relative"
                >
                  {unreadCount > 0 && <span className="absolute top-4 right-4 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-black animate-pulse">{unreadCount}</span>}
                  <div className="w-16 h-16 bg-indigo-200 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <svg className="w-8 h-8 text-indigo-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900">Thông báo học sinh</h3>
                  <p className="text-indigo-400 text-sm mt-1">Xem kết quả bài làm học sinh gửi về.</p>
                </button>
              </div>
            )}

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-blue-900 mb-2 tracking-tight">Cấu hình bài luyện tập</h2>
              <p className="text-slate-500 font-medium">Lựa chọn môn học và kiến thức bạn muốn thử thách</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-blue-600 p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Nguồn câu hỏi</h3>
                <div className="space-y-4">
                  <button onClick={() => setSettings({...settings, source: 'AI'})} className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center ${settings.source === 'AI' ? 'bg-white text-blue-600 border-white' : 'bg-blue-700/50 border-blue-500 hover:bg-blue-500/50'}`}>
                    <div className={`p-2 rounded-lg mr-3 ${settings.source === 'AI' ? 'bg-blue-50' : 'bg-blue-600'}`}>✨</div>
                    <div><h4 className="font-bold text-sm">Học cùng AI</h4><p className="text-[10px] opacity-70">Soạn đề ngẫu nhiên từ AI</p></div>
                  </button>
                  <button onClick={() => setSettings({...settings, source: 'LIBRARY'})} className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center ${settings.source === 'LIBRARY' ? 'bg-white text-blue-600 border-white' : 'bg-blue-700/50 border-blue-500 hover:bg-blue-500/50'}`}>
                    <div className={`p-2 rounded-lg mr-3 ${settings.source === 'LIBRARY' ? 'bg-blue-50' : 'bg-blue-600'}`}>📚</div>
                    <div><h4 className="font-bold text-sm">Thư viện trường</h4><p className="text-[10px] opacity-70">Đề từ kho giáo viên soạn</p></div>
                  </button>
                </div>
              </div>

              <div className="md:w-2/3 p-8">
                {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium flex items-center">{error}</div>}
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Môn học</label>
                    <select value={settings.subject} onChange={(e) => setSettings({...settings, subject: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 font-bold">
                      {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Khối lớp</label>
                    <select value={settings.grade} onChange={(e) => setSettings({...settings, grade: parseInt(e.target.value)})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 font-bold">
                      {[6, 7, 8, 9].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Chủ đề bài học</label>
                    <input type="text" placeholder="Để trống để AI tự động chọn ngẫu nhiên" value={settings.topic} onChange={(e) => setSettings({...settings, topic: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 font-medium italic placeholder:text-slate-300" />
                  </div>

                  {/* Difficulty Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Độ khó mong muốn</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSettings({...settings, difficulty: level as DifficultyLevel})}
                          className={`flex-1 group py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${
                            settings.difficulty === level 
                              ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm' 
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-400'
                          }`}
                        >
                          <div className="flex space-x-0.5">
                            {[...Array(level)].map((_, i) => (
                              <svg key={i} className={`w-3.5 h-3.5 ${settings.difficulty === level ? 'fill-blue-600' : 'fill-slate-300 group-hover:fill-blue-400'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {getDifficultyText(level as DifficultyLevel)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Số lượng câu</label>
                    <div className="flex space-x-2">
                      {[5, 10, 15, 20].map(n => <button key={n} onClick={() => setSettings({...settings, numQuestions: n})} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${settings.numQuestions === n ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-200'}`}>{n}</button>)}
                    </div>
                  </div>
                  <button onClick={startQuiz} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-100 hover:shadow-indigo-200 hover:-translate-y-1 active:scale-95 transition-all mt-4">Bắt đầu luyện tập ngay</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.TEACHER_DASHBOARD && (isAdmin || user?.role === 'TEACHER') && (
          <TeacherDashboard library={library} onAddQuestion={(q) => saveLibrary([q, ...library])} onDeleteQuestion={(id) => saveLibrary(library.filter(q => q.id !== id))} onBack={() => setState(AppState.HOME)} />
        )}

        {state === AppState.ADMIN_SETTINGS && isAdmin && (
          <AdminSettings settings={appSettings} onSave={saveAppSettings} onBack={() => setState(AppState.HOME)} />
        )}

        {state === AppState.NOTIFICATIONS && (isAdmin || user?.role === 'TEACHER') && (
          <NotificationCenter notifications={userNotifications} onBack={() => setState(AppState.HOME)} onClear={clearNotifications} onMarkRead={markNotificationAsRead} />
        )}

        {state === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-black text-blue-900 mb-2 text-center px-4">Đang biên soạn đề bài thông minh...</h3>
            <p className="text-slate-500 font-medium text-center px-4">Hệ thống đang lựa chọn các mảng kiến thức phù hợp nhất cho bạn.</p>
          </div>
        )}

        {state === AppState.QUIZ && questions.length > 0 && (
          <QuizSession questions={questions} onComplete={finishQuiz} onCancel={reset} />
        )}

        {state === AppState.RESULT && (
          <ResultView 
            questions={questions} 
            userAnswers={userAnswers} 
            currentUser={user}
            onRestart={reset} 
            onSendResult={sendResultToTeacher}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs font-medium">
          <p>© 2024 {appSettings.appName} - {appSettings.appSubtitle} - Nền tảng luyện tập THCS</p>
          <div className="flex space-x-6 mt-4 md:mt-0 uppercase tracking-widest text-[10px] font-bold">
            <a href="https://drive.google.com/drive/folders/1uyVJl3QJ6zkgCrRlmPwX4qeA74mztUr9?usp=sharing" target="_blank" className="hover:text-blue-500 transition-colors">Kho dữ liệu dùng chung</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
