import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const TITLES: Record<string, string> = {
  '/': 'Overview',
  '/equipment': 'Equipment',
  '/spares': 'Spares',
  '/cases': 'Cases',
  '/simulator': 'What-if Simulator',
  '/accuracy': 'Forecast Accuracy',
  '/history': 'History',
  '/data': 'Data',
  '/settings': 'Settings',
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const pageTitle = (() => {
    if (location.pathname.startsWith('/equipment/')) return 'Engineering Case File';
    return TITLES[location.pathname] ?? 'SETU';
  })();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/equipment?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className="flex items-center justify-between px-5 h-12 shrink-0"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: 'var(--text-muted)' }}>SETU</span>
        <span style={{ color: 'var(--border-strong)' }}>/</span>
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {pageTitle}
        </span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative w-64">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search assets, cases, parts…"
          className="w-full text-xs pl-8 pr-3 py-1.5 rounded outline-none transition-colors"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = 'var(--green-700)')
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = 'var(--border-default)')
          }
        />
      </form>

      {/* Right side */}
      <div className="flex items-center gap-3 text-xs">
        <span
          className="px-2 py-1 rounded font-mono font-semibold"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
        >
          SYNTHETIC DATASET
        </span>
        <div
          className="flex items-center gap-2 pl-3"
          style={{ borderLeft: '1px solid var(--border-subtle)' }}
        >
          <div
            className="size-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <User className="size-3.5" style={{ color: 'var(--green-400)' }} />
          </div>
          <span style={{ color: 'var(--text-secondary)' }}>Chief Logistics Officer</span>
        </div>
      </div>
    </header>
  );
};
