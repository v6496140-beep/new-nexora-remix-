import React from 'react';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'small'
  | 'caption'
  | 'label';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  display: 'text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-900',
  h1: 'text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900',
  h2: 'text-xl sm:text-2xl font-bold tracking-tight text-slate-900',
  h3: 'text-lg sm:text-xl font-bold text-slate-900',
  h4: 'text-base font-semibold text-slate-900',
  body: 'text-sm sm:text-base text-slate-700 leading-relaxed',
  small: 'text-xs sm:text-sm text-slate-600',
  caption: 'text-xs text-slate-500 font-medium tracking-wide',
  label: 'text-xs font-bold uppercase tracking-wider text-slate-500'
};

const defaultTag: Record<TypographyVariant, React.ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  small: 'p',
  caption: 'span',
  label: 'label'
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  className = '',
  children,
  ...props
}) => {
  const Component = as || defaultTag[variant];
  return (
    <Component className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
