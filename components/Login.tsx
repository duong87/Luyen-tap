
import React, { useState } from 'react';
import { fetchUsersFromSheet } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const users = await fetchUsersFromSheet();
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        onLoginSuccess({
          username: user.username,
          role: user.role,
          fullName: user.fullName
        });
      } else {
        setError("Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      setError("Không thể kết nối với máy chủ xác thực.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-blue-600 rounded-3xl mb-4 shadow-lg shadow-blue-200">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Đăng nhập</h2>
        <p className="text-slate-500 mt-2 font-medium">Hệ thống luyện tập THCS TTGL</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-medium flex items-center animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Tên đăng nhập</label>
          <input
            type="text"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            placeholder="Nhập tài khoản..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-indigo-200 hover:-translate-y-1'}`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Đăng nhập ngay'}
        </button>
      </form>

      <p className="text-center mt-8 text-slate-400 text-xs font-medium">
        Liên hệ quản trị viên nếu bạn quên mật khẩu
      </p>
    </div>
  );
};

export default Login;
