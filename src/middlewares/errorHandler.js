/**
 * Middleware xử lý lỗi tập trung cho toàn bộ ứng dụng Express
 */
const multer = require('multer');

function errorHandler(err, req, res, next) {
    console.error(`[Error Handler] ${new Date().toISOString()} - ${req.method} ${req.url}:`, err.message);

    // Xử lý lỗi do Multer gây ra
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Dung lượng file vượt quá giới hạn cho phép (tối đa 20MB).'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Lỗi upload file: ${err.message}`
        });
    }

    // Xử lý lỗi do Multer fileFilter custom error
    if (err.message && err.message.includes('Định dạng file không được hỗ trợ')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Xử lý lỗi từ MySQL Database
    if (err.code) {
        // Lỗi vi phạm khóa ngoại (Foreign Key Constraint Fail)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu khóa ngoại không hợp lệ (category_id hoặc uploaded_by không tồn tại trong hệ thống).'
            });
        }
        // Lỗi vi phạm ràng buộc UNIQUE (Duplicate entry)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Dữ liệu bị trùng lặp, vui lòng kiểm tra lại thông tin.'
            });
        }
        // Lỗi không tìm thấy database hoặc bảng
        if (err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({
                success: false,
                message: 'Cơ sở dữ liệu chưa được khởi tạo. Vui lòng chạy lệnh "npm run db:init".'
            });
        }
    }

    // Các lỗi thông thường khác
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

module.exports = errorHandler;
