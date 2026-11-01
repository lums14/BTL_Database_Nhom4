import React from 'react';
import { 
  FolderTree, 
  PieChart, 
  Code2, 
  HardDrive, 
  RotateCcw, 
  ShieldCheck, 
  User,
  Layers
} from 'lucide-react';

const CATEGORY_DOT_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-teal-500'
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  categories,
  activeCategory,
  onSelectCategory,
  onClearCategory,
  totalDocs,
  totalStorageMB,
  currentRole
}) {
  const percentUsed = Math.min(100, Math.round((parseFloat(totalStorageMB || 0) / 500) * 100));

  return (
    <aside className="w-[280px] bg-slate-900 text-slate-300 flex flex-col fixed top-0 bottom-0 left-0 z-40 border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight leading-tight">DocuCorp</h1>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Workspace Pro
          </div>
        </div>
      </div>

      {/* Navigations & Categories */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
        {/* Workspace Menu */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Không Gian Làm Việc
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'hover:bg-white/5 hover:text-white text-slate-300'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span className="flex-1 text-left">Tất cả tài liệu</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {totalDocs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'hover:bg-white/5 hover:text-white text-slate-300'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span className="flex-1 text-left">Báo cáo & Thống kê</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SQL Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('api-docs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'api-docs'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'hover:bg-white/5 hover:text-white text-slate-300'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="flex-1 text-left">Tài liệu REST API</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                CSDL
              </span>
            </button>
          </nav>
        </div>

        {/* 8 Quick Category Filters */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Danh Mục Tài Liệu (8)</span>
            {activeCategory && (
              <button
                onClick={onClearCategory}
                className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1 transition"
                title="Bỏ lọc danh mục"
              >
                <RotateCcw className="w-3 h-3" /> Bỏ lọc
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {categories.map((cat, idx) => {
              const isActive = activeCategory === cat.category_name;
              const dotColor = CATEGORY_DOT_COLORS[idx % CATEGORY_DOT_COLORS.length];
              return (
                <button
                  key={cat.category_id}
                  onClick={() => onSelectCategory(cat.category_name)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                  <span className="flex-1 text-left truncate">{cat.category_name}</span>
                  <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-white/5">
                    {cat.doc_count || 4}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Storage & Current User Profile */}
      <div className="p-4 border-t border-white/10 bg-slate-850/60 space-y-3.5">
        {/* Storage Widget */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" /> Dung lượng Cloud
            </span>
            <span className="text-blue-400 font-bold">{percentUsed}%</span>
          </div>
          <div className="text-[11px] text-slate-400 mb-2">
            {totalStorageMB} MB / 500 MB
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 shrink-0">
            NA
          </div>
          <div className="overflow-hidden">
            <div className="text-white font-semibold text-xs truncate">Nguyễn Văn An</div>
            <div className="flex items-center gap-1 text-[10px] text-sky-400 font-medium mt-0.5">
              {currentRole === 'Admin' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  <span>Quản trị viên (Admin)</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400">Nhân viên (Staff)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
