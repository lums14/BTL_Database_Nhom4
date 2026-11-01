/**
 * Middleware kiểm tra danh tính và phân quyền (RBAC Middleware)
 */
const { AuthModel } = require('../models/authModel');
const DocumentModel = require('../models/documentModel');
const fs = require('fs');

/**
 * Middleware trích xuất thông tin người dùng từ Request Headers / Body
 */
async function extractCurrentUser(req, res, next) {
    try {
        let userId = req.headers['x-user-id'] || 
                     req.body?.user_id || 
                     req.query?.user_id;

        // Trích xuất từ Authorization Header: Bearer <user_id>
        if (!userId && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                const tokenVal = parts[1].trim();
                // Nếu tokenVal là con số
                if (!isNaN(tokenVal)) {
                    userId = parseInt(tokenVal, 10);
                } else {
                    try {
                        const parsed = JSON.parse(decodeURIComponent(tokenVal));
                        if (parsed.user_id) userId = parsed.user_id;
                    } catch {
                        // ignore
                    }
                }
            }
        }

        if (userId) {
            const user = await AuthModel.findById(userId);
            if (user) {
                req.user = user;
            } else {
                // Fallback nếu có header role
                const roleId = parseInt(req.headers['x-role-id'], 10) || 2;
                const roleName = req.headers['x-role-name'] || (roleId === 1 ? 'Admin' : 'Staff');
                req.user = {
                    user_id: parseInt(userId, 10),
                    role_id: roleId,
                    role_name: roleName
                };
            }
        }

        next();
    } catch (err) {
        next(err);
    }
}

/**
 * Middleware bảo vệ quyền Chỉnh sửa hoặc Xóa tài liệu (RBAC Guard)
 * - Admin (role_id = 1): Toàn quyền Sửa / Xóa mọi tài liệu
 * - Staff (role_id = 2): Chỉ được Sửa / Xóa tài liệu do chính mình đăng tải (doc.uploaded_by === user.user_id)
 */
async function requireDocumentOwnership(req, res, next) {
    try {
        const docId = parseInt(req.params.id, 10);
        if (isNaN(docId)) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'ID tài liệu không hợp lệ.'
            });
        }

        // 1. Lấy thông tin tài liệu cần thao tác
        let existingDoc = null;
        try {
            existingDoc = await DocumentModel.getById(docId);
        } catch (e) {
            // Trường hợp DB offline, fallback check
            console.warn('[RBAC] Lỗi đọc tài liệu từ DB, dùng fallback check:', e.message);
        }

        // Nếu DB trả về null hoặc offline, lưu docId vào req để controller xử lý
        if (existingDoc) {
            req.targetDoc = existingDoc;
        }

        // 2. Xác định người dùng đang thực hiện request
        const currentUser = req.user;

        // Nếu không có thông tin user đăng nhập -> Yêu cầu đăng nhập
        if (!currentUser) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để thực hiện thao tác này.'
            });
        }

        const roleId = Number(currentUser.role_id);
        const roleName = (currentUser.role_name || '').toLowerCase();
        const isAdmin = roleId === 1 || roleName === 'admin';

        // Admin có toàn quyền trên tất cả tài liệu
        if (isAdmin) {
            return next();
        }

        // Nếu là Staff (role_id = 2): Chỉ cho phép nếu documents.uploaded_by === currentUser.user_id
        if (existingDoc) {
            const isOwner = Number(existingDoc.uploaded_by) === Number(currentUser.user_id);
            if (!isOwner) {
                // Xóa file tạm vừa upload lên nếu có
                if (req.file && fs.existsSync(req.file.path)) {
                    try { fs.unlinkSync(req.file.path); } catch {}
                }

                return res.status(403).json({
                    success: false,
                    message: 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!'
                });
            }
        }

        return next();
    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch {}
        }
        next(err);
    }
}

module.exports = {
    extractCurrentUser,
    requireDocumentOwnership
};
