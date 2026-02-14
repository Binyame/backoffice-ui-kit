import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Select options
   */
  options: SelectOption[];

  /**
   * Selected value
   */
  value?: string;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Placeholder (shown as first disabled option)
   */
  placeholder?: string;

  /**
   * Select name attribute
   */
  name?: string;

  /**
   * Select ID
   */
  id?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

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
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;

  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;

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
}

/**
 * Select component for forms with accessible patterns
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      placeholder,
      name,
      id,
      disabled = false,
      required = false,
      error = false,
      onChange,
      onBlur,
      onFocus,
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
    },
    ref
  ) => {
    const classNames = [
      styles.select,
      error && styles.error,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={classNames}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid ?? error}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';
