import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  FileCode, 
  Eye, 
  Download, 
  Edit3, 
  Trash2, 
  Lock, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import Swal from 'sweetalert2';

const CATEGORY_STYLES = {
  1: 'bg-blue-50 text-blue-700 border-blue-200',
  2: 'bg-purple-50 text-purple-700 border-purple-200',
  3: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  4: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  5: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  6: 'bg-amber-50 text-amber-800 border-amber-200',
  7: 'bg-pink-50 text-pink-700 border-pink-200',
  8: 'bg-teal-50 text-teal-700 border-teal-200'
};

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-indigo-600',
  'from-amber-500 to-rose-500',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600'
];

export default function DocumentTable({
  documents = [],
  currentUser,
  currentRole,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onView,
  onOpenReader,
  onDownload,
  onEdit,
  onDelete
}) {
  const totalItems = documents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentDocs = documents.slice(startIndex, endIndex);

  // Phân quyền RBAC:
  // Admin (role_id = 1) -> Toàn quyền trên tất cả 50 tài liệu
  // Staff (role_id = 2) -> Chỉ sửa/xóa tài liệu mà doc.uploaded_by === currentUser.user_id
  const isAdmin = currentUser?.role_id === 1 || 
                  (currentUser?.role_name || '').toLowerCase() === 'admin' || 
                  currentRole === 'Admin';
  const currentUserId = currentUser?.user_id;

  const handleRestrictedAction = (doc) => {
    Swal.fire({
      icon: 'warning',
      title: 'Quyền Truy Cập Bị Hạn Chế (403 Forbidden)',
      html: `
        <div style="font-size: 13px; line-height: 1.6; text-align: left; padding: 4px 10px;">
          <p><strong>Tài liệu:</strong> ${doc.title}</p>
          <p><strong>Người đăng:</strong> ${doc.uploader_name || 'Khác'} (ID: ${doc.uploaded_by})</p>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="color: #b91c1c; font-weight: bold;">
            Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!
          </p>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
            Hãy đăng nhập bằng tài khoản <strong>Admin</strong> hoặc tài khoản của người tạo để chỉnh sửa.
          </p>
        </div>
      `,
      confirmButtonColor: '#0f172a',
      confirmButtonText: 'Đã hiểu'
    });
  };

  const getFileBadge = (fileType) => {
    const ft = (fileType || '').toLowerCase();
    if (ft.includes('pdf')) {
      return (
        <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
          <FileText className="w-4 h-4" />
        </span>
      );
    }
    if (ft.includes('doc') || ft.includes('word')) {
      return (
        <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
          <FileText className="w-4 h-4" />
        </span>
      );
    }
    if (ft.includes('xls') || ft.includes('excel') || ft.includes('csv')) {
      return (
        <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
          <FileSpreadsheet className="w-4 h-4" />
        </span>
      );
    }
    if (ft.includes('ppt') || ft.includes('powerpoint')) {
      return (
        <span className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-2xs">
          <Presentation className="w-4 h-4" />
        </span>
      );
    }
    return (
      <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
        <FileCode className="w-4 h-4" />
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatFileSize = (kb) => {
    const num = parseFloat(kb) || 0;
    if (num >= 1024) return `${(num / 1024).toFixed(2)} MB`;
    return `${num.toFixed(1)} KB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split(' ')[0] || dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* RBAC Notification Banner */}
      <div className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
        isAdmin 
          ? 'bg-purple-50/70 text-purple-900 border-purple-100' 
          : 'bg-blue-50/70 text-blue-900 border-blue-100'
      }`}>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
              <span><strong>Chế độ Quản trị viên (Admin):</strong> Bạn có toàn quyền Sửa / Xóa tất cả {totalItems} tài liệu trong hệ thống.</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span><strong>Chế độ Nhân viên (Staff):</strong> Bạn chỉ có quyền Sửa / Xóa những tài liệu có nhãn <strong className="text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">Tài liệu của bạn</strong>. Các tài liệu khác sẽ bị khóa thao tác.</span>
            </>
          )}
        </div>
        <div className="font-mono text-[11px] text-slate-500 hidden md:block">
          Tổng số: <strong>{totalItems}</strong> tài liệu
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4 min-w-[280px]">Tài liệu & Mô tả</th>
              <th className="py-3.5 px-4 min-w-[170px]">Danh mục (3NF)</th>
              <th className="py-3.5 px-4 min-w-[190px]">Người tải lên & Phòng ban</th>
              <th className="py-3.5 px-4 text-right min-w-[100px]">Dung lượng</th>
              <th className="py-3.5 px-4 text-center min-w-[90px]">Lượt tải</th>
              <th className="py-3.5 px-4 min-w-[110px]">Ngày đăng</th>
              <th className="py-3.5 px-4 text-center min-w-[150px]">Thao tác (RBAC)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Không tìm thấy tài liệu phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              currentDocs.map((doc, idx) => {
                const globalIndex = startIndex + idx + 1;
                const isOwner = Number(doc.uploaded_by) === Number(currentUserId);
                const canModify = isAdmin || isOwner;
                const categoryStyle = CATEGORY_STYLES[doc.category_id] || 'bg-slate-50 text-slate-700 border-slate-200';
                const avatarGradient = AVATAR_GRADIENTS[(doc.uploaded_by || 1) % AVATAR_GRADIENTS.length];

                return (
                  <tr 
                    key={doc.doc_id || idx}
                    className={`transition-colors ${
                      isOwner 
                        ? 'bg-blue-50/25 hover:bg-blue-50/50' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-semibold">
                      {globalIndex}
                    </td>

                    {/* Title & Desc */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        {getFileBadge(doc.file_type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span 
                              onClick={() => onOpenReader ? onOpenReader(doc) : (onView && onView(doc))}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate max-w-sm block transition"
                              title={doc.title}
                            >
                              {doc.title}
                            </span>

                            {/* Label "Tài liệu của bạn" nếu người dùng sở hữu */}
                            {isOwner && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
                                <UserCheck className="w-2.5 h-2.5" />
                                <span>Tài liệu của bạn</span>
                              </span>
                            )}
                          </div>

                          <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5" title={doc.description}>
                            {doc.description || 'Không có mô tả chi tiết.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${categoryStyle}`}>
                        {doc.category_name || 'Chung'}
                      </span>
                    </td>

                    {/* Uploader & Dept */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${avatarGradient} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}>
                          {getInitials(doc.uploader_name || 'NV')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">
                            {doc.uploader_name || 'Chưa rõ'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {doc.dept_name || 'Phòng Ban'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 font-medium">
                      {formatFileSize(doc.file_size)}
                    </td>

                    {/* Download count */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700 text-[11px]">
                        <Download className="w-3 h-3 text-emerald-600" />
                        {Number(doc.download_count || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(doc.created_at)}
                    </td>

                    {/* RBAC Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 1. Nút Đọc Toàn Văn (Reader) */}
                        <button
                          onClick={() => onOpenReader ? onOpenReader(doc) : (onView && onView(doc))}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Đọc toàn văn văn bản này"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        </button>

                        {/* 1b. Nút Xem chi tiết siêu dữ liệu (Modal) */}
                        <button
                          onClick={() => onView && onView(doc)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Xem chi tiết siêu dữ liệu CSDL"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Nút Tải xuống (Download) - Hiển thị cho cả Admin và Staff */}
                        <button
                          onClick={() => onDownload && onDownload(doc)}
                          className="w-7 h-7 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Tải xuống tài liệu"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* 3 & 4. Nút Sửa & Xóa (Chỉ cho phép nếu Admin hoặc chính chủ) */}
                        {canModify ? (
                          <>
                            <button
                              onClick={() => onEdit && onEdit(doc)}
                              className="w-7 h-7 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-600 hover:text-amber-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                              title="Chỉnh sửa tài liệu này"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete && onDelete(doc)}
                              className="w-7 h-7 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                              title="Xóa tài liệu này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          // Đối với tài liệu người khác: Hiển thị biểu tượng ổ khóa với tooltip
                          <button
                            onClick={() => handleRestrictedAction(doc)}
                            className="h-7 px-2 rounded-lg border border-slate-200 bg-slate-100/90 text-slate-400 hover:text-slate-600 hover:border-slate-300 flex items-center gap-1 transition shadow-2xs cursor-not-allowed group"
                            title="Chỉ Admin hoặc người tạo mới có quyền chỉnh sửa"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition" />
                            <span className="text-[10px] font-bold">Khóa</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 font-medium">
        <div>
          Hiển thị <strong>{startIndex + 1} - {endIndex}</strong> trên tổng số <strong>{totalItems}</strong> tài liệu
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="h-8 px-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
              <option value={50}>50 dòng</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 rounded-lg border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange && onPageChange(page)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 rounded-lg border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
