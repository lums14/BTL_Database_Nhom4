/**
 * Model quản lý dữ liệu bảng `documents`
 * Thực hiện các thao tác CRUD và truy vấn JOIN với categories, users, departments
 * Tích hợp Fallback Data Store 50 tài liệu khớp 100% với SQL_N4_BTL.sql
 */
const { pool } = require('../config/db');
const { fallbackDocumentsStore, FALLBACK_CATEGORIES, FALLBACK_USERS } = require('../data/fallbackData');

class DocumentModel {
    /**
     * Lấy danh sách tài liệu có JOIN để lấy tên danh mục, người đăng, phòng ban
     * Hỗ trợ tìm kiếm theo tiêu đề/mô tả và lọc theo danh mục
     */
    static async getAll({ search, category_id } = {}) {
        try {
            let sql = `
                SELECT 
                    d.doc_id,
                    d.title,
                    d.description,
                    d.file_path,
                    d.file_type,
                    d.file_size,
                    d.download_count,
                    d.category_id,
                    c.category_name,
                    d.uploaded_by,
                    u.full_name AS uploader_name,
                    u.email AS uploader_email,
                    dept.dept_id,
                    dept.dept_name,
                    d.created_at,
                    d.updated_at
                FROM documents d
                INNER JOIN categories c ON d.category_id = c.category_id
                INNER JOIN users u ON d.uploaded_by = u.user_id
                INNER JOIN departments dept ON u.dept_id = dept.dept_id
                WHERE 1=1
            `;

            const params = [];

            // Lọc theo từ khóa tìm kiếm (tiêu đề hoặc mô tả)
            if (search && search.trim() !== '') {
                sql += ` AND (d.title LIKE ? OR d.description LIKE ?)`;
                const keyword = `%${search.trim()}%`;
                params.push(keyword, keyword);
            }

            // Lọc theo ID danh mục
            if (category_id && !isNaN(category_id)) {
                sql += ` AND d.category_id = ?`;
                params.push(parseInt(category_id, 10));
            }

            sql += ` ORDER BY d.created_at DESC`;

            const [rows] = await pool.query(sql, params);
            return rows;
        } catch (dbErr) {
            // Fallback khi MySQL chưa kết nối
            let results = [...fallbackDocumentsStore];

            if (search && search.trim() !== '') {
                const q = search.trim().toLowerCase();
                results = results.filter(d => 
                    d.title.toLowerCase().includes(q) || 
                    (d.description && d.description.toLowerCase().includes(q))
                );
            }

            if (category_id && !isNaN(category_id)) {
                const catId = parseInt(category_id, 10);
                results = results.filter(d => d.category_id === catId);
            }

            return results;
        }
    }

