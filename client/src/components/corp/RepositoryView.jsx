import React, { useState, useMemo } from 'react';
import { 
  Table, 
  LayoutGrid, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  Lock, 
  UserCheck, 
  Sparkles,
  ShieldAlert,
  ChevronDown,
  FileText
} from 'lucide-react';
import Swal from 'sweetalert2';
import DocumentTable from '../DocumentTable';
import EditModal from '../EditModal';
import ViewModal from '../ViewModal';
import { deleteDocumentApi, recordDownloadApi } from '../../services/api';

export default function RepositoryView({ 
  documents = [], 
  categories = [], 
  departments = [], 
  currentUser,
  onSelectDoc,
  onRefreshDocs 
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Pagination for table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const isAdmin = currentUser?.role_id === 1 || 
                  (currentUser?.role_name || '').toLowerCase() === 'admin';
  const currentUserId = currentUser?.user_id;

  // Filter documents by search, category, and department
  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      // 1. Search filter
      if (searchTerm && searchTerm.trim() !== '') {
        const q = searchTerm.trim().toLowerCase();
        const matchesTitle = (d.title || '').toLowerCase().includes(q);
        const matchesDesc = (d.description || '').toLowerCase().includes(q);
        const matchesUploader = (d.uploader_name || '').toLowerCase().includes(q);
        const matchesCat = (d.category_name || '').toLowerCase().includes(q);
        const matchesDept = (d.dept_name || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesUploader && !matchesCat && !matchesDept) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory) {
        if (Number(d.category_id) !== Number(selectedCategory)) {
          return false;
        }
      }

      // 3. Department filter
      if (selectedDept) {
        if (Number(d.dept_id) !== Number(selectedDept) && d.dept_name !== selectedDept) {
          return false;
        }
      }

      return true;
    });
  }, [documents, searchTerm, selectedCategory, selectedDept]);

  // Handler Download
  const handleDownload = (doc) => {
    if (doc.doc_id) {
      recordDownloadApi(doc.doc_id).catch(() => null);
    }

    const a = document.createElement('a');
    a.href = doc.file_path ? `/${doc.file_path}` : `/uploads/sample-noi-quy-lao-dong-2025.pdf`;
    a.download = doc.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Đang tải xuống: ${doc.title}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  // Handler Edit
  const handleEdit = (doc) => {
    const isOwner = Number(doc.uploaded_by) === Number(currentUserId);
    if (!isAdmin && !isOwner) {
      Swal.fire({
        icon: 'warning',
        title: 'Quyền Truy Cập Bị Hạn Chế (403 Forbidden)',
        text: 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!',
        confirmButtonColor: '#0f172a'
      });
      return;
    }
    setEditingDoc(doc);
  };

  // Handler Delete
  const handleDelete = (doc) => {
    const isOwner = Number(doc.uploaded_by) === Number(currentUserId);
    if (!isAdmin && !isOwner) {
      Swal.fire({
        icon: 'warning',
        title: 'Quyền Truy Cập Bị Hạn Chế (403 Forbidden)',
        text: 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!',
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    Swal.fire({
      title: 'Xác Nhận Xóa Tài Liệu?',
      html: `
        <div style="font-size: 13px; text-align: left; line-height: 1.6;">
          <p>Bạn sắp xóa vĩnh viễn tài liệu:</p>
          <p style="color: #b91c1c; font-weight: bold; margin: 4px 0;">${doc.title}</p>
          <p style="color: #64748b; font-size: 12px;">Hành động này sẽ xóa bản ghi trong bảng <strong>documents</strong> của MySQL và xóa file vật lý trên máy chủ.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteDocumentApi(doc.doc_id);
          if (res && res.success === false) {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: res.message || 'Không thể xóa tài liệu.'
            });
            return;
          }
        } catch {}

        Swal.fire({
          icon: 'success',
          title: 'Đã xóa thành công!',
          text: `Đã loại bỏ tài liệu "${doc.title}" khỏi hệ thống.`,
          timer: 2000,
          showConfirmButton: false
        });

        if (onRefreshDocs) onRefreshDocs();
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-10 font-sans space-y-8">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono">
              DATABASE: DOCUMENT_MANAGEMENT (3NF)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              50 TÀI LIỆU SẴN SÀNG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Kho Tài Liệu Nội Bộ Doanh Nghiệp
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý, phân loại, tìm kiếm và kiểm soát phân quyền Sửa / Xóa bám sát dữ liệu SQL_N4_BTL.sql
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Bảng Quản Trị RBAC</span>
          </button>

          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kho Thẻ Stream</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Search + Category Filter + Reset) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tiêu đề, người đăng, phòng ban, danh mục..."
            className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-11 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-black transition cursor-pointer font-medium text-slate-700"
          >
            <option value="">Tất cả danh mục (6 danh mục 3NF)</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="md:col-span-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedDept('');
              setCurrentPage(1);
            }}
            className="w-full h-11 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer shadow-2xs"
          >
            ĐẶT LẠI LỌC
          </button>
        </div>
      </div>

      {/* View Mode 1: Detailed RBAC Table View */}
      {viewMode === 'table' ? (
        <DocumentTable
          documents={filteredDocuments}
          currentUser={currentUser}
          currentRole={currentUser?.role_name || (isAdmin ? 'Admin' : 'Staff')}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          onView={(doc) => setViewingDoc(doc)}
          onOpenReader={(doc) => onSelectDoc && onSelectDoc(doc)}
          onDownload={handleDownload}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        /* View Mode 2: Minimalist Cards Stream View */
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Tìm thấy <strong>{filteredDocuments.length}</strong> tài liệu:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => {
              const isOwner = Number(doc.uploaded_by) === Number(currentUserId);
              const canModify = isAdmin || isOwner;

              return (
                <div
                  key={doc.doc_id}
                  className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isOwner 
                      ? 'border-blue-200 bg-blue-50/20 hover:border-blue-300' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 hover:text-blue-700 transition cursor-pointer" onClick={() => onSelectDoc(doc)}>
                          {doc.title}
                        </span>
                        {isOwner && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            Tài liệu của bạn
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {doc.category_name}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                      {doc.description || 'Tài liệu quản trị nội bộ doanh nghiệp.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{doc.uploader_name}</span>
                      <span>•</span>
                      <span>{doc.dept_name}</span>
                      <span>•</span>
                      <span className="font-mono">{doc.file_type?.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        title="Tải xuống"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {canModify ? (
                        <>
                          <button
                            onClick={() => handleEdit(doc)}
                            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="Sửa"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            Swal.fire({
                              icon: 'warning',
                              title: '403 Forbidden',
                              text: 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!'
                            });
                          }}
                          className="p-1.5 text-slate-300 hover:text-slate-500 rounded-lg transition cursor-not-allowed"
                          title="Chỉ Admin hoặc người tạo mới có quyền chỉnh sửa"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={Boolean(editingDoc)}
        onClose={() => setEditingDoc(null)}
        document={editingDoc}
        categories={categories}
        onSave={() => {
          setEditingDoc(null);
          if (onRefreshDocs) onRefreshDocs();
        }}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc}
        onDownload={handleDownload}
        onOpenReader={(doc) => {
          setViewingDoc(null);
          if (onSelectDoc) onSelectDoc(doc);
        }}
      />
    </div>
  );
}
