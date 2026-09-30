import React from 'react';

// 1. BADGE
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs'
  };

  const variantClasses = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    brand: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    outline: 'bg-transparent text-slate-700 border border-slate-300'
  };

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// 2. CARD
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  hoverEffect = false,
  className = '',
  children,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300 transition-all' : ''
      } ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 3. AVATAR
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base font-bold'
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-slate-200 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
};

// 4. SKELETON
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded-md ${width} ${height} ${className}`}
      {...props}
    />
  );
};

// 5. ALERT
export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  className = ''
}) => {
  const variantStyles = {
    info: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
    success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900',
    danger: 'bg-rose-50/80 border-rose-200 text-rose-900'
  };

  return (
    <div className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 text-xs text-left ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      <div className="space-y-0.5">
        {title && <p className="font-bold text-xs">{title}</p>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
