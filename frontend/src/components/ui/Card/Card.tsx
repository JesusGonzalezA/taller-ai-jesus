import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content inside the card */
  children: ReactNode;
  /** Internal padding */
  padding?: CardPadding;
  /** Drop shadow intensity */
  shadow?: CardShadow;
}

/**
 * Generic surface container. Use to group related content with an optional border and shadow.
 */
export function Card({ children, padding = 'md', shadow = 'sm', className, ...rest }: CardProps) {
  const paddingClass = {
    none: '',
    sm: styles.paddingSm,
    md: styles.paddingMd,
    lg: styles.paddingLg,
  }[padding];

  const shadowClass = {
    none: styles.shadowNone,
    sm: styles.shadowSm,
    md: styles.shadowMd,
    lg: styles.shadowLg,
  }[shadow];

  const classes = [styles.card, paddingClass, shadowClass, className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
