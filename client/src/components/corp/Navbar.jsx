import React, { useState } from 'react';
import { LogOut, ShieldCheck, UserCheck, ChevronDown, RefreshCw, Sparkles, Building } from 'lucide-react';
import { FALLBACK_USERS } from '../../services/api';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  onSwitchAccount 
}) {
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const navTabs = [
    { id: 'dashboard', label: 'TỔNG QUAN' },
    { id: 'repository', label: 'KHO TÀI LIỆU (50 BẢN GHI)' },
    { id: 'reader', label: 'XEM TÀI LIỆU' },
    { id: 'ingestion', label: 'NẠP TÀI LIỆU' },
    { id: 'analytics', label: 'THỐNG KÊ & BÁO CÁO SQL' },
    { id: 'compliance', label: 'TUÂN THỦ & PHÁP LÝ' },
    { id: 'admin', label: 'QUẢN TRỊ HỆ THỐNG' },
  ];

  const isAdmin = currentUser?.role_id === 1 || currentUser?.role_name === 'Admin';

  // Helper lấy chữ cái đầu
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-6 sm:px-8 h-16 flex items-center justify-between font-sans shadow-2xs">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab('repository')}
          className="text-sm font-black tracking-widest text-black hover:opacity-85 transition font-sans flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
            N4
          </div>
          <div className="text-left">
            <span className="block leading-none font-mono">BTL_Nhóm 4</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-wider">
              QUẢN LÝ TÀI LIỆU NỘI BỘ
            </span>
          </div>
        </button>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-6 h-full">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-full flex items-center text-xs tracking-wider font-semibold transition relative cursor-pointer px-1 ${
                isActive
                  ? 'text-black font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-black'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: User Profile & Role Badge & Logout */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-3">
            {/* User Quick Info */}
            <div className="relative">
              <div 
                onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-1.5 pl-2.5 rounded-full cursor-pointer transition select-none shadow-2xs"
                title="Bấm để chuyển đổi nhanh giữa 10 tài khoản demo"
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ${
                  isAdmin 
                    ? 'bg-gradient-to-tr from-rose-500 to-purple-600' 
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                }`}>
                  {getInitials(currentUser.full_name)}
                </div>

                {/* Name & Dept */}
                <div className="text-left hidden sm:block pr-1">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {currentUser.dept_name}
                  </div>
                </div>

                {/* Role Badge (Admin: Đỏ/Tím, Staff: Xanh) */}
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isAdmin
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isAdmin ? <ShieldCheck className="w-3 h-3 text-purple-600" /> : <UserCheck className="w-3 h-3 text-emerald-600" />}
                  <span>{currentUser.role_name || (isAdmin ? 'Admin' : 'Staff')}</span>
                </span>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </div>

              {/* Quick Account Switcher Dropdown */}
              {showSwitchMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Đổi Tài Khoản Demo (RBAC)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">10 Users</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {FALLBACK_USERS.map((u) => {
                      const isCurrent = u.user_id === currentUser.user_id;
                      const isUAdmin = u.role_id === 1;

                      return (
                        <div
                          key={u.user_id}
                          onClick={() => {
                            setShowSwitchMenu(false);
                            onSwitchAccount(u);
                          }}
                          className={`p-2.5 px-3 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between text-xs ${
                            isCurrent ? 'bg-blue-50/60 font-semibold text-blue-900' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{u.full_name}</span>
                              {isCurrent && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full">Hiện tại</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">{u.dept_name}</div>
                          </div>

                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                            isUAdmin 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {u.role_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 p-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Đăng xuất khỏi phiên làm việc"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ĐĂNG XUẤT</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className="text-xs font-bold uppercase tracking-wider text-white bg-black hover:bg-slate-800 px-4 py-2 rounded-lg transition"
          >
            ĐĂNG NHẬP
          </button>
        )}
      </div>
    </header>
  );
}
