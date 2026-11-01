/**
 * Định tuyến (Routes) cho phân hệ Quản lý tài liệu (Documents)
 * Tích hợp Phân quyền chi tiết (RBAC Guard)
 */
const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const upload = require('../middlewares/upload');
const { extractCurrentUser, requireDocumentOwnership } = require('../middlewares/auth');

// Áp dụng middleware trích xuất user cho toàn bộ route tài liệu
router.use(extractCurrentUser);

// 1. GET /api/documents - Lấy danh sách tài liệu (tìm kiếm & lọc)
router.get('/', DocumentController.getDocuments);

// 2. GET /api/documents/:id - Lấy thông tin chi tiết một tài liệu
router.get('/:id', DocumentController.getDocumentById);

// 3. POST /api/documents - Thêm mới tài liệu (Tự động gán uploaded_by của user đang đăng nhập)
router.post('/', upload.single('file'), DocumentController.createDocument);

// 4. PUT /api/documents/:id - Cập nhật thông tin tài liệu (Kiểm tra quyền Admin hoặc chính chủ)
router.put('/:id', upload.single('file'), requireDocumentOwnership, DocumentController.updateDocument);

// 5. DELETE /api/documents/:id - Xóa tài liệu theo ID (Kiểm tra quyền Admin hoặc chính chủ)
router.delete('/:id', requireDocumentOwnership, DocumentController.deleteDocument);

// 6. POST /api/documents/:id/download - Ghi nhận lượt tải xuống (+1 download_count)
router.post('/:id/download', DocumentController.recordDownload);

// 7. GET /api/documents/:id/download-file - Tải file vật lý trực tiếp về máy
router.get('/:id/download-file', DocumentController.downloadFile);

module.exports = router;
