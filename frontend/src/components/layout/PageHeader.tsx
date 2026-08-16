import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  statusBadge
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1a2636] mb-6">
      <div className="flex flex-col">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-sans">
            {title}
          </h1>
          {statusBadge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
