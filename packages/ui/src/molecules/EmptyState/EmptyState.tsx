import React from 'react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  /**
   * Title text
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Icon or illustration (emoji or custom element)
   */
  icon?: string | React.ReactNode;

  /**
   * Action slot (typically a Button)
   */
  action?: React.ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * EmptyState molecule for no-data scenarios
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📭',
  action,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {typeof icon === 'string' ? (
            <span className={styles.emoji}>{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}

      <h3 className={styles.title}>{title}</h3>

      {description && <p className={styles.description}>{description}</p>}

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
