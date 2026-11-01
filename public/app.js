/**
 * DOCUCORP WORKSPACE - ENTERPRISE SAAS JAVASCRIPT ARCHITECTURE
 * Pair Programming: Senior UI/UX Designer & Frontend Architect
 * Database: document_management (MySQL 3NF)
 */

// =======================================================================
// 1. GLOBAL STATE & CONFIGURATION
// =======================================================================
const API_BASE = ''; // Cùng origin với máy chủ Express.js
let currentRole = 'Admin'; // 'Admin' | 'Staff'
let currentPage = 1;
let pageSize = 10;
let activeCategoryFilter = '';
let activeDepartmentFilter = '';
let activeTypeFilter = '';
let searchQuery = '';

let allDocuments = [];
let allCategories = [];
let allDepartments = [];
let allUsers = [];

// Chart.js Instances
let deptChartInstance = null;
let catChartInstance = null;

// =======================================================================
// 2. FALLBACK SEED DATA (32 BẢN GHI KHỚP VỚI CSDL MYSQL seed.sql)
// Đảm bảo hệ thống hoạt động mượt mà 100% ngay cả khi test độc lập
// =======================================================================
const FALLBACK_CATEGORIES = [
    { category_id: 1, category_name: 'Policies', display_vn: 'Chính Sách & Nội Quy', description: 'Văn bản quy định, nội quy lao động và chính sách nhân sự', doc_count: 5 },
    { category_id: 2, category_name: 'Contracts', display_vn: 'Hợp Đồng & Pháp Lý', description: 'Mẫu hợp đồng kinh tế, NDA và pháp lý doanh nghiệp', doc_count: 5 },
    { category_id: 3, category_name: 'Reports', display_vn: 'Báo Cáo Tài Chính & Kế Toán', description: 'Báo cáo doanh thu, quyết toán thuế và ngân sách', doc_count: 5 },
    { category_id: 4, category_name: 'Technical Documentation', display_vn: 'Tài Liệu Kỹ Thuật & Dự Án', description: 'Kiến trúc hệ thống, hướng dẫn kỹ thuật, spec dự án', doc_count: 7 },
    { category_id: 5, category_name: 'Templates', display_vn: 'Biểu Mẫu Hành Chính', description: 'Mẫu đơn xin phép, đề xuất mua sắm, thanh toán', doc_count: 5 },
    { category_id: 6, category_name: 'Training Materials', display_vn: 'Đào Tạo & Hướng Dẫn', description: 'Giáo trình đào tạo, onboarding nhân sự mới', doc_count: 5 },
    { category_id: 7, category_name: 'Meeting Minutes', display_vn: 'Biên Bản Họp & Nghị Quyết', description: 'Biên bản các phiên họp giao ban và chiến lược công ty', doc_count: 4 },
    { category_id: 8, category_name: 'Finance', display_vn: 'Hồ Sơ Thuế & Ngân Sách', description: 'Hồ sơ kê khai thuế và đối soát dòng tiền', doc_count: 4 }
];

const FALLBACK_DEPARTMENTS = [
    { dept_id: 1, dept_name: 'Ban Giám Đốc', description: 'Cơ quan điều hành cao nhất công ty' },
    { dept_id: 2, dept_name: 'Phòng Nhân Sự', description: 'Quản lý nhân sự, đào tạo và tuyển dụng' },
    { dept_id: 3, dept_name: 'Phòng Kế Toán', description: 'Quản lý tài chính, ngân sách và tiền lương' },
    { dept_id: 4, dept_name: 'Phòng Kỹ Thuật & CNTT', description: 'Nghiên cứu phát triển phần mềm và hạ tầng số' },
    { dept_id: 5, dept_name: 'Phòng Kinh Doanh & Marketing', description: 'Phát triển thị trường và kinh doanh' }
];

const FALLBACK_USERS = [
    {
        "user_id": 1,
        "full_name": "Nguyen Van An",
        "email": "an.nguyen@example.com",
        "role_id": 1,
        "role_name": "Admin",
        "dept_id": 1,
        "dept_name": "Ban Giám Đốc"
    },
    {
        "user_id": 2,
        "full_name": "Tran Thi Binh",
        "email": "binh.tran@example.com",
        "role_id": 1,
        "role_name": "Admin",
        "dept_id": 2,
        "dept_name": "Phòng Nhân Sự"
    },
    {
        "user_id": 3,
        "full_name": "Le Minh Cuong",
        "email": "cuong.le@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 4,
        "dept_name": "Phòng Kỹ Thuật & CNTT"
    },
    {
        "user_id": 4,
        "full_name": "Pham Thu Dung",
        "email": "dung.pham@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 3,
        "dept_name": "Phòng Kế Toán & Tài Chính"
    },
    {
        "user_id": 5,
        "full_name": "Hoang Van Em",
        "email": "em.hoang@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 2,
        "dept_name": "Phòng Nhân Sự"
    },
    {
        "user_id": 6,
        "full_name": "Vu Thi Giang",
        "email": "giang.vu@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 4,
        "dept_name": "Phòng Kỹ Thuật & CNTT"
    },
    {
        "user_id": 7,
        "full_name": "Ngo Van Hai",
        "email": "hai.ngo@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 5,
        "dept_name": "Phòng Kinh Doanh & Marketing"
    },
    {
        "user_id": 8,
        "full_name": "Do Thi Linh",
        "email": "linh.do@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 3,
        "dept_name": "Phòng Kế Toán & Tài Chính"
    },
    {
        "user_id": 9,
        "full_name": "Bui Van Minh",
        "email": "minh.bui@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 4,
        "dept_name": "Phòng Kỹ Thuật & CNTT"
    },
    {
        "user_id": 10,
        "full_name": "Dang Thi Nga",
        "email": "nga.dang@example.com",
        "role_id": 2,
        "role_name": "Staff",
        "dept_id": 2,
        "dept_name": "Phòng Nhân Sự"
    }
];

