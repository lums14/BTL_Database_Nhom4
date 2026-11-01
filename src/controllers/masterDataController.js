/**
 * Controller cung cấp dữ liệu nền (Master Data) cho frontend / Postman
 */
const MasterDataModel = require('../models/masterDataModel');

class MasterDataController {
    /**
     * GET /api/categories
     * Lấy danh sách các danh mục tài liệu
     */
    static async getCategories(req, res, next) {
        try {
            const categories = await MasterDataModel.getCategories();
            return res.status(200).json({
                success: true,
                total: categories.length,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/departments
     * Lấy danh sách các phòng ban
     */
    static async getDepartments(req, res, next) {
        try {
            const departments = await MasterDataModel.getDepartments();
            return res.status(200).json({
                success: true,
                total: departments.length,
                data: departments
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users
     * Lấy danh sách nhân viên
     */
    static async getUsers(req, res, next) {
        try {
            const users = await MasterDataModel.getUsers();
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

module.exports = MasterDataController;
