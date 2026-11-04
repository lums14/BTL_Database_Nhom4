import React, { useState, useEffect } from 'react';
import Navbar from './components/corp/Navbar';
import LoginView from './components/corp/LoginView';
import RepositoryView from './components/corp/RepositoryView';
import DocumentReaderView from './components/corp/DocumentReaderView';
import IngestionPipelineView from './components/corp/IngestionPipelineView';
import AdminView from './components/corp/AdminView';
import DashboardView from './components/corp/DashboardView';
import ComplianceView from './components/corp/ComplianceView';
import AnalyticsView from './components/AnalyticsView';

import { 
  fetchCategories, 
  fetchDepartments, 
  fetchUsers, 
  fetchDocuments,
  recordDownloadApi,
  FALLBACK_USERS
} from './services/api';

import Swal from 'sweetalert2';

export default function App() {
  const [activeTab, setActiveTab] = useState('repository'); // 'login' | 'dashboard' | 'repository' | 'reader' | 'ingestion' | 'analytics' | 'compliance' | 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Current logged in user (Admin Nguyen Van An mặc định)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('docucorp_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return FALLBACK_USERS[0];
  });

  const [selectedDoc, setSelectedDoc] = useState(null);

  // Master Data (Categories, Departments, Users, 50 Documents)
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  const formatDocForReader = (docItem) => {
    if (!docItem) return null;
    return {
      ...docItem,
      doc_id: docItem.doc_id || docItem.id,
      title: docItem.title,
      articleTitle: (docItem.title || '').replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      code: `CORP-${String(docItem.doc_id || docItem.id || '0012').padStart(4, '0')}`,
      classification: 'Bảo Mật Nội Bộ (RBAC)',
      storageNode: 'AWS-AP-SOUTHEAST-01',
      retention: '10 Năm',
      file_path: docItem.file_path,
      uploader_name: docItem.uploader_name || 'Hệ Thống',
      uploaded_by: docItem.uploaded_by,
      dept_name: docItem.dept_name || 'Phòng Nội Bộ',
      category_name: docItem.category_name,
      versions: [
        { version: 'V2.4 (Hiện Hành)', author: docItem.uploader_name || 'Nguyen Van An', time: 'Hôm nay, 14:20', active: true },
        { version: 'V2.0 (Bản Phát Hành)', author: 'Quản Trị Viên', time: '01 Tháng 1, 2025', active: false },
      ],
      accessList: [
        { initials: 'AD', name: 'Quản Trị Viên (Admin)', role: 'HỆ THỐNG', permission: 'Toàn Quyền' },
        { initials: 'TG', name: docItem.uploader_name || 'Tác Giả', role: 'CHỦ SỞ HỮU', permission: 'Biên Tập & Xóa' },
        { initials: 'NV', name: 'Toàn Thể Nhân Viên (Staff)', role: 'THÀNH VIÊN', permission: 'Chỉ Đọc & Tải' },
      ]
    };
  };

  const loadData = async () => {
    const [cats, depts, usrs, docs] = await Promise.all([
      fetchCategories(),
      fetchDepartments(),
      fetchUsers(),
      fetchDocuments()
    ]);
    setCategories(cats);
    setDepartments(depts);
    setUsers(usrs);
    setDocuments(docs);
    if (docs && docs.length > 0) {
      setSelectedDoc(prev => prev || formatDocForReader(docs[0]));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectDocFromRepo = (docItem) => {
    setSelectedDoc(formatDocForReader(docItem));
    setActiveTab('reader');
  };

  const handleDownload = async (doc) => {
    if (doc.doc_id) {
      recordDownloadApi(doc.doc_id).catch(() => null);
    }

    const a = document.createElement('a');
    a.href = doc.file_path ? `/${doc.file_path}` : `/uploads/sample-noi-quy-lao-dong-2025.pdf`;
    a.download = doc.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Đang tải xuống: ${doc.title}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('docucorp_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('login');
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Đã đăng xuất khỏi hệ thống',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleSwitchAccount = (newAccount) => {
    localStorage.setItem('docucorp_user', JSON.stringify(newAccount));
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Đã đổi sang: ${newAccount.full_name}`,
      text: `Vai trò: ${newAccount.role_name} • ${newAccount.dept_name}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  // If in login view or unauthenticated
  if (activeTab === 'login' || !isAuthenticated || !currentUser) {
    return (
      <LoginView
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          setIsAuthenticated(true);
          setActiveTab('repository');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-black selection:text-white">
      {/* Top Minimalist Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchAccount={handleSwitchAccount}
      />

      {/* Main Screen Router */}
      <main className="flex-1 w-full bg-white">
        {activeTab === 'dashboard' && (
          <DashboardView onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'repository' && (
          <RepositoryView
            documents={documents}
            categories={categories}
            departments={departments}
            currentUser={currentUser}
            onSelectDoc={handleSelectDocFromRepo}
            onRefreshDocs={loadData}
          />
        )}

        {activeTab === 'reader' && (
          <DocumentReaderView
            selectedDoc={selectedDoc}
            documents={documents}
            onSelectDoc={handleSelectDocFromRepo}
            onDownload={handleDownload}
          />
        )}

        {activeTab === 'ingestion' && (
          <IngestionPipelineView
            categories={categories}
            users={users}
            currentUser={currentUser}
            onUploadSuccess={async () => {
              await loadData();
              setActiveTab('repository');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="w-full max-w-7xl mx-auto px-8 py-10">
            <AnalyticsView
              categories={categories}
              departments={departments}
              documents={documents}
              currentUser={currentUser}
            />
          </div>
        )}

        {activeTab === 'compliance' && (
          <ComplianceView />
        )}

        {activeTab === 'admin' && (
          <AdminView users={users} />
        )}
      </main>

      {/* Footer Minimal Info */}
      <footer className="border-t border-slate-100 py-6 px-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 font-mono uppercase tracking-widest">
        <span>BTL_NHÓM 4 • QUẢN LÝ TÀI LIỆU NỘI BỘ (RBAC PRO)</span>
        <span>DATABASE: DOCUMENT_MANAGEMENT • 10 USERS • 50 DOCUMENTS</span>
      </footer>
    </div>
  );
}
