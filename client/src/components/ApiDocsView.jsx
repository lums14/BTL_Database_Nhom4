import React from 'react';
import { Bolt, Code2 } from 'lucide-react';

export default function ApiDocsView() {
  const endpoints = [
    { method: 'GET', path: '/api/documents', desc: 'Lấy danh sách tài liệu (hỗ trợ tìm kiếm theo tiêu đề, lọc theo danh mục, phòng ban, định dạng file)' },
    { method: 'GET', path: '/api/documents/:id', desc: 'Lấy thông tin chi tiết một tài liệu cùng thông tin người đăng và phòng ban' },
    { method: 'POST', path: '/api/documents', desc: 'Tải lên tài liệu mới (Multipart Form-Data, tự động lưu file vật lý vào thư mục uploads)' },
    { method: 'PUT', path: '/api/documents/:id', desc: 'Cập nhật tiêu đề, danh mục, mô tả tóm tắt của tài liệu theo ID' },
    { method: 'DELETE', path: '/api/documents/:id', desc: 'Xóa tài liệu khỏi CSDL MySQL và tự động xóa tệp nhị phân trên đĩa' },
    { method: 'POST', path: '/api/documents/:id/download', desc: 'Ghi nhận lượt tải xuống (+1 đơn vị vào download_count)' },
    { method: 'GET', path: '/api/stats/categories', desc: '[SQL 1] Thống kê số tài liệu và tổng dung lượng file của từng danh mục' },
    { method: 'GET', path: '/api/stats/departments', desc: '[SQL 2] Thống kê tài liệu và tổng lượt tải theo từng phòng ban' },
    { method: 'GET', path: '/api/stats/top-uploaders', desc: '[SQL 3] Bảng xếp hạng Top 5 nhân viên đăng tải tài liệu nhiều nhất' },
    { method: 'GET', path: '/api/categories', desc: 'Lấy danh mục dữ liệu nền (Master Data Categories)' },
    { method: 'GET', path: '/api/departments', desc: 'Lấy danh sách phòng ban trong công ty' },
    { method: 'GET', path: '/api/users', desc: 'Lấy danh sách nhân sự phục vụ phân quyền và tác giả' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Tài Liệu Đặc Tả RESTful API Backend
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Hệ thống các API endpoints được xây dựng trên nền tảng Express.js chuẩn kiến trúc MVC phục vụ BTL môn CSDL
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {endpoints.map((ep, i) => {
          const methodColors = {
            GET: 'bg-blue-50 text-blue-700 border-blue-200',
            POST: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            PUT: 'bg-amber-50 text-amber-800 border-amber-200',
            DELETE: 'bg-rose-50 text-rose-700 border-rose-200'
          };

          return (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${methodColors[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {ep.path}
                </code>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {ep.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
