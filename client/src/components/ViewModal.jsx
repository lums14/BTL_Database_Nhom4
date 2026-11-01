import React from 'react';
import { Eye, X, Download, Tag, User, Building2, HardDrive, ArrowDownToLine, Clock } from 'lucide-react';

export default function ViewModal({
  isOpen,
  onClose,
  document,
  onDownload
}) {
  if (!isOpen || !document) return null;

  const formatFileSize = (kb) => {
    const num = parseFloat(kb) || 0;
    if (num >= 1024) return `${(num / 1024).toFixed(2)} MB`;
    return `${num.toFixed(1)} KB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-modalPop">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 truncate max-w-xs">{document.title}</h3>
              <p className="text-xs text-slate-400">Chi tiết tài liệu và siêu dữ liệu trong CSDL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3.5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <Tag className="w-3.5 h-3.5 text-blue-500" /> Danh mục
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {document.category_name}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <User className="w-3.5 h-3.5 text-purple-500" /> Người đăng
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {document.uploader_name || 'Hệ Thống'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Phòng ban
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {document.dept_name || 'Ban Giám Đốc'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <HardDrive className="w-3.5 h-3.5 text-amber-500" /> Dung lượng
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {formatFileSize(document.file_size)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500" /> Lượt tải
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {Number(document.download_count || 0).toLocaleString()} lượt
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <Clock className="w-3.5 h-3.5 text-rose-500" /> Ngày tạo
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {document.created_at ? document.created_at.split(' ')[0] : '--'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Mô Tả Tóm Tắt
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {document.description || 'Không có mô tả chi tiết cho tài liệu này.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-white transition"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onDownload(document);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Tải Về Máy
          </button>
        </div>
      </div>
    </div>
  );
}
