import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Content of the badge */
  children: ReactNode;
  /** Color variant indicating semantic meaning */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
}

/**
 * Inline label used to communicate status, category, or metadata at a glance.
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...rest
}: BadgeProps) {
  const classes = [styles.badge, styles[variant], styles[size], className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
