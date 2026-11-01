# HỆ THỐNG QUẢN LÝ TÀI LIỆU NỘI BỘ CÔNG TY (COMPANY INTERNAL DOCUMENT MANAGEMENT SYSTEM)
> **Đề tài Bài tập lớn môn Cơ sở dữ liệu**  
> **Phân hệ: Backend RESTful API & Cơ sở dữ liệu quan hệ (RDBMS)**  
> **Kiến trúc: MVC (Model - Controller - Routes - Middlewares - Config)**  

---

## 1. TỔNG QUAN HỆ THỐNG & CÔNG NGHỆ TRIỂN KHAI

Hệ thống Quản lý Tài liệu Nội bộ Công ty giúp số hóa việc lưu trữ, phân loại, tìm kiếm và thống kê tài liệu của các phòng ban trong một doanh nghiệp. Hệ thống được xây dựng với mục tiêu đảm bảo tính toàn vẹn dữ liệu, tối ưu hóa tốc độ truy vấn trên tập dữ liệu lớn và cung cấp các RESTful API chuẩn mực cho các ứng dụng Client (Web/Mobile/Desktop).

### Công nghệ sử dụng:
- **Ngôn ngữ & Nền tảng:** Node.js (v18+) & Express.js.
- **Hệ quản trị CSDL:** MySQL (chạy trên XAMPP hoặc MySQL Server độc lập, bảng mã `utf8mb4_unicode_ci`).
- **Thư viện Driver CSDL:** `mysql2/promise` (hỗ trợ Connection Pooling, Async/Await và chống SQL Injection 100% với Prepared Statements).
- **Thư viện xử lý File:** `multer` (quản lý tải lên, kiểm tra phần mở rộng file, hạn chế kích thước và lưu trữ đĩa an toàn).
- **Bảo mật & Tiện ích:** `cors` (cho phép đa nguồn gọi API), `dotenv` (quản lý biến môi trường), `morgan` (HTTP request logger).

---

## 2. THIẾT KẾ CƠ SỞ DỮ LIỆU ĐẠT CHUẨN 3NF (THIRD NORMAL FORM)

Cơ sở dữ liệu mang tên **`company_docs_db`** gồm 5 bảng được chuẩn hóa đạt dạng chuẩn 3NF:

```
+---------------+          +-------------------+          +-------------------+
|     roles     |          |    departments    |          |    categories     |
+---------------+          +-------------------+          +-------------------+
| PK | role_id  |          | PK | dept_id      |          | PK | category_id  |
|    | role_name|          |    | dept_name    |          |    | category_name|
+-------+-------+          +---------+---------+          +---------+---------+
        |                            |                              |
        +--------------+   +---------+                              |
                       |   |                                        |
                   +---v---v-----------+                            |
                   |       users       |                            |
                   +-------------------+                            |
                   | PK | user_id      |                            |
                   |    | full_name    |                            |
                   |    | email (UQ)   |                            |
                   |    | password     |                            |
                   | FK | role_id      |                            |
                   | FK | dept_id      |                            |
                   +---------+---------+                            |
                             |                                      |
                             +------------------+   +---------------+
                                                |   |
                                            +---v---v-----------+
                                            |     documents     |
                                            +-------------------+
                                            | PK | doc_id       |
                                            |    | title        |
                                            |    | description  |
                                            |    | file_path    |
                                            |    | file_type    |
                                            |    | file_size    |
                                            |    | download_c...|
                                            | FK | category_id  |
                                            | FK | uploaded_by  |
                                            |    | created_at   |
                                            +-------------------+
```

### Chứng minh các chuẩn hóa:
1. **Dạng chuẩn 1 (1NF):** Tất cả các thuộc tính đều mang giá trị nguyên tố (nguyên tử - atomic), không chứa mảng hay tập dữ liệu lặp. Mỗi bảng đều có Khóa chính (`role_id`, `dept_id`, `category_id`, `user_id`, `doc_id`).
2. **Dạng chuẩn 2 (2NF):** Đạt 1NF và tất cả các thuộc tính không khóa đều phụ thuộc hàm toàn phần vào Khóa chính (không có sự phụ thuộc từng phần vào khóa phức hợp).
3. **Dạng chuẩn 3 (3NF):** Đạt 2NF và không có thuộc tính không khóa nào phụ thuộc bắc cầu vào Khóa chính. Ví dụ: Bảng `documents` chỉ lưu `uploaded_by` (FK -> `users.user_id`), không lưu trùng `dept_name` hay `role_name` trong bảng tài liệu để tránh dư thừa và dị thường khi cập nhật.

### Chi tiết các bảng:
- `roles`: Lưu danh sách quyền (`role_id`, `role_name`, `description`).
- `departments`: Lưu danh sách phòng ban (`dept_id`, `dept_name`, `description`).
- `categories`: Lưu danh mục tài liệu (`category_id`, `category_name`, `description`).
- `users`: Lưu tài khoản nhân viên (`user_id`, `full_name`, `email` UNIQUE, `password`, `role_id` FK, `dept_id` FK).
- `documents`: Lưu thông tin tài liệu (`doc_id`, `title`, `description`, `file_path`, `file_type`, `file_size`, `download_count`, `category_id` FK, `uploaded_by` FK, `created_at`, `updated_at`).

