import React from 'react';
import { Download, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

export default function DocumentReaderView({ selectedDoc, onDownload }) {
  const doc = selectedDoc || {
    doc_id: 101,
    title: '2024_Strategic_Roadmap_V2.pdf',
    articleTitle: 'Sáng Kiến Tăng Trưởng Chiến Lược 2024',
    code: 'STR-2024-0012',
    classification: 'Tuyệt mật (Confidential)',
    storageNode: 'AWS-EAST-01',
    retention: '7 Năm',
    versions: [
      { version: 'V2.4 (Hiện hành)', author: 'Sarah Jenkins', time: 'Hôm nay, 14:20', active: true },
      { version: 'V2.3', author: 'Sarah Jenkins', time: '12 Thg 8, 09:15', active: false },
      { version: 'V2.0 (Bản phát hành chính)', author: 'Marcus Thorne', time: '01 Thg 8, 16:45', active: false },
    ],
    accessList: [
      { initials: 'SJ', name: 'Sarah Jenkins', role: 'CHỦ SỞ HỮU', permission: 'Toàn quyền' },
      { initials: 'MT', name: 'Marcus Thorne', role: 'ĐỘI CHIẾN LƯỢC', permission: 'Chỉnh sửa' },
      { initials: 'OD', name: 'Giám Đốc Vận Hành', role: 'ĐỐI TÁC NGOÀI', permission: 'Chỉ đọc' },
    ]
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload(doc);
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Đang tải: ${doc.title}`,
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#f5f5f5] flex flex-col font-sans">
      {/* Subheader with Breadcrumbs & Action Button */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-1 font-mono">
            <span>KHÔNG GIAN LÀM VIỆC</span>
            <ChevronRight className="w-2.5 h-2.5" />
            <span>CHIẾN LƯỢC</span>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-slate-600">BÁO CÁO</span>
          </div>
          <h1 className="text-xl font-bold text-black tracking-tight font-sans">
            {doc.title}
          </h1>
        </div>

        <button
          onClick={handleDownloadClick}
          className="bg-[#1f2937] hover:bg-black text-white px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition shadow-sm rounded-none"
        >
          TẢI BẢN MỚI NHẤT
        </button>
      </div>

      {/* Main Split Layout: Document Canvas (Left) + Inspection Panel (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Sheet Canvas (Left) */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto flex justify-center bg-[#f7f7f7]">
          <div className="w-full max-w-3xl bg-white shadow-sm border border-slate-200 min-h-[820px] p-12 lg:p-16">
            {/* Terracotta / Rust accent line */}
            <div className="w-16 h-[3px] bg-[#9b3722] mb-10"></div>

            {/* Document Headline */}
            <h2 className="text-3xl font-light text-slate-900 tracking-tight font-sans mb-12">
              {doc.articleTitle || doc.title}
            </h2>

            {/* Simulated Content Body Lines */}
            <div className="space-y-4 mb-12">
              <div className="h-3.5 bg-slate-100 rounded-sm w-full"></div>
              <div className="h-3.5 bg-slate-100 rounded-sm w-[92%]"></div>
              <div className="h-3.5 bg-slate-100 rounded-sm w-[96%]"></div>
              <div className="h-3.5 bg-slate-100 rounded-sm w-[45%]"></div>
            </div>

            {/* Section I */}
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-widest uppercase text-black mb-4">
                I. PHÂN TÍCH THỊ TRƯỜNG & DỰ BÁO TĂNG TRƯỞNG
              </h3>
              <div className="space-y-4">
                <div className="h-3.5 bg-slate-100 rounded-sm w-full"></div>
                <div className="h-3.5 bg-slate-100 rounded-sm w-[94%]"></div>
                <div className="h-3.5 bg-slate-100 rounded-sm w-[88%]"></div>
                <div className="h-3.5 bg-slate-100 rounded-sm w-[97%]"></div>
                <div className="h-3.5 bg-slate-100 rounded-sm w-[60%]"></div>
              </div>
            </div>

            {/* Section II */}
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-widest uppercase text-black mb-4">
                II. MỞ RỘNG VẬN HÀNH & TIÊU CHUẨN TUÂN THỦ
              </h3>
              <div className="space-y-4">
                <div className="h-3.5 bg-slate-100 rounded-sm w-full"></div>
                <div className="h-3.5 bg-slate-100 rounded-sm w-[90%]"></div>
                <div className="h-3.5 bg-slate-100 rounded-sm w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspection Rail */}
        <aside className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-8 shrink-0">
          {/* Document Info */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
              THÔNG TIN TÀI LIỆU
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mã định danh (ID)</span>
                <span className="font-mono text-slate-900">{doc.code || 'STR-2024-0012'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cấp độ bảo mật</span>
                <span className="font-semibold text-[#9b3722]">
                  {doc.classification || 'Tuyệt mật (Confidential)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Máy chủ lưu trữ</span>
                <span className="font-mono text-slate-700">{doc.storageNode || 'AWS-EAST-01'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Thời hạn lưu trữ</span>
                <span className="font-semibold text-slate-800">{doc.retention || '7 Năm'}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Version History */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
              LỊCH SỬ PHIÊN BẢN
            </h4>
            <div className="space-y-4 relative before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              {doc.versions.map((ver, idx) => (
                <div key={idx} className="relative pl-5">
                  <span
                    className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 border-white -translate-x-[3px] ${
                      ver.active ? 'bg-[#9b3722] ring-2 ring-[#9b3722]/20' : 'bg-slate-300'
                    }`}
                  ></span>
                  <div className="text-xs font-bold text-slate-900">
                    {ver.version}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ver.author} • {ver.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Access Control */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] font-bold tracking-widest uppercase text-black">
                PHÂN QUYỀN TRUY CẬP
              </h4>
              <button className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-black transition">
                QUẢN LÝ
              </button>
            </div>
            <div className="space-y-3.5">
              {doc.accessList.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                      <div className="text-[10px] font-semibold text-slate-400 tracking-wider">
                        {user.role}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                    {user.permission}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
