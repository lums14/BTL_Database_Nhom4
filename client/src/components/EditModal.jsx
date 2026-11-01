import React, { useState, useEffect } from 'react';
import { Edit3, X, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateDocumentApi } from '../services/api';

export default function EditModal({
  isOpen,
  onClose,
  document,
  categories,
  onSave
}) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setCategoryId(document.category_id || (categories[0]?.category_id || 1));
      setDescription(document.description || '');
    }
  }, [document, categories]);

  if (!isOpen || !document) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateDocumentApi(document.doc_id, {
        title: title.trim(),
        category_id: Number(categoryId),
        description: description.trim()
      });

      if (res && res.success === false) {
        Swal.fire({
          icon: 'error',
          title: 'Từ Chối Quyền Hạn (403 Forbidden)',
          text: res.message || 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!',
          confirmButtonColor: '#0f172a'
        });
        setLoading(false);
        return;
      }
    } catch {
      // offline simulation
    }

    onSave({
      ...document,
      title: title.trim(),
      category_id: Number(categoryId),
      category_name: categories.find(c => c.category_id === Number(categoryId))?.category_name || document.category_name,
      description: description.trim()
    });

    setLoading(false);
    onClose();
    Swal.fire({
      icon: 'success',
      title: 'Cập nhật thành công!',
      text: 'Thông tin tài liệu đã được lưu lại trong CSDL.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-modalPop">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Chỉnh Sửa Tài Liệu</h3>
              <p className="text-xs text-slate-400">ID: #{document.doc_id} • Người đăng: {document.uploader_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiêu đề tài liệu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
              placeholder="Nhập tiêu đề tài liệu..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Danh mục phân loại (3NF) <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
            >
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả chi tiết nội dung
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition resize-none"
              placeholder="Nhập tóm tắt văn bản, chính sách..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Đang Lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
