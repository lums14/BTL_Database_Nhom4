import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, UserCheck, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import { createDocumentApi } from '../../services/api';

export default function IngestionPipelineView({ 
  categories = [], 
  users = [], 
  currentUser,
  onUploadSuccess 
}) {
  const [file, setFile] = useState(null);
  const [docTitle, setDocTitle] = useState('Nội Quy Vận Hành Và Bảo Mật Doanh Nghiệp 2025');
  const [categoryId, setCategoryId] = useState(categories[0]?.category_id || 1);
  const [uploadedBy, setUploadedBy] = useState(currentUser?.user_id || 1);
  const [tags, setTags] = useState('TUÂN THỦ, BẢO MẬT, 2025');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const isAdmin = currentUser?.role_id === 1 || 
                  (currentUser?.role_name || '').toLowerCase() === 'admin';

  useEffect(() => {
    if (currentUser?.user_id) {
      setUploadedBy(currentUser.user_id);
    }
  }, [currentUser]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      if (!docTitle) setDocTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const targetUserId = currentUser?.user_id || uploadedBy;

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('title', docTitle);
    formData.append('category_id', categoryId);
    formData.append('uploaded_by', targetUserId);
    formData.append('description', `Phân loại: ${tags}. Tài liệu kiểm soát nội bộ nạp vào kho lưu trữ doanh nghiệp.`);

    try {
      const data = await createDocumentApi(formData);

      Swal.fire({
        icon: 'success',
        title: 'Nạp Tài Liệu Thành Công',
        html: `
          <div style="font-size: 13px; text-align: left; line-height: 1.6;">
            <p><strong>Tiêu đề:</strong> ${docTitle}</p>
            <p><strong>Người tạo:</strong> ${currentUser?.full_name || 'Hệ Thống'} (ID: ${targetUserId})</p>
            <p><strong>Phòng ban:</strong> ${currentUser?.dept_name || 'Phòng Nội Bộ'}</p>
            <p style="color: #047857; margin-top: 6px; font-weight: bold;">
              ✓ Đã gán quyền sở hữu RBAC và lưu trữ vào kho 50 tài liệu.
            </p>
          </div>
        `,
        confirmButtonColor: '#111111'
      });

      if (onUploadSuccess) {
        onUploadSuccess(data?.data || {
          doc_id: Date.now(),
          title: docTitle,
          description: `Phân loại: ${tags}`,
          file_type: file ? file.name.split('.').pop() : 'pdf',
          file_size: file ? (file.size / 1024) : 2400,
          uploaded_by: targetUserId,
          uploader_name: currentUser?.full_name || 'Nhân Viên',
          dept_name: currentUser?.dept_name || 'Phòng Kỹ Thuật'
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể nạp tài liệu vào máy chủ.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 font-sans">
      {/* Top Header */}
      <div className="mb-10">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 font-mono block mb-2">
          GIAO THỨC TẢI LÊN • RBAC INTEGRATION
        </span>
        <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-2">
          Nạp Tài Liệu Mới Vào Kho Hệ Thống
        </h1>
        <p className="text-xs text-slate-500">
          Tài liệu tải lên sẽ tự động gán quyền sở hữu cho tài khoản đang đăng nhập ({currentUser?.full_name || 'Người dùng'}).
        </p>
      </div>

      {/* Upload Zone & Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dropzone Container */}
        <div className="max-w-4xl">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-black bg-slate-50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.length) {
                  const f = e.target.files[0];
                  setFile(f);
                  if (!docTitle) setDocTitle(f.name.replace(/\.[^/.]+$/, ''));
                }
              }}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-black">{file.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • SẴN SÀNG NẠP VÀO HỆ THỐNG
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-200/70 mb-4 flex items-center justify-center text-slate-600">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm text-slate-700 font-medium mb-1">
                  Kéo thả tệp tài liệu vào đây (PDF, Word, Excel, PowerPoint)
                </p>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  HOẶC NHẤP ĐỂ CHỌN TỆP TỪ THIẾT BỊ CỦA BẠN (TỐI ĐA 20MB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="space-y-6 max-w-4xl">
          {/* Document Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700">
              TIÊU ĐỀ TÀI LIỆU <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Ví dụ: Quy chế Quản trị Doanh nghiệp và An toàn Thông tin 2025"
              className="w-full h-11 px-4 border border-slate-200 focus:border-black text-xs text-black placeholder-slate-400 focus:outline-none transition rounded-lg bg-white"
            />
          </div>

          {/* Two Columns: Category & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700">
                DANH MỤC PHÂN LOẠI (CHUẨN 3NF)
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full h-11 px-3.5 border border-slate-200 focus:border-black text-xs text-black focus:outline-none transition rounded-lg bg-white cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                ))}
              </select>
            </div>

            {/* Author / Uploader (Auto assigned to currentUser) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700">
                  NGƯỜI TẢI LÊN (UPLOADED_BY)
                </label>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Tự động gán người đăng
                </span>
              </div>

              {isAdmin ? (
                /* Admin có thể chỉ định người tạo khác nếu muốn */
                <select
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(Number(e.target.value))}
                  className="w-full h-11 px-3.5 border border-slate-200 focus:border-black text-xs text-black focus:outline-none transition rounded-lg bg-white cursor-pointer"
                >
                  {users.map(u => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.full_name} ({u.role_name} - {u.dept_name})
                    </option>
                  ))}
                </select>
              ) : (
                /* Staff: Tự động khóa cứng tài khoản đang đăng nhập */
                <div className="w-full h-11 px-3.5 border border-slate-200 bg-slate-50 text-xs text-slate-800 flex items-center justify-between rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <strong>{currentUser?.full_name || 'Staff User'}</strong>
                    <span className="text-slate-400 font-mono text-[11px]">(ID: {currentUser?.user_id || 3})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{currentUser?.dept_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Classification Tags */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700">
              TỪ KHÓA & THẺ BẢO MẬT
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ví dụ: TUÂN THỦ, BẢO MẬT, 2025"
              className="w-full h-11 px-4 border border-slate-200 focus:border-black text-xs text-black placeholder-slate-400 focus:outline-none transition rounded-lg bg-white font-mono"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-slate-900 hover:bg-black text-white text-xs font-bold tracking-widest uppercase transition rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>ĐANG XỬ LÝ NẠP DỮ LIỆU...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>XÁC NHẬN NẠP VÀO HỆ THỐNG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
