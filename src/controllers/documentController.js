/**
 * Controller xử lý các tác vụ liên quan đến tài liệu (CRUD & Download & File storage)
 */
const fs = require('fs');
const path = require('path');
const DocumentModel = require('../models/documentModel');

class DocumentController {
    /**
     * GET /api/documents
     * Lấy danh sách tài liệu (hỗ trợ search, filter theo category_id)
     */
    static async getDocuments(req, res, next) {
        try {
            const { search, category_id } = req.query;
            const documents = await DocumentModel.getAll({ search, category_id });

            return res.status(200).json({
                success: true,
                total: documents.length,
                data: documents
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/documents/:id
     * Lấy chi tiết một tài liệu theo ID
     */
    static async getDocumentById(req, res, next) {
        try {
            const docId = parseInt(req.params.id, 10);
            if (isNaN(docId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID tài liệu không hợp lệ.'
                });
            }

            const document = await DocumentModel.getById(docId);
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy tài liệu có ID = ${docId}.`
                });
            }

            return res.status(200).json({
                success: true,
                data: document
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/documents
     * Thêm mới tài liệu kèm file đính kèm qua Multer
     */
    static async createDocument(req, res, next) {
        try {
            const { title, description, category_id, uploaded_by } = req.body;

            // Kiểm tra các trường thông tin bắt buộc
            if (!title || !title.trim()) {
                if (req.file) fs.unlinkSync(req.file.path); // Xóa file rác vừa upload nếu thiếu dữ liệu
                return res.status(400).json({
                    success: false,
                    message: 'Tiêu đề tài liệu (title) là bắt buộc.'
                });
            }

            if (!category_id || isNaN(category_id)) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: 'Danh mục tài liệu (category_id) không hợp lệ.'
                });
            }

            // Tự động lấy user_id của người đang đăng nhập gán vào cột uploaded_by
            const finalUploadedBy = req.user?.user_id || 
                                    (uploaded_by && !isNaN(uploaded_by) ? parseInt(uploaded_by, 10) : 1);

            // Kiểm tra file đính kèm
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn file tài liệu cần tải lên.'
                });
            }

            const fileExt = path.extname(req.file.originalname).replace('.', '').toLowerCase();
            const fileSizeKb = parseFloat((req.file.size / 1024).toFixed(2));
            const relativeFilePath = `uploads/${req.file.filename}`;

            const newDocId = await DocumentModel.create({
                title: title.trim(),
                description: description ? description.trim() : null,
                file_path: relativeFilePath,
                file_type: fileExt,
                file_size: fileSizeKb,
                category_id: parseInt(category_id, 10),
                uploaded_by: finalUploadedBy
            });

            const createdDocument = await DocumentModel.getById(newDocId);

            return res.status(201).json({
                success: true,
                message: 'Tải lên tài liệu mới thành công.',
                data: createdDocument
            });
        } catch (error) {
            // Xóa file nếu có lỗi xảy ra trong quá trình lưu CSDL
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error);
        }
    }

    /**
     * PUT /api/documents/:id
     * Cập nhật thông tin tài liệu (có thể kèm file mới hoặc giữ file cũ)
     */
    static async updateDocument(req, res, next) {
        try {
            const docId = parseInt(req.params.id, 10);
            if (isNaN(docId)) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: 'ID tài liệu không hợp lệ.'
                });
            }

            const existingDoc = await DocumentModel.getById(docId);
            if (!existingDoc) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy tài liệu có ID = ${docId} để cập nhật.`
                });
            }

            // Kiểm tra phân quyền RBAC:
            // Admin (role_id = 1): Cho phép sửa mọi tài liệu
            // Staff (role_id = 2): Chỉ cho phép nếu documents.uploaded_by === user_id
            const currentUser = req.user;
            if (currentUser) {
                const roleId = Number(currentUser.role_id);
                const roleName = (currentUser.role_name || '').toLowerCase();
                const isAdmin = roleId === 1 || roleName === 'admin';
                if (!isAdmin && Number(existingDoc.uploaded_by) !== Number(currentUser.user_id)) {
                    if (req.file && fs.existsSync(req.file.path)) {
                        try { fs.unlinkSync(req.file.path); } catch {}
                    }
                    return res.status(403).json({
                        success: false,
                        message: 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!'
                    });
                }
            }

            const { title, description, category_id } = req.body;
            const updateData = {};

            if (title !== undefined && title.trim() !== '') {
                updateData.title = title.trim();
            }
            if (description !== undefined) {
                updateData.description = description.trim();
            }
            if (category_id !== undefined && !isNaN(category_id)) {
                updateData.category_id = parseInt(category_id, 10);
            }

            let oldFileToDelete = null;

            // Nếu người dùng upload file mới thay thế
            if (req.file) {
                const fileExt = path.extname(req.file.originalname).replace('.', '').toLowerCase();
                const fileSizeKb = parseFloat((req.file.size / 1024).toFixed(2));
                updateData.file_path = `uploads/${req.file.filename}`;
                updateData.file_type = fileExt;
                updateData.file_size = fileSizeKb;

                oldFileToDelete = path.join(__dirname, '..', '..', existingDoc.file_path);
            }

            await DocumentModel.update(docId, updateData);

            // Xóa file cũ nếu người dùng đã thay thế file mới thành công
            if (oldFileToDelete && fs.existsSync(oldFileToDelete)) {
                try {
                    fs.unlinkSync(oldFileToDelete);
                } catch (e) {
                    console.warn(`Không thể xóa file cũ: ${oldFileToDelete}`);
                }
            }

            const updatedDoc = await DocumentModel.getById(docId);

            return res.status(200).json({
                success: true,
                message: 'Cập nhật tài liệu thành công.',
                data: updatedDoc
            });
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error);
        }
    }

    /**
     * DELETE /api/documents/:id
     * Xóa tài liệu khỏi hệ thống (đồng thời xóa file vật lý trong /uploads)
     */
    static async deleteDocument(req, res, next) {
        try {
            const docId = parseInt(req.params.id, 10);
            if (isNaN(docId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID tài liệu không hợp lệ.'
                });
            }

            const existingDoc = await DocumentModel.getById(docId);
            if (!existingDoc) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy tài liệu có ID = ${docId} để xóa.`
                });
            }

            // Kiểm tra phân quyền RBAC:
            // Admin (role_id = 1): Cho phép xóa mọi tài liệu
            // Staff (role_id = 2): Chỉ cho phép xóa nếu documents.uploaded_by === user_id
            const currentUser = req.user;
            if (currentUser) {
                const roleId = Number(currentUser.role_id);
                const roleName = (currentUser.role_name || '').toLowerCase();
                const isAdmin = roleId === 1 || roleName === 'admin';
                if (!isAdmin && Number(existingDoc.uploaded_by) !== Number(currentUser.user_id)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Bạn chỉ có quyền chỉnh sửa hoặc xóa tài liệu do chính mình đăng tải!'
                    });
                }
            }

            // Xóa bản ghi trong MySQL Database
            await DocumentModel.delete(docId);

            // Xóa file vật lý trong thư mục uploads nếu có
            if (existingDoc.file_path) {
                const physicalPath = path.join(__dirname, '..', '..', existingDoc.file_path);
                if (fs.existsSync(physicalPath)) {
                    try {
                        fs.unlinkSync(physicalPath);
                    } catch (e) {
                        console.warn(`Không thể xóa file vật lý: ${physicalPath}`);
                    }
                }
            }

            return res.status(200).json({
                success: true,
                message: `Đã xóa thành công tài liệu: "${existingDoc.title}" (ID: ${docId}).`
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/documents/:id/download
     * Tăng số lượt tải (download_count = download_count + 1)
     */
    static async recordDownload(req, res, next) {
        try {
            const docId = parseInt(req.params.id, 10);
            if (isNaN(docId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID tài liệu không hợp lệ.'
                });
            }

            const document = await DocumentModel.getById(docId);
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy tài liệu có ID = ${docId}.`
                });
            }

            // Tăng download_count
            await DocumentModel.incrementDownloadCount(docId);

            const updatedDoc = await DocumentModel.getById(docId);

            return res.status(200).json({
                success: true,
                message: 'Đã ghi nhận lượt tải tài liệu thành công.',
                download_count: updatedDoc.download_count,
                download_url: `/api/documents/${docId}/download-file`,
                data: updatedDoc
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/documents/:id/download-file
     * Tải trực tiếp file tài liệu về máy client
     */
    static async downloadFile(req, res, next) {
        try {
            const docId = parseInt(req.params.id, 10);
            const document = await DocumentModel.getById(docId);

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy tài liệu có ID = ${docId}.`
                });
            }

            const physicalPath = path.join(__dirname, '..', '..', document.file_path);
            if (!fs.existsSync(physicalPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File vật lý không tồn tại trên máy chủ lưu trữ.'
                });
            }

            // Tự động tăng download_count khi người dùng tải file trực tiếp
            await DocumentModel.incrementDownloadCount(docId);

            // Lấy tên tải về thân thiện với người dùng
            const sanitizedTitle = document.title
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9_-]/g, '_');
            const downloadFilename = `${sanitizedTitle}.${document.file_type}`;

            return res.download(physicalPath, downloadFilename);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DocumentController;
