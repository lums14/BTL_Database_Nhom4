import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Sparkles, Building2, KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';
import { loginApi } from '../../services/api';

export default function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState('an.nguyen@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  // 4 tài khoản demo nổi bật theo yêu cầu đồ án
  const quickDemoAccounts = [
    {
      id: 1,
      name: 'Nguyen Van An',
      email: 'an.nguyen@example.com',
      role: 'Admin',
      dept: 'Ban Giám Đốc / IT',
      desc: 'Toàn quyền hệ thống (Sửa/Xóa tất cả 50 tài liệu)',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 2,
      name: 'Tran Thi Binh',
      email: 'binh.tran@example.com',
      role: 'Admin',
      dept: 'Phòng Nhân Sự',
      desc: 'Toàn quyền hệ thống (Sửa/Xóa tất cả 50 tài liệu)',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 3,
      name: 'Le Minh Cuong',
      email: 'cuong.le@example.com',
      role: 'Staff',
      dept: 'Phòng Kỹ Thuật & CNTT',
      desc: 'Chỉ sửa/xóa bài do mình tạo (uploaded_by = 3)',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 4,
      name: 'Pham Thu Dung',
      email: 'dung.pham@example.com',
      role: 'Staff',
      dept: 'Phòng Kế Toán & Tài Chính',
      desc: 'Chỉ sửa/xóa bài do mình tạo (uploaded_by = 4)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  const handleQuickSelect = (acc, autoSubmit = false) => {
    setEmail(acc.email);
    setPassword('password');

    if (autoSubmit) {
      performLogin(acc.email, 'password');
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `Đã chọn: ${acc.name} (${acc.role})`,
        text: 'Bấm "XÁC THỰC TRUY CẬP" để đăng nhập',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const performLogin = async (loginEmail, loginPassword) => {
    setIsLoading(true);
    try {
      const result = await loginApi(loginEmail, loginPassword);
      if (result && result.success) {
        localStorage.setItem('docucorp_user', JSON.stringify(result.data));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Đăng nhập thành công!`,
          text: `Chào mừng ${result.data.full_name} (${result.data.role_name} - ${result.data.dept_name})`,
          showConfirmButton: false,
          timer: 2000
        });
        onLoginSuccess(result.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: result?.message || 'Email hoặc mật khẩu không chính xác. Mật khẩu mặc định là: password',
          confirmButtonColor: '#0f172a'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi kết nối',
        text: 'Không thể kết nối máy chủ xác thực.',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      {/* Left Column: Form & Demo Quick Buttons */}
      <div className="w-full lg:w-7/12 p-8 sm:p-14 lg:p-16 flex flex-col justify-between overflow-y-auto">
        {/* Top Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black tracking-widest text-sm shadow-md font-mono">
              N4
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-black uppercase font-mono block">
                BTL_Nhóm 4
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                QUẢN LÝ TÀI LIỆU NỘI BỘ
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MySQL 3NF: document_management</span>
          </div>
        </div>

        {/* Center Main Form */}
        <div className="max-w-xl w-full mx-auto my-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wider uppercase mb-3 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xác Thực Người Dùng Chuẩn Doanh Nghiệp</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-black mb-2">
              Đăng Nhập Hệ Thống
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Truy cập kho lưu trữ tài liệu với cơ chế phân quyền chi tiết (Admin toàn quyền, Staff quản lý bài đăng chính chủ).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>EMAIL NHÂN VIÊN</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 text-xs text-slate-800 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-black/5 transition"
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>MẬT KHẨU</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Mặc định: <strong className="text-slate-700 font-semibold">password</strong>
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 text-xs text-slate-800 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-black/5 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-slate-900 hover:bg-black text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>ĐANG XÁC THỰC...</span>
              ) : (
                <>
                  <span>XÁC THỰC TRUY CẬP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Buttons (Bảng chọn nhanh tài khoản Demo) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black tracking-widest uppercase text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>CHỌN NHANH TÀI KHOẢN DEMO THUYẾT TRÌNH (1-CLICK)</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Bấm để đăng nhập ngay</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickDemoAccounts.map((acc) => {
                const isAdmin = acc.role === 'Admin';
                const isSelected = email === acc.email;

                return (
                  <div
                    key={acc.id}
                    onClick={() => handleQuickSelect(acc, true)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-black bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-bold text-xs font-sans">
                        {acc.name}
                      </div>
                      <span
                        className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                          isSelected
                            ? 'bg-white/20 text-white border-white/30'
                            : acc.badgeColor
                        }`}
                      >
                        {acc.role}
                      </span>
                    </div>

                    <div className={`text-[11px] font-mono truncate mb-1.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {acc.email}
                    </div>

                    <div className={`text-[10px] leading-tight line-clamp-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {acc.desc}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {acc.dept}
                      </span>
                      <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-emerald-400' : 'text-blue-600 group-hover:translate-x-0.5 transition'}`}>
                        Đăng nhập →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          <span>BTL_NHÓM 4 • QUẢN LÝ TÀI LIỆU NỘI BỘ (RBAC ARCHITECTURE)</span>
          <span>10 USERS • 50 DOCUMENTS • 3NF READY</span>
        </div>
      </div>

      {/* Right Column: Corporate Branding Artwork */}
      <div className="hidden lg:block lg:w-5/12 relative bg-slate-900 overflow-hidden select-none">
        <img
          src="/corp_office_hallway.jpg"
          alt="Kiến trúc văn phòng doanh nghiệp"
          className="w-full h-full object-cover grayscale contrast-125 opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute bottom-12 left-10 right-10 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phân Quyền Chuẩn RBAC Doanh Nghiệp</span>
          </div>

          <h2 className="text-2xl font-light tracking-tight leading-snug">
            Kiểm Soát Toàn Diện Quyền Biên Tập & Bảo Vệ Tính Toàn Vẹn Dữ Liệu
          </h2>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Quản Trị Viên (Admin)</div>
              <div className="font-bold text-white mt-0.5">Toàn quyền Sửa / Xóa 50 bài</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Nhân Viên (Staff)</div>
              <div className="font-bold text-white mt-0.5">Chỉ sửa/xóa bài của chính mình</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
