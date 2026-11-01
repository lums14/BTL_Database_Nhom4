import React from 'react';
import { FileText, ArrowDownToLine, HardDrive, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function KPICards({
  totalDocs,
  totalDownloads,
  totalStorageMB,
  totalDepts
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* KPI 1 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tổng Số Tài Liệu
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {totalDocs.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Lưu hành trong 8 danh mục
            </span>
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tổng Lượt Tải Xuống
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {totalDownloads.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Tương tác chia sẻ tri thức cao
            </span>
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Dung Lượng Lưu Trữ
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {totalStorageMB} MB
              </h3>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                19% đã dùng
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Quy đổi tự động từ bytes/KB
            </span>
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Phòng Ban Tham Gia
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {totalDepts}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> 100% kết nối
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              10 nhân viên cốt cán đóng góp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
