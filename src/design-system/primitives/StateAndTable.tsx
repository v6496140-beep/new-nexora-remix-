import React from 'react';
import { AlertCircle, Inbox, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

// 1. EMPTY STATE
export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-sm text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};

// 2. ERROR STATE
export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry
}) => {
  return (
    <div className="p-6 sm:p-8 text-center rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col items-center justify-center space-y-3 text-rose-900">
      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

// 3. LOADING STATE
export interface LoadingStateProps {
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ label = 'Loading salon data...' }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

// 4. TABLE
export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs bg-white text-left">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-slate-50/80 transition-colors">
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  className={`py-3.5 px-4 font-medium text-slate-700 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.cell
                    ? col.cell(item)
                    : col.accessorKey
                    ? String(item[col.accessorKey] ?? '')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 5. PAGINATION
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-2 py-3 text-xs text-slate-600">
      <span>
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
