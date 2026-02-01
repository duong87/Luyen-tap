
import React from 'react';
import { QuizResultNotification } from '../types';

interface NotificationCenterProps {
  notifications: QuizResultNotification[];
  onBack: () => void;
  onClear: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onBack, onClear, onMarkRead }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-blue-600 transition-colors font-medium group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 mr-2 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </div>
          Quay lại
        </button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Thông báo kết quả</h2>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest px-3 py-1 bg-red-50 rounded-lg"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <p className="text-slate-400 font-medium italic">Chưa có thông báo kết quả nào từ học sinh.</p>
          </div>
        ) : (
          notifications.sort((a,b) => b.timestamp - a.timestamp).map(notif => (
            <div 
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`bg-white p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${
                notif.read ? 'border-slate-50 opacity-80' : 'border-blue-100 shadow-md ring-4 ring-blue-50/50'
              }`}
            >
              {!notif.read && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-xl"></div>}
              
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded tracking-tighter">
                      {notif.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(notif.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800">
                    Học sinh <span className="text-blue-600 underline underline-offset-4">{notif.studentName}</span> vừa hoàn thành bài luyện tập
                  </h3>
                  
                  <div className="mt-4 flex flex-wrap gap-4">
                     <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-slate-400 uppercase font-black">Kết quả</span>
                        <span className="text-lg font-black text-blue-900">{notif.score} / {notif.total}</span>
                     </div>
                     <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-slate-400 uppercase font-black">Chủ đề</span>
                        <span className="text-sm font-bold text-slate-700">{notif.topic}</span>
                     </div>
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ml-4 ${
                   (notif.score / notif.total) >= 0.8 ? 'bg-green-100 text-green-600' : 
                   (notif.score / notif.total) >= 0.5 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                   <span className="text-xl font-black">{Math.round((notif.score / notif.total) * 10)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center">
         <p className="text-xs text-blue-600 font-medium italic">
            Dữ liệu kết quả được đồng bộ và lưu trữ tại thư mục shared 'THCSTTGL-LT'
         </p>
      </div>
    </div>
  );
};

export default NotificationCenter;
