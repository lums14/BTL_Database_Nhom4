-- =======================================================================
-- BÀI TẬP LỚN CƠ SỞ DỮ LIỆU
-- SEED DATA: DỮ LIỆU MẪU CHO HỆ THỐNG QUẢN LÝ TÀI LIỆU NỘI BỘ CÔNG TY
-- =======================================================================

USE `document_management`;

-- 1. CHÈN DỮ LIỆU BẢNG `roles` (2 quyền: Admin, Staff)
INSERT INTO `roles` (`role_id`, `role_name`, `description`) VALUES
(1, 'Admin', 'Quản trị viên toàn quyền cấu hình, phê duyệt và quản lý mọi tài liệu hệ thống'),
(2, 'Staff', 'Nhân viên công ty - Có quyền xem, tải xuống và chỉ sửa/xóa tài liệu do chính mình tạo');

-- 2. CHÈN DỮ LIỆU BẢNG `departments` (5 phòng ban)
INSERT INTO `departments` (`dept_id`, `dept_name`, `description`) VALUES
(1, 'Ban Giám Đốc', 'Cơ quan điều hành chiến lược và ban hành quy chế cấp cao'),
(2, 'Phòng Nhân Sự', 'Quản lý nhân sự, tuyển dụng, đào tạo, chính sách và tiền lương'),
(3, 'Phòng Kế Toán & Tài Chính', 'Quản lý tài chính, dòng tiền, ngân sách, hóa đơn và quyết toán thuế'),
(4, 'Phòng Kỹ Thuật & CNTT', 'Nghiên cứu phát triển phần mềm, hạ tầng máy chủ và an toàn thông tin'),
(5, 'Phòng Kinh Doanh & Marketing', 'Phát triển thị trường, quan hệ đối tác khách hàng và thương mại');

-- 3. CHÈN DỮ LIỆU BẢNG `categories` (8 danh mục tài liệu)
INSERT INTO `categories` (`category_id`, `category_name`, `description`) VALUES
(1, 'Chính Sách & Nội Quy', 'Các văn bản quy định, nội quy làm việc, bảo mật và chính sách nhân sự'),
(2, 'Hợp Đồng & Pháp Lý', 'Mẫu hợp đồng kinh tế, NDA bảo mật, thỏa thuận hợp tác và hồ sơ pháp lý'),
(3, 'Báo Cáo Tài Chính & Kế Toán', 'Báo cáo doanh thu, quyết toán thuế, kiểm toán và phân bổ ngân sách'),
(4, 'Tài Liệu Kỹ Thuật & Dự Án', 'Kiến trúc hệ thống, tài liệu đặc tả SRS, tài liệu API và quy trình DevOps'),
(5, 'Biểu Mẫu Hành Chính', 'Các mẫu đơn đề xuất, thanh toán tạm ứng, đơn nghỉ phép và bàn giao tài sản'),
(6, 'Đào Tạo & Hướng Dẫn', 'Giáo trình đào tạo, tài liệu Onboarding nhân sự mới và cẩm nang kỹ năng'),
(7, 'Biên Bản Họp & Nghị Quyết', 'Biên bản các phiên họp giao ban, đại hội cổ đông và nghị quyết chiến lược'),
(8, 'Hồ Sơ Thuế & Ngân Sách', 'Hồ sơ quyết toán thuế, dự toán chi tiêu và phân bổ dòng tiền hàng năm');

