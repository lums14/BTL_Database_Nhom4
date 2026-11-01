/**
 * Model xử lý các truy vấn thống kê chuyên sâu (Aggregations, Complex JOINs, GROUP BY)
 * Phục vụ báo cáo và đánh giá kiến thức môn Cơ sở dữ liệu
 */
const { pool } = require('../config/db');
const { fallbackDocumentsStore, FALLBACK_CATEGORIES, FALLBACK_DEPARTMENTS, FALLBACK_USERS } = require('../data/fallbackData');

class StatsModel {
    /**
     * API 1: Thống kê số lượng tài liệu và tổng dung lượng file của từng danh mục.
     */
    static async getCategoryStats() {
        try {
            const sql = `
                SELECT 
                    c.category_id,
                    c.category_name,
                    c.description,
                    COUNT(d.doc_id) AS total_documents,
                    COALESCE(ROUND(SUM(d.file_size), 2), 0) AS total_file_size_kb,
                    COALESCE(ROUND(SUM(d.file_size) / 1048576, 2), 0) AS total_file_size_mb,
                    COALESCE(SUM(d.download_count), 0) AS total_downloads,
                    COALESCE(ROUND(AVG(d.download_count), 1), 0) AS avg_downloads_per_doc
                FROM categories c
                LEFT JOIN documents d ON c.category_id = d.category_id
                GROUP BY c.category_id, c.category_name, c.description
                ORDER BY total_documents DESC, total_file_size_kb DESC;
            `;

            const [rows] = await pool.query(sql);
            return rows;
        } catch {
            return FALLBACK_CATEGORIES.map(cat => {
                const docs = fallbackDocumentsStore.filter(d => d.category_id === cat.category_id);
                const totalDocs = docs.length;
                const totalKb = docs.reduce((acc, cur) => acc + (parseFloat(cur.file_size) || 0), 0);
                const totalDownloads = docs.reduce((acc, cur) => acc + (cur.download_count || 0), 0);
                return {
                    category_id: cat.category_id,
                    category_name: cat.category_name,
                    description: cat.description,
                    total_documents: totalDocs,
                    total_file_size_kb: parseFloat(totalKb.toFixed(2)),
                    total_file_size_mb: parseFloat((totalKb / 1048576).toFixed(2)),
                    total_downloads: totalDownloads,
                    avg_downloads_per_doc: totalDocs > 0 ? parseFloat((totalDownloads / totalDocs).toFixed(1)) : 0
                };
            }).sort((a, b) => b.total_documents - a.total_documents);
        }
    }

    /**
     * API 2: Thống kê tổng số lượng tài liệu do nhân viên thuộc từng phòng ban đóng góp và tổng lượt tải xuống.
     */
    static async getDepartmentStats() {
        try {
            const sql = `
                SELECT 
                    dept.dept_id,
                    dept.dept_name,
                    dept.description,
                    COUNT(DISTINCT u.user_id) AS total_employees,
                    COUNT(d.doc_id) AS total_documents,
                    COALESCE(SUM(d.download_count), 0) AS total_downloads,
                    COALESCE(ROUND(SUM(d.file_size), 2), 0) AS total_storage_kb
                FROM departments dept
                LEFT JOIN users u ON dept.dept_id = u.dept_id
                LEFT JOIN documents d ON u.user_id = d.uploaded_by
                GROUP BY dept.dept_id, dept.dept_name, dept.description
                ORDER BY total_documents DESC, total_downloads DESC;
            `;

            const [rows] = await pool.query(sql);
            return rows;
        } catch {
            return FALLBACK_DEPARTMENTS.map(dept => {
                const deptUsers = FALLBACK_USERS.filter(u => u.dept_id === dept.dept_id);
                const deptUserIds = deptUsers.map(u => u.user_id);
                const docs = fallbackDocumentsStore.filter(d => deptUserIds.includes(d.uploaded_by));
                const totalKb = docs.reduce((acc, cur) => acc + (parseFloat(cur.file_size) || 0), 0);
                const totalDownloads = docs.reduce((acc, cur) => acc + (cur.download_count || 0), 0);
                return {
                    dept_id: dept.dept_id,
                    dept_name: dept.dept_name,
                    description: dept.description,
                    total_employees: deptUsers.length,
                    total_documents: docs.length,
                    total_downloads: totalDownloads,
                    total_storage_kb: parseFloat(totalKb.toFixed(2))
                };
            }).sort((a, b) => b.total_documents - a.total_documents);
        }
    }

