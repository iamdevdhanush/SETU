import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutList,
  Truck,
  Package,
  FileText,
  SlidersHorizontal,
  BarChart3,
  Clock,
  Database,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { casesService, sparesService } from '@/lib/data/serviceLayer';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  end?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pendingCount = casesService.getPending().length;
  const shortageCount = sparesService.getShortages().length;

  const sections: NavSection[] = [
    {
      title: 'Workspace',
      items: [
        { to: '/', label: 'Overview', icon: LayoutList, end: true },
        { to: '/equipment', label: 'Equipment', icon: Truck },
        { to: '/spares', label: 'Spares', icon: Package, badge: shortageCount },
        { to: '/cases', label: 'Cases', icon: FileText, badge: pendingCount },
      ],
    },
    {
      title: 'Planning',
      items: [
        { to: '/simulator', label: 'What-if Simulator', icon: SlidersHorizontal },
      ],
    },
    {
      title: 'Analysis',
      items: [
        { to: '/accuracy', label: 'Forecast Accuracy', icon: BarChart3 },
        { to: '/history', label: 'History', icon: Clock },
      ],
    },
    {
      title: 'System',
      items: [
        { to: '/data', label: 'Data', icon: Database },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className="flex flex-col shrink-0 select-none"
      style={{
        width: 220,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-4 h-12 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="flex items-center justify-center size-7 rounded font-mono font-bold text-xs shrink-0"
          style={{
            background: 'var(--green-800)',
            color: 'var(--green-400)',
            border: '1px solid var(--green-700)',
          }}
        >
          S
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            SETU
          </span>
          <span className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Predictive Sustainment
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <div
              className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              {section.title}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between mx-2 px-2.5 py-1.5 rounded text-[13px] font-medium transition-colors',
                    isActive
                      ? 'text-[color:var(--green-400)]'
                      : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--bg-elevated)]',
                  )
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'var(--green-900)', color: 'var(--green-400)' }
                    : {}
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="size-[15px] shrink-0 opacity-80" />
                  {item.label}
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: 'var(--status-critical-bg)',
                      color: 'var(--status-critical)',
                      border: '1px solid var(--status-critical-border)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer context */}
      <div
        className="px-4 py-2.5 text-[11px] font-mono"
        style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
      >
        DEMO WORKSHOP · SYNTHETIC DATA
      </div>
    </aside>
  );
};