---

## 3. PHÂN TÍCH 3 TRUY VẤN SQL PHỨC TẠP CHO CÁC API THỐNG KÊ

Các câu truy vấn này phục vụ các báo cáo phân tích quản trị doanh nghiệp và thể hiện kỹ năng truy vấn SQL nâng cao:

### 🔹 API 1: Thống Kê Theo Danh Mục Tài Liệu (`GET /api/stats/categories`)
- **Yêu cầu:** Thống kê số lượng tài liệu và tổng dung lượng file của từng danh mục.
- **Kỹ thuật SQL:** Dùng `LEFT JOIN` giữa `categories` và `documents`, kết hợp `GROUP BY`, `COUNT()`, `SUM()` và `COALESCE()` để xử lý danh mục chưa có tài liệu nào không bị lỗi `NULL`.
- **Câu lệnh SQL:**
```sql
SELECT 
    c.category_id,
    c.category_name,
    c.description,
    COUNT(d.doc_id) AS total_documents,
    COALESCE(ROUND(SUM(d.file_size), 2), 0) AS total_file_size_kb,
    COALESCE(ROUND(SUM(d.file_size) / 1024, 2), 0) AS total_file_size_mb,
    COALESCE(SUM(d.download_count), 0) AS total_downloads,
    COALESCE(ROUND(AVG(d.download_count), 1), 0) AS avg_downloads_per_doc
FROM categories c
LEFT JOIN documents d ON c.category_id = d.category_id
GROUP BY c.category_id, c.category_name, c.description
ORDER BY total_documents DESC, total_file_size_kb DESC;
```

---

### 🔹 API 2: Thống Kê Đóng Góp Theo Phòng Ban (`GET /api/stats/departments`)
- **Yêu cầu:** Thống kê tổng số lượng tài liệu do nhân viên thuộc từng phòng ban đóng góp và tổng lượt tải xuống.
- **Kỹ thuật SQL:** Dùng `LEFT JOIN` qua 3 bảng `departments` -> `users` -> `documents`, kết hợp `GROUP BY`, `COUNT(DISTINCT u.user_id)`, `COUNT(d.doc_id)`, `SUM(d.download_count)`.
- **Câu lệnh SQL:**
```sql
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
```

---

### 🔹 API 3: Bảng Xếp Hạng Top 5 Nhân Viên Tích Cực Nhất (`GET /api/stats/top-uploaders`)
- **Yêu cầu:** Lấy ra Top 5 nhân viên tích cực đăng tải nhiều tài liệu nhất hệ thống.
- **Kỹ thuật SQL:** Dùng `INNER JOIN` giữa 3 bảng `users`, `departments`, `documents` (chỉ lấy những nhân viên đã có đóng góp tài liệu), kết hợp `GROUP BY`, `COUNT(d.doc_id)`, sắp xếp `ORDER BY total_uploaded_documents DESC` và giới hạn `LIMIT 5`.
- **Câu lệnh SQL:**
```sql
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
```

---

## 4. DANH SÁCH RESTFUL API ENDPOINTS

Tất cả các API đều đã được cấu hình mở `cors()` và trả về định dạng JSON chuẩn.

| STT | Phương thức | Đường dẫn API | Mô tả chức năng | Request Body / Query |
|:---:|:---:|:---|:---|:---|
| 1 | `GET` | `/api/documents` | Lấy danh sách tài liệu (kết hợp JOIN 3 bảng) | `?search=...&category_id=...` |
| 2 | `GET` | `/api/documents/:id` | Lấy thông tin chi tiết một tài liệu | Không |
| 3 | `POST` | `/api/documents` | Thêm mới tài liệu (kèm upload file `multer`) | `multipart/form-data`: `title`, `category_id`, `uploaded_by`, `file` |
| 4 | `PUT` | `/api/documents/:id` | Cập nhật thông tin tài liệu | `title`, `description`, `category_id`, `file` (tùy chọn) |
| 5 | `DELETE` | `/api/documents/:id` | Xóa tài liệu khỏi CSDL và xóa file vật lý | Không |
| 6 | `POST` | `/api/documents/:id/download` | Tăng số lượt tải (`download_count = download_count + 1`) | Không |
| 7 | `GET` | `/api/documents/:id/download-file`| Tải trực tiếp file vật lý về máy tính | Không |
| 8 | `GET` | `/api/stats/categories` | **[SQL 1]** Thống kê theo danh mục tài liệu | Không |
| 9 | `GET` | `/api/stats/departments` | **[SQL 2]** Thống kê theo phòng ban | Không |
| 10 | `GET` | `/api/stats/top-uploaders` | **[SQL 3]** Top 5 nhân viên đăng tải nhiều nhất | Không |
| 11 | `GET` | `/api/stats/overview` | Số liệu KPI tổng quan cho Dashboard | Không |
| 12 | `GET` | `/api/categories` | Lấy danh sách các danh mục tài liệu | Không |
| 13 | `GET` | `/api/departments` | Lấy danh sách các phòng ban | Không |
| 14 | `GET` | `/api/users` | Lấy danh sách nhân viên hệ thống | Không |

