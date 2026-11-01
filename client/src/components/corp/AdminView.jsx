import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminView({ users: backendUsers = [] }) {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Elena Moretti (Nguyễn Thị Mai)',
      email: 'e.moretti@corpdocs.int',
      dept: 'Pháp Chế & Chính Sách',
      role: 'QUẢN TRỊ VIÊN CẤP CAO',
      status: 'Đang hoạt động',
      statusColor: 'emerald'
    },
    {
      id: 2,
      name: 'Marcus Thorne (Phạm Minh Đức)',
      email: 'm.thorne@corpdocs.int',
      dept: 'Nghiên Cứu & Phát Triển (R&D)',
      role: 'BIÊN TẬP VIÊN',
      status: 'Đang hoạt động',
      statusColor: 'emerald'
    },
    {
      id: 3,
      name: 'Sarah Jenkins (Lê Hoàng Cường)',
      email: 's.jenkins@corpdocs.int',
      dept: 'Tài Chính & Kế Toán',
      role: 'NGƯỜI XEM TÀI LIỆU',
      status: 'Đang hoạt động',
      statusColor: 'emerald'
    },
    {
      id: 4,
      name: 'Julian Vane (Trần Thị Bích)',
      email: 'j.vane@corpdocs.int',
      dept: 'Khối Vận Hành',
      role: 'CÁN BỘ TUÂN THỦ',
      status: 'Đang nghỉ phép',
      statusColor: 'amber'
    }
  ]);

  const handleEditUser = (user) => {
    Swal.fire({
      title: `Chỉnh sửa phân quyền: ${user.name}`,
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.8;">
          <p><strong>Email công vụ:</strong> ${user.email}</p>
          <p><strong>Phòng ban chuyên trách:</strong> ${user.dept}</p>
          <p><strong>Vai trò hệ thống:</strong> ${user.role}</p>
          <p><strong>Trạng thái tài khoản:</strong> ${user.status}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Lưu thay đổi',
      confirmButtonColor: '#111111',
      cancelButtonText: 'Đóng'
    });
  };

  const handleProvisionUser = () => {
    Swal.fire({
      title: 'Cấp Quyền Tài Khoản Nhân Sự Mới',
      input: 'email',
      inputLabel: 'Nhập địa chỉ email doanh nghiệp để kích hoạt quyền truy cập:',
      inputPlaceholder: 'ten.nhan_su@corpdocs.int',
      confirmButtonText: 'Xác nhận cấp phép',
      confirmButtonColor: '#111111',
      showCancelButton: true,
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Đã Cấp Phép Thành Công',
          text: `Tài khoản ${result.value} đã được thêm vào danh bạ và đồng bộ SSO doanh nghiệp.`,
          confirmButtonColor: '#111111'
        });
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 font-sans space-y-16">
      {/* Section 1: INFRASTRUCTURE */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-bold tracking-widest uppercase text-slate-900">
          HẠ TẦNG HỆ THỐNG
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Stat 1: Storage */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-black tracking-tight">2.4</span>
              <span className="text-lg font-light text-slate-500">TB</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 mb-3">
              Tổng dung lượng lưu trữ đã sử dụng
            </div>
            <div className="w-full max-w-sm h-1 bg-slate-100 overflow-hidden">
              <div className="h-full bg-slate-800" style={{ width: '68%' }}></div>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-2 block font-mono">
              68% CỦA TỔNG DUNG LƯỢNG HỆ THỐNG
            </span>
          </div>

          {/* Stat 2: User Seats */}
          <div>
            <div className="text-4xl font-light text-black tracking-tight">
              142
            </div>
            <div className="text-xs text-slate-500 mt-1 mb-3">
              Số tài khoản nhân sự đã cấp phép
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-700"></span>
              <span className="w-2.5 h-2.5 bg-emerald-700"></span>
              <span className="w-2.5 h-2.5 bg-emerald-700"></span>
              <span className="w-2.5 h-2.5 bg-slate-200"></span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Section 2: ACCESS CONTROL */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-900 mb-1">
              KIỂM SOÁT TRUY CẬP
            </h3>
            <h4 className="text-lg font-normal text-black font-sans">
              Danh bạ Nhân sự & Phân quyền Hệ thống
            </h4>
          </div>

          <button
            onClick={handleProvisionUser}
            className="border border-slate-300 hover:border-black text-black px-4 py-2 text-xs font-bold tracking-wider uppercase transition rounded-none flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            + CẤP PHÉP NGƯỜI DÙNG
          </button>
        </div>

        {/* Access Control Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-4 font-bold">DANH TÍNH NHÂN SỰ</th>
                <th className="py-4 font-bold">PHÒNG BAN</th>
                <th className="py-4 font-bold">VAI TRÒ HỆ THỐNG</th>
                <th className="py-4 font-bold">TRẠNG THÁI</th>
                <th className="py-4 text-right font-bold">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => {
                const isActive = u.statusColor === 'emerald';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition group">
                    {/* User Identity */}
                    <td className="py-4">
                      <div className="font-bold text-black text-xs font-sans">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                    </td>

                    {/* Department */}
                    <td className="py-4 text-slate-700 font-normal">
                      {u.dept}
                    </td>

                    {/* Role Badge */}
                    <td className="py-4">
                      <span className="inline-block text-[9px] font-bold tracking-widest uppercase border border-slate-300 px-2.5 py-1 text-slate-800 font-mono">
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <span className="flex items-center gap-2 text-xs text-slate-700">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        ></span>
                        <span>{u.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="text-xs text-slate-400 hover:text-black font-medium transition cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
