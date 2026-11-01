/**
 * Model quản lý dữ liệu danh mục, phòng ban, vai trò và người dùng
 */
const { pool } = require('../config/db');

const FALLBACK_CATEGORIES = [
    { category_id: 1, category_name: 'Chính Sách & Nội Quy', description: 'Các văn bản quy định, nội quy làm việc, bảo mật và chính sách nhân sự' },
    { category_id: 2, category_name: 'Hợp Đồng & Pháp Lý', description: 'Mẫu hợp đồng kinh tế, NDA bảo mật, thỏa thuận hợp tác và hồ sơ pháp lý' },
    { category_id: 3, category_name: 'Báo Cáo Tài Chính & Kế Toán', description: 'Báo cáo doanh thu, quyết toán thuế, kiểm toán và phân bổ ngân sách' },
    { category_id: 4, category_name: 'Tài Liệu Kỹ Thuật & Dự Án', description: 'Kiến trúc hệ thống, tài liệu đặc tả SRS, tài liệu API và quy trình DevOps' },
    { category_id: 5, category_name: 'Biểu Mẫu Hành Chính', description: 'Các mẫu đơn đề xuất, thanh toán tạm ứng, đơn nghỉ phép và bàn giao tài sản' },
    { category_id: 6, category_name: 'Đào Tạo & Hướng Dẫn', description: 'Giáo trình đào tạo, tài liệu Onboarding nhân sự mới và cẩm nang kỹ năng' },
    { category_id: 7, category_name: 'Biên Bản Họp & Nghị Quyết', description: 'Biên bản các phiên họp giao ban, đại hội cổ đông và nghị quyết chiến lược' },
    { category_id: 8, category_name: 'Hồ Sơ Thuế & Ngân Sách', description: 'Hồ sơ quyết toán thuế, dự toán chi tiêu và phân bổ dòng tiền hàng năm' }
];

const FALLBACK_DEPARTMENTS = [
    { dept_id: 1, dept_name: 'Ban Giám Đốc', description: 'Cơ quan điều hành chiến lược và ban hành quy chế cấp cao' },
    { dept_id: 2, dept_name: 'Phòng Nhân Sự', description: 'Quản lý nhân sự, tuyển dụng, đào tạo, chính sách và tiền lương' },
    { dept_id: 3, dept_name: 'Phòng Kế Toán & Tài Chính', description: 'Quản lý tài chính, dòng tiền, ngân sách, hóa đơn và quyết toán thuế' },
    { dept_id: 4, dept_name: 'Phòng Kỹ Thuật & CNTT', description: 'Nghiên cứu phát triển phần mềm, hạ tầng máy chủ và an toàn thông tin' },
    { dept_id: 5, dept_name: 'Phòng Kinh Doanh & Marketing', description: 'Phát triển thị trường, quan hệ đối tác khách hàng và thương mại' }
];

const FALLBACK_USERS = [
    { user_id: 1, full_name: 'Nguyen Van An', email: 'an.nguyen@example.com', role_id: 1, role_name: 'Admin', dept_id: 1, dept_name: 'Ban Giám Đốc' },
    { user_id: 2, full_name: 'Tran Thi Binh', email: 'binh.tran@example.com', role_id: 1, role_name: 'Admin', dept_id: 2, dept_name: 'Phòng Nhân Sự' },
    { user_id: 3, full_name: 'Le Minh Cuong', email: 'cuong.le@example.com', role_id: 2, role_name: 'Staff', dept_id: 4, dept_name: 'Phòng Kỹ Thuật & CNTT' },
    { user_id: 4, full_name: 'Pham Thu Dung', email: 'dung.pham@example.com', role_id: 2, role_name: 'Staff', dept_id: 3, dept_name: 'Phòng Kế Toán & Tài Chính' },
    { user_id: 5, full_name: 'Hoang Van Em', email: 'em.hoang@example.com', role_id: 2, role_name: 'Staff', dept_id: 2, dept_name: 'Phòng Nhân Sự' },
    { user_id: 6, full_name: 'Vu Thi Giang', email: 'giang.vu@example.com', role_id: 2, role_name: 'Staff', dept_id: 4, dept_name: 'Phòng Kỹ Thuật & CNTT' },
    { user_id: 7, full_name: 'Ngo Van Hai', email: 'hai.ngo@example.com', role_id: 2, role_name: 'Staff', dept_id: 5, dept_name: 'Phòng Kinh Doanh & Marketing' },
    { user_id: 8, full_name: 'Do Thi Linh', email: 'linh.do@example.com', role_id: 2, role_name: 'Staff', dept_id: 3, dept_name: 'Phòng Kế Toán & Tài Chính' },
    { user_id: 9, full_name: 'Bui Van Minh', email: 'minh.bui@example.com', role_id: 2, role_name: 'Staff', dept_id: 4, dept_name: 'Phòng Kỹ Thuật & CNTT' },
    { user_id: 10, full_name: 'Dang Thi Nga', email: 'nga.dang@example.com', role_id: 2, role_name: 'Staff', dept_id: 2, dept_name: 'Phòng Nhân Sự' }
];

class MasterDataModel {
    /**
     * Lấy toàn bộ danh mục tài liệu
     */
    static async getCategories() {
        try {
            const sql = `SELECT category_id, category_name, description FROM categories ORDER BY category_id ASC`;
            const [rows] = await pool.query(sql);
            return rows;
        } catch {
            return FALLBACK_CATEGORIES;
        }
    }

    /**
     * Lấy toàn bộ phòng ban
     */
    static async getDepartments() {
        try {
            const sql = `SELECT dept_id, dept_name, description FROM departments ORDER BY dept_id ASC`;
            const [rows] = await pool.query(sql);
            return rows;
        } catch {
            return FALLBACK_DEPARTMENTS;
        }
    }

    /**
     * Lấy danh sách người dùng kèm vai trò và phòng ban
     */
    static async getUsers() {
        try {
            const sql = `
                SELECT 
                    u.user_id,
                    u.full_name,
                    u.email,
                    r.role_id,
                    r.role_name,
                    dept.dept_id,
                    dept.dept_name,
                    u.created_at
                FROM users u
                INNER JOIN roles r ON u.role_id = r.role_id
                INNER JOIN departments dept ON u.dept_id = dept.dept_id
                ORDER BY u.user_id ASC
            `;
            const [rows] = await pool.query(sql);
            return rows;
        } catch {
            return FALLBACK_USERS;
        }
    }
}

module.exports = MasterDataModel;