    /**
     * Lấy chi tiết 1 tài liệu theo doc_id
     */
    static async getById(docId) {
        const id = parseInt(docId, 10);
        try {
            const sql = `
                SELECT 
                    d.doc_id,
                    d.title,
                    d.description,
                    d.file_path,
                    d.file_type,
                    d.file_size,
                    d.download_count,
                    d.category_id,
                    c.category_name,
                    d.uploaded_by,
                    u.full_name AS uploader_name,
                    u.email AS uploader_email,
                    dept.dept_id,
                    dept.dept_name,
                    d.created_at,
                    d.updated_at
                FROM documents d
                INNER JOIN categories c ON d.category_id = c.category_id
                INNER JOIN users u ON d.uploaded_by = u.user_id
                INNER JOIN departments dept ON u.dept_id = dept.dept_id
                WHERE d.doc_id = ?
            `;

            const [rows] = await pool.query(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch {
            return fallbackDocumentsStore.find(d => d.doc_id === id) || null;
        }
    }

    /**
     * Thêm mới tài liệu vào CSDL
     */
    static async create({ title, description, file_path, file_type, file_size, category_id, uploaded_by }) {
        try {
            const sql = `
                INSERT INTO documents 
                    (title, description, file_path, file_type, file_size, category_id, uploaded_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(sql, [
                title,
                description || null,
                file_path,
                file_type,
                file_size,
                category_id,
                uploaded_by
            ]);

            return result.insertId;
        } catch (dbErr) {
            // Lưu vào fallback store
            const newId = fallbackDocumentsStore.length > 0 
                ? Math.max(...fallbackDocumentsStore.map(d => d.doc_id)) + 1 
                : 1;

            const user = FALLBACK_USERS.find(u => u.user_id === Number(uploaded_by)) || FALLBACK_USERS[0];
            const cat = FALLBACK_CATEGORIES.find(c => c.category_id === Number(category_id)) || FALLBACK_CATEGORIES[0];

            const newDoc = {
                doc_id: newId,
                title,
                description: description || null,
                file_path,
                file_type,
                file_size,
                download_count: 0,
                category_id: Number(category_id),
                category_name: cat.category_name,
                uploaded_by: Number(uploaded_by),
                uploader_name: user.full_name,
                uploader_email: user.email,
                dept_id: user.dept_id,
                dept_name: user.dept_name,
                created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
            };

            fallbackDocumentsStore.unshift(newDoc);
            return newId;
        }
    }

    /**
     * Cập nhật thông tin tài liệu theo doc_id
     */
    static async update(docId, updateData) {
        const id = parseInt(docId, 10);
        try {
            const fields = [];
            const params = [];

            if (updateData.title !== undefined) {
                fields.push('title = ?');
                params.push(updateData.title);
            }
            if (updateData.description !== undefined) {
                fields.push('description = ?');
                params.push(updateData.description);
            }
            if (updateData.category_id !== undefined) {
                fields.push('category_id = ?');
                params.push(updateData.category_id);
            }
            if (updateData.file_path !== undefined) {
                fields.push('file_path = ?');
                params.push(updateData.file_path);
            }
            if (updateData.file_type !== undefined) {
                fields.push('file_type = ?');
                params.push(updateData.file_type);
            }
            if (updateData.file_size !== undefined) {
                fields.push('file_size = ?');
                params.push(updateData.file_size);
            }

            if (fields.length === 0) {
                return false;
            }

            const sql = `UPDATE documents SET ${fields.join(', ')} WHERE doc_id = ?`;
            params.push(id);

            const [result] = await pool.query(sql, params);
            return result.affectedRows > 0;
        } catch {
            const target = fallbackDocumentsStore.find(d => d.doc_id === id);
            if (target) {
                if (updateData.title !== undefined) target.title = updateData.title;
                if (updateData.description !== undefined) target.description = updateData.description;
                if (updateData.category_id !== undefined) {
                    target.category_id = Number(updateData.category_id);
                    const cat = FALLBACK_CATEGORIES.find(c => c.category_id === target.category_id);
                    if (cat) target.category_name = cat.category_name;
                }
                if (updateData.file_path !== undefined) target.file_path = updateData.file_path;
                if (updateData.file_type !== undefined) target.file_type = updateData.file_type;
                if (updateData.file_size !== undefined) target.file_size = updateData.file_size;
                return true;
            }
            return false;
        }
    }

    /**
     * Xóa tài liệu khỏi CSDL theo doc_id
     */
    static async delete(docId) {
        const id = parseInt(docId, 10);
        try {
            const sql = `DELETE FROM documents WHERE doc_id = ?`;
            const [result] = await pool.query(sql, [id]);
            return result.affectedRows > 0;
        } catch {
            const idx = fallbackDocumentsStore.findIndex(d => d.doc_id === id);
            if (idx !== -1) {
                fallbackDocumentsStore.splice(idx, 1);
                return true;
            }
            return false;
        }
    }

    /**
     * Tăng số lượt tải của tài liệu lên 1 đơn vị
     */
    static async incrementDownloadCount(docId) {
        const id = parseInt(docId, 10);
        try {
            const sql = `
                UPDATE documents 
                SET download_count = download_count + 1 
                WHERE doc_id = ?
            `;
            const [result] = await pool.query(sql, [id]);
            return result.affectedRows > 0;
        } catch {
            const target = fallbackDocumentsStore.find(d => d.doc_id === id);
            if (target) {
                target.download_count = (target.download_count || 0) + 1;
                return true;
            }
            return false;
        }
    }
}

module.exports = DocumentModel;
