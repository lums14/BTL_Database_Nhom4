/**
 * Định tuyến (Routes) cho 3 API Thống kê chuyên sâu
 */
const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');

// API 1: Thống kê số lượng tài liệu và tổng dung lượng file của từng danh mục
router.get('/categories', StatsController.getCategoryStats);

// API 2: Thống kê số lượng tài liệu do nhân viên thuộc từng phòng ban đóng góp & tổng lượt tải
router.get('/departments', StatsController.getDepartmentStats);

// API 3: Lấy ra Top 5 nhân viên tích cực đăng tải nhiều tài liệu nhất hệ thống
router.get('/top-uploaders', StatsController.getTopUploaders);

// API Bổ trợ: Thống kê tổng quan hệ thống (Overview KPI)
router.get('/overview', StatsController.getOverview);

module.exports = router;