    /**
     * API 3: Lấy ra Top 5 nhân viên tích cực đăng tải nhiều tài liệu nhất hệ thống.
     */
    static async getTopUploaders() {
        try {
            const sql = `
                SELECT 
                    u.user_id,
                    u.full_name,
                    u.email,
                    dept.dept_name,
                    r.role_name,
                    COUNT(d.doc_id) AS total_uploaded_documents,
                    COALESCE(SUM(d.download_count), 0) AS total_downloads_received,
                    COALESCE(ROUND(SUM(d.file_size), 2), 0) AS total_storage_used_kb,
                    MAX(d.created_at) AS latest_upload_date
                FROM users u
                INNER JOIN departments dept ON u.dept_id = dept.dept_id
                INNER JOIN roles r ON u.role_id = r.role_id
                INNER JOIN documents d ON u.user_id = d.uploaded_by
                GROUP BY u.user_id, u.full_name, u.email, dept.dept_name, r.role_name
                ORDER BY total_uploaded_documents DESC, total_downloads_received DESC
                LIMIT 5;
            `;

            const [rows] = await pool.query(sql);
            return rows;
        } catch {
            const map = {};
            fallbackDocumentsStore.forEach(d => {
                if (!map[d.uploaded_by]) {
                    const u = FALLBACK_USERS.find(user => user.user_id === d.uploaded_by) || {
                        user_id: d.uploaded_by,
                        full_name: d.uploader_name || `User ${d.uploaded_by}`,
                        email: d.uploader_email || 'user@example.com',
                        dept_name: d.dept_name || 'Phòng Ban',
                        role_name: 'Staff'
                    };
                    map[d.uploaded_by] = {
                        user_id: u.user_id,
                        full_name: u.full_name,
                        email: u.email,
                        dept_name: u.dept_name,
                        role_name: u.role_name || 'Staff',
                        total_uploaded_documents: 0,
                        total_downloads_received: 0,
                        total_storage_used_kb: 0,
                        latest_upload_date: d.created_at
                    };
                }
                map[d.uploaded_by].total_uploaded_documents += 1;
                map[d.uploaded_by].total_downloads_received += (d.download_count || 0);
                map[d.uploaded_by].total_storage_used_kb += (parseFloat(d.file_size) || 0);
            });

            return Object.values(map)
                .sort((a, b) => b.total_uploaded_documents - a.total_uploaded_documents)
                .slice(0, 5);
        }
    }

    /**
     * API Phụ trợ: Lấy số liệu tổng quan hệ thống (Dashboard KPI Cards)
     */
    static async getOverviewStats() {
        try {
            const sql = `
                SELECT 
                    (SELECT COUNT(*) FROM documents) AS total_documents,
                    (SELECT COUNT(*) FROM users) AS total_users,
                    (SELECT COUNT(*) FROM departments) AS total_departments,
                    (SELECT COUNT(*) FROM categories) AS total_categories,
                    (SELECT COALESCE(SUM(download_count), 0) FROM documents) AS total_downloads,
                    (SELECT COALESCE(ROUND(SUM(file_size) / 1048576, 2), 0) FROM documents) AS total_storage_mb;
            `;

            const [rows] = await pool.query(sql);
            return rows[0];
        } catch {
            const totalDocs = fallbackDocumentsStore.length;
            const totalDownloads = fallbackDocumentsStore.reduce((acc, cur) => acc + (cur.download_count || 0), 0);
            const totalKb = fallbackDocumentsStore.reduce((acc, cur) => acc + (parseFloat(cur.file_size) || 0), 0);
            return {
                total_documents: totalDocs,
                total_users: FALLBACK_USERS.length,
                total_departments: FALLBACK_DEPARTMENTS.length,
                total_categories: FALLBACK_CATEGORIES.length,
                total_downloads: totalDownloads,
                total_storage_mb: parseFloat((totalKb / 1048576).toFixed(2))
            };
        }
    }
}

module.exports = StatsModel;
