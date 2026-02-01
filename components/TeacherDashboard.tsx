
import React, { useState } from 'react';
import { Question, AVAILABLE_SUBJECTS } from '../types';

interface TeacherDashboardProps {
  library: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onBack: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ library, onAddQuestion, onDeleteQuestion, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [newQ, setNewQ] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
    grade: 6,
    topic: '',
    subject: AVAILABLE_SUBJECTS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question: Question = {
      ...newQ,
      id: Date.now().toString(),
      isCustom: true
    };
    onAddQuestion(question);
    setShowForm(false);
    setNewQ({
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: '',
      grade: 6,
      topic: '',
      subject: AVAILABLE_SUBJECTS[0]
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-blue-600 transition-colors font-medium group"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </div>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-blue-900 leading-tight">Thư viện trường</h2>
            <p className="text-slate-500 text-sm">Quản lý kho câu hỏi luyện tập của bạn</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-md shadow-blue-100"
          >
            {showForm ? 'Đóng form' : '+ Thêm câu hỏi'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 mb-12 animate-in slide-in-from-top duration-300">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Soạn câu hỏi mới</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Khối lớp</label>
                <select 
                  value={newQ.grade}
                  onChange={e => setNewQ({...newQ, grade: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                >
                  {[6, 7, 8, 9].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Môn học</label>
                <select 
                  value={newQ.subject}
                  onChange={e => setNewQ({...newQ, subject: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                >
                  {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Chủ đề</label>
                <input 
                  type="text" required
                  value={newQ.topic}
                  onChange={e => setNewQ({...newQ, topic: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="VD: Phân số"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nội dung câu hỏi</label>
              <textarea 
                required value={newQ.text}
                onChange={e => setNewQ({...newQ, text: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 min-h-[100px]"
                placeholder="Nhập nội dung bài toán..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newQ.options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <span className="font-bold text-blue-600">{String.fromCharCode(65+i)}</span>
                  <input 
                    required value={opt}
                    onChange={e => {
                      const opts = [...newQ.options];
                      opts[i] = e.target.value;
                      setNewQ({...newQ, options: opts});
                    }}
                    className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                    placeholder={`Lựa chọn ${String.fromCharCode(65+i)}`}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Đáp án đúng</label>
                <select 
                  value={newQ.correctAnswerIndex}
                  onChange={e => setNewQ({...newQ, correctAnswerIndex: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                >
                  {newQ.options.map((_, i) => (
                    <option key={i} value={i}>Đáp án {String.fromCharCode(65+i)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Giải thích chi tiết</label>
                <input 
                  type="text" required
                  value={newQ.explanation}
                  onChange={e => setNewQ({...newQ, explanation: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Tại sao đáp án đó lại đúng?"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95">
              Lưu vào thư viện
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {library.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-blue-100">
            <p className="text-slate-400">Thư viện đang trống. Hãy thêm câu hỏi đầu tiên!</p>
          </div>
        ) : (
          library.map(q => (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm flex items-start justify-between hover:border-blue-200 transition-all group">
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">Lớp {q.grade}</span>
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded">{q.subject}</span>
                  <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">{q.topic}</span>
                </div>
                <h4 className="text-lg font-medium text-slate-800 mb-4">{q.text}</h4>
                <div className="grid grid-cols-2 gap-2 max-w-md">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`text-sm ${i === q.correctAnswerIndex ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                      {String.fromCharCode(65+i)}. {opt}
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onDeleteQuestion(q.id)}
                className="text-slate-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
