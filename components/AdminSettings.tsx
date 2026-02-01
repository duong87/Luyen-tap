
import React, { useState, useRef } from 'react';
import { AppSettings } from '../types';

interface AdminSettingsProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onBack: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSave, onBack }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cài đặt hệ thống</h2>
        <div className="w-20"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4 pb-8 border-b border-slate-100">
            <div className="relative group">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-700">Logo ứng dụng</h3>
              <p className="text-xs text-slate-400">Tải lên hình ảnh làm logo cho hệ thống</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tên ứng dụng (Dòng chính)</label>
              <input 
                type="text"
                value={formData.appName}
                onChange={e => setFormData({...formData, appName: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-lg"
                placeholder="VD: THCS TTGL"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tiêu đề phụ (Dòng nhỏ)</label>
              <input 
                type="text"
                value={formData.appSubtitle}
                onChange={e => setFormData({...formData, appSubtitle: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                placeholder="VD: Luyện tập"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-1 active:scale-95 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