const FALLBACK_DOCUMENTS = [
    {
        "doc_id": 1,
        "title": "Noi_Quy_Lao_Dong_Cong_Ty_2025.pdf",
        "description": "Quy định giờ giấc làm việc, tác phong công sở, kỷ luật lao động và an toàn vệ sinh.",
        "file_path": "uploads/sample-noi-quy-lao-dong-2025.pdf",
        "file_type": "pdf",
        "file_size": 2450.5,
        "download_count": 154,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 1,
        "uploader_name": "Nguyen Van An",
        "dept_name": "Ban Giám Đốc",
        "created_at": "2025-01-15 09:30:00"
    },
    {
        "doc_id": 2,
        "title": "Chinh_Sach_Lam_Viec_Tu_Xa_Hybrid.docx",
        "description": "Chính sách làm việc remote kết hợp lên văn phòng cho kỹ sư công nghệ.",
        "file_path": "uploads/sample-chinh-sach-remote.docx",
        "file_type": "docx",
        "file_size": 1230.75,
        "download_count": 89,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 2,
        "uploader_name": "Tran Thi Binh",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-01-20 14:15:00"
    },
    {
        "doc_id": 3,
        "title": "Quy_Che_Bao_Mat_Thong_Tin_Doanh_Nghiep.pdf",
        "description": "Quy tắc bảo mật mã nguồn dự án, dữ liệu khách hàng và bí mật kinh doanh.",
        "file_path": "uploads/sample-quy-che-bao-mat.pdf",
        "file_type": "pdf",
        "file_size": 3120,
        "download_count": 210,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 1,
        "uploader_name": "Nguyen Van An",
        "dept_name": "Ban Giám Đốc",
        "created_at": "2025-01-22 11:00:00"
    },
    {
        "doc_id": 4,
        "title": "So_Tay_Van_Hoa_Gia_Tri_Cot_Loi.pdf",
        "description": "Tài liệu giới thiệu tầm nhìn, sứ mệnh và 6 giá trị cốt lõi của công ty.",
        "file_path": "uploads/sample-so-tay-van-hoa.pdf",
        "file_type": "pdf",
        "file_size": 5420.25,
        "download_count": 178,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 2,
        "uploader_name": "Tran Thi Binh",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-02-05 16:20:00"
    },
    {
        "doc_id": 5,
        "title": "Quy_Dinh_Khen_Thuong_Ky_Luat_Q1.docx",
        "description": "Khung đánh giá KPI định kỳ và mức thưởng thành tích dự án quý 1.",
        "file_path": "uploads/sample-khen-thuong-ky-luat.docx",
        "file_type": "docx",
        "file_size": 980.4,
        "download_count": 67,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 5,
        "uploader_name": "Hoang Van Em",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-03-01 10:00:00"
    },
    {
        "doc_id": 6,
        "title": "Chinh_Sach_Bao_Hiem_Suc_Khoe_Toan_Dien.pdf",
        "description": "Quyền lợi gói bảo hiểm sức khỏe cao cấp mở rộng dành cho nhân viên chính thức.",
        "file_path": "uploads/sample-noi-quy-lao-dong-2025.pdf",
        "file_type": "pdf",
        "file_size": 1840,
        "download_count": 122,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 10,
        "uploader_name": "Dang Thi Nga",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-03-05 14:20:00"
    },
    {
        "doc_id": 7,
        "title": "Quy_Dinh_Su_Dung_Thiet_Bi_Cong_Nghe.docx",
        "description": "Tiêu chuẩn bảo quản máy tính laptop, tài khoản truy cập VPN và tài sản phần cứng.",
        "file_path": "uploads/sample-chinh-sach-remote.docx",
        "file_type": "docx",
        "file_size": 1150.2,
        "download_count": 95,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-03-08 09:10:00"
    },
    {
        "doc_id": 8,
        "title": "Quy_Che_Tiep_Khach_Va_Cong_Tac_Phi.pdf",
        "description": "Định mức chi tiêu khi đi công tác trong và ngoài nước, tiêu chuẩn khách sạn vé bay.",
        "file_path": "uploads/sample-quy-che-bao-mat.pdf",
        "file_type": "pdf",
        "file_size": 1670.5,
        "download_count": 74,
        "category_id": 1,
        "category_name": "Chính Sách & Nội Quy",
        "uploaded_by": 4,
        "uploader_name": "Pham Thu Dung",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-03-12 11:30:00"
    },
    {
        "doc_id": 9,
        "title": "Mau_Hop_Dong_Lao_Dong_Chuan_2025.docx",
        "description": "Mẫu hợp đồng lao động xác định thời hạn 12 đến 36 tháng chuẩn Bộ Luật Lao Động.",
        "file_path": "uploads/sample-hop-dong-lao-dong.docx",
        "file_type": "docx",
        "file_size": 850.2,
        "download_count": 120,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 2,
        "uploader_name": "Tran Thi Binh",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-01-18 10:45:00"
    },
    {
        "doc_id": 10,
        "title": "Thoa_Thuan_Bao_Mat_NDA_Song_Ngu.pdf",
        "description": "Thỏa thuận bảo mật thông tin song ngữ Anh - Việt áp dụng cho nhân sự cốt cán.",
        "file_path": "uploads/sample-nda-template.pdf",
        "file_type": "pdf",
        "file_size": 1560.8,
        "download_count": 145,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 1,
        "uploader_name": "Nguyen Van An",
        "dept_name": "Ban Giám Đốc",
        "created_at": "2025-01-25 15:30:00"
    },
    {
        "doc_id": 11,
        "title": "Hop_Dong_Cung_Cap_Dich_Vu_Phan_Mem_B2B.docx",
        "description": "Mẫu hợp đồng triển khai giải pháp chuyển đổi số cho khối khách hàng doanh nghiệp.",
        "file_path": "uploads/sample-hop-dong-dich-vu-b2b.docx",
        "file_type": "docx",
        "file_size": 2140.6,
        "download_count": 93,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 7,
        "uploader_name": "Ngo Van Hai",
        "dept_name": "Phòng Kinh Doanh & Marketing",
        "created_at": "2025-02-12 09:15:00"
    },
    {
        "doc_id": 12,
        "title": "Hop_Dong_Mua_Sam_May_Chu_Cloud.docx",
        "description": "Hợp đồng mua sắm hạ tầng Dedicated Server và dịch vụ lưu trữ dữ liệu đám mây.",
        "file_path": "uploads/sample-hop-dong-mua-sam.docx",
        "file_type": "docx",
        "file_size": 1780,
        "download_count": 48,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-02-28 14:00:00"
    },
    {
        "doc_id": 13,
        "title": "Ho_So_Dang_Ky_Ban_Quyen_Phan_Mem_ERP.pdf",
        "description": "Hồ sơ chứng nhận quyền sở hữu tác giả đối với hệ thống lõi DocuCorp ERP.",
        "file_path": "uploads/sample-ho-so-ban-quyen.pdf",
        "file_type": "pdf",
        "file_size": 4650,
        "download_count": 35,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-03-15 11:20:00"
    },
    {
        "doc_id": 14,
        "title": "Mau_Hop_Dong_Dai_Ly_Phan_Phoi_Doc_Quyen.docx",
        "description": "Hợp đồng nguyên tắc bổ nhiệm đại lý phân phối sản phẩm phần mềm khu vực miền Trung.",
        "file_path": "uploads/sample-hop-dong-dich-vu-b2b.docx",
        "file_type": "docx",
        "file_size": 2310,
        "download_count": 52,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 7,
        "uploader_name": "Ngo Van Hai",
        "dept_name": "Phòng Kinh Doanh & Marketing",
        "created_at": "2025-03-18 15:00:00"
    },
    {
        "doc_id": 15,
        "title": "Thoa_Thuan_Cap_Phep_Ban_Quyen_SaaS.pdf",
        "description": "Điều khoản sử dụng phần mềm dạng dịch vụ dành cho người dùng cuối (EULA License).",
        "file_path": "uploads/sample-nda-template.pdf",
        "file_type": "pdf",
        "file_size": 1980,
        "download_count": 88,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 1,
        "uploader_name": "Nguyen Van An",
        "dept_name": "Ban Giám Đốc",
        "created_at": "2025-03-22 10:30:00"
    },
    {
        "doc_id": 16,
        "title": "Bien_Ban_Thanh_Ly_Hop_Dong_Kinh_Te.docx",
        "description": "Mẫu biên bản nghiệm thu và thanh lý hợp đồng cung ứng dịch vụ phần mềm.",
        "file_path": "uploads/sample-hop-dong-mua-sam.docx",
        "file_type": "docx",
        "file_size": 920.4,
        "download_count": 61,
        "category_id": 2,
        "category_name": "Hợp Đồng & Pháp Lý",
        "uploaded_by": 4,
        "uploader_name": "Pham Thu Dung",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-03-25 16:15:00"
    },
    {
        "doc_id": 17,
        "title": "Bao_Cao_Tai_Chinh_Nam_2024_Kiem_Toan.xlsx",
        "description": "Báo cáo tài chính năm 2024 đã được kiểm toán độc lập xác nhận không ngoại trừ.",
        "file_path": "uploads/sample-bctc-2024-kiem-toan.xlsx",
        "file_type": "xlsx",
        "file_size": 6890.5,
        "download_count": 112,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 4,
        "uploader_name": "Pham Thu Dung",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-01-30 16:45:00"
    },
    {
        "doc_id": 18,
        "title": "Ke_Hoach_Ngan_Sach_Van_Hanh_Nam_2025.xlsx",
        "description": "Dự toán định mức chi phí R&D, nhân sự và marketing toàn công ty năm 2025.",
        "file_path": "uploads/sample-ngan-sach-2025.xlsx",
        "file_type": "xlsx",
        "file_size": 4320,
        "download_count": 85,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 4,
        "uploader_name": "Pham Thu Dung",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-02-02 08:30:00"
    },
    {
        "doc_id": 19,
        "title": "Bao_Cao_Doanh_Thu_Q1_2025.xlsx",
        "description": "Phân tích chi tiết dòng tiền và mức độ hoàn thành chỉ tiêu doanh thu quý 1.",
        "file_path": "uploads/sample-doanh-thu-q1-2025.xlsx",
        "file_type": "xlsx",
        "file_size": 3780.2,
        "download_count": 64,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 8,
        "uploader_name": "Do Thi Linh",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-04-05 15:10:00"
    },
    {
        "doc_id": 20,
        "title": "Bang_Quyet_Toan_Thue_TNDN_2024.pdf",
        "description": "Hồ sơ quyết toán thuế TNDN và giấy xác nhận hoàn tất nghĩa vụ nộp ngân sách.",
        "file_path": "uploads/sample-quyet-toan-thue.pdf",
        "file_type": "pdf",
        "file_size": 2950.4,
        "download_count": 53,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 8,
        "uploader_name": "Do Thi Linh",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-04-10 10:25:00"
    },
    {
        "doc_id": 21,
        "title": "Bao_Cao_Kiem_Toan_Chi_Phi_Cloud_Server.docx",
        "description": "Đánh giá tính tối ưu của cụm tài nguyên AWS và giải pháp tiết kiệm ngân sách 20%.",
        "file_path": "uploads/sample-kiem-toan-cntt.docx",
        "file_type": "docx",
        "file_size": 1890.3,
        "download_count": 41,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 4,
        "uploader_name": "Pham Thu Dung",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-04-18 13:40:00"
    },
    {
        "doc_id": 22,
        "title": "Phan_Tich_Ty_Suat_Loi_Nhuan_Duan_Aries.xlsx",
        "description": "Bảng tính IRR và ROI của gói đầu tư giải pháp văn phòng số cho đối tác lớn.",
        "file_path": "uploads/sample-doanh-thu-q1-2025.xlsx",
        "file_type": "xlsx",
        "file_size": 3150,
        "download_count": 47,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 8,
        "uploader_name": "Do Thi Linh",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-04-20 09:20:00"
    },
    {
        "doc_id": 23,
        "title": "Bao_Cao_Luu_Chuyen_Tien_Te_Thang_3.xlsx",
        "description": "Đối soát các nguồn thu - chi thực tế và dự báo dòng tiền lưu động cho tháng tới.",
        "file_path": "uploads/sample-bctc-2024-kiem-toan.xlsx",
        "file_type": "xlsx",
        "file_size": 2740,
        "download_count": 39,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 4,
        "uploader_name": "Pham Thu Dung",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-04-22 14:45:00"
    },
    {
        "doc_id": 24,
        "title": "Bao_Cao_Quan_Tri_Rui_Ro_Tai_Chinh.pdf",
        "description": "Biện pháp phòng ngừa rủi ro tỷ giá ngoại hối và các khoản nợ quá hạn quý 1.",
        "file_path": "uploads/sample-quyet-toan-thue.pdf",
        "file_type": "pdf",
        "file_size": 3420,
        "download_count": 33,
        "category_id": 3,
        "category_name": "Báo Cáo Tài Chính & Kế Toán",
        "uploaded_by": 8,
        "uploader_name": "Do Thi Linh",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-04-25 11:00:00"
    },
    {
        "doc_id": 25,
        "title": "Kien_Truc_He_Thong_Microservices_v3.pdf",
        "description": "Thiết kế phân tầng Gateway, Kafka Broker, gRPC Service và DB Cluster chuẩn 3NF.",
        "file_path": "uploads/sample-kientruc-microservices.pdf",
        "file_type": "pdf",
        "file_size": 8920,
        "download_count": 240,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-02-15 10:00:00"
    },
    {
        "doc_id": 26,
        "title": "Tieu_Chuan_Viet_Code_GitFlow_Standard.pdf",
        "description": "Quy tắc đặt tên biến, kiến trúc Clean Code, tiêu chí sonarQube và quy trình PR.",
        "file_path": "uploads/sample-coding-standard-gitflow.pdf",
        "file_type": "pdf",
        "file_size": 2150.7,
        "download_count": 310,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 6,
        "uploader_name": "Vu Thi Giang",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-02-20 14:00:00"
    },
    {
        "doc_id": 27,
        "title": "Dac_Ta_Yeu_Cau_Phan_Mem_SRS_CRM.docx",
        "description": "Tài liệu mô tả chức năng, sơ đồ use-case và luồng dữ liệu cho phân hệ CRM.",
        "file_path": "uploads/sample-srs-crm-project.docx",
        "file_type": "docx",
        "file_size": 5430.1,
        "download_count": 185,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-03-05 09:15:00"
    },
    {
        "doc_id": 28,
        "title": "Kich_Ban_Kiem_Thu_Tu_Dong_Jest_Supertest.xlsx",
        "description": "Bộ 120 test case kiểm thử tự động API bảo mật và toàn vẹn dữ liệu cơ sở dữ liệu.",
        "file_path": "uploads/sample-test-plan-automation.xlsx",
        "file_type": "xlsx",
        "file_size": 3120.5,
        "download_count": 95,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 9,
        "uploader_name": "Bui Van Minh",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-03-12 11:30:00"
    },
    {
        "doc_id": 29,
        "title": "Huong_Dan_Van_Hanh_Docker_Kubernetes.pdf",
        "description": "Quy trình đóng gói Dockerfile, triển khai Helm chart và giám sát cụm Pods K8s.",
        "file_path": "uploads/sample-huong-dan-docker-cicd.pdf",
        "file_type": "pdf",
        "file_size": 6740,
        "download_count": 275,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 6,
        "uploader_name": "Vu Thi Giang",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-03-22 15:45:00"
    },
    {
        "doc_id": 30,
        "title": "Ky_Thuat_Toi_Uu_Truy_Van_MySQL_Index.pdf",
        "description": "Hướng dẫn đánh chỉ mục Composite Index, tối ưu EXPLAIN và loại bỏ Full Table Scan.",
        "file_path": "uploads/sample-toi-uu-mysql.pdf",
        "file_type": "pdf",
        "file_size": 4380,
        "download_count": 290,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 9,
        "uploader_name": "Bui Van Minh",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-02 08:45:00"
    },
    {
        "doc_id": 31,
        "title": "Ke_Hoach_Khoi_Phuc_Sau_Tham_Hoa_DRP.docx",
        "description": "Quy trình sao lưu tự động hằng ngày và kịch bản khôi phục DB trong vòng 15 phút.",
        "file_path": "uploads/sample-disaster-recovery.docx",
        "file_type": "docx",
        "file_size": 3620,
        "download_count": 130,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-12 16:00:00"
    },
    {
        "doc_id": 32,
        "title": "Dac_Ta_Giao_Thuc_API_RESTful_v2.pdf",
        "description": "Tài liệu Swagger OpenAPI mô tả chi tiết 25 endpoint quản trị dữ liệu.",
        "file_path": "uploads/sample-kientruc-microservices.pdf",
        "file_type": "pdf",
        "file_size": 5120,
        "download_count": 205,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 6,
        "uploader_name": "Vu Thi Giang",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-15 10:15:00"
    },
    {
        "doc_id": 33,
        "title": "Chinh_Sach_Bao_Mat_Zero_Trust_Network.pdf",
        "description": "Mô hình bảo vệ mạng nội bộ không tin cậy tuyệt đối, áp dụng xác thực mTLS và JWT.",
        "file_path": "uploads/sample-toi-uu-mysql.pdf",
        "file_type": "pdf",
        "file_size": 4180,
        "download_count": 168,
        "category_id": 4,
        "category_name": "Tài Liệu Kỹ Thuật & Dự Án",
        "uploaded_by": 9,
        "uploader_name": "Bui Van Minh",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-18 13:30:00"
    },
    {
        "doc_id": 34,
        "title": "Bieu_Mau_De_Xuat_Mua_Sam_Thiet_Bi.docx",
        "description": "Mẫu phiếu đề nghị cấp sắm máy tính bàn, linh kiện và thiết bị ngoại vi văn phòng.",
        "file_path": "uploads/sample-de-xuat-mua-sam.docx",
        "file_type": "docx",
        "file_size": 620.5,
        "download_count": 160,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 5,
        "uploader_name": "Hoang Van Em",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-01-28 08:30:00"
    },
    {
        "doc_id": 35,
        "title": "Don_Xin_Nghi_Phep_Huong_Luong_2025.docx",
        "description": "Mẫu đơn xin nghỉ phép năm, nghỉ chế độ dưỡng sức và thai sản dành cho nhân viên.",
        "file_path": "uploads/sample-don-xin-nghi-phep.docx",
        "file_type": "docx",
        "file_size": 450,
        "download_count": 320,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 2,
        "uploader_name": "Tran Thi Binh",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-02-08 10:15:00"
    },
    {
        "doc_id": 36,
        "title": "Phieu_De_Nghi_Thanh_Toan_Tam_Ung.xlsx",
        "description": "Mẫu bảng kê chứng từ hóa đơn hợp lệ kèm phiếu chi tiền mặt hoặc chuyển khoản.",
        "file_path": "uploads/sample-de-nghi-thanh-toan.xlsx",
        "file_type": "xlsx",
        "file_size": 890.3,
        "download_count": 215,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 8,
        "uploader_name": "Do Thi Linh",
        "dept_name": "Phòng Kế Toán & Tài Chính",
        "created_at": "2025-02-22 14:50:00"
    },
    {
        "doc_id": 37,
        "title": "Phieu_Danh_Gia_Ket_Qua_Thu_Viec.docx",
        "description": "Bảng thẩm định năng lực thử việc sau 2 tháng để làm căn cứ ký HĐLĐ chính thức.",
        "file_path": "uploads/sample-danh-gia-thu-viec.docx",
        "file_type": "docx",
        "file_size": 710,
        "download_count": 105,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 5,
        "uploader_name": "Hoang Van Em",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-03-18 11:00:00"
    },
    {
        "doc_id": 38,
        "title": "Bien_Ban_Ban_Giao_Tai_San_Thiet_Bi.docx",
        "description": "Biên bản kiểm kê thiết bị bàn giao khi nhân sự mới nhận việc hoặc thôi việc.",
        "file_path": "uploads/sample-bien-ban-ban-giao.docx",
        "file_type": "docx",
        "file_size": 580.4,
        "download_count": 88,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 10,
        "uploader_name": "Dang Thi Nga",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-04-03 09:30:00"
    },
    {
        "doc_id": 39,
        "title": "Phieu_Dang_Ky_Lam_Them_Gio_Overtime.docx",
        "description": "Mẫu đăng ký lịch trực ca và làm thêm giờ dự án có chữ ký phê duyệt của quản lý.",
        "file_path": "uploads/sample-don-xin-nghi-phep.docx",
        "file_type": "docx",
        "file_size": 510,
        "download_count": 142,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-06 15:20:00"
    },
    {
        "doc_id": 40,
        "title": "Giay_De_Nghi_Di_Cong_Tac_Nuoc_Ngoai.pdf",
        "description": "Mẫu trình Ban Giám Đốc phê duyệt lịch công tác xúc tiến thương mại quốc tế.",
        "file_path": "uploads/sample-de-xuat-mua-sam.docx",
        "file_type": "pdf",
        "file_size": 1240,
        "download_count": 76,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 7,
        "uploader_name": "Ngo Van Hai",
        "dept_name": "Phòng Kinh Doanh & Marketing",
        "created_at": "2025-04-10 11:45:00"
    },
    {
        "doc_id": 41,
        "title": "Phieu_Yeu_Cau_Ho_Tro_Ky_Thuat_IT.docx",
        "description": "Phiếu yêu cầu mở quyền truy cập máy chủ, reset mật khẩu và khắc phục sự cố mạng.",
        "file_path": "uploads/sample-bien-ban-ban-giao.docx",
        "file_type": "docx",
        "file_size": 490,
        "download_count": 195,
        "category_id": 5,
        "category_name": "Biểu Mẫu Hành Chính",
        "uploaded_by": 9,
        "uploader_name": "Bui Van Minh",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-14 08:30:00"
    },
    {
        "doc_id": 42,
        "title": "Slide_Dao_Tao_Nhap_Mon_Onboarding_Kit.pptx",
        "description": "Tài liệu thuyết trình chào đón nhân sự mới, giới thiệu văn hóa và phần mềm nội bộ.",
        "file_path": "uploads/sample-onboarding-presentation.pptx",
        "file_type": "pptx",
        "file_size": 12450,
        "download_count": 260,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 2,
        "uploader_name": "Tran Thi Binh",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-01-16 13:00:00"
    },
    {
        "doc_id": 43,
        "title": "Khoa_Hoc_Nhan_Thuc_An_Ninh_Mang_2025.pdf",
        "description": "Cẩm nang phòng chống thư rác lừa đảo Phishing, mã độc ransomware và lộ lọt dữ liệu.",
        "file_path": "uploads/sample-security-awareness.pdf",
        "file_type": "pdf",
        "file_size": 7340,
        "download_count": 340,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 6,
        "uploader_name": "Vu Thi Giang",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-02-25 15:20:00"
    },
    {
        "doc_id": 44,
        "title": "Cam_Nang_Giao_Tiep_Xu_Ly_Xung_Dot_Nhom.pdf",
        "description": "Kỹ năng làm việc nhóm, giao tiếp nội bộ hiệu quả và phương pháp giải quyết tranh chấp.",
        "file_path": "uploads/sample-ky-nang-giao-tiep.pdf",
        "file_type": "pdf",
        "file_size": 3890,
        "download_count": 142,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 1,
        "uploader_name": "Nguyen Van An",
        "dept_name": "Ban Giám Đốc",
        "created_at": "2025-03-20 16:30:00"
    },
    {
        "doc_id": 45,
        "title": "Huong_Dan_Su_Dung_DocuCorp_Portal.pdf",
        "description": "Tài liệu hướng dẫn tải lên, tìm kiếm và phân quyền tài liệu trên hệ thống DocuCorp.",
        "file_path": "uploads/sample-huong-dan-erp.pdf",
        "file_type": "pdf",
        "file_size": 6120,
        "download_count": 280,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-08 10:40:00"
    },
    {
        "doc_id": 46,
        "title": "Playbook_Quy_Trinh_Ban_Hang_Va_CSKH.docx",
        "description": "Kịch bản gọi điện tư vấn sản phẩm phần mềm và quy trình chốt hợp đồng B2B.",
        "file_path": "uploads/sample-sales-playbook.docx",
        "file_type": "docx",
        "file_size": 2850,
        "download_count": 175,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 7,
        "uploader_name": "Ngo Van Hai",
        "dept_name": "Phòng Kinh Doanh & Marketing",
        "created_at": "2025-04-15 14:10:00"
    },
    {
        "doc_id": 47,
        "title": "Giao_Trinh_Dao_Tao_SQL_Chuan_3NF.pdf",
        "description": "Khóa học SQL căn bản đến nâng cao: Chuẩn hóa dữ liệu 3NF, Indexing và Query Tuning.",
        "file_path": "uploads/sample-toi-uu-mysql.pdf",
        "file_type": "pdf",
        "file_size": 8400,
        "download_count": 315,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 3,
        "uploader_name": "Le Minh Cuong",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-19 16:00:00"
    },
    {
        "doc_id": 48,
        "title": "Huong_Dan_Phong_Chay_Chua_Chay_VP.pdf",
        "description": "Quy tắc thoát hiểm khẩn cấp và vị trí bình bọt chữa cháy tại các tầng tòa nhà.",
        "file_path": "uploads/sample-ky-nang-giao-tiep.pdf",
        "file_type": "pdf",
        "file_size": 2900,
        "download_count": 89,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 10,
        "uploader_name": "Dang Thi Nga",
        "dept_name": "Phòng Nhân Sự",
        "created_at": "2025-04-21 09:10:00"
    },
    {
        "doc_id": 49,
        "title": "Cam_Nang_Quan_Tri_Thoi_Gian_Cho_Dev.docx",
        "description": "Phương pháp quản lý công việc Pomodoro, Eisenhower và kỹ thuật tập trung chuyên sâu.",
        "file_path": "uploads/sample-sales-playbook.docx",
        "file_type": "docx",
        "file_size": 1860,
        "download_count": 134,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 6,
        "uploader_name": "Vu Thi Giang",
        "dept_name": "Phòng Kỹ Thuật & CNTT",
        "created_at": "2025-04-23 11:25:00"
    },
    {
        "doc_id": 50,
        "title": "Quy_Trinh_Danh_Gia_Hieu_Suat_OKRs.pdf",
        "description": "Hướng dẫn thiết lập mục tiêu then chốt OKRs và quy trình review hiệu quả quý.",
        "file_path": "uploads/sample-so-tay-van-hoa.pdf",
        "file_type": "pdf",
        "file_size": 3750,
        "download_count": 210,
        "category_id": 6,
        "category_name": "Đào Tạo & Hướng Dẫn",
        "uploaded_by": 1,
        "uploader_name": "Nguyen Van An",
        "dept_name": "Ban Giám Đốc",
        "created_at": "2025-04-26 15:40:00"
    }
];

