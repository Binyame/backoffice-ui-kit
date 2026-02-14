import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  /**
   * Badge content
   */
  children: React.ReactNode;

  /**
   * Badge variant/color scheme
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

  /**
   * Badge size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Badge component for status indicators and labels
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  className,
}) => {
  const classNames = [
    styles.badge,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames}>{children}</span>;
};

Badge.displayName = 'Badge';
