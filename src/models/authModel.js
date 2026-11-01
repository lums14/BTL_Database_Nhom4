/**
 * Model quản lý xác thực và tìm kiếm người dùng
 */
const { pool } = require('../config/db');

// Danh sách 10 tài khoản mẫu chuẩn RBAC bám sát 100% SQL_N4_BTL.sql
const FALLBACK_AUTH_USERS = [
    {
        user_id: 1,
        full_name: 'Nguyen Van An',
        email: 'an.nguyen@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 1,
        role_name: 'Admin',
        dept_id: 1,
        dept_name: 'Ban Giám Đốc'
    },
    {
        user_id: 2,
        full_name: 'Tran Thi Binh',
        email: 'binh.tran@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 1,
        role_name: 'Admin',
        dept_id: 2,
        dept_name: 'Phòng Nhân Sự'
    },
    {
        user_id: 3,
        full_name: 'Le Minh Cuong',
        email: 'cuong.le@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 4,
        dept_name: 'Phòng Kỹ Thuật & CNTT'
    },
    {
        user_id: 4,
        full_name: 'Pham Thu Dung',
        email: 'dung.pham@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 3,
        dept_name: 'Phòng Kế Toán & Tài Chính'
    },
    {
        user_id: 5,
        full_name: 'Hoang Van Em',
        email: 'em.hoang@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 2,
        dept_name: 'Phòng Nhân Sự'
    },
    {
        user_id: 6,
        full_name: 'Vu Thi Giang',
        email: 'giang.vu@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 4,
        dept_name: 'Phòng Kỹ Thuật & CNTT'
    },
    {
        user_id: 7,
        full_name: 'Ngo Van Hai',
        email: 'hai.ngo@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 5,
        dept_name: 'Phòng Kinh Doanh & Marketing'
    },
    {
        user_id: 8,
        full_name: 'Do Thi Linh',
        email: 'linh.do@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 3,
        dept_name: 'Phòng Kế Toán & Tài Chính'
    },
    {
        user_id: 9,
        full_name: 'Bui Van Minh',
        email: 'minh.bui@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 4,
        dept_name: 'Phòng Kỹ Thuật & CNTT'
    },
    {
        user_id: 10,
        full_name: 'Dang Thi Nga',
        email: 'nga.dang@example.com',
        password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role_id: 2,
        role_name: 'Staff',
        dept_id: 2,
        dept_name: 'Phòng Nhân Sự'
    }
];

class AuthModel {
    /**
     * Tìm thông tin người dùng theo email (kết hợp JOIN roles và LEFT JOIN departments)
     */
    static async findByEmail(email) {
        if (!email) return null;
        const normalizedEmail = email.trim().toLowerCase();

        try {
            const sql = `
                SELECT 
                    u.user_id,
                    u.full_name,
                    u.email,
                    u.password,
                    u.role_id,
                    r.role_name,
                    u.dept_id,
                    COALESCE(d.dept_name, 'Chưa xác định') AS dept_name
                FROM users u
                INNER JOIN roles r ON u.role_id = r.role_id
                LEFT JOIN departments d ON u.dept_id = d.dept_id
                WHERE LOWER(u.email) = ?
                LIMIT 1
            `;
            const [rows] = await pool.query(sql, [normalizedEmail]);
            if (rows && rows.length > 0) {
                return rows[0];
            }
        } catch (dbErr) {
            console.warn('[AuthModel] MySQL không khả dụng hoặc lỗi truy vấn, chuyển sang bộ nhớ Fallback:', dbErr.message);
        }

        // Fallback match theo email chuẩn hoặc prefix email (@example.com và @company.com)
        const matched = FALLBACK_AUTH_USERS.find(u => {
            const uMail = u.email.toLowerCase();
            return uMail === normalizedEmail ||
                   uMail.replace('@example.com', '@company.com') === normalizedEmail ||
                   normalizedEmail.split('@')[0] === uMail.split('@')[0];
        });

        return matched || null;
    }

    /**
     * Tìm thông tin người dùng theo user_id
     */
    static async findById(userId) {
        const id = parseInt(userId, 10);
        if (isNaN(id)) return null;

        try {
            const sql = `
                SELECT 
                    u.user_id,
                    u.full_name,
                    u.email,
                    u.role_id,
                    r.role_name,
                    u.dept_id,
                    COALESCE(d.dept_name, 'Chưa xác định') AS dept_name
                FROM users u
                INNER JOIN roles r ON u.role_id = r.role_id
                LEFT JOIN departments d ON u.dept_id = d.dept_id
                WHERE u.user_id = ?
                LIMIT 1
            `;
            const [rows] = await pool.query(sql, [id]);
            if (rows && rows.length > 0) {
                return rows[0];
            }
        } catch (dbErr) {
            console.warn('[AuthModel] MySQL không khả dụng, dùng fallback findById');
        }

        return FALLBACK_AUTH_USERS.find(u => u.user_id === id) || null;
    }

    /**
     * Lấy danh sách 10 người dùng mẫu phục vụ Quick Demo Login
     */
    static getFallbackUsers() {
        return FALLBACK_AUTH_USERS.map(({ password, ...rest }) => rest);
    }
}

module.exports = {
    AuthModel,
    FALLBACK_AUTH_USERS
};
