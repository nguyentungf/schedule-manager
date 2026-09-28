import React from 'react';
import { DashboardTab } from '../../types/state';
import { LayoutDashboard, CalendarDays, Network, Calculator, BrainCircuit, Database } from 'lucide-react';

interface TabNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  urgentDeadlineCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  urgentDeadlineCount
}) => {
  const tabs = [
    {
      id: 'dashboard' as DashboardTab,
      label: 'Tổng quan & Deadline',
      icon: LayoutDashboard,
      badge: urgentDeadlineCount > 0 ? urgentDeadlineCount : null,
      badgeColor: 'bg-red-600 text-white animate-pulse'
    },
    {
      id: 'schedule' as DashboardTab,
      label: 'Thời Khóa Biểu (TKB)',
      icon: CalendarDays,
      badge: 'Mới',
      badgeColor: 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'curriculum' as DashboardTab,
      label: 'Bản đồ CTĐT & Tiên quyết',
      icon: Network,
      badge: '9 Ngành',
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/30'
    },
    {
      id: 'grade-calculator' as DashboardTab,
      label: 'Máy tính Điểm CK & CPA',
      icon: Calculator,
      badge: null
    },
    {
      id: 'planner' as DashboardTab,
      label: 'Dự đoán GPA & Gợi ý Môn',
      icon: BrainCircuit,
      badge: 'OLS ML',
      badgeColor: 'bg-blue-600/30 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'sis' as DashboardTab,
      label: 'Cổng Dữ liệu SIS HUST',
      icon: Database,
      badge: null
    }
  ];

  return (
    <nav className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-2 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all relative ${
                isActive
                  ? 'bg-red-50 dark:bg-red-600/15 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    tab.badgeColor || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-[-9px] left-1/2 transform -translate-x-1/2 w-8 h-[2px] bg-red-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