-- 4. CHÈN DỮ LIỆU BẢNG `users` (10 tài khoản, chung mật khẩu 'password' -> Hash bcrypt $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `role_id`, `dept_id`, `created_at`) VALUES
-- 2 Admin:
(1, 'Nguyen Van An', 'an.nguyen@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2025-01-01 08:00:00'),
(2, 'Tran Thi Binh', 'binh.tran@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 2, '2025-01-02 08:30:00'),
-- 8 Staff:
(3, 'Le Minh Cuong', 'cuong.le@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 4, '2025-01-03 09:00:00'),
(4, 'Pham Thu Dung', 'dung.pham@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 3, '2025-01-04 09:30:00'),
(5, 'Hoang Van Em', 'em.hoang@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 2, '2025-01-05 10:00:00'),
(6, 'Vu Thi Giang', 'giang.vu@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 4, '2025-01-06 10:30:00'),
(7, 'Ngo Van Hai', 'hai.ngo@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 5, '2025-01-07 11:00:00'),
(8, 'Do Thi Linh', 'linh.do@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 3, '2025-01-08 11:30:00'),
(9, 'Bui Van Minh', 'minh.bui@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 4, '2025-01-09 13:30:00'),
(10, 'Dang Thi Nga', 'nga.dang@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 2, '2025-01-10 14:00:00');

-- 5. CHÈN DỮ LIỆU BẢNG `documents` (50 tài liệu mẫu)
INSERT INTO `documents` (`doc_id`, `title`, `description`, `file_path`, `file_type`, `file_size`, `download_count`, `category_id`, `uploaded_by`, `created_at`) VALUES
-- Nhóm Chính sách & Nội quy (category_id = 1)
(1, 'Noi_Quy_Lao_Dong_Cong_Ty_2025.pdf', 'Quy định giờ giấc làm việc, tác phong công sở, kỷ luật lao động và an toàn vệ sinh.', 'uploads/sample-noi-quy-lao-dong-2025.pdf', 'pdf', 2450.50, 154, 1, 1, '2025-01-15 09:30:00'),
(2, 'Chinh_Sach_Lam_Viec_Tu_Xa_Hybrid.docx', 'Chính sách làm việc remote kết hợp lên văn phòng cho kỹ sư công nghệ.', 'uploads/sample-chinh-sach-remote.docx', 'docx', 1230.75, 89, 1, 2, '2025-01-20 14:15:00'),
(3, 'Quy_Che_Bao_Mat_Thong_Tin_Doanh_Nghiep.pdf', 'Quy tắc bảo mật mã nguồn dự án, dữ liệu khách hàng và bí mật kinh doanh.', 'uploads/sample-quy-che-bao-mat.pdf', 'pdf', 3120.00, 210, 1, 1, '2025-01-22 11:00:00'),
(4, 'So_Tay_Van_Hoa_Gia_Tri_Cot_Loi.pdf', 'Tài liệu giới thiệu tầm nhìn, sứ mệnh và 6 giá trị cốt lõi của công ty.', 'uploads/sample-so-tay-van-hoa.pdf', 'pdf', 5420.25, 178, 1, 2, '2025-02-05 16:20:00'),
(5, 'Quy_Dinh_Khen_Thuong_Ky_Luat_Q1.docx', 'Khung đánh giá KPI định kỳ và mức thưởng thành tích dự án quý 1.', 'uploads/sample-khen-thuong-ky-luat.docx', 'docx', 980.40, 67, 1, 5, '2025-03-01 10:00:00'),
(6, 'Chinh_Sach_Bao_Hiem_Suc_Khoe_Toan_Dien.pdf', 'Quyền lợi gói bảo hiểm sức khỏe cao cấp mở rộng dành cho nhân viên chính thức.', 'uploads/sample-noi-quy-lao-dong-2025.pdf', 'pdf', 1840.00, 122, 1, 10, '2025-03-05 14:20:00'),
(7, 'Quy_Dinh_Su_Dung_Thiet_Bi_Cong_Nghe.docx', 'Tiêu chuẩn bảo quản máy tính laptop, tài khoản truy cập VPN và tài sản phần cứng.', 'uploads/sample-chinh-sach-remote.docx', 'docx', 1150.20, 95, 1, 3, '2025-03-08 09:10:00'),
(8, 'Quy_Che_Tiep_Khach_Va_Cong_Tac_Phi.pdf', 'Định mức chi tiêu khi đi công tác trong và ngoài nước, tiêu chuẩn khách sạn vé bay.', 'uploads/sample-quy-che-bao-mat.pdf', 'pdf', 1670.50, 74, 1, 4, '2025-03-12 11:30:00'),

-- Nhóm Hợp đồng & Pháp lý (category_id = 2)
(9, 'Mau_Hop_Dong_Lao_Dong_Chuan_2025.docx', 'Mẫu hợp đồng lao động xác định thời hạn 12 đến 36 tháng chuẩn Bộ Luật Lao Động.', 'uploads/sample-hop-dong-lao-dong.docx', 'docx', 850.20, 120, 2, 2, '2025-01-18 10:45:00'),
(10, 'Thoa_Thuan_Bao_Mat_NDA_Song_Ngu.pdf', 'Thỏa thuận bảo mật thông tin song ngữ Anh - Việt áp dụng cho nhân sự cốt cán.', 'uploads/sample-nda-template.pdf', 'pdf', 1560.80, 145, 2, 1, '2025-01-25 15:30:00'),
(11, 'Hop_Dong_Cung_Cap_Dich_Vu_Phan_Mem_B2B.docx', 'Mẫu hợp đồng triển khai giải pháp chuyển đổi số cho khối khách hàng doanh nghiệp.', 'uploads/sample-hop-dong-dich-vu-b2b.docx', 'docx', 2140.60, 93, 2, 7, '2025-02-12 09:15:00'),
(12, 'Hop_Dong_Mua_Sam_May_Chu_Cloud.docx', 'Hợp đồng mua sắm hạ tầng Dedicated Server và dịch vụ lưu trữ dữ liệu đám mây.', 'uploads/sample-hop-dong-mua-sam.docx', 'docx', 1780.00, 48, 2, 3, '2025-02-28 14:00:00'),
(13, 'Ho_So_Dang_Ky_Ban_Quyen_Phan_Mem_ERP.pdf', 'Hồ sơ chứng nhận quyền sở hữu tác giả đối với hệ thống lõi DocuCorp ERP.', 'uploads/sample-ho-so-ban-quyen.pdf', 'pdf', 4650.00, 35, 2, 3, '2025-03-15 11:20:00'),
(14, 'Mau_Hop_Dong_Dai_Ly_Phan_Phoi_Doc_Quyen.docx', 'Hợp đồng nguyên tắc bổ nhiệm đại lý phân phối sản phẩm phần mềm khu vực miền Trung.', 'uploads/sample-hop-dong-dich-vu-b2b.docx', 'docx', 2310.00, 52, 2, 7, '2025-03-18 15:00:00'),
(15, 'Thoa_Thuan_Cap_Phep_Ban_Quyen_SaaS.pdf', 'Điều khoản sử dụng phần mềm dạng dịch vụ dành cho người dùng cuối (EULA License).', 'uploads/sample-nda-template.pdf', 'pdf', 1980.00, 88, 2, 1, '2025-03-22 10:30:00'),
(16, 'Bien_Ban_Thanh_Ly_Hop_Dong_Kinh_Te.docx', 'Mẫu biên bản nghiệm thu và thanh lý hợp đồng cung ứng dịch vụ phần mềm.', 'uploads/sample-hop-dong-mua-sam.docx', 'docx', 920.40, 61, 2, 4, '2025-03-25 16:15:00'),

-- Nhóm Báo cáo Tài chính & Kế toán (category_id = 3)
(17, 'Bao_Cao_Tai_Chinh_Nam_2024_Kiem_Toan.xlsx', 'Báo cáo tài chính năm 2024 đã được kiểm toán độc lập xác nhận không ngoại trừ.', 'uploads/sample-bctc-2024-kiem-toan.xlsx', 'xlsx', 6890.50, 112, 3, 4, '2025-01-30 16:45:00'),
(18, 'Ke_Hoach_Ngan_Sach_Van_Hanh_Nam_2025.xlsx', 'Dự toán định mức chi phí R&D, nhân sự và marketing toàn công ty năm 2025.', 'uploads/sample-ngan-sach-2025.xlsx', 'xlsx', 4320.00, 85, 3, 4, '2025-02-02 08:30:00'),
(19, 'Bao_Cao_Doanh_Thu_Q1_2025.xlsx', 'Phân tích chi tiết dòng tiền và mức độ hoàn thành chỉ tiêu doanh thu quý 1.', 'uploads/sample-doanh-thu-q1-2025.xlsx', 'xlsx', 3780.20, 64, 3, 8, '2025-04-05 15:10:00'),
(20, 'Bang_Quyet_Toan_Thue_TNDN_2024.pdf', 'Hồ sơ quyết toán thuế TNDN và giấy xác nhận hoàn tất nghĩa vụ nộp ngân sách.', 'uploads/sample-quyet-toan-thue.pdf', 'pdf', 2950.40, 53, 3, 8, '2025-04-10 10:25:00'),
(21, 'Bao_Cao_Kiem_Toan_Chi_Phi_Cloud_Server.docx', 'Đánh giá tính tối ưu của cụm tài nguyên AWS và giải pháp tiết kiệm ngân sách 20%.', 'uploads/sample-kiem-toan-cntt.docx', 'docx', 1890.30, 41, 3, 4, '2025-04-18 13:40:00'),
(22, 'Phan_Tich_Ty_Suat_Loi_Nhuan_Duan_Aries.xlsx', 'Bảng tính IRR và ROI của gói đầu tư giải pháp văn phòng số cho đối tác lớn.', 'uploads/sample-doanh-thu-q1-2025.xlsx', 'xlsx', 3150.00, 47, 3, 8, '2025-04-20 09:20:00'),
(23, 'Bao_Cao_Luu_Chuyen_Tien_Te_Thang_3.xlsx', 'Đối soát các nguồn thu - chi thực tế và dự báo dòng tiền lưu động cho tháng tới.', 'uploads/sample-bctc-2024-kiem-toan.xlsx', 'xlsx', 2740.00, 39, 3, 4, '2025-04-22 14:45:00'),
(24, 'Bao_Cao_Quan_Tri_Rui_Ro_Tai_Chinh.pdf', 'Biện pháp phòng ngừa rủi ro tỷ giá ngoại hối và các khoản nợ quá hạn quý 1.', 'uploads/sample-quyet-toan-thue.pdf', 'pdf', 3420.00, 33, 3, 8, '2025-04-25 11:00:00'),

-- Nhóm Tài liệu Kỹ thuật & Dự án (category_id = 4)
(25, 'Kien_Truc_He_Thong_Microservices_v3.pdf', 'Thiết kế phân tầng Gateway, Kafka Broker, gRPC Service và DB Cluster chuẩn 3NF.', 'uploads/sample-kientruc-microservices.pdf', 'pdf', 8920.00, 240, 4, 3, '2025-02-15 10:00:00'),
(26, 'Tieu_Chuẩn_Viet_Code_GitFlow_Standard.pdf', 'Quy tắc đặt tên biến, kiến trúc Clean Code, tiêu chí sonarQube và quy trình PR.', 'uploads/sample-coding-standard-gitflow.pdf', 'pdf', 2150.70, 310, 4, 6, '2025-02-20 14:00:00'),
(27, 'Dac_Ta_Yeu_Cau_Phan_Mem_SRS_CRM.docx', 'Tài liệu mô tả chức năng, sơ đồ use-case và luồng dữ liệu cho phân hệ CRM.', 'uploads/sample-srs-crm-project.docx', 'docx', 5430.10, 185, 4, 3, '2025-03-05 09:15:00'),
(28, 'Kich_Ban_Kiem_Thu_Tu_Dong_Jest_Supertest.xlsx', 'Bộ 120 test case kiểm thử tự động API bảo mật và toàn vẹn dữ liệu cơ sở dữ liệu.', 'uploads/sample-test-plan-automation.xlsx', 'xlsx', 3120.50, 95, 4, 9, '2025-03-12 11:30:00'),
(29, 'Huong_Dan_Van_Hanh_Docker_Kubernetes.pdf', 'Quy trình đóng gói Dockerfile, triển khai Helm chart và giám sát cụm Pods K8s.', 'uploads/sample-huong-dan-docker-cicd.pdf', 'pdf', 6740.00, 275, 4, 6, '2025-03-22 15:45:00'),
(30, 'Ky_Thuat_Toi_Uu_Truy_Van_MySQL_Index.pdf', 'Hướng dẫn đánh chỉ mục Composite Index, tối ưu EXPLAIN và loại bỏ Full Table Scan.', 'uploads/sample-toi-uu-mysql.pdf', 'pdf', 4380.00, 290, 4, 9, '2025-04-02 08:45:00'),
(31, 'Ke_Hoach_Khoi_Phuc_Sau_Tham_Hoa_DRP.docx', 'Quy trình sao lưu tự động hằng ngày và kịch bản khôi phục DB trong vòng 15 phút.', 'uploads/sample-disaster-recovery.docx', 'docx', 3620.00, 130, 4, 3, '2025-04-12 16:00:00'),
(32, 'Dac_Ta_Giao_Thuc_API_RESTful_v2.pdf', 'Tài liệu Swagger OpenAPI mô tả chi tiết 25 endpoint quản trị dữ liệu.', 'uploads/sample-kientruc-microservices.pdf', 'pdf', 5120.00, 205, 4, 6, '2025-04-15 10:15:00'),
(33, 'Chinh_Sach_Bao_Mat_Zero_Trust_Network.pdf', 'Mô hình bảo vệ mạng nội bộ không tin cậy tuyệt đối, áp dụng xác thực mTLS và JWT.', 'uploads/sample-toi-uu-mysql.pdf', 'pdf', 4180.00, 168, 4, 9, '2025-04-18 13:30:00'),

-- Nhóm Biểu mẫu Hành chính (category_id = 5)
(34, 'Bieu_Mau_De_Xuat_Mua_Sam_Thiet_Bi.docx', 'Mẫu phiếu đề nghị cấp sắm máy tính bàn, linh kiện và thiết bị ngoại vi văn phòng.', 'uploads/sample-de-xuat-mua-sam.docx', 'docx', 620.50, 160, 5, 5, '2025-01-28 08:30:00'),
(35, 'Don_Xin_Nghi_Phep_Huong_Luong_2025.docx', 'Mẫu đơn xin nghỉ phép năm, nghỉ chế độ dưỡng sức và thai sản dành cho nhân viên.', 'uploads/sample-don-xin-nghi-phep.docx', 'docx', 450.00, 320, 5, 2, '2025-02-08 10:15:00'),
(36, 'Phieu_De_Nghi_Thanh_Toan_Tam_Ung.xlsx', 'Mẫu bảng kê chứng từ hóa đơn hợp lệ kèm phiếu chi tiền mặt hoặc chuyển khoản.', 'uploads/sample-de-nghi-thanh-toan.xlsx', 'xlsx', 890.30, 215, 5, 8, '2025-02-22 14:50:00'),
(37, 'Phieu_Danh_Gia_Ket_Qua_Thu_Viec.docx', 'Bảng thẩm định năng lực thử việc sau 2 tháng để làm căn cứ ký HĐLĐ chính thức.', 'uploads/sample-danh-gia-thu-viec.docx', 'docx', 710.00, 105, 5, 5, '2025-03-18 11:00:00'),
(38, 'Bien_Ban_Ban_Giao_Tai_San_Thiet_Bi.docx', 'Biên bản kiểm kê thiết bị bàn giao khi nhân sự mới nhận việc hoặc thôi việc.', 'uploads/sample-bien-ban-ban-giao.docx', 'docx', 580.40, 88, 5, 10, '2025-04-03 09:30:00'),
(39, 'Phieu_Dang_Ky_Lam_Them_Gio_Overtime.docx', 'Mẫu đăng ký lịch trực ca và làm thêm giờ dự án có chữ ký phê duyệt của quản lý.', 'uploads/sample-don-xin-nghi-phep.docx', 'docx', 510.00, 142, 5, 3, '2025-04-06 15:20:00'),
(40, 'Giay_De_Nghi_Di_Cong_Tac_Nuoc_Ngoai.pdf', 'Mẫu trình Ban Giám Đốc phê duyệt lịch công tác xúc tiến thương mại quốc tế.', 'uploads/sample-de-xuat-mua-sam.docx', 'pdf', 1240.00, 76, 5, 7, '2025-04-10 11:45:00'),
(41, 'Phieu_Yeu_Cau_Ho_Tro_Ky_Thuat_IT.docx', 'Phiếu yêu cầu mở quyền truy cập máy chủ, reset mật khẩu và khắc phục sự cố mạng.', 'uploads/sample-bien-ban-ban-giao.docx', 'docx', 490.00, 195, 5, 9, '2025-04-14 08:30:00'),

-- Nhóm Đào tạo & Hướng dẫn (category_id = 6)
(42, 'Slide_Dao_Tao_Nhap_Mon_Onboarding_Kit.pptx', 'Tài liệu thuyết trình chào đón nhân sự mới, giới thiệu văn hóa và phần mềm nội bộ.', 'uploads/sample-onboarding-presentation.pptx', 'pptx', 12450.00, 260, 6, 2, '2025-01-16 13:00:00'),
(43, 'Khoa_Hoc_Nhan_Thuc_An_Ninh_Mang_2025.pdf', 'Cẩm nang phòng chống thư rác lừa đảo Phishing, mã độc ransomware và lộ lọt dữ liệu.', 'uploads/sample-security-awareness.pdf', 'pdf', 7340.00, 340, 6, 6, '2025-02-25 15:20:00'),
(44, 'Cam_Nang_Giao_Tiep_Xu_Ly_Xung_Dot_Nhom.pdf', 'Kỹ năng làm việc nhóm, giao tiếp nội bộ hiệu quả và phương pháp giải quyết tranh chấp.', 'uploads/sample-ky-nang-giao-tiep.pdf', 'pdf', 3890.00, 142, 6, 1, '2025-03-20 16:30:00'),
(45, 'Huong_Dan_Su_Dung_DocuCorp_Portal.pdf', 'Tài liệu hướng dẫn tải lên, tìm kiếm và phân quyền tài liệu trên hệ thống DocuCorp.', 'uploads/sample-huong-dan-erp.pdf', 'pdf', 6120.00, 280, 6, 3, '2025-04-08 10:40:00'),
(46, 'Playbook_Quy_Trinh_Ban_Hang_Va_CSKH.docx', 'Kịch bản gọi điện tư vấn sản phẩm phần mềm và quy trình chốt hợp đồng B2B.', 'uploads/sample-sales-playbook.docx', 'docx', 2850.00, 175, 6, 7, '2025-04-15 14:10:00'),
(47, 'Giao_Trinh_Dao_Tao_SQL_Chuan_3NF.pdf', 'Khóa học SQL căn bản đến nâng cao: Chuẩn hóa dữ liệu 3NF, Indexing và Query Tuning.', 'uploads/sample-toi-uu-mysql.pdf', 'pdf', 8400.00, 315, 6, 3, '2025-04-19 16:00:00'),
(48, 'Huong_Dan_Phong_Chay_Chua_Chay_VP.pdf', 'Quy tắc thoát hiểm khẩn cấp và vị trí bình bọt chữa cháy tại các tầng tòa nhà.', 'uploads/sample-ky-nang-giao-tiep.pdf', 'pdf', 2900.00, 89, 6, 10, '2025-04-21 09:10:00'),
(49, 'Cam_Nang_Quan_Tri_Thoi_Gian_Cho_Dev.docx', 'Phương pháp quản lý công việc Pomodoro, Eisenhower và kỹ thuật tập trung chuyên sâu.', 'uploads/sample-sales-playbook.docx', 'docx', 1860.00, 134, 6, 6, '2025-04-23 11:25:00'),
(50, 'Quy_Trinh_Danh_Gia_Hieu_Suat_OKRs.pdf', 'Hướng dẫn thiết lập mục tiêu then chốt OKRs và quy trình review hiệu quả quý.', 'uploads/sample-so-tay-van-hoa.pdf', 'pdf', 3750.00, 210, 6, 1, '2025-04-26 15:40:00');
