/**
 * Cấu hình kết nối MySQL sử dụng mysql2/promise Connection Pool
 * Đảm bảo hiệu năng cao, tự động quản lý tái sử dụng connection và phòng chống rò rỉ kết nối.
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'company_docs_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Hàm kiểm tra kết nối khi khởi động server
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`[Database] Đã kết nối thành công tới MySQL database: ${process.env.DB_NAME || 'company_docs_db'}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('[Database] LỖI KẾT NỐI MYSQL:', error.message);
        console.error('👉 Vui lòng kiểm tra lại dịch vụ MySQL (XAMPP) và cấu hình trong file .env');
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
