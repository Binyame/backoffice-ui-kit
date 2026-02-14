import React, { useEffect, useRef } from 'react';
import { Button } from '../../atoms/Button';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Dialog message/content
   */
  message: string | React.ReactNode;

  /**
   * Confirm button text
   */
  confirmText?: string;

  /**
   * Cancel button text
   */
  cancelText?: string;

  /**
   * Confirm button variant
   */
  confirmVariant?: 'primary' | 'danger';

  /**
   * Confirm handler
   */
  onConfirm: () => void;

  /**
   * Cancel handler
   */
  onCancel: () => void;

  /**
   * Loading state (disables buttons)
   */
  loading?: boolean;
}

/**
 * ConfirmDialog molecule for confirmation prompts
 * Implements accessible dialog pattern with focus management
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <div className={styles.header}>
          <h2 id="dialog-title" className={styles.title}>
            {title}
          </h2>
        </div>

        <div id="dialog-message" className={styles.content}>
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className={styles.actions}>
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';
