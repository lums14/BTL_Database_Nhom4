/**
 * Script tự động khởi tạo Cơ sở dữ liệu và nạp dữ liệu mẫu (Seed Data)
 * Chạy lệnh: npm run db:init
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

const DB_NAME = process.env.DB_NAME || 'document_management';

async function initDatabase() {
    console.log('====================================================');
    console.log('   BẮT ĐẦU KHỞI TẠO CƠ SỞ DỮ LIỆU DOCUMENT_MANAGEMENT   ');
    console.log('====================================================');

    let connection;
    try {
        console.log(`[1/3] Đang kết nối tới MySQL Server tại ${DB_CONFIG.host}:${DB_CONFIG.port}...`);
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('✓ Kết nối MySQL Server thành công.');

        console.log(`[2/3] Đang nạp toàn bộ cấu trúc & 50 dữ liệu mẫu từ SQL_N4_BTL.sql...`);
        const btlSqlPath = path.join(__dirname, 'SQL_N4_BTL.sql');
        const btlSql = fs.readFileSync(btlSqlPath, 'utf8');
        await connection.query(btlSql);
        console.log('✓ Nạp dữ liệu mẫu thành công:');
        console.log('   - 2 Vai trò chuẩn RBAC (1: Admin, 2: Staff)');
        console.log('   - 5 Phòng ban (Departments)');
        console.log('   - 6 Danh mục tài liệu (Categories)');
        console.log('   - 10 Tài khoản nhân viên (Users)');
        console.log('   - 50 Tài liệu mẫu nội bộ đa dạng (Documents)');

        // Tạo thư mục uploads và các file mẫu giả lập
        const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Tạo một số file mẫu demo trong uploads
        const sampleFiles = [
            'sample-noi-quy-lao-dong-2025.pdf',
            'sample-chinh-sach-remote.docx',
            'sample-quy-che-bao-mat.pdf',
            'sample-so-tay-van-hoa.pdf',
            'sample-khen-thuong-ky-luat.docx',
            'sample-hop-dong-lao-dong.docx',
            'sample-nda-template.pdf',
            'sample-hop-dong-dich-vu-b2b.docx',
            'sample-hop-dong-mua-sam.docx',
            'sample-ho-so-ban-quyen.pdf',
            'sample-bctc-2024-kiem-toan.xlsx',
            'sample-ngan-sach-2025.xlsx',
            'sample-doanh-thu-q1-2025.xlsx',
            'sample-quyet-toan-thue.pdf',
            'sample-kiem-toan-cntt.docx',
            'sample-kientruc-microservices.pdf',
            'sample-coding-standard-gitflow.pdf',
            'sample-srs-crm-project.docx',
            'sample-test-plan-automation.xlsx',
            'sample-huong-dan-docker-cicd.pdf',
            'sample-toi-uu-mysql.pdf',
            'sample-disaster-recovery.docx',
            'sample-de-xuat-mua-sam.docx',
            'sample-don-xin-nghi-phep.docx',
            'sample-de-nghi-thanh-toan.xlsx',
            'sample-danh-gia-thu-viec.docx',
            'sample-bien-ban-ban-giao.docx',
            'sample-onboarding-presentation.pptx',
            'sample-security-awareness.pdf',
            'sample-ky-nang-giao-tiep.pdf',
            'sample-huong-dan-erp.pdf',
            'sample-sales-playbook.docx'
        ];

        sampleFiles.forEach(file => {
            const filePath = path.join(uploadDir, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, `Nội dung tài liệu mẫu: ${file}\nĐược khởi tạo tự động cho Hệ thống Quản lý Tài liệu Nội bộ Công ty.\nThời gian: ${new Date().toISOString()}`);
            }
        });

        console.log(`✓ Đã tạo ${sampleFiles.length} file đính kèm mẫu trong thư mục: /uploads.`);
        console.log('====================================================');
        console.log('   KHỞI TẠO CSDL HOÀN TẤT! SẴN SÀNG CHẠY SERVER!   ');
        console.log('====================================================');
    } catch (error) {
        console.error('❌ Lỗi trong quá trình khởi tạo cơ sở dữ liệu:');
        console.error(error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n👉 Gợi ý: Hãy đảm bảo MySQL trong XAMPP (hoặc MySQL Service) đã được bật (Start)!');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initDatabase();
