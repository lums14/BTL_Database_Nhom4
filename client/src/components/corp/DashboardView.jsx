import React from 'react';
import { ArrowUpRight, ShieldCheck, FileCheck, Users, HardDrive } from 'lucide-react';

export default function DashboardView({ onNavigate }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 font-sans space-y-12">
      {/* Top Welcome Title */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1">
            TỔNG QUAN ĐIỀU HÀNH
          </span>
          <h1 className="text-3xl font-light text-black tracking-tight font-sans">
            Trung Tâm Quản Trị & Thông Tin Doanh Nghiệp
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('ingestion')}
            className="bg-[#171717] hover:bg-black text-white px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition shadow-sm rounded-none cursor-pointer"
          >
            + NẠP TÀI LIỆU MỚI
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 bg-[#f9fafb] border border-slate-200">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2 font-mono">
            TỔNG TÀI SẢN TÀI LIỆU
          </span>
          <div className="text-3xl font-light text-black">1,428</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Tài liệu kiểm soát đang hiệu lực</span>
        </div>

        <div className="p-6 bg-[#f9fafb] border border-slate-200">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2 font-mono">
            CHỈ SỐ TUÂN THỦ
          </span>
          <div className="text-3xl font-light text-emerald-800">99.4%</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Chứng nhận ISO 27001 & SOC2</span>
        </div>

        <div className="p-6 bg-[#f9fafb] border border-slate-200">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2 font-mono">
            DUNG LƯỢNG ĐÃ DÙNG
          </span>
          <div className="text-3xl font-light text-black">2.4 TB</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cụm máy chủ lưu trữ AWS-EAST-01</span>
        </div>

        <div className="p-6 bg-[#f9fafb] border border-slate-200">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2 font-mono">
            TÀI KHOẢN HOẠT ĐỘNG
          </span>
          <div className="text-3xl font-light text-black">142 / 150</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Còn 8 giấy phép khả dụng</span>
        </div>
      </div>

      {/* 2-Column Split: Quick Workspaces + Recent Ingestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Quick Access Workspaces (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold tracking-widest uppercase text-black">
            KHÔNG GIAN LÀM VIỆC CHÍNH
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 bg-white">
            <div
              onClick={() => onNavigate('repository')}
              className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition group"
            >
              <div>
                <h4 className="font-bold text-sm text-black group-hover:text-blue-700">Tài Chính & Kế Toán Kiểm Toán</h4>
                <p className="text-xs text-slate-400 mt-0.5">124 tài liệu kiểm soát • Cập nhật 3 giờ trước</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black transition" />
            </div>

            <div
              onClick={() => onNavigate('repository')}
              className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition group"
            >
              <div>
                <h4 className="font-bold text-sm text-black group-hover:text-blue-700">Pháp Chế & Quản Trị Doanh Nghiệp</h4>
                <p className="text-xs text-slate-400 mt-0.5">86 văn bản quy chế • Lưu trữ bắt buộc 7 năm</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black transition" />
            </div>

            <div
              onClick={() => onNavigate('repository')}
              className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition group"
            >
              <div>
                <h4 className="font-bold text-sm text-black group-hover:text-blue-700">Hồ Sơ Nghiên Cứu & Phát Triển (R&D)</h4>
                <p className="text-xs text-slate-400 mt-0.5">42 tài liệu kiến trúc & đặc tả kỹ thuật</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black transition" />
            </div>
          </div>
        </div>

        {/* Right: Security & Ingestion Feed (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold tracking-widest uppercase text-black">
            TÀI LIỆU NẠP MỚI ĐÃ ĐƯỢC TRA SOÁT
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 bg-white">
            <div
              onClick={() => onNavigate('reader')}
              className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MÃ NẠP #842</span>
                <h4 className="font-bold text-xs text-black mt-0.5">Lo_Trinh_Chien_Luoc_Doanh_Nghiep_2024_V2.pdf</h4>
                <p className="text-[11px] text-slate-400">Ban Chiến Lược • Xác thực mã SHA-256 hợp lệ</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                ĐÃ DUYỆT
              </span>
            </div>

            <div
              onClick={() => onNavigate('reader')}
              className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MÃ NẠP #841</span>
                <h4 className="font-bold text-xs text-black mt-0.5">Du_An_Aries_Kiem_Toan_Tai_Chinh_V1.xlsx</h4>
                <p className="text-[11px] text-slate-400">Phòng Kế Toán • Đang thẩm tra phân loại bảo mật</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-[#fdf6f5] text-[#9b3722] border-[#f2d5cf] border">
                CHỜ DUYỆT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
