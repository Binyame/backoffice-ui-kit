import React from 'react';
import { Button } from '../../atoms/Button';
import styles from './SaveBar.module.css';

export interface SaveBarProps {
  /**
   * Whether there are unsaved changes
   */
  hasChanges: boolean;

  /**
   * Save handler
   */
  onSave: () => void;

  /**
   * Discard/reset handler
   */
  onDiscard: () => void;

  /**
   * Loading state (save in progress)
   */
  loading?: boolean;

  /**
   * Save button text
   */
  saveText?: string;

  /**
   * Discard button text
   */
  discardText?: string;

  /**
   * Message to display
   */
  message?: string;

  /**
   * Position of the bar
   */
  position?: 'top' | 'bottom';

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * SaveBar organism - sticky bar for unsaved changes with save/discard actions
 */
export const SaveBar: React.FC<SaveBarProps> = ({
  hasChanges,
  onSave,
  onDiscard,
  loading = false,
  saveText = 'Save',
  discardText = 'Discard',
  message = 'You have unsaved changes',
  position = 'bottom',
  className,
}) => {
  if (!hasChanges) return null;

  return (
    <div
      className={`${styles.container} ${styles[position]} ${className || ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        <div className={styles.message}>
          <span className={styles.icon}>⚠️</span>
          <span>{message}</span>
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="medium"
            onClick={onDiscard}
            disabled={loading}
            aria-label="Discard changes"
          >
            {discardText}
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={onSave}
            loading={loading}
            disabled={loading}
            aria-label="Save changes"
          >
            {saveText}
          </Button>
        </div>
      </div>
    </div>
  );
};
