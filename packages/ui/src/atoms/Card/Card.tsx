import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Card padding size
   */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Whether to show border
   */
  bordered?: boolean;

  /**
   * Whether to show shadow
   */
  shadow?: boolean | 'small' | 'medium' | 'large';

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Click handler (makes card interactive)
   */
  onClick?: () => void;
}

/**
 * Card component for content containers
 */
export const Card: React.FC<CardProps> = ({
  children,
  padding = 'medium',
  bordered = true,
  shadow = false,
  className,
  onClick,
}) => {
  const classNames = [
    styles.card,
    styles[`padding-${padding}`],
    bordered && styles.bordered,
    shadow && styles[`shadow-${shadow === true ? 'medium' : shadow}`],
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={classNames}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

Card.displayName = 'Card';
