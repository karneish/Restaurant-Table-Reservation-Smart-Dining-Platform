import { forwardRef, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldProps {
  label?: string;
  hint?: string;
  icon?: ReactNode;
  children: ReactNode;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

export function Field({ label, hint, icon, children, labelProps }: FieldProps) {
  return (
    <label className="block" {...labelProps}>
      {label && (
        <span className="block text-sm font-semibold text-forest-800 mb-1.5">
          {icon && <span className="inline-flex items-center gap-1.5">{icon}{label}</span>}
          {!icon && label}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-forest-400">{hint}</span>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...rest }, ref) => (
    <input ref={ref} className={`input-field ${className}`} {...rest} />
  ),
);
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...rest }, ref) => (
    <select ref={ref} className={`select-field ${className}`} {...rest}>
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...rest }, ref) => (
    <textarea ref={ref} className={`input-field resize-none ${className}`} {...rest} />
  ),
);
Textarea.displayName = 'Textarea';
