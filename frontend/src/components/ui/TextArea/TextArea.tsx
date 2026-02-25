import type { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text shown above the textarea */
  label?: string;
  /** Error message shown below the textarea */
  error?: string;
  /** Helper text shown below the textarea (hidden when error is present) */
  helperText?: string;
}

/**
 * Multi-line text input with optional label, error, and helper text.
 */
export function TextArea({
  label,
  error,
  helperText,
  disabled = false,
  rows = 4,
  id,
  className,
  ...rest
}: TextAreaProps) {
  const textareaId =
    id ?? (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`${styles.wrapper} ${disabled ? styles.wrapperDisabled : ''}`}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        className={[styles.textarea, error ? styles.textareaError : '', className ?? '']
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error && (
        <span id={`${textareaId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${textareaId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}
