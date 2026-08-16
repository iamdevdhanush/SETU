import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-2 select-none">
      <Link to="/" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
        <Home className="size-3 text-slate-500" />
        <span>Workstation</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="size-3 text-slate-600" />
          {item.href ? (
            <Link to={item.href} className="hover:text-slate-200 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
