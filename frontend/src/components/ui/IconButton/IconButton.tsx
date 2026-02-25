import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'ghost' | 'outline' | 'primary';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to render (any ReactNode, ideally an SVG icon) */
  icon: ReactNode;
  /** Accessible label — required for screen readers */
  'aria-label': string;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Size of the button */
  size?: IconButtonSize;
}

/**
 * Square button designed to hold a single icon.
 * Always provide an `aria-label` for accessibility.
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className,
  ...rest
}: IconButtonProps) {
  const classes = [
    styles.iconButton,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {icon}
    </button>
  );
}