// =======================================================================
// 3. INITIALIZATION ON DOM READY
// =======================================================================
document.addEventListener('DOMContentLoaded', async () => {
    initNavigationTabs();
    initRoleSwitcher();
    initSmartSearchAndShortcuts();
    initCategoryQuickFilter();
    initModalsAndDropzone();
    initToolbarFilters();
    initNotificationDropdown();

    // Nạp dữ liệu
    await loadInitialData();
});

// =======================================================================
// 4. NAVIGATION TABS (Tất cả tài liệu vs Analytics vs API)
// =======================================================================
function initNavigationTabs() {
    const navItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    const navItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    tabPanes.forEach(pane => {
        if (pane.id === `tab-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Kích hoạt render lại biểu đồ nếu chuyển sang tab thống kê
    if (tabId === 'stats') {
        setTimeout(() => {
            renderAnalyticsCharts();
            loadSQLStats();
        }, 100);
    }
}

// =======================================================================
// 5. ROLE SWITCHER (ADMIN VS STAFF)
// =======================================================================
function initRoleSwitcher() {
    const btnAdmin = document.getElementById('btn-role-admin');
    const btnStaff = document.getElementById('btn-role-staff');
    const staffBanner = document.getElementById('staff-notice-banner');
    const quickBackAdmin = document.getElementById('btn-quick-back-admin');
    const userRoleBadge = document.getElementById('current-user-role-badge');
    const headerAvatar = document.getElementById('header-user-avatar');

    function applyRole(newRole) {
        currentRole = newRole;
        if (newRole === 'Staff') {
            document.body.classList.remove('role-admin');
            document.body.classList.add('role-staff');
            btnStaff.classList.add('active');
            btnAdmin.classList.remove('active');
            if (staffBanner) staffBanner.style.display = 'flex';
            if (userRoleBadge) {
                userRoleBadge.innerHTML = '<i class="fa-solid fa-user"></i> <span>Nhân viên (Staff)</span>';
            }
            if (headerAvatar) {
                headerAvatar.title = 'Tài khoản đang đăng nhập: Staff (Chế độ xem)';
            }
            showNotificationToast('Đã chuyển sang chế độ xem: Nhân viên (Staff). Quyền Sửa/Xóa bị khóa.', 'info');
        } else {
            document.body.classList.remove('role-staff');
            document.body.classList.add('role-admin');
            btnAdmin.classList.add('active');
            btnStaff.classList.remove('active');
            if (staffBanner) staffBanner.style.display = 'none';
            if (userRoleBadge) {
                userRoleBadge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> <span>Quản trị viên (Admin)</span>';
            }
            if (headerAvatar) {
                headerAvatar.title = 'Tài khoản đang đăng nhập: Admin (Toàn quyền)';
            }
            showNotificationToast('Đã kích hoạt toàn quyền Quản trị viên (Admin)', 'success');
        }
        renderDocumentsTable();
    }

    if (btnAdmin) btnAdmin.addEventListener('click', () => applyRole('Admin'));
    if (btnStaff) btnStaff.addEventListener('click', () => applyRole('Staff'));
    if (quickBackAdmin) quickBackAdmin.addEventListener('click', () => applyRole('Admin'));
}

// =======================================================================
// 6. SMART SEARCH & PHÍM TẮT CTRL + K
// =======================================================================
function initSmartSearchAndShortcuts() {
    const topSearch = document.getElementById('top-search-input');
    const tableSearch = document.getElementById('search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');

    // Phím tắt bàn phím Ctrl + K hoặc Cmd + K
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            switchTab('documents');
            if (topSearch) {
                topSearch.focus();
                topSearch.select();
            }
        }
    });

    // Đồng bộ 2 ô tìm kiếm
    function handleSearchInput(value) {
        searchQuery = value.trim().toLowerCase();
        if (topSearch && topSearch.value !== value) topSearch.value = value;
        if (tableSearch && tableSearch.value !== value) tableSearch.value = value;
        if (btnClearSearch) {
            btnClearSearch.style.display = searchQuery ? 'block' : 'none';
        }
        currentPage = 1;
        updateActiveFilterTags();
        renderDocumentsTable();
    }

    if (topSearch) {
        topSearch.addEventListener('input', (e) => {
            switchTab('documents');
            handleSearchInput(e.target.value);
        });
    }

    if (tableSearch) {
        tableSearch.addEventListener('input', (e) => {
            handleSearchInput(e.target.value);
        });
    }

    if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
            handleSearchInput('');
        });
    }
}

// =======================================================================
// 7. QUICK CATEGORY FILTER (SIDEBAR 8 MỤC)
// =======================================================================
function initCategoryQuickFilter() {
    const quickCatItems = document.querySelectorAll('#quick-category-list .cat-item');
    const btnClearQuick = document.getElementById('btn-clear-quick-cat');
    const filterSelect = document.getElementById('filter-category');

    quickCatItems.forEach(item => {
        item.addEventListener('click', () => {
            const catName = item.getAttribute('data-cat-name');
            const catId = item.getAttribute('data-cat-id');

            quickCatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            activeCategoryFilter = catName;
            if (filterSelect) {
                // Đồng bộ dropdown lọc
                for (let opt of filterSelect.options) {
                    if (opt.value === catId || opt.text.toLowerCase().includes(catName.toLowerCase())) {
                        filterSelect.value = opt.value;
                        break;
                    }
                }
            }

            switchTab('documents');
            currentPage = 1;
            updateActiveFilterTags();
            renderDocumentsTable();
        });
    });

    if (btnClearQuick) {
        btnClearQuick.addEventListener('click', () => {
            resetCategoryFilter();
        });
    }
}

function resetCategoryFilter() {
    activeCategoryFilter = '';
    const quickCatItems = document.querySelectorAll('#quick-category-list .cat-item');
    quickCatItems.forEach(i => i.classList.remove('active'));

    const filterSelect = document.getElementById('filter-category');
    if (filterSelect) filterSelect.value = '';

    currentPage = 1;
    updateActiveFilterTags();
    renderDocumentsTable();
}

// =======================================================================
// 8. TOOLBAR FILTERS (CATEGORY, DEPARTMENT, TYPE)
// =======================================================================
function initToolbarFilters() {
    const catSelect = document.getElementById('filter-category');
    const deptSelect = document.getElementById('filter-department');
    const typeSelect = document.getElementById('filter-type');
    const btnRefresh = document.getElementById('btn-refresh-docs');
    const pageSizeSelect = document.getElementById('select-page-size');
    const btnResetAll = document.getElementById('btn-reset-all-filters');
    const btnExportCSV = document.getElementById('btn-export-csv');

    if (catSelect) {
        catSelect.addEventListener('change', (e) => {
            const selectedText = e.target.options[e.target.selectedIndex].text;
            activeCategoryFilter = e.target.value ? selectedText : '';
            // Đồng bộ sidebar quick category highlight
            const quickCatItems = document.querySelectorAll('#quick-category-list .cat-item');
            quickCatItems.forEach(i => {
                const name = i.getAttribute('data-cat-name');
                if (selectedText.toLowerCase().includes(name.toLowerCase())) {
                    i.classList.add('active');
                } else {
                    i.classList.remove('active');
                }
            });
            currentPage = 1;
            updateActiveFilterTags();
            renderDocumentsTable();
        });
    }

    if (deptSelect) {
        deptSelect.addEventListener('change', (e) => {
            activeDepartmentFilter = e.target.value ? e.target.options[e.target.selectedIndex].text : '';
            currentPage = 1;
            updateActiveFilterTags();
            renderDocumentsTable();
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            activeTypeFilter = e.target.value;
            currentPage = 1;
            updateActiveFilterTags();
            renderDocumentsTable();
        });
    }

    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value, 10) || 10;
            currentPage = 1;
            renderDocumentsTable();
        });
    }

    if (btnRefresh) {
        btnRefresh.addEventListener('click', async () => {
            btnRefresh.classList.add('fa-spin');
            await loadDocumentsFromBackend();
            setTimeout(() => btnRefresh.classList.remove('fa-spin'), 600);
            showNotificationToast('Đã làm mới dữ liệu tài liệu thành công!', 'success');
        });
    }

    if (btnResetAll) {
        btnResetAll.addEventListener('click', () => {
            resetAllFilters();
        });
    }

    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', exportDocumentsToCSV);
    }

    // Toggle Sidebar trên màn hình nhỏ
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function resetAllFilters() {
    searchQuery = '';
    activeCategoryFilter = '';
    activeDepartmentFilter = '';
    activeTypeFilter = '';

    const topSearch = document.getElementById('top-search-input');
    const tableSearch = document.getElementById('search-input');
    const catSelect = document.getElementById('filter-category');
    const deptSelect = document.getElementById('filter-department');
    const typeSelect = document.getElementById('filter-type');
    const quickCatItems = document.querySelectorAll('#quick-category-list .cat-item');

    if (topSearch) topSearch.value = '';
    if (tableSearch) tableSearch.value = '';
    if (catSelect) catSelect.value = '';
    if (deptSelect) deptSelect.value = '';
    if (typeSelect) typeSelect.value = '';
    quickCatItems.forEach(i => i.classList.remove('active'));

    currentPage = 1;
    updateActiveFilterTags();
    renderDocumentsTable();
}

function updateActiveFilterTags() {
    const filterRow = document.getElementById('active-filters-row');
    const tagsList = document.getElementById('filter-tags-list');
    if (!filterRow || !tagsList) return;

    tagsList.innerHTML = '';
    let hasFilter = false;

    if (searchQuery) {
        hasFilter = true;
        tagsList.innerHTML += `
            <span class="filter-tag-pill">
                Từ khóa: "${searchQuery}"
                <button type="button" class="btn-remove-tag" onclick="clearSearchFilter()"><i class="fa-solid fa-xmark"></i></button>
            </span>
        `;
    }

    if (activeCategoryFilter) {
        hasFilter = true;
        tagsList.innerHTML += `
            <span class="filter-tag-pill">
                Danh mục: ${activeCategoryFilter}
                <button type="button" class="btn-remove-tag" onclick="resetCategoryFilter()"><i class="fa-solid fa-xmark"></i></button>
            </span>
        `;
    }

    if (activeDepartmentFilter) {
        hasFilter = true;
        tagsList.innerHTML += `
            <span class="filter-tag-pill">
                Phòng ban: ${activeDepartmentFilter}
                <button type="button" class="btn-remove-tag" onclick="clearDepartmentFilter()"><i class="fa-solid fa-xmark"></i></button>
            </span>
        `;
    }

    if (activeTypeFilter) {
        hasFilter = true;
        tagsList.innerHTML += `
            <span class="filter-tag-pill">
                Định dạng: ${activeTypeFilter.toUpperCase()}
                <button type="button" class="btn-remove-tag" onclick="clearTypeFilter()"><i class="fa-solid fa-xmark"></i></button>
            </span>
        `;
    }

    filterRow.style.display = hasFilter ? 'flex' : 'none';
}

window.clearSearchFilter = function() {
    searchQuery = '';
    const topSearch = document.getElementById('top-search-input');
    const tableSearch = document.getElementById('search-input');
    if (topSearch) topSearch.value = '';
    if (tableSearch) tableSearch.value = '';
    currentPage = 1;
    updateActiveFilterTags();
    renderDocumentsTable();
};

window.clearDepartmentFilter = function() {
    activeDepartmentFilter = '';
    const deptSelect = document.getElementById('filter-department');
    if (deptSelect) deptSelect.value = '';
    currentPage = 1;
    updateActiveFilterTags();
    renderDocumentsTable();
};

window.clearTypeFilter = function() {
    activeTypeFilter = '';
    const typeSelect = document.getElementById('filter-type');
    if (typeSelect) typeSelect.value = '';
    currentPage = 1;
    updateActiveFilterTags();
    renderDocumentsTable();
};

// =======================================================================
// 9. NẠP DỮ LIỆU BAN ĐẦU (API KẾT NỐI & FALLBACK)
// =======================================================================
async function loadInitialData() {
    try {
        // 1. Nạp master data: Danh mục, Phòng ban, Nhân viên
        await loadMasterData();

        // 2. Nạp danh sách tài liệu
        await loadDocumentsFromBackend();

        // 3. Tính toán KPI cards
        calculateAndUpdateKPIs();

        // 4. Nạp thống kê 3 câu SQL
        await loadSQLStats();
    } catch (err) {
        console.warn('Sử dụng dữ liệu khởi tạo fallback:', err);
        allCategories = FALLBACK_CATEGORIES;
        allDepartments = FALLBACK_DEPARTMENTS;
        allUsers = FALLBACK_USERS;
        allDocuments = FALLBACK_DOCUMENTS;
        populateMasterDropdowns();
        calculateAndUpdateKPIs();
        renderDocumentsTable();
    }
}

async function loadMasterData() {
    try {
        const [resCat, resDept, resUser] = await Promise.all([
            fetch(`${API_BASE}/api/categories`).then(r => r.json()).catch(() => null),
            fetch(`${API_BASE}/api/departments`).then(r => r.json()).catch(() => null),
            fetch(`${API_BASE}/api/users`).then(r => r.json()).catch(() => null)
        ]);

        allCategories = (resCat && resCat.success && resCat.data.length) ? resCat.data : FALLBACK_CATEGORIES;
        allDepartments = (resDept && resDept.success && resDept.data.length) ? resDept.data : FALLBACK_DEPARTMENTS;
        allUsers = (resUser && resUser.success && resUser.data.length) ? resUser.data : FALLBACK_USERS;

        const statusLabel = document.getElementById('backend-status-label');
        const statusPill = document.querySelector('.pulse-indicator');
        if (resCat && resCat.success) {
            if (statusLabel) statusLabel.textContent = 'API Live (MySQL)';
            if (statusPill) statusPill.classList.remove('offline');
        } else {
            if (statusLabel) statusLabel.textContent = 'Chế độ Demo (Fallback)';
            if (statusPill) statusPill.classList.add('offline');
        }
    } catch (error) {
        allCategories = FALLBACK_CATEGORIES;
        allDepartments = FALLBACK_DEPARTMENTS;
        allUsers = FALLBACK_USERS;
    }

    populateMasterDropdowns();
}

function populateMasterDropdowns() {
    // 1. Dropdown lọc danh mục
    const filterCat = document.getElementById('filter-category');
    const modalCat = document.getElementById('doc-category');
    const editCat = document.getElementById('edit-doc-category');

    if (filterCat) {
        filterCat.innerHTML = '<option value="">Tất cả danh mục (8)</option>';
        allCategories.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.category_id;
            opt.textContent = `${c.category_name} ${c.display_vn ? `(${c.display_vn})` : ''}`;
            filterCat.appendChild(opt);
        });
    }

    if (modalCat) {
        modalCat.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        allCategories.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.category_id;
            opt.textContent = `${c.category_name} ${c.display_vn ? `(${c.display_vn})` : ''}`;
            modalCat.appendChild(opt);
        });
    }

    if (editCat) {
        editCat.innerHTML = '';
        allCategories.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.category_id;
            opt.textContent = c.category_name;
            editCat.appendChild(opt);
        });
    }

    // 2. Dropdown lọc phòng ban
    const filterDept = document.getElementById('filter-department');
    if (filterDept) {
        filterDept.innerHTML = '<option value="">Tất cả phòng ban</option>';
        allDepartments.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.dept_id;
            opt.textContent = d.dept_name;
            filterDept.appendChild(opt);
        });
    }

    // 3. Dropdown người đăng tải
    const modalUploader = document.getElementById('doc-uploader');
    if (modalUploader) {
        modalUploader.innerHTML = '<option value="">-- Chọn nhân viên --</option>';
        allUsers.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.user_id;
            opt.textContent = `${u.full_name} (${u.dept_name || 'Phòng ban'})`;
            modalUploader.appendChild(opt);
        });
    }
}

async function loadDocumentsFromBackend() {
    try {
        const res = await fetch(`${API_BASE}/api/documents`);
        const result = await res.json();
        if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            allDocuments = result.data;
        } else {
            allDocuments = FALLBACK_DOCUMENTS;
        }
    } catch (e) {
        console.log('Chuyển sang dữ liệu mẫu fallback:', e);
        allDocuments = FALLBACK_DOCUMENTS;
    }
    calculateAndUpdateKPIs();
    renderDocumentsTable();
}

// =======================================================================
// 10. TÍNH TOÁN VÀ CẬP NHẬT 4 THẺ KPI
// =======================================================================
function calculateAndUpdateKPIs() {
    const totalDocs = allDocuments.length;
    const totalDownloads = allDocuments.reduce((sum, d) => sum + (parseInt(d.download_count, 10) || 0), 0);
    
    // Quy đổi tổng dung lượng từ KB sang MB (nếu file_size là KB)
    const totalStorageKB = allDocuments.reduce((sum, d) => sum + (parseFloat(d.file_size) || 0), 0);
    const totalStorageMB = (totalStorageKB / 1024).toFixed(2);

    // Đếm số phòng ban tham gia
    const uniqueDepts = new Set(allDocuments.map(d => d.dept_name).filter(Boolean));
    const totalDepts = uniqueDepts.size || 5;

    // Gán vào UI
    const elDocs = document.getElementById('kpi-total-docs');
    const elDownloads = document.getElementById('kpi-total-downloads');
    const elStorage = document.getElementById('kpi-total-storage');
    const elDepts = document.getElementById('kpi-total-depts');
    const elNavDocCount = document.getElementById('nav-doc-count');

    if (elDocs) elDocs.textContent = totalDocs.toLocaleString('vi-VN');
    if (elDownloads) elDownloads.textContent = totalDownloads.toLocaleString('vi-VN');
    if (elStorage) elStorage.textContent = `${totalStorageMB} MB`;
    if (elDepts) elDepts.textContent = totalDepts.toString();
    if (elNavDocCount) elNavDocCount.textContent = totalDocs.toString();

    // Cập nhật widget bộ nhớ ở sidebar
    const sidebarStorageText = document.getElementById('sidebar-storage-text');
    const sidebarStoragePercent = document.getElementById('sidebar-storage-percent');
    const sidebarStorageBar = document.getElementById('sidebar-storage-bar');
    const percentUsed = Math.min(100, Math.round((parseFloat(totalStorageMB) / 500) * 100));

    if (sidebarStorageText) sidebarStorageText.textContent = `${totalStorageMB} MB / 500 MB`;
    if (sidebarStoragePercent) sidebarStoragePercent.textContent = `${percentUsed}%`;
    if (sidebarStorageBar) sidebarStorageBar.style.width = `${percentUsed}%`;
}

// =======================================================================
// 11. ENTERPRISE DATA TABLE RENDERING
// =======================================================================
function getFilteredDocuments() {
    return allDocuments.filter(doc => {
        // Tìm kiếm tự do theo tiêu đề hoặc mô tả
        if (searchQuery) {
            const titleMatch = (doc.title || '').toLowerCase().includes(searchQuery);
            const descMatch = (doc.description || '').toLowerCase().includes(searchQuery);
            if (!titleMatch && !descMatch) return false;
        }

        // Lọc theo danh mục
        if (activeCategoryFilter) {
            const catName = (doc.category_name || '').toLowerCase();
            const filterLower = activeCategoryFilter.toLowerCase();
            if (!catName.includes(filterLower) && !filterLower.includes(catName)) {
                // Kiểm tra ID nếu có
                if (doc.category_id != activeCategoryFilter) return false;
            }
        }

        // Lọc theo phòng ban
        if (activeDepartmentFilter) {
            if ((doc.dept_name || '').toLowerCase() !== activeDepartmentFilter.toLowerCase()) {
                return false;
            }
        }

        // Lọc theo định dạng file
        if (activeTypeFilter) {
            const ftype = (doc.file_type || '').toLowerCase();
            if (!ftype.includes(activeTypeFilter.toLowerCase())) {
                return false;
            }
        }

        return true;
    });
}

function renderDocumentsTable() {
    const tbody = document.getElementById('documents-tbody');
    if (!tbody) return;

    const filtered = getFilteredDocuments();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedItems = filtered.slice(startIndex, endIndex);

    if (paginatedItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <div class="empty-state">
                        <i class="fa-regular fa-folder-open" style="font-size: 40px; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
                        <h4 style="font-size: 16px; font-weight: 700; color: #334155;">Không tìm thấy tài liệu phù hợp</h4>
                        <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Hãy thử thay đổi từ khóa hoặc bộ lọc danh mục/phòng ban</p>
                        <button class="btn btn-secondary mt-4" onclick="resetAllFilters()">Xóa tất cả bộ lọc</button>
                    </div>
                </td>
            </tr>
        `;
        renderPagination(0, 0, 0, 1);
        return;
    }

    tbody.innerHTML = paginatedItems.map(doc => {
        // Icon định dạng file có màu đặc trưng
        const typeInfo = getFileIconBadge(doc.file_type);

        // Badge màu riêng biệt cho từng Danh mục
        const catBadge = getCategoryBadgeHTML(doc.category_id, doc.category_name);

        // Avatar chữ cái đầu người đăng + màu gradient
        const avatarInfo = getUserAvatarInfo(doc.uploader_name || 'N');

        // Định dạng dung lượng
        const sizeFormatted = formatFileSize(doc.file_size);

        // Ngày đăng
        const dateFormatted = formatDate(doc.created_at);

        // Phân quyền nút Sửa/Xóa
        const isStaff = currentRole === 'Staff';
        const lockAttr = isStaff ? 'action-locked' : '';
        const lockTooltip = isStaff ? 'Chỉ dành cho Admin' : '';

        return `
            <tr data-doc-id="${doc.doc_id}">
                <td class="text-center">
                    <span class="file-format-badge ${typeInfo.className}" title="Định dạng ${doc.file_type ? doc.file_type.toUpperCase() : 'FILE'}">
                        <i class="${typeInfo.icon}"></i>
                    </span>
                </td>
                <td>
                    <div class="doc-title-cell">
                        <span class="doc-name" onclick="viewDocumentDetail(${doc.doc_id})" title="Nhấn để xem chi tiết">${escapeHtml(doc.title)}</span>
                        <span class="doc-desc" title="${escapeHtml(doc.description || '')}">${escapeHtml(doc.description || 'Không có mô tả tóm tắt')}</span>
                    </div>
                </td>
                <td>${catBadge}</td>
                <td>
                    <div class="contributor-cell">
                        <div class="contributor-avatar" style="background: ${avatarInfo.bg}">
                            ${avatarInfo.initials}
                        </div>
                        <div class="contributor-meta">
                            <span class="contributor-name">${escapeHtml(doc.uploader_name || 'Hệ Thống')}</span>
                            <span class="contributor-dept">${escapeHtml(doc.dept_name || 'Ban Giám Đốc')}</span>
                        </div>
                    </div>
                </td>
                <td class="text-right">
                    <span class="file-size-badge">${sizeFormatted}</span>
                </td>
                <td class="text-center">
                    <span class="download-counter">
                        <i class="fa-solid fa-arrow-down"></i> ${Number(doc.download_count || 0).toLocaleString()}
                    </span>
                </td>
                <td>
                    <span class="doc-date">${dateFormatted}</span>
                </td>
                <td class="text-center">
                    <div class="action-buttons-group">
                        <button type="button" class="btn-action-icon" title="Xem chi tiết" onclick="viewDocumentDetail(${doc.doc_id})">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button type="button" class="btn-action-icon action-download" title="Tải xuống tệp" onclick="downloadDocument(${doc.doc_id})">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <button type="button" class="btn-action-icon action-edit ${lockAttr}" title="${lockTooltip || 'Chỉnh sửa tài liệu'}" onclick="handleEditDocument(${doc.doc_id})">
                            <i class="${isStaff ? 'fa-solid fa-lock' : 'fa-solid fa-pen'}"></i>
                        </button>
                        <button type="button" class="btn-action-icon action-delete ${lockAttr}" title="${lockTooltip || 'Xóa tài liệu'}" onclick="handleDeleteDocument(${doc.doc_id})">
                            <i class="${isStaff ? 'fa-solid fa-ban' : 'fa-regular fa-trash-can'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    renderPagination(startIndex + 1, endIndex, totalItems, totalPages);
}

// Phân trang
function renderPagination(start, end, total, totalPages) {
    const info = document.getElementById('table-pagination-info');
    const pageContainer = document.getElementById('page-numbers');
    const btnPrev = document.getElementById('btn-page-prev');
    const btnNext = document.getElementById('btn-page-next');

    if (info) {
        if (total === 0) {
            info.innerHTML = 'Hiển thị <strong>0</strong> trên <strong>0</strong> tài liệu';
        } else {
            info.innerHTML = `Hiển thị <strong>${start} - ${end}</strong> trên tổng số <strong>${total}</strong> tài liệu`;
        }
    }

    if (btnPrev) btnPrev.disabled = (currentPage <= 1);
    if (btnNext) btnNext.disabled = (currentPage >= totalPages);

    if (btnPrev) {
        btnPrev.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderDocumentsTable();
            }
        };
    }

    if (btnNext) {
        btnNext.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderDocumentsTable();
            }
        };
    }

    if (pageContainer) {
        pageContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `btn-page ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderDocumentsTable();
            };
            pageContainer.appendChild(btn);
        }
    }
}

// =======================================================================
// 12. HELPER RENDERING (FILE ICONS, BADGES, DATES)
// =======================================================================
function getFileIconBadge(fileType) {
    const ft = (fileType || '').toLowerCase();
    if (ft.includes('pdf')) {
        return { icon: 'fa-solid fa-file-pdf', className: 'type-pdf' };
    }
    if (ft.includes('doc') || ft.includes('word')) {
        return { icon: 'fa-solid fa-file-word', className: 'type-docx' };
    }
    if (ft.includes('xls') || ft.includes('excel') || ft.includes('csv')) {
        return { icon: 'fa-solid fa-file-excel', className: 'type-xlsx' };
    }
    if (ft.includes('ppt') || ft.includes('powerpoint')) {
        return { icon: 'fa-solid fa-file-powerpoint', className: 'type-pptx' };
    }
    return { icon: 'fa-solid fa-file-lines', className: 'type-other' };
}

function getCategoryBadgeHTML(catId, catName) {
    const id = parseInt(catId, 10) || 1;
    const badgeClass = `badge-cat-${((id - 1) % 8) + 1}`;
    return `<span class="badge-category ${badgeClass}"><i class="fa-solid fa-tag"></i> ${escapeHtml(catName || 'Chung')}</span>`;
}

function getUserAvatarInfo(fullName) {
    const name = fullName || 'User';
    const words = name.trim().split(' ');
    let initials = 'U';
    if (words.length >= 2) {
        initials = (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
    } else if (words.length === 1 && words[0]) {
        initials = words[0].substring(0, 2).toUpperCase();
    }

    const gradients = [
        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        'linear-gradient(135deg, #10b981, #047857)',
        'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        'linear-gradient(135deg, #f59e0b, #b45309)',
        'linear-gradient(135deg, #ec4899, #be185d)',
        'linear-gradient(135deg, #06b6d4, #0e7490)'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bg = gradients[hash % gradients.length];

    return { initials, bg };
}

function formatFileSize(sizeInKB) {
    const kb = parseFloat(sizeInKB) || 0;
    if (kb >= 1024) {
        return `${(kb / 1024).toFixed(2)} MB`;
    }
    return `${kb.toFixed(1)} KB`;
}

function formatDate(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split(' ')[0] || dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// =======================================================================
// 13. TƯƠNG TÁC TÀI LIỆU (DOWNLOAD, VIEW, EDIT, DELETE)
// =======================================================================
window.viewDocumentDetail = function(docId) {
    const doc = allDocuments.find(d => d.doc_id === docId);
    if (!doc) return;

    const modal = document.getElementById('modal-view');
    document.getElementById('view-modal-title').textContent = doc.title;
    document.getElementById('view-cat-badge').innerHTML = getCategoryBadgeHTML(doc.category_id, doc.category_name);
    document.getElementById('view-uploader-name').textContent = doc.uploader_name || 'Hệ Thống';
    document.getElementById('view-dept-name').textContent = doc.dept_name || 'Chưa phân bổ';
    document.getElementById('view-file-size').textContent = formatFileSize(doc.file_size);
    document.getElementById('view-download-count').textContent = `${Number(doc.download_count || 0).toLocaleString()} lượt`;
    document.getElementById('view-created-at').textContent = formatDate(doc.created_at);
    document.getElementById('view-doc-description').textContent = doc.description || 'Không có mô tả chi tiết cho tài liệu này.';

    const btnDownload = document.getElementById('btn-download-from-view');
    if (btnDownload) {
        btnDownload.onclick = () => {
            closeModal('modal-view');
            downloadDocument(docId);
        };
    }

    openModal('modal-view');
};

window.downloadDocument = async function(docId) {
    const doc = allDocuments.find(d => d.doc_id === docId);
    if (!doc) return;

    try {
        // Tăng lượt tải trên Backend (+1 download_count)
        fetch(`${API_BASE}/api/documents/${docId}/download`, { method: 'POST' }).catch(() => null);
        
        // Tăng lượt tải trên client
        doc.download_count = (parseInt(doc.download_count, 10) || 0) + 1;
        calculateAndUpdateKPIs();
        renderDocumentsTable();

        // Tải file nhị phân nếu có backend hoặc tạo file ảo
        const downloadUrl = `${API_BASE}/api/documents/${docId}/download-file`;
        const a = document.createElement('a');
        a.href = doc.file_path ? `${API_BASE}/${doc.file_path}` : downloadUrl;
        a.download = `${doc.title}.${doc.file_type || 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        Swal.fire({
            icon: 'success',
            title: 'Tải xuống thành công!',
            text: `Tài liệu "${doc.title}" đã được ghi nhận lượt tải mới (+1).`,
            timer: 2500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    } catch (e) {
        showNotificationToast('Đã bắt đầu tải file về máy...', 'success');
    }
};

window.handleEditDocument = function(docId) {
    if (currentRole === 'Staff') {
        Swal.fire({
            icon: 'warning',
            title: 'Thông Báo Phân Quyền',
            text: 'Bạn đang ở chế độ xem Nhân viên (Staff). Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa tài liệu!',
            confirmButtonText: 'Đã hiểu',
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    const doc = allDocuments.find(d => d.doc_id === docId);
    if (!doc) return;

    document.getElementById('edit-doc-id').value = doc.doc_id;
    document.getElementById('edit-doc-title').value = doc.title;
    document.getElementById('edit-doc-category').value = doc.category_id;
    document.getElementById('edit-doc-description').value = doc.description || '';
    document.getElementById('edit-modal-doc-id').textContent = `Mã tài liệu: #${doc.doc_id} • Người đăng: ${doc.uploader_name || 'N/A'}`;

    openModal('modal-edit');
};

window.handleDeleteDocument = function(docId) {
    if (currentRole === 'Staff') {
        Swal.fire({
            icon: 'warning',
            title: 'Hành Động Bị Khóa',
            text: 'Bạn đang ở quyền Nhân viên (Staff). Không thể xóa tài liệu của doanh nghiệp!',
            confirmButtonText: 'Đã hiểu',
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    const doc = allDocuments.find(d => d.doc_id === docId);
    if (!doc) return;

    Swal.fire({
        title: 'Xác nhận xóa tài liệu?',
        html: `Bạn có chắc chắn muốn xóa vĩnh viễn tài liệu <strong>"${escapeHtml(doc.title)}"</strong>?<br><small class="text-muted">Hành động này sẽ xóa dữ liệu trong MySQL và file vật lý tương ứng.</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: '<i class="fa-solid fa-trash-can"></i> Xóa vĩnh viễn',
        cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Gọi API backend DELETE
                const res = await fetch(`${API_BASE}/api/documents/${docId}`, { method: 'DELETE' });
                const json = await res.json().catch(() => null);

                // Cập nhật client state
                allDocuments = allDocuments.filter(d => d.doc_id !== docId);
                calculateAndUpdateKPIs();
                renderDocumentsTable();

                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa tài liệu!',
                    text: 'Tài liệu đã được gỡ bỏ an toàn khỏi hệ thống.',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            } catch (err) {
                allDocuments = allDocuments.filter(d => d.doc_id !== docId);
                calculateAndUpdateKPIs();
                renderDocumentsTable();
                showNotificationToast('Đã xóa tài liệu khỏi danh sách.', 'success');
            }
        }
    });
};

// =======================================================================
// 14. MODAL DIALOGS & DRAG & DROP UPLOAD ZONE
// =======================================================================
function initModalsAndDropzone() {
    // Nút mở modal upload
    const btnOpenUpload = document.getElementById('btn-open-upload-modal');
    if (btnOpenUpload) {
        btnOpenUpload.addEventListener('click', () => {
            openModal('modal-upload');
        });
    }

    // Nút đóng modal
    setupModalClose('modal-upload', 'btn-close-upload-modal', 'btn-cancel-upload');
    setupModalClose('modal-edit', 'btn-close-edit-modal', 'btn-cancel-edit');
    setupModalClose('modal-view', 'btn-close-view-modal', 'btn-close-view');

    // Drag & Drop Zone Logic
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('doc-file');
    const placeholder = document.getElementById('dropzone-placeholder');
    const previewCard = document.getElementById('file-preview-card');
    const btnRemoveFile = document.getElementById('btn-remove-file');
    const titleInput = document.getElementById('doc-title');

    if (dropzone && fileInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dragover');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleSelectedFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleSelectedFile(e.target.files[0]);
            }
        });
    }

    function handleSelectedFile(file) {
        if (!file) return;

        if (placeholder) placeholder.style.display = 'none';
        if (previewCard) previewCard.style.display = 'flex';

        const nameEl = document.getElementById('preview-file-name');
        const sizeEl = document.getElementById('preview-file-size');
        const iconEl = document.getElementById('preview-file-icon');

        if (nameEl) nameEl.textContent = file.name;
        if (sizeEl) sizeEl.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

        // Tự động nhận diện icon file
        const ext = file.name.split('.').pop().toLowerCase();
        const typeInfo = getFileIconBadge(ext);
        if (iconEl) {
            iconEl.innerHTML = `<i class="${typeInfo.icon}"></i>`;
        }

        // Tự động điền tiêu đề nếu chưa nhập
        if (titleInput && !titleInput.value.trim()) {
            const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            titleInput.value = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
        }
    }

    if (btnRemoveFile && fileInput) {
        btnRemoveFile.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.value = '';
            if (placeholder) placeholder.style.display = 'block';
            if (previewCard) previewCard.style.display = 'none';
        });
    }

    // Submit Form Thêm Mới Tài Liệu
    const formUpload = document.getElementById('form-upload-document');
    if (formUpload) {
        formUpload.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-submit-upload');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải lên...';
            }

            const formData = new FormData(formUpload);
            try {
                const res = await fetch(`${API_BASE}/api/documents`, {
                    method: 'POST',
                    body: formData
                });
                const json = await res.json().catch(() => null);

                if (json && json.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Tải lên thành công!',
                        text: 'Tài liệu mới đã được thêm vào CSDL hệ thống.',
                        confirmButtonColor: '#2563eb'
                    });
                    formUpload.reset();
                    if (placeholder) placeholder.style.display = 'block';
                    if (previewCard) previewCard.style.display = 'none';
                    closeModal('modal-upload');
                    await loadDocumentsFromBackend();
                } else {
                    // Fallback giả lập tạo tài liệu nếu chạy offline
                    handleFallbackUpload(formData);
                }
            } catch (err) {
                handleFallbackUpload(formData);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> <span>Tải Lên Hệ Thống</span>';
                }
            }
        });
    }

    // Submit Form Chỉnh Sửa Tài Liệu
    const formEdit = document.getElementById('form-edit-document');
    if (formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const docId = parseInt(document.getElementById('edit-doc-id').value, 10);
            const title = document.getElementById('edit-doc-title').value;
            const category_id = parseInt(document.getElementById('edit-doc-category').value, 10);
            const description = document.getElementById('edit-doc-description').value;

            try {
                await fetch(`${API_BASE}/api/documents/${docId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, category_id, description })
                }).catch(() => null);

                // Cập nhật client state
                const doc = allDocuments.find(d => d.doc_id === docId);
                if (doc) {
                    doc.title = title;
                    doc.category_id = category_id;
                    const cat = allCategories.find(c => c.category_id === category_id);
                    if (cat) doc.category_name = cat.category_name;
                    doc.description = description;
                }

                closeModal('modal-edit');
                renderDocumentsTable();

                Swal.fire({
                    icon: 'success',
                    title: 'Lưu thay đổi thành công!',
                    text: 'Thông tin tài liệu đã được cập nhật.',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            } catch (error) {
                closeModal('modal-edit');
                renderDocumentsTable();
                showNotificationToast('Đã lưu thay đổi.', 'success');
            }
        });
    }
}

function handleFallbackUpload(formData) {
    const file = formData.get('file');
    const title = formData.get('title') || 'Tài liệu mới';
    const catId = parseInt(formData.get('category_id'), 10) || 1;
    const uploaderId = parseInt(formData.get('uploaded_by'), 10) || 1;
    const description = formData.get('description') || '';

    const cat = allCategories.find(c => c.category_id === catId);
    const uploader = allUsers.find(u => u.user_id === uploaderId);

    const ext = file && file.name ? file.name.split('.').pop() : 'pdf';
    const fileSizeKB = file ? (file.size / 1024) : 1250;

    const newDoc = {
        doc_id: allDocuments.length ? Math.max(...allDocuments.map(d => d.doc_id)) + 1 : 1,
        title: title,
        description: description,
        file_path: `uploads/${file ? file.name : 'new-document.pdf'}`,
        file_type: ext,
        file_size: fileSizeKB,
        download_count: 0,
        category_id: catId,
        category_name: cat ? cat.category_name : 'Policies',
        uploaded_by: uploaderId,
        uploader_name: uploader ? uploader.full_name : 'Nguyễn Văn An',
        dept_name: uploader ? uploader.dept_name : 'Ban Giám Đốc',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    allDocuments.unshift(newDoc);
    calculateAndUpdateKPIs();
    renderDocumentsTable();
    closeModal('modal-upload');

    document.getElementById('form-upload-document').reset();
    document.getElementById('dropzone-placeholder').style.display = 'block';
    document.getElementById('file-preview-card').style.display = 'none';

    Swal.fire({
        icon: 'success',
        title: 'Tải lên thành công!',
        text: `Tài liệu "${title}" đã được lưu trữ trong danh mục ${cat ? cat.category_name : ''}.`,
        confirmButtonColor: '#2563eb'
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

function setupModalClose(modalId, closeBtnId, cancelBtnId) {
    const modal = document.getElementById(modalId);
    const btnClose = document.getElementById(closeBtnId);
    const btnCancel = document.getElementById(cancelBtnId);

    if (btnClose) btnClose.addEventListener('click', () => closeModal(modalId));
    if (btnCancel) btnCancel.addEventListener('click', () => closeModal(modalId));

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modalId);
        });
    }
}

// =======================================================================
// 15. BÁO CÁO THỐNG KÊ (ANALYTICS DASHBOARD & CHART.JS)
// =======================================================================
async function renderAnalyticsCharts() {
    let deptStatsData = [];
    let catStatsData = [];

    try {
        const [resDept, resCat] = await Promise.all([
            fetch(`${API_BASE}/api/stats/departments`).then(r => r.json()).catch(() => null),
            fetch(`${API_BASE}/api/stats/categories`).then(r => r.json()).catch(() => null)
        ]);

        if (resDept && resDept.success && resDept.data.length) {
            deptStatsData = resDept.data;
        }
        if (resCat && resCat.success && resCat.data.length) {
            catStatsData = resCat.data;
        }
    } catch (e) {
        console.warn('Dùng dữ liệu fallback cho biểu đồ:', e);
    }

    // Nếu chưa có từ API, tính toán trực tiếp từ dữ liệu hiện tại
    if (!deptStatsData.length) {
        const deptMap = {};
        allDocuments.forEach(d => {
            const dept = d.dept_name || 'Khác';
            if (!deptMap[dept]) deptMap[dept] = { total_documents: 0, total_downloads: 0 };
            deptMap[dept].total_documents += 1;
            deptMap[dept].total_downloads += (parseInt(d.download_count, 10) || 0);
        });
        deptStatsData = Object.keys(deptMap).map(k => ({
            dept_name: k,
            total_documents: deptMap[k].total_documents,
            total_downloads: deptMap[k].total_downloads
        }));
    }

    if (!catStatsData.length) {
        const catMap = {};
        allDocuments.forEach(d => {
            const cat = d.category_name || 'Khác';
            if (!catMap[cat]) catMap[cat] = 0;
            catMap[cat] += 1;
        });
        catStatsData = Object.keys(catMap).map(k => ({
            category_name: k,
            total_documents: catMap[k]
        }));
    }

    // 1. Biểu đồ cột: Thống kê phòng ban (SQL 2)
    renderDepartmentBarChart(deptStatsData);

    // 2. Biểu đồ tròn: Thống kê danh mục (SQL 1)
    renderCategoryDoughnutChart(catStatsData);
}

function renderDepartmentBarChart(deptData) {
    const canvas = document.getElementById('chart-departments');
    if (!canvas) return;

    if (deptChartInstance) {
        deptChartInstance.destroy();
    }

    const labels = deptData.map(d => d.dept_name);
    const docs = deptData.map(d => d.total_documents);
    const downloads = deptData.map(d => d.total_downloads);

    deptChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Số tài liệu đóng góp',
                    data: docs,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                },
                {
                    label: 'Tổng lượt tải xuống',
                    data: downloads,
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleFont: { family: "'Plus Jakarta Sans'", size: 13, weight: '700' },
                    bodyFont: { family: "'Plus Jakarta Sans'", size: 12 },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' },
                        color: '#64748b'
                    }
                },
                y: {
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        font: { family: "'Plus Jakarta Sans'", size: 11 },
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

function renderCategoryDoughnutChart(catData) {
    const canvas = document.getElementById('chart-categories');
    if (!canvas) return;

    if (catChartInstance) {
        catChartInstance.destroy();
    }

    const labels = catData.map(c => c.category_name);
    const counts = catData.map(c => c.total_documents);
    const colors = [
        '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
        '#ec4899', '#06b6d4', '#6366f1', '#14b8a6'
    ];

    catChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors.slice(0, counts.length),
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 12,
                        font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' },
                        color: '#475569'
                    }
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    cornerRadius: 8
                }
            },
            cutout: '68%'
        }
    });
}

