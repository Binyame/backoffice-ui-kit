import React from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  /**
   * Input type
   */
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';

  /**
   * Input value
   */
  value?: string;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Input name attribute
   */
  name?: string;

  /**
   * Input ID
   */
  id?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Read-only state
   */
  readOnly?: boolean;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Change handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * KeyDown handler
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;

  /**
   * ARIA described by (for error messages)
   */
  'aria-describedby'?: string;

  /**
   * ARIA invalid state
   */
  'aria-invalid'?: boolean;

  /**
   * Autocomplete attribute
   */
  autoComplete?: string;

  /**
   * Min value (for number type)
   */
  min?: number;

  /**
   * Max value (for number type)
   */
  max?: number;

  /**
   * Step value (for number type)
   */
  step?: number;
}

/**
 * TextInput component for forms with accessible patterns
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      type = 'text',
      value,
      defaultValue,
      placeholder,
      name,
      id,
      disabled = false,
      readOnly = false,
      required = false,
      error = false,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      autoComplete,
      min,
      max,
      step,
    },
    ref
  ) => {
    const classNames = [
      styles.input,
      error && styles.error,
      disabled && styles.disabled,
      readOnly && styles.readOnly,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <input
        ref={ref}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        id={id}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className={classNames}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid ?? error}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
