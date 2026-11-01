-- =======================================================================
-- BÀI TẬP LỚN CƠ SỞ DỮ LIỆU
-- ĐỀ TÀI: HỆ THỐNG QUẢN LÝ TÀI LIỆU NỘI BỘ CÔNG TY (COMPANY INTERNAL DOCUMENT MANAGEMENT SYSTEM)
-- DATABASE SCHEMA DESIGN (CHUẨN HÓA 3NF)
-- =======================================================================

-- 1. Tạo cơ sở dữ liệu nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS `document_management` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `document_management`;

-- Xóa bảng theo thứ tự khóa ngoại để tránh xung đột khi re-create
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `roles`;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Bảng `roles` (Vai trò người dùng trong hệ thống: Admin, Staff)
CREATE TABLE `roles` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên vai trò người dùng (Admin, Staff)',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả quyền hạn của vai trò'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng `departments` (Phòng ban công ty)
CREATE TABLE `departments` (
    `dept_id` INT AUTO_INCREMENT PRIMARY KEY,
    `dept_name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên phòng ban nội bộ',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả chức năng của phòng ban'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng `categories` (Danh mục phân loại tài liệu)
CREATE TABLE `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên danh mục phân loại tài liệu',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả thể loại tài liệu thuộc danh mục'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng `users` (Nhân viên/Người dùng hệ thống)
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên nhân viên',
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Địa chỉ email công ty (dùng đăng nhập)',
    `password` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa hoặc chuỗi bảo mật',
    `role_id` INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bảng roles',
    `dept_id` INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bảng departments',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo tài khoản',
    CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) 
        REFERENCES `roles` (`role_id`) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT `fk_users_departments` FOREIGN KEY (`dept_id`) 
        REFERENCES `departments` (`dept_id`) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng `documents` (Lưu thông tin tài liệu)
CREATE TABLE `documents` (
    `doc_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề tài liệu',
    `description` TEXT NULL COMMENT 'Mô tả chi tiết nội dung',
    `file_path` VARCHAR(255) NOT NULL COMMENT 'Đường dẫn file vật lý trên server',
    `file_type` VARCHAR(20) NOT NULL COMMENT 'Loại file (pdf, docx, xlsx, pptx)',
    `file_size` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Kích thước file tính bằng KB',
    `download_count` INT NOT NULL DEFAULT 0 COMMENT 'Số lần tài liệu được tải xuống',
    `category_id` INT NOT NULL COMMENT 'Khóa ngoại tham chiếu bảng categories',
    `uploaded_by` INT NOT NULL COMMENT 'Khóa ngoại tham chiếu bảng users (người tải lên)',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày giờ đăng tải',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày giờ cập nhật gần nhất',
    CONSTRAINT `fk_documents_categories` FOREIGN KEY (`category_id`) 
        REFERENCES `categories` (`category_id`) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT `fk_documents_users` FOREIGN KEY (`uploaded_by`) 
        REFERENCES `users` (`user_id`) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
