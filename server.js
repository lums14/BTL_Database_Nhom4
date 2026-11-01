/**
 * ENTRY POINT: Máy chủ Backend Express.js
 * Hệ thống Quản lý Tài liệu Nội bộ Công ty (Company Internal Document Management System)
 * Đề tài Bài tập lớn môn Cơ sở dữ liệu
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const masterDataRoutes = require('./src/routes/masterDataRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Cấu hình CORS mở rộng cho tất cả nguồn (Frontend, Postman, Mobile App)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Logging HTTP request chi tiết trong môi trường dev
app.use(morgan('dev'));

// 3. Body Parser xử lý dữ liệu JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Phục vụ thư mục file tĩnh
// - /uploads: Truy cập trực tiếp các file tài liệu đã upload
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// - Phục vụ giao diện CORP_DOCS Workspace (ưu tiên client/dist, fallback public)
const fs = require('fs');
const clientDistPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
} else {
    app.use(express.static(path.join(__dirname, 'public')));
}

// 5. Route kiểm tra trạng thái hoạt động của Server (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Hệ thống Quản lý Tài liệu Nội bộ đang hoạt động ổn định.',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 6. Đăng ký các phân hệ Routes chính
app.use('/api/auth', authRoutes); // Cung cấp /api/auth/login, /api/auth/me, /api/auth/users
app.use('/api/documents', documentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', masterDataRoutes); // Cung cấp /api/categories, /api/departments, /api/users

// 7. Xử lý đường dẫn 404 Not Found khi gọi sai endpoint API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint API "${req.originalUrl}" không tồn tại trên máy chủ.`
    });
});

// 8. SPA Fallback: Trả về index.html của CORP_DOCS cho các route client
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
    }
    if (fs.existsSync(path.join(clientDistPath, 'index.html'))) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// 9. Middleware xử lý lỗi tập trung (Error Handler)
app.use(errorHandler);

// 9. Khởi động máy chủ và kiểm tra kết nối CSDL
app.listen(PORT, async () => {
    console.log('\n=============================================================');
    console.log(`🚀 Máy chủ Backend đang lắng nghe tại: http://localhost:${PORT}`);
    console.log(`📚 Giao diện Web Dashboard trực quan: http://localhost:${PORT}`);
    console.log(`📡 API Documents: http://localhost:${PORT}/api/documents`);
    console.log(`📊 API Thống kê:  http://localhost:${PORT}/api/stats/categories`);
    console.log('=============================================================');

    // Kiểm tra kết nối tới MySQL
    await testConnection();
});

module.exports = app;
