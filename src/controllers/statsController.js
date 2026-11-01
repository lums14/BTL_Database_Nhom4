/**
 * Controller xử lý 3 API Thống kê chuyên sâu phục vụ báo cáo bài tập lớn môn CSDL
 */
const StatsModel = require('../models/statsModel');

class StatsController {
    /**
     * API 1: GET /api/stats/categories
     * Thống kê số lượng tài liệu và tổng dung lượng file của từng danh mục
     * (Sử dụng LEFT JOIN, GROUP BY, COUNT, SUM)
     */
    static async getCategoryStats(req, res, next) {
        try {
            const stats = await StatsModel.getCategoryStats();
            return res.status(200).json({
                success: true,
                message: 'Lấy thống kê tài liệu theo danh mục thành công.',
                total_categories: stats.length,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * API 2: GET /api/stats/departments
     * Thống kê tổng số lượng tài liệu do nhân viên thuộc từng phòng ban đóng góp và tổng lượt tải xuống
     * (Sử dụng LEFT JOIN qua 3 bảng departments - users - documents, GROUP BY, COUNT, SUM)
     */
    static async getDepartmentStats(req, res, next) {
        try {
            const stats = await StatsModel.getDepartmentStats();
            return res.status(200).json({
                success: true,
                message: 'Lấy thống kê đóng góp tài liệu theo phòng ban thành công.',
                total_departments: stats.length,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * API 3: GET /api/stats/top-uploaders
     * Lấy ra Top 5 nhân viên tích cực đăng tải nhiều tài liệu nhất hệ thống
     * (Sử dụng INNER JOIN giữa users, departments, documents, GROUP BY, COUNT, ORDER BY DESC, LIMIT 5)
     */
    static async getTopUploaders(req, res, next) {
        try {
            const topUsers = await StatsModel.getTopUploaders();
            return res.status(200).json({
                success: true,
                message: 'Lấy danh sách Top 5 nhân viên đăng tải nhiều tài liệu nhất thành công.',
                total_records: topUsers.length,
                data: topUsers
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/stats/overview
     * Số liệu tổng quan Dashboard (KPI Cards)
     */
    static async getOverview(req, res, next) {
        try {
            const overview = await StatsModel.getOverviewStats();
            return res.status(200).json({
                success: true,
                data: overview
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StatsController;
