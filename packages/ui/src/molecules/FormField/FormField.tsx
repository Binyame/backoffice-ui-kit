import React from 'react';
import { TextInput, TextInputProps } from '../../atoms/TextInput';
import { Select, SelectProps } from '../../atoms/Select';
import styles from './FormField.module.css';

export interface FormFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field ID (required for accessibility)
   */
  id: string;

  /**
   * Type of input field
   */
  fieldType?: 'text' | 'select';

  /**
   * Props for TextInput (when fieldType='text')
   */
  inputProps?: Omit<TextInputProps, 'id'>;

  /**
   * Props for Select (when fieldType='select')
   */
  selectProps?: Omit<SelectProps, 'id'>;

  /**
   * Helper text shown below the input
   */
  helperText?: string;

  /**
   * Error message (overrides helperText when present)
   */
  errorText?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Additional CSS class for container
   */
  className?: string;
}

/**
 * FormField molecule combining label, input/select, and error/helper text
 * Following accessible form patterns with proper ARIA attributes
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  fieldType = 'text',
  inputProps,
  selectProps,
  helperText,
  errorText,
  required = false,
  className,
}) => {
  const hasError = !!errorText;
  const helperId = `${id}-helper`;
  const message = errorText || helperText;

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-label="required">*</span>}
      </label>

      {fieldType === 'select' && selectProps ? (
        <Select
          {...selectProps}
          id={id}
          required={required}
          error={hasError}
          aria-describedby={message ? helperId : undefined}
          aria-invalid={hasError}
        />
      ) : (
        <TextInput
          {...inputProps}
          id={id}
          required={required}
          error={hasError}
          aria-describedby={message ? helperId : undefined}
          aria-invalid={hasError}
        />
      )}

      {message && (
        <div
          id={helperId}
          className={hasError ? styles.errorText : styles.helperText}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </div>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
