import React, { useState, useMemo } from 'react';
import { 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  User, 
  Building2, 
  Printer, 
  Eye, 
  ExternalLink, 
  Search, 
  Tag, 
  HardDrive,
  FileCheck,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * Tự động tạo nội dung tài liệu chuẩn doanh nghiệp (Tiếng Việt)
 * dựa trên danh mục, tiêu đề và siêu dữ liệu trong CSDL 3NF
 */
function generateDocumentContent(doc) {
  const title = doc.title || 'Tài Liệu Doanh Nghiệp';
  const desc = doc.description || 'Văn bản quy định và chỉ dẫn quản trị nội bộ doanh nghiệp.';
  const dept = doc.dept_name || 'Ban Giám Đốc';
  const cat = (doc.category_name || '').toLowerCase();
  const uploader = doc.uploader_name || 'Quản Trị Viên';
  const cleanTitle = title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

  // 1. Phân loại nội dung theo danh mục
  if (cat.includes('chính sách') || cat.includes('nội quy') || cat.includes('policies')) {
    return {
      typeLabel: 'QUYẾT ĐỊNH BAN HÀNH QUY ĐỊNH NỘI BỘ',
      subTitle: `V/v: Áp dụng ${cleanTitle} trên toàn hệ thống công ty`,
      legalBasis: [
        'Căn cứ Bộ luật Lao động nước Cộng hòa Xã hội Chủ nghĩa Việt Nam số 45/2019/QH14;',
        'Căn cứ Điều lệ tổ chức và Quy chế quản trị nội bộ của Công ty Cổ phần Công nghệ;',
        'Căn cứ vào biên bản họp giao ban chiến lược định kỳ của Ban Giám Đốc điều hành;',
        'Xét đề nghị của Trưởng phòng Nhân sự và Trưởng phòng Kỹ thuật & CNTT.'
      ],
      articles: [
        {
          num: 'Điều 1',
          heading: 'Mục đích & Phạm vi điều chỉnh',
          content: `${desc} Văn bản này áp dụng bắt buộc đối với toàn thể cán bộ, nhân viên chính thức, nhân sự thử việc và các đơn vị cộng tác trực thuộc ${dept} cũng như toàn bộ các chi nhánh công ty trên toàn quốc.`
        },
        {
          num: 'Điều 2',
          heading: 'Quy tắc tác phong & Tiêu chuẩn bảo mật',
          content: 'Tất cả nhân sự có nghĩa vụ tuân thủ nghiêm ngặt thời gian làm việc, chuẩn mực giao tiếp văn minh công sở, giữ gìn tài sản chung và bảo vệ an toàn thông tin mật. Mọi hành vi làm rò rỉ mã nguồn, dữ liệu kinh doanh hoặc bí mật công nghệ ra bên ngoài sẽ bị xử lý kỷ luật nghiêm khắc theo pháp luật hiện hành.'
        },
        {
          num: 'Điều 3',
          heading: 'Chế độ đãi ngộ & Quyền lợi nhân sự',
          content: 'Công ty cam kết đảm bảo môi trường làm việc công bằng, hiện đại và nhân văn; trang bị đầy đủ hạ tầng máy tính, phần mềm bản quyền, chính sách bảo hiểm sức khỏe mở rộng cùng các khóa đào tạo nâng cao chuyên môn định kỳ hàng quý.'
        },
        {
          num: 'Điều 4',
          heading: 'Tổ chức thực hiện & Hiệu lực thi hành',
          content: `Quyết định này có hiệu lực kể từ ngày ký. Ban Giám Đốc, Trưởng các phòng ban nghiệp vụ và cán bộ phụ trách ${uploader} chịu trách nhiệm phổ biến, đôn đốc và giám sát thực hiện nghiêm túc quyết định này.`
        }
      ]
    };
  }

  if (cat.includes('hợp đồng') || cat.includes('pháp lý') || cat.includes('contracts')) {
    return {
      typeLabel: 'VĂN BẢN THỎA THUẬN & HỢP ĐỒNG PHÁP LÝ',
      subTitle: `Về việc: Xác lập điều khoản ${cleanTitle}`,
      legalBasis: [
        'Căn cứ Bộ luật Dân sự số 91/2015/QH13 và Luật Thương mại nước CHXHCN Việt Nam;',
        'Căn cứ năng lực và nhu cầu thực tế của các bên tham gia giao dịch hợp đồng;',
        'Căn cứ giấy chứng nhận đăng ký kinh doanh và thẩm quyền đại diện pháp luật.'
      ],
      articles: [
        {
          num: 'Điều 1',
          heading: 'Đối tượng & Phạm vi thỏa thuận',
          content: `Các bên thống nhất xác lập quan hệ hợp tác đối với nội dung: "${desc}". Mọi cam kết, quyền và nghĩa vụ được ràng buộc pháp lý chặt chẽ theo các điều khoản quy định trong hồ sơ văn bản đính kèm này.`
        },
        {
          num: 'Điều 2',
          heading: 'Cam kết bảo mật thông tin (NDA)',
          content: 'Các bên cam kết giữ bí mật tuyệt đối toàn bộ tài liệu kỹ thuật, mã nguồn, kế hoạch tài chính và danh sách đối tác. Không bên nào được phép cung cấp thông tin cho bên thứ ba khi chưa có văn bản chấp thuận trước của người có thẩm quyền.'
        },
        {
          num: 'Điều 3',
          heading: 'Trách nhiệm bồi thường thiệt hại & Giải quyết tranh chấp',
          content: 'Bên nào vi phạm nghĩa vụ hợp đồng dẫn đến tổn hại quyền lợi hợp pháp của bên kia phải bồi thường toàn bộ thiệt hại thực tế phát sinh. Mọi tranh chấp nếu không thương lượng thành công sẽ được phân xử chung thẩm tại Trung tâm Trọng tài Thương mại Quốc tế (VIAC).'
        },
        {
          num: 'Điều 4',
          heading: 'Hiệu lực hợp đồng & Lưu trữ hồ sơ',
          content: `Hợp đồng được lập thành các bản có giá trị pháp lý như nhau, lưu trữ an toàn tại hệ thống quản lý văn bản nội bộ do ${uploader} (${dept}) kiểm soát.`
        }
      ]
    };
  }

  if (cat.includes('báo cáo') || cat.includes('tài chính') || cat.includes('thuế') || cat.includes('reports') || cat.includes('finance')) {
    return {
      typeLabel: 'BÁO CÁO TÀI CHÍNH & QUẢN TRỊ DÒNG TIỀN DOANH NGHIỆP',
      subTitle: `Chuyên đề: ${cleanTitle}`,
      legalBasis: [
        'Căn cứ Luật Kế toán Việt Nam số 88/2015/QH13 và hệ thống Chuẩn mực Kế toán (VAS);',
        'Căn cứ Thông tư 200/2014/TT-BTC hướng dẫn chế độ kế toán doanh nghiệp;',
        'Căn cứ số liệu đối soát dòng tiền và biên bản kiểm toán tài chính độc lập.'
      ],
      articles: [
        {
          num: 'Phần I',
          heading: 'Tổng quan chỉ số hoạt động tài chính',
          content: `${desc} Các chỉ số doanh thu thuần, tỷ suất hoàn vốn nội bộ (IRR), biên lợi nhuận hoạt động và kế hoạch phân bổ ngân sách đều được hạch toán minh bạch, đúng quy trình đối soát chứng từ gốc.`
        },
        {
          num: 'Phần II',
          heading: 'Đánh giá tính tuân thủ & Nghĩa vụ thuế',
          content: 'Hồ sơ quyết toán thuế thu nhập doanh nghiệp (TNDN) và thuế thu nhập cá nhân (TNCN) đã được đối soát khớp đúng với tờ khai nộp điện tử của Tổng cục Thuế, đảm bảo không có rủi ro phạt chậm nộp hay vi phạm hóa đơn chứng từ.'
        },
        {
          num: 'Phần III',
          heading: 'Đề xuất phân bổ ngân sách kỳ tới',
          content: `Phòng Kế toán & Tài chính kiến nghị Ban Giám Đốc tiếp tục tối ưu hóa chi phí hạ tầng máy chủ, tăng cường đầu tư R&D và duy trì quỹ dự phòng rủi ro tài chính tương đương 15% tổng dòng tiền lưu động.`
        },
        {
          num: 'Phần IV',
          heading: 'Xác nhận của bộ phận phụ trách',
          content: `Báo cáo do cán bộ ${uploader} tổng hợp, số liệu đã được kiểm tra chéo và lưu vào cơ sở dữ liệu tài chính của ${dept}.`
        }
      ]
    };
  }

  if (cat.includes('kỹ thuật') || cat.includes('dự án') || cat.includes('technical')) {
    return {
      typeLabel: 'TÀI LIỆU ĐẶC TẢ KỸ THUẬT & KIẾN TRÚC HỆ THỐNG',
      subTitle: `Hệ Thống: ${cleanTitle} (Phiên bản kiến trúc v3)`,
      legalBasis: [
        'Căn cứ tiêu chuẩn kiến trúc phần mềm quốc tế ISO/IEC 25010 và Clean Architecture;',
        'Căn cứ quy chuẩn bảo mật an toàn thông tin OWASP Top 10 và mô hình Zero-Trust;',
        'Căn cứ chuẩn hóa cơ sở dữ liệu quan hệ MySQL mức chuẩn 3NF (Third Normal Form).'
      ],
      articles: [
        {
          num: 'Mục 1',
          heading: 'Tổng quan kiến trúc & Yêu cầu phi chức năng',
          content: `${desc} Hệ thống được thiết kế với tính sẵn sàng cao (High Availability), phân tách độc lập các phân tầng: Presentation Layer (Vite + React), Application Layer (Express RESTful API), và Database Storage (MySQL 3NF InnoDB Engine).`
        },
        {
          num: 'Mục 2',
          heading: 'Quy chuẩn mã nguồn & Luồng GitFlow',
          content: 'Mọi commit mã nguồn phải tuân thủ chuẩn Conventional Commits. Bắt buộc vượt qua bộ kiểm thử tự động (Unit Test / Integration Test) và đạt điểm phân tích tĩnh SonarQube trước khi được merge vào branch staging/production.'
        },
        {
          num: 'Mục 3',
          heading: 'Quy trình kiểm thử & Tối ưu hóa truy vấn CSDL',
          content: 'Áp dụng Composite Index cho các trường thường xuyên tìm kiếm và join (category_id, uploaded_by, created_at). Loại bỏ triệt để Full Table Scan, duy trì thời gian phản hồi API trung bình dưới 150ms.'
        },
        {
          num: 'Mục 4',
          heading: 'Sao lưu & Kế hoạch khôi phục thảm họa (DRP)',
          content: `Kế hoạch sao lưu tự động diễn ra lúc 02:00 sáng mỗi ngày. Chịu trách nhiệm kỹ thuật và vận hành máy chủ: Kỹ sư ${uploader} thuộc ${dept}.`
        }
      ]
    };
  }

  if (cat.includes('đào tạo') || cat.includes('hướng dẫn') || cat.includes('training')) {
    return {
      typeLabel: 'GIÁO TRÌNH ĐÀO TẠO & HƯỚNG DẪN NGHIỆP VỤ NỘI BỘ',
      subTitle: `Khóa học: ${cleanTitle}`,
      legalBasis: [
        'Căn cứ chiến lược phát triển nguồn nhân lực chất lượng cao của doanh nghiệp;',
        'Căn cứ chuẩn năng lực nghề nghiệp và khung đánh giá nhân sự định kỳ;',
        'Căn cứ quy trình đào tạo hội nhập (Onboarding) dành cho nhân sự công ty.'
      ],
      articles: [
        {
          num: 'Chương 1',
          heading: 'Mục tiêu học tập & Khung năng lực',
          content: `${desc} Giúp học viên nắm vững quy trình làm việc chuẩn mực, nâng cao tư duy giải quyết vấn đề và thích ứng nhanh với môi trường công nghệ cao.`
        },
        {
          num: 'Chương 2',
          heading: 'Nội dung cốt lõi & Hướng dẫn thực hành từng bước',
          content: 'Học viên được hướng dẫn chi tiết qua các ví dụ thực tế (case-study) của doanh nghiệp, thực hành thao tác trên môi trường Sandbox nội bộ và được kèm cặp bởi các chuyên gia giàu kinh nghiệm.'
        },
        {
          num: 'Chương 3',
          heading: 'Đánh giá kết quả & Tiêu chuẩn hoàn thành',
          content: 'Kết thúc khóa học, nhân viên thực hiện bài trắc nghiệm và báo cáo chuyên đề. Đạt từ 80% điểm trở lên sẽ được cấp chứng nhận hoàn thành khóa học nội bộ và cộng điểm đánh giá KPI.'
        },
        {
          num: 'Chương 4',
          heading: 'Tài liệu tham khảo & Giảng viên phụ trách',
          content: `Chủ nhiệm phụ trách biên soạn và hướng dẫn: ${uploader} (${dept}).`
        }
      ]
    };
  }

  // Biểu mẫu hành chính hoặc mặc định
  return {
    typeLabel: 'BIỂU MẪU HÀNH CHÍNH & QUY TRÌNH NỘI BỘ',
    subTitle: `Mẫu chuẩn: ${cleanTitle}`,
    legalBasis: [
      'Căn cứ quy chế văn thư và ban hành biểu mẫu hành chính thống nhất;',
      'Căn cứ quy trình số hóa và phê duyệt văn bản trực tuyến (Online Approval).'
    ],
    articles: [
      {
        num: 'Điều 1',
        heading: 'Mục đích sử dụng biểu mẫu',
        content: `${desc} Biểu mẫu này dùng làm căn cứ pháp lý để thực hiện các nghiệp vụ đề xuất, xét duyệt kinh phí, điều chuyển trang thiết bị hoặc xin nghỉ phép theo đúng phân cấp quản lý.`
      },
      {
        num: 'Điều 2',
        heading: 'Quy trình trình ký & Duyệt trực tuyến',
        content: 'Bước 1: Nhân viên lập đơn trên hệ thống -> Bước 2: Quản lý trực tiếp phê duyệt -> Bước 3: Phòng ban nghiệp vụ thụ lý -> Bước 4: Ban Giám Đốc xác nhận (nếu vượt hạn mức).'
      },
      {
        num: 'Điều 3',
        heading: 'Thời gian tiếp nhận & Giải quyết',
        content: 'Thời gian xử lý tối đa không quá 24 giờ làm việc kể từ khi nhận đủ thông tin hợp lệ trên cổng thông tin quản lý nội bộ.'
      },
      {
        num: 'Điều 4',
        heading: 'Đơn vị phát hành & Hỗ trợ',
        content: `Mẫu biểu được quản lý và cập nhật định kỳ bởi ${uploader} (${dept}).`
      }
    ]
  };
}

export default function DocumentReaderView({ 
  selectedDoc, 
  documents = [], 
  onSelectDoc, 
  onDownload 
}) {
  const [activeViewMode, setActiveViewMode] = useState('paper'); // 'paper' | 'preview'
  const [docSearch, setDocSearch] = useState('');
  const [showDocSelector, setShowDocSelector] = useState(false);

  // Chọn tài liệu hiển thị: ưu tiên selectedDoc, fallback documents[0]
  const currentDoc = useMemo(() => {
    if (selectedDoc && selectedDoc.title) return selectedDoc;
    if (documents && documents.length > 0) return documents[0];
    return {
      doc_id: 1,
      title: 'Noi_Quy_Lao_Dong_Cong_Ty_2025.pdf',
      description: 'Quy định giờ giấc làm việc, tác phong công sở, kỷ luật lao động và an toàn vệ sinh.',
      file_path: 'uploads/sample-noi-quy-lao-dong-2025.pdf',
      file_type: 'pdf',
      file_size: 2450.50,
      download_count: 154,
      category_name: 'Chính Sách & Nội Quy',
      uploader_name: 'Nguyen Van An',
      dept_name: 'Ban Giám Đốc',
      created_at: '2025-01-15 09:30:00'
    };
  }, [selectedDoc, documents]);

  // Sinh nội dung chi tiết theo nghiệp vụ
  const content = useMemo(() => generateDocumentContent(currentDoc), [currentDoc]);

  // Tìm kiếm trong danh sách tài liệu
  const filteredDocs = useMemo(() => {
    if (!docSearch.trim()) return documents;
    const q = docSearch.toLowerCase();
    return documents.filter(d => 
      (d.title || '').toLowerCase().includes(q) ||
      (d.category_name || '').toLowerCase().includes(q) ||
      (d.uploader_name || '').toLowerCase().includes(q)
    );
  }, [documents, docSearch]);

  // Tìm index của tài liệu hiện tại để hỗ trợ Previous / Next
  const currentIndex = useMemo(() => {
    return documents.findIndex(d => (d.doc_id || d.id) === (currentDoc.doc_id || currentDoc.id));
  }, [documents, currentDoc]);

  const handlePrevDoc = () => {
    if (currentIndex > 0 && onSelectDoc) {
      onSelectDoc(documents[currentIndex - 1]);
    }
  };

  const handleNextDoc = () => {
    if (currentIndex < documents.length - 1 && onSelectDoc) {
      onSelectDoc(documents[currentIndex + 1]);
    }
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload(currentDoc);
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Đang tải: ${currentDoc.title}`,
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDocId = `CORP-${String(currentDoc.doc_id || currentDoc.id || 1).padStart(4, '0')}`;
  const fileExt = (currentDoc.file_type || (currentDoc.title || '').split('.').pop() || 'pdf').toUpperCase();

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#f1f3f5] flex flex-col font-sans">
      {/* 1. TOP SUBHEADER VÀ THANH CÔNG CỤ ĐỌC TÀI LIỆU */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-2xs">
        {/* Left: Breadcrumbs & Document Quick Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowDocSelector(!showDocSelector)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition border border-slate-300/80 cursor-pointer shadow-2xs"
              title="Nhấn để chọn văn bản khác trong kho tài liệu"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Đổi Tài Liệu ({documents.length || 50} bản ghi)</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">
                #{currentIndex >= 0 ? currentIndex + 1 : 1}/{documents.length || 50}
              </span>
            </button>

            {/* Dropdown danh sách 50 tài liệu */}
            {showDocSelector && (
              <div className="absolute left-0 mt-2 w-96 max-h-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-slate-50 border-b border-slate-200">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm tài liệu theo tên, danh mục..."
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
                  {filteredDocs.map((item, idx) => {
                    const isSelected = (item.doc_id || item.id) === (currentDoc.doc_id || currentDoc.id);
                    return (
                      <div
                        key={item.doc_id || idx}
                        onClick={() => {
                          setShowDocSelector(false);
                          if (onSelectDoc) onSelectDoc(item);
                        }}
                        className={`p-2.5 px-3 rounded-lg hover:bg-slate-100 cursor-pointer transition text-xs flex items-start gap-2.5 ${
                          isSelected ? 'bg-blue-50/80 text-blue-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">
                          #{String(item.doc_id || idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{item.title}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-blue-600 font-semibold">{item.category_name}</span>
                            <span>•</span>
                            <span>{item.dept_name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Prev / Next */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={handlePrevDoc}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Văn bản trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextDoc}
              disabled={currentIndex >= documents.length - 1}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Văn bản tiếp theo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span className="text-slate-400 uppercase tracking-wider">{currentDoc.category_name}</span>
            <span>/</span>
            <span className="font-bold text-slate-800 truncate max-w-xs">{currentDoc.title}</span>
          </div>
        </div>

        {/* Right: View Mode Toggle & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Chuyển chế độ: Toàn văn chuẩn / Xem trước file */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveViewMode('paper')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeViewMode === 'paper' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Toàn Văn Văn Bản</span>
            </button>

            <button
              onClick={() => setActiveViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeViewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tệp Đính Kèm ({fileExt})</span>
            </button>
          </div>

          {/* In văn bản */}
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="In văn bản này"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>In</span>
          </button>

          {/* Nút Tải xuống */}
          <button
            onClick={handleDownloadClick}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Bản Gốc</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN SPLIT LAYOUT: KHUNG ĐỌC VĂN BẢN (TRÁI) + THÔNG TIN CHI TIẾT (PHẢI) */}
      <div className="flex-1 flex overflow-hidden">
        {/* KHUNG ĐỌC VĂN BẢN TRANG GIẤY CHÍNH (LEFT SHEET) */}
        <div className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto flex justify-center bg-[#f1f3f5]">
          {activeViewMode === 'paper' ? (
            /* CHẾ ĐỘ 1: VĂN BẢN QUY PHẠM DOANH NGHIỆP HOÀN CHỈNH */
            <div className="w-full max-w-4xl bg-white shadow-xl border border-slate-300 rounded-none sm:rounded-xl min-h-[960px] p-8 sm:p-14 lg:p-16 flex flex-col justify-between text-slate-800 leading-relaxed font-serif selection:bg-amber-100">
              <div>
                {/* Header Tiêu ngữ chuẩn công sở */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8 border-b-2 border-slate-800 font-sans text-xs mb-8">
                  <div className="text-left space-y-1">
                    <div className="font-extrabold uppercase tracking-wide text-slate-900">
                      CÔNG TY CỔ PHẦN CÔNG NGHỆ CORP_DOCS
                    </div>
                    <div className="text-slate-600 font-semibold uppercase">
                      {currentDoc.dept_name || 'Ban Giám Đốc Doanh Nghiệp'}
                    </div>
                    <div className="font-mono text-slate-500 text-[11px] pt-1">
                      Số: <strong className="text-slate-900">{formattedDocId}/QĐ-N4</strong>
                    </div>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <div className="font-extrabold uppercase tracking-wider text-slate-900">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </div>
                    <div className="font-semibold underline decoration-slate-400 underline-offset-4 text-slate-700">
                      Độc lập - Tự do - Hạnh phúc
                    </div>
                    <div className="text-[11px] text-slate-500 italic pt-1 font-serif">
                      Hà Nội, ngày 15 tháng 01 năm 2025
                    </div>
                  </div>
                </div>

                {/* Tiêu đề văn bản trang trọng */}
                <div className="text-center space-y-2 mb-10 font-sans">
                  <span className="inline-block text-[11px] font-extrabold tracking-widest uppercase bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    {content.typeLabel}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight max-w-2xl mx-auto leading-snug">
                    {currentDoc.title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                  </h1>
                  <p className="text-xs text-slate-500 italic">
                    {content.subTitle}
                  </p>
                </div>

                {/* Căn cứ pháp lý */}
                <div className="mb-8 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs italic font-serif space-y-1.5 text-slate-600">
                  {content.legalBasis.map((basis, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 font-sans">•</span>
                      <span>{basis}</span>
                    </div>
                  ))}
                </div>

                {/* Nội dung các Điều, Mục chi tiết */}
                <div className="space-y-6 text-sm font-serif">
                  {content.articles.map((art, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h3 className="font-sans font-bold text-xs uppercase tracking-wide text-slate-900 flex items-center gap-2">
                        <span className="text-blue-700 font-extrabold">{art.num}:</span>
                        <span>{art.heading}</span>
                      </h3>
                      <p className="text-slate-700 text-justify leading-relaxed indent-6">
                        {art.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần ký số & Đóng dấu điện tử */}
              <div className="pt-12 mt-12 border-t border-slate-200 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                  <div className="space-y-1 text-slate-500 text-[11px]">
                    <div className="font-bold uppercase text-slate-700">Nơi nhận:</div>
                    <div>- Ban Giám Đốc (để báo cáo);</div>
                    <div>- Các phòng ban liên quan (để thi hành);</div>
                    <div>- Lưu: Văn thư, CSDL Hệ thống RBAC.</div>
                  </div>

                  <div className="text-center sm:text-right space-y-2">
                    <div className="font-bold uppercase tracking-wider text-slate-900">
                      TM. BAN GIÁM ĐỐC / NGƯỜI ĐĂNG TẢI
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {currentDoc.uploader_name || 'Nguyen Van An'} ({currentDoc.dept_name || 'Ban Giám Đốc'})
                    </div>

                    {/* Dấu mộc điện tử */}
                    <div className="inline-block border-2 border-dashed border-emerald-600 bg-emerald-50 text-emerald-800 p-2.5 px-4 rounded-xl text-left shadow-xs">
                      <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ĐÃ PHÊ DUYỆT ĐIỆN TỬ</span>
                      </div>
                      <div className="text-[9px] text-emerald-700 font-mono mt-0.5">
                        Xác thực hệ thống BTL Nhóm 4 • SHA-256 Validated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CHẾ ĐỘ 2: XEM TRƯỚC TỆP GỐC (FILE PREVIEW) */
            <div className="w-full max-w-4xl bg-white shadow-xl border border-slate-300 rounded-xl min-h-[820px] p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">
                    {fileExt}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{currentDoc.title}</h2>
                    <p className="text-xs text-slate-500 font-mono">Đường dẫn: /{currentDoc.file_path}</p>
                  </div>
                </div>

                <a
                  href={`/${currentDoc.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở trong Tab Mới</span>
                </a>
              </div>

              {/* Iframe hoặc Trình đọc nhúng */}
              <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {fileExt === 'PDF' ? (
                  <iframe
                    src={`/${currentDoc.file_path}`}
                    title={currentDoc.title}
                    className="w-full h-[650px] border-none rounded"
                  />
                ) : (
                  <div className="max-w-md space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                      {fileExt === 'XLSX' || fileExt === 'XLS' ? (
                        <FileSpreadsheet className="w-8 h-8" />
                      ) : (
                        <FileText className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Tệp định dạng {fileExt}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Tệp tin này được lưu trữ an toàn trong thư mục máy chủ <code>uploads/</code>.
                        Bạn có thể tải trực tiếp về máy để mở bằng Microsoft Office hoặc Google Docs.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải Ngay ({Number(currentDoc.file_size || 0).toFixed(1)} KB)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. BẢNG THÔNG TIN CHI TIẾT & PHÂN QUYỀN RBAC (RIGHT ASIDE RAIL) */}
        <aside className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shrink-0 hidden lg:block shadow-sm">
          {/* Siêu dữ liệu từ bảng documents trong CSDL */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2 mb-4 font-mono">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>SIÊU DỮ LIỆU CSDL (3NF)</span>
            </h4>
            <div className="space-y-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mã doc_id</span>
                <span className="font-mono font-bold text-slate-900">#{currentDoc.doc_id || currentDoc.id || 1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Danh mục</span>
                <span className="font-semibold text-blue-700">{currentDoc.category_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phòng ban ban hành</span>
                <span className="font-semibold text-slate-800">{currentDoc.dept_name || 'Ban Giám Đốc'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Người đăng tải</span>
                <span className="font-semibold text-slate-800">{currentDoc.uploader_name || 'Hệ Thống'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dung lượng file</span>
                <span className="font-mono text-slate-700">
                  {Number(currentDoc.file_size || 0) >= 1024 
                    ? `${(Number(currentDoc.file_size || 0) / 1024).toFixed(2)} MB`
                    : `${Number(currentDoc.file_size || 0).toFixed(1)} KB`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Lượt tải về</span>
                <span className="font-bold text-emerald-600">
                  {Number(currentDoc.download_count || 0).toLocaleString()} lượt
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ngày lưu trữ</span>
                <span className="font-mono text-slate-700">
                  {currentDoc.created_at ? currentDoc.created_at.split(' ')[0] : '2025-01-15'}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Lịch sử phiên bản */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2 mb-3 font-mono">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>LỊCH SỬ PHIÊN BẢN</span>
            </h4>
            <div className="space-y-3.5 relative pl-4 border-l-2 border-slate-200">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100"></span>
                <div className="text-xs font-bold text-slate-900">V2.4 (Bản Hiện Hành)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Đã duyệt bởi {currentDoc.uploader_name || 'Ban Giám Đốc'} • Áp dụng 2025
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <div className="text-xs font-semibold text-slate-600">V1.0 (Bản Lưu Trữ Ban Đầu)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Khởi tạo dữ liệu hệ thống nội bộ
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Phân quyền truy cập RBAC */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2 mb-3 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PHÂN QUYỀN TRUY CẬP (RBAC)</span>
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-purple-50/60 border border-purple-100">
                <div>
                  <div className="font-bold text-purple-900">Quản Trị Viên (Admin)</div>
                  <div className="text-[10px] text-purple-600">Toàn quyền hệ thống</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Xem / Sửa / Xóa
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                <div>
                  <div className="font-bold text-blue-900">Tác Giả ({currentDoc.uploader_name})</div>
                  <div className="text-[10px] text-blue-600">Chủ sở hữu bản ghi</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Sửa / Xóa Của Mình
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Nhân Viên Khác (Staff)</div>
                  <div className="text-[10px] text-slate-500">Người dùng nội bộ</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Chỉ Đọc & Tải
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
