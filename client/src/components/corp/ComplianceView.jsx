import React from 'react';
import { ShieldAlert, FileText, CheckCircle, Clock } from 'lucide-react';

export default function ComplianceView() {
  const auditLogs = [
    { timestamp: '2025-01-22 11:00:15', actor: 'Elena Moretti (Nguyễn Thị Mai)', event: 'TÁI_PHÂN_LOẠI_TÀI_LIỆU', docId: 'DOC-8412', status: 'THÀNH CÔNG' },
    { timestamp: '2025-01-22 10:45:00', actor: 'Sarah Jenkins (Lê Hoàng Cường)', event: 'XUẤT_NHẬT_KÝ_KIỂM_TOÁN', docId: 'TẤT CẢ', status: 'THÀNH CÔNG' },
    { timestamp: '2025-01-22 09:30:12', actor: 'Marcus Thorne (Phạm Minh Đức)', event: 'TRUY_CẬP_TỆP_GIỚI_HẠN', docId: 'STR-2024-0012', status: 'ĐƯỢC DUYỆT' },
    { timestamp: '2025-01-21 16:20:00', actor: 'Hệ Thống Tự Động', event: 'SAO_LƯU_ĐỊNH_KỲ_CSDL', docId: 'BACKUP_V4', status: 'HOÀN TẤT' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 font-sans space-y-12">
      <div>
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1">
          QUẢN TRỊ & NHẬT KÝ KIỂM TOÁN
        </span>
        <h1 className="text-3xl font-light text-black tracking-tight font-sans">
          Tuân Thủ & Kiểm Soát Pháp Lý Doanh Nghiệp
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Xác thực tính toàn vẹn dữ liệu tự động, lưu vết nhật ký chống chỉnh sửa và thực thi thời hạn lưu trữ bắt buộc.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-slate-200 p-6 bg-white space-y-3">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#9b3722] font-mono">
            QUY ĐỊNH 01
          </div>
          <h3 className="font-bold text-sm text-black">Thời Hạn Lưu Trữ Dữ Liệu</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Toàn bộ hồ sơ báo cáo tài chính, chứng từ thuế và kiểm toán được khóa lưu trữ cố định tối thiểu 7 năm theo quy định pháp luật.
          </p>
        </div>

        <div className="border border-slate-200 p-6 bg-white space-y-3">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#9b3722] font-mono">
            QUY ĐỊNH 02
          </div>
          <h3 className="font-bold text-sm text-black">Băm Mật Mã Học Toàn Vẹn</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mỗi tài liệu khi nạp vào hệ thống đều được sinh mã băm SHA-256 nhằm bảo đảm tính toàn vẹn và chống chối bỏ trách nhiệm.
          </p>
        </div>

        <div className="border border-slate-200 p-6 bg-white space-y-3">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#9b3722] font-mono">
            QUY ĐỊNH 03
          </div>
          <h3 className="font-bold text-sm text-black">Cách Ly Phân Quyền RBAC</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hệ thống phân quyền truy cập theo vai trò (RBAC) thiết lập tường lửa nghiệp vụ nghiêm ngặt giữa Pháp chế, Kế toán và R&D.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-widest uppercase text-black">
          SỔ CÁI SỰ KIỆN HỆ THỐNG THỜI GIAN THỰC (BẤT BIẾN)
        </h3>
        <div className="w-full overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-3.5 px-4">DẤU THỜI GIAN</th>
                <th className="py-3.5 px-4">TÁC NHÂN / NHÂN SỰ</th>
                <th className="py-3.5 px-4">LOẠI SỰ KIỆN</th>
                <th className="py-3.5 px-4">MÃ TÀI NGUYÊN</th>
                <th className="py-3.5 px-4 text-right">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4 text-black font-sans font-bold">{log.actor}</td>
                  <td className="py-3 px-4 text-slate-700">{log.event}</td>
                  <td className="py-3 px-4 text-blue-700">{log.docId}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[9px] font-bold px-2 py-0.5 border border-emerald-300 bg-emerald-50 text-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
