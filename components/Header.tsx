
import React from 'react';
import { UserRole, AppSettings } from '../types';

interface HeaderProps {
  role: UserRole;
  userName?: string;
  usernameId?: string;
  settings: AppSettings;
  notificationCount: number;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, userName, usernameId, settings, notificationCount, onLogout, onOpenSettings, onOpenNotifications }) => {
  const isAdmin = usernameId === 'admin';
  const isTeacher = role === 'TEACHER';

  return (
    <header className="bg-white border-b border-blue-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-md shadow-blue-100 flex items-center justify-center overflow-hidden w-10 h-10">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-md" />
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-blue-900 leading-tight">{settings.appName}</h1>
            <span className="text-blue-500 font-medium text-xs">{settings.appSubtitle}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {role && (
            <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">
                  {isAdmin ? 'Quản trị viên' : (role === 'TEACHER' ? 'Giáo viên' : 'Học sinh')}
                </span>
                <span className="text-sm font-bold text-blue-900 leading-none">{userName}</span>
              </div>
              
              <div className="flex items-center space-x-1 border-l border-blue-200 pl-2">
                {(isTeacher || isAdmin) && (
                  <button 
                    onClick={onOpenNotifications}
                    className="relative text-slate-400 hover:text-blue-600 transition-colors p-1"
                    title="Thông báo kết quả học sinh"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                )}

                {isAdmin && (
                  <button 
                    onClick={onOpenSettings}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                    title="Cài đặt hệ thống"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                )}
                <button 
                  onClick={onLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Đăng xuất"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
