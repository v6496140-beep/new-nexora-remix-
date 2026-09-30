import React, { useId } from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

// 1. INPUT
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FormFieldProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
              error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300'
            } ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''} ${className}`}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-slate-400 pointer-events-none">{rightIcon}</span>}
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// 2. TEXTAREA
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldProps {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = '', id, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// 3. SELECT
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FormFieldProps {
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, children, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// 4. CHECKBOX
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-2.5 text-left">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`w-4 h-4 mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 cursor-pointer disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label htmlFor={checkboxId} className="text-xs font-medium text-slate-800 cursor-pointer select-none">
                {label}
              </label>
            )}
            {description && <p className="text-[11px] text-slate-500">{description}</p>}
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// 5. RADIO
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    return (
      <div className="flex items-start gap-2.5 text-left">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={`w-4 h-4 mt-0.5 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 cursor-pointer disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label htmlFor={radioId} className="text-xs font-medium text-slate-800 cursor-pointer select-none">
                {label}
              </label>
            )}
            {description && <p className="text-[11px] text-slate-500">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

// 6. SWITCH
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <div className="flex items-center justify-between gap-4 text-left">
      {(label || description) && (
        <div>
          {label && <p className="text-xs font-semibold text-slate-800">{label}</p>}
          {description && <p className="text-[11px] text-slate-500">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${checked ? 'bg-slate-900' : 'bg-slate-300'}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
