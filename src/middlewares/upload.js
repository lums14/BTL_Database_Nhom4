/**
 * Cấu hình Multer Upload File cho hệ thống Quản lý Tài liệu
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const uploadDirectory = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');

// Tự động tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Cấu hình vị trí lưu và đặt tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        // Làm sạch tên file gốc (loại bỏ ký tự đặc biệt)
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext)
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Khử dấu tiếng Việt
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 40);

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

// Bộ lọc định dạng file hợp lệ
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.zip', '.rar', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Định dạng file không được hỗ trợ (${ext}). Chỉ chấp nhận: ${allowedExtensions.join(', ')}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 20 * 1024 * 1024 // Mặc định 20MB
    }
});

module.exports = upload;
