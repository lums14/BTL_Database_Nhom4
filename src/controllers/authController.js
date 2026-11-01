/**
 * Controller xử lý Đăng nhập xác thực và Phân quyền (Authentication & Authorization)
 */
const bcrypt = require('bcryptjs');
const { AuthModel } = require('../models/authModel');

class AuthController {
    /**
     * POST /api/auth/login
     * Đăng nhập người dùng bằng email và mật khẩu
     */
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // 1. Kiểm tra đầu vào bắt buộc
            if (!email || !email.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp địa chỉ email nhân viên.'
                });
            }

            if (!password || !password.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp mật khẩu truy cập.'
                });
            }

            const cleanEmail = email.trim();
            const cleanPassword = password.trim();

            // 2. Tìm thông tin người dùng trong CSDL (JOIN roles & departments)
            const user = await AuthModel.findByEmail(cleanEmail);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: `Tài khoản email "${cleanEmail}" không tồn tại trong hệ thống.`
                });
            }

            // 3. Kiểm tra mật khẩu bằng bcryptjs HOẶC so sánh trực tiếp chuỗi 'password' (phục vụ đồ án)
            let isPasswordValid = false;

            // (a) Kiểm tra trực tiếp chuỗi 'password' cho mục đích demo đồ án
            if (cleanPassword === 'password' || cleanPassword === user.password) {
                isPasswordValid = true;
            }

            // (b) Kiểm tra bằng bcryptjs
            if (!isPasswordValid && user.password) {
                try {
                    // Xử lý cả hash $2y$ (PHP/Laravel) sang $2a$ chuẩn bcryptjs
                    const normalizedHash = user.password.replace(/^\$2y\$/, '$2a$');
                    if (bcrypt.compareSync(cleanPassword, user.password) || bcrypt.compareSync(cleanPassword, normalizedHash)) {
                        isPasswordValid = true;
                    }
                } catch (err) {
                    // Nếu hash không đúng định dạng bcrypt, vẫn cho phép nếu trùng 'password'
                    if (cleanPassword === 'password') {
                        isPasswordValid = true;
                    }
                }
            }

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Mật khẩu không chính xác. Mật khẩu mặc định hệ thống là: "password".'
                });
            }

            // 4. Chuẩn bị payload thông tin người dùng trả về Client
            const authUserData = {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role_id: user.role_id,
                role_name: user.role_name || (user.role_id === 1 ? 'Admin' : 'Staff'),
                dept_id: user.dept_id,
                dept_name: user.dept_name || 'Phòng Nội Bộ'
            };

            return res.status(200).json({
                success: true,
                message: `Đăng nhập thành công! Chào mừng ${authUserData.full_name} (${authUserData.role_name}).`,
                data: authUserData
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/me
     * Lấy thông tin tài khoản đang đăng nhập hiện tại từ header
     */
    static async getMe(req, res, next) {
        try {
            const userId = req.headers['x-user-id'] || 
                           (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Chưa có phiên đăng nhập hợp lệ.'
                });
            }

            const user = await AuthModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy thông tin tài khoản.'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    role_id: user.role_id,
                    role_name: user.role_name,
                    dept_id: user.dept_id,
                    dept_name: user.dept_name
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/users
     * Lấy danh sách 10 user mẫu cho tính năng Quick Demo Login
     */
    static async getQuickDemoUsers(req, res, next) {
        try {
            const users = AuthModel.getFallbackUsers();
            return res.status(200).json({
                success: true,
                total: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
