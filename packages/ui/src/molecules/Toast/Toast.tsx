import React from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  /**
   * Toast message
   */
  message: string;

  /**
   * Toast variant
   */
  variant?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Whether the toast is visible
   */
  isVisible: boolean;

  /**
   * Close handler
   */
  onClose?: () => void;

  /**
   * Auto-hide duration in ms (0 = no auto-hide)
   */
  duration?: number;
}

/**
 * Toast molecule for notifications and feedback messages
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  isVisible,
  onClose,
  duration = 3000,
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  };

  return (
    <div
      className={`${styles.toast} ${styles[`variant-${variant}`]}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        {icons[variant]}
      </span>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

Toast.displayName = 'Toast';