---

## 5. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY DỰ ÁN

### Bước 1: Khởi động MySQL trên XAMPP
1. Mở **XAMPP Control Panel**.
2. Bấm nút **Start** tại mục **MySQL** (cổng mặc định: `3306`).

### Bước 2: Khởi tạo Cơ sở dữ liệu và nạp dữ liệu mẫu
Hệ thống được tích hợp script tự động tạo database `company_docs_db`, khởi tạo cấu trúc bảng 3NF và nạp sẵn **3 vai trò, 5 phòng ban, 6 danh mục, 10 nhân viên và 32 tài liệu mẫu đa dạng**:

Mở Terminal tại thư mục dự án và chạy:
```bash
npm run db:init
```
*(Hoặc bạn có thể mở `http://localhost/phpmyadmin` và import lần lượt 2 file [database/schema.sql](file:///c:/Users/BIN/Desktop/CSDL_BTL/database/schema.sql) và [database/seed.sql](file:///c:/Users/BIN/Desktop/CSDL_BTL/database/seed.sql)).*

### Bước 3: Khởi động Server Backend Express
- Chế độ phát triển (Auto Reload khi code thay đổi):
```bash
npm run dev
```
- Chế độ thông thường:
```bash
npm start
```

Máy chủ sẽ chạy tại: **`http://localhost:5000`**

### Bước 4: Mở Giao diện Web Dashboard Trực Quan
Mở trình duyệt web và truy cập địa chỉ:
👉 **`http://localhost:5000`**

Giao diện sẽ hiển thị đầy đủ:
- Thẻ KPI thống kê số lượng tài liệu, lượt tải, phòng ban, nhân sự.
- Bảng trực quan hóa kết quả của **3 câu truy vấn SQL phức tạp**.
- Bảng quản trị tài liệu: Tìm kiếm realtime, lọc theo danh mục, nút tải xuống (tăng counter trong DB), nút xóa tài liệu.
- Modal tải lên tài liệu mới có upload file vật lý thực tế.

---

## 6. HƯỚNG DẪN KIỂM THỬ VỚI POSTMAN

1. Mở phần mềm **Postman**.
2. Chọn **File** -> **Import** -> Chọn file [company_docs_api.postman_collection.json](file:///c:/Users/BIN/Desktop/CSDL_BTL/company_docs_api.postman_collection.json).
3. Tất cả các request mẫu (GET, POST multipart upload, PUT, DELETE, 3 API SQL thống kê) đã được cấu hình sẵn biến `{{base_url}} = http://localhost:5000`. Bạn chỉ cần bấm **Send** để kiểm thử!

---

## 7. CẤU TRÚC THƯ MỤC DỰ ÁN (MVC ARCHITECTURE)

```
CSDL_BTL/
├── database/
│   ├── schema.sql           # Script DDL tạo Database và 5 bảng chuẩn 3NF
│   ├── seed.sql             # Script DML nạp 32 tài liệu và dữ liệu mẫu
│   └── initDb.js            # Script tự động khởi tạo CSDL với 1 câu lệnh npm run db:init
├── src/
│   ├── config/
│   │   └── db.js            # Kết nối MySQL Pool (mysql2/promise)
│   ├── middlewares/
│   │   ├── upload.js        # Cấu hình Multer upload và lưu trữ file
│   │   └── errorHandler.js  # Middleware xử lý lỗi tập trung
│   ├── models/
│   │   ├── documentModel.js # Model xử lý CRUD documents & JOINs
│   │   ├── statsModel.js    # Model xử lý 3 câu truy vấn SQL phức tạp
│   │   └── masterDataModel.js# Model truy xuất categories, departments, users
│   ├── controllers/
│   │   ├── documentController.js # Điều khiển luồng xử lý tài liệu & file
│   │   ├── statsController.js    # Điều khiển 3 API thống kê
│   │   └── masterDataController.js# Điều khiển master data
│   └── routes/
│       ├── documentRoutes.js # Định tuyến API documents
│       ├── statsRoutes.js    # Định tuyến 3 API thống kê
│       └── masterDataRoutes.js # Định tuyến dữ liệu danh mục/phòng ban
├── uploads/                 # Thư mục lưu trữ file tài liệu vật lý
├── public/                  # Giao diện Web Dashboard trực quan
│   ├── index.html
│   ├── style.css
│   └── app.js
├── company_docs_api.postman_collection.json # File Postman Collection
├── .env.example             # File mẫu biến môi trường
├── .env                     # File cấu hình môi trường
├── package.json             # Cấu hình dự án và dependencies
├── server.js                # Entry point khởi động ứng dụng Express
└── README.md                # Tài liệu hướng dẫn đồ án
```