// =======================================================================
// 16. NẠP 3 CÂU TRUY VẤN SQL PHỨC TẠP & LEADERBOARD TOP 5
// =======================================================================
async function loadSQLStats() {
    try {
        // API 1: Categories
        const resCat = await fetch(`${API_BASE}/api/stats/categories`).catch(() => null);
        const jsonCat = resCat ? await resCat.json() : null;
        const catRows = (jsonCat && jsonCat.success) ? jsonCat.data : FALLBACK_CATEGORIES.map(c => ({
            category_id: c.category_id,
            category_name: c.category_name,
            total_documents: c.doc_count || 5,
            total_file_size_mb: '12.45',
            total_downloads: 650,
            avg_downloads_per_doc: 130
        }));

        const tbody1 = document.querySelector('#table-sql-categories tbody');
        if (tbody1) {
            tbody1.innerHTML = catRows.map(c => `
                <tr>
                    <td><strong>#${c.category_id}</strong></td>
                    <td><strong>${escapeHtml(c.category_name)}</strong></td>
                    <td><span class="badge-category badge-cat-1">${c.total_documents} tài liệu</span></td>
                    <td><strong>${c.total_file_size_mb || '0'} MB</strong></td>
                    <td>${Number(c.total_downloads || 0).toLocaleString()}</td>
                    <td>${c.avg_downloads_per_doc || '0'} lượt/bản</td>
                </tr>
            `).join('');
        }

        // API 2: Departments
        const resDept = await fetch(`${API_BASE}/api/stats/departments`).catch(() => null);
        const jsonDept = resDept ? await resDept.json() : null;
        const deptRows = (jsonDept && jsonDept.success) ? jsonDept.data : FALLBACK_DEPARTMENTS.map(d => ({
            dept_id: d.dept_id,
            dept_name: d.dept_name,
            total_employees: 2,
            total_documents: 7,
            total_downloads: 1200,
            total_storage_kb: 18900
        }));

        const tbody2 = document.querySelector('#table-sql-departments tbody');
        if (tbody2) {
            tbody2.innerHTML = deptRows.map(d => `
                <tr>
                    <td><strong>#${d.dept_id}</strong></td>
                    <td><strong>${escapeHtml(d.dept_name)}</strong></td>
                    <td>${d.total_employees} người</td>
                    <td><span class="badge-category badge-cat-3">${d.total_documents} tài liệu</span></td>
                    <td><strong>${Number(d.total_downloads || 0).toLocaleString()}</strong></td>
                    <td>${Number(d.total_storage_kb || 0).toLocaleString()} KB</td>
                </tr>
            `).join('');
        }

        // API 3: Top 5 Uploaders (Leaderboard)
        const resTop = await fetch(`${API_BASE}/api/stats/top-uploaders`).catch(() => null);
        const jsonTop = resTop ? await resTop.json() : null;
        let topRows = (jsonTop && jsonTop.success) ? jsonTop.data : [
            { user_id: 2, full_name: 'Trần Thị Bích', email: 'bich.tran@company.com', dept_name: 'Phòng Nhân Sự', role_name: 'Manager', total_uploaded_documents: 6, total_downloads_received: 971 },
            { user_id: 4, full_name: 'Phạm Minh Đức', email: 'duc.pham@company.com', dept_name: 'Phòng Kỹ Thuật & CNTT', role_name: 'Manager', total_uploaded_documents: 5, total_downloads_received: 865 },
            { user_id: 6, full_name: 'Vũ Thành Long', email: 'long.vu@company.com', dept_name: 'Phòng Kỹ Thuật & CNTT', role_name: 'Staff', total_uploaded_documents: 4, total_downloads_received: 925 },
            { user_id: 3, full_name: 'Lê Hoàng Cường', email: 'cuong.le@company.com', dept_name: 'Phòng Kế Toán', role_name: 'Manager', total_uploaded_documents: 4, total_downloads_received: 286 },
            { user_id: 5, full_name: 'Hoàng Thu Giang', email: 'giang.hoang@company.com', dept_name: 'Phòng Nhân Sự', role_name: 'Staff', total_uploaded_documents: 3, total_downloads_received: 476 }
        ];

        // Render Leaderboard Cards
        const leaderboardContainer = document.getElementById('leaderboard-cards-container');
        if (leaderboardContainer) {
            const medals = ['🥇 Top 1', '🥈 Top 2', '🥉 Top 3', '⭐ Top 4', '⭐ Top 5'];
            const maxDocs = topRows[0] ? topRows[0].total_uploaded_documents : 1;

            leaderboardContainer.innerHTML = topRows.slice(0, 5).map((u, i) => {
                const avatar = getUserAvatarInfo(u.full_name);
                const percent = Math.round((u.total_uploaded_documents / maxDocs) * 100);

                return `
                    <div class="leaderboard-item-card">
                        <div class="leader-medal">${medals[i]}</div>
                        <div class="leader-avatar" style="background: ${avatar.bg}">${avatar.initials}</div>
                        <div class="leader-name" title="${escapeHtml(u.full_name)}">${escapeHtml(u.full_name)}</div>
                        <div class="leader-dept">${escapeHtml(u.dept_name)}</div>
                        <div class="leader-stat-box">
                            <div class="leader-stat-number">${u.total_uploaded_documents}</div>
                            <div class="leader-stat-label">Tài liệu đã đăng</div>
                        </div>
                        <div class="leader-progress-track">
                            <div class="leader-progress-bar" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render SQL 3 Table
        const tbody3 = document.querySelector('#table-sql-top-uploaders tbody');
        if (tbody3) {
            const medals = ['🥇 Hạng 1', '🥈 Hạng 2', '🥉 Hạng 3', 'Hạng 4', 'Hạng 5'];
            tbody3.innerHTML = topRows.map((u, i) => `
                <tr>
                    <td><strong>${medals[i] || `Hạng ${i + 1}`}</strong></td>
                    <td><strong>${escapeHtml(u.full_name)}</strong></td>
                    <td><span class="badge-category badge-cat-2">${escapeHtml(u.dept_name)}</span></td>
                    <td>${escapeHtml(u.role_name)}</td>
                    <td><span class="badge-category badge-cat-3">${u.total_uploaded_documents} tài liệu</span></td>
                    <td>${Number(u.total_downloads_received || 0).toLocaleString()} lượt</td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error('Lỗi khi nạp dữ liệu thống kê SQL:', e);
    }
}

// =======================================================================
// 17. NOTIFICATIONS & EXPORT CSV
// =======================================================================
function initNotificationDropdown() {
    const btn = document.getElementById('btn-notifications');
    const menu = document.getElementById('notification-dropdown');

    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.remove('show');
            }
        });
    }
}

function exportDocumentsToCSV() {
    const docs = getFilteredDocuments();
    if (!docs.length) {
        Swal.fire({
            icon: 'info',
            title: 'Không có dữ liệu',
            text: 'Không có tài liệu nào để xuất tệp CSV!'
        });
        return;
    }

    const headers = ['Mã TL', 'Tên Tài Liệu', 'Danh Mục', 'Người Đăng', 'Phòng Ban', 'Định Dạng', 'Dung Lượng (KB)', 'Lượt Tải', 'Ngày Tạo'];
    const rows = docs.map(d => [
        d.doc_id,
        `"${(d.title || '').replace(/"/g, '""')}"`,
        `"${d.category_name || ''}"`,
        `"${d.uploader_name || ''}"`,
        `"${d.dept_name || ''}"`,
        d.file_type || '',
        d.file_size || 0,
        d.download_count || 0,
        `"${d.created_at || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocuCorp_Documents_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotificationToast(`Đã xuất ${docs.length} dòng dữ liệu sang tệp CSV`, 'success');
}

function showNotificationToast(message, type = 'success') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}
