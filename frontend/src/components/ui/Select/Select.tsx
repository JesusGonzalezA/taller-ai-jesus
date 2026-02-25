import type { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label text shown above the select */
  label?: string;
  /** Array of options to render */
  options: SelectOption[];
  /** Placeholder option shown when no value is selected */
  placeholder?: string;
  /** Error message shown below the select */
  error?: string;
  /** Helper text shown below the select (hidden when error is present) */
  helperText?: string;
}

/**
 * Native select dropdown with optional label, error, and helper text.
 */
export function Select({
  label,
  options,
  placeholder,
  error,
  helperText,
  disabled = false,
  id,
  className,
  ...rest
}: SelectProps) {
  const selectId = id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`${styles.wrapper} ${disabled ? styles.wrapperDisabled : ''}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          className={[styles.select, error ? styles.selectError : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && (
        <span id={`${selectId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${selectId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}
