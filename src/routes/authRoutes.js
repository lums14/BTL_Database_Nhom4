/**
 * Định tuyến (Routes) cho Phân hệ Xác thực & Quyền hạn (Authentication)
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// 1. POST /api/auth/login - Đăng nhập tài khoản
router.post('/login', AuthController.login);

// 2. GET /api/auth/me - Lấy thông tin user hiện tại
router.get('/me', AuthController.getMe);

// 3. GET /api/auth/users - Lấy danh sách tài khoản demo
router.get('/users', AuthController.getQuickDemoUsers);

module.exports = router;
