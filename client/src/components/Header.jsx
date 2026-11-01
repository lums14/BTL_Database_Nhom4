import React, { useState } from 'react';
import { Search, Bell, Shield, User, FileUp, Download, Database, Check } from 'lucide-react';

export default function Header({
  searchQuery,
  onSearchChange,
  currentRole,
  onRoleChange,
  isOnline
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-[70px] bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Search Bar with Ctrl+K */}
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm nhanh tài liệu, danh mục, phòng ban..."
            className="w-full h-10 pl-10 pr-20 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-blue-500 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none text-[10px] font-bold text-slate-400">
            <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-sm">Ctrl</kbd>
            <span>+</span>
            <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Backend Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-amber-500'}`}></span>
          <span>{isOnline ? 'API Live (MySQL)' : 'Chế độ Demo Fallback'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition relative"
            title="Thông báo hoạt động"
          >
            <Bell className="w-4 h-4" />
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Thông Báo Hoạt Động</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  3 mới
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FileUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-snug">
                      <strong>Vũ Thành Long</strong> vừa tải lên tài liệu <em>Hướng Dẫn Docker CI/CD</em>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">10 phút trước</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-snug">
                      Tài liệu <em>Nội Quy Lao Động 2025</em> vừa cán mốc <strong>150+ lượt tải</strong>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">1 giờ trước</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-snug">
                      Sao lưu CSDL <strong>company_docs_db</strong> thành công
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Hôm nay</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher (Admin vs Staff) */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full p-1 pl-3">
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">Chế độ:</span>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-full p-0.5">
            <button
              onClick={() => onRoleChange('Admin')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                currentRole === 'Admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
            <button
              onClick={() => onRoleChange('Staff')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                currentRole === 'Staff'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3" /> Staff
            </button>
          </div>
        </div>

        {/* User Avatar */}
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm cursor-pointer select-none"
          title={`Đang đăng nhập: ${currentRole}`}
        >
          NA
        </div>
      </div>
    </header>
  );
}
