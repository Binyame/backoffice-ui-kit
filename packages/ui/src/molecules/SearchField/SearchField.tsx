import React, { useState } from 'react';
import { TextInput } from '../../atoms/TextInput';
import { Button } from '../../atoms/Button';
import styles from './SearchField.module.css';

export interface SearchFieldProps {
  /**
   * Search value (controlled)
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
   * Search handler (called on button click or Enter key)
   */
  onSearch?: (query: string) => void;

  /**
   * Change handler (called on every keystroke)
   */
  onChange?: (query: string) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * SearchField molecule combining TextInput with a search button
 */
export const SearchField: React.FC<SearchFieldProps> = ({
  value: controlledValue,
  defaultValue,
  placeholder = 'Search...',
  onSearch,
  onChange,
  disabled = false,
  loading = false,
  className,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <TextInput
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={styles.input}
        aria-label="Search"
      />
      <Button
        onClick={handleSearch}
        disabled={disabled}
        loading={loading}
        variant="primary"
        aria-label="Search"
      >
        Search
      </Button>
    </div>
  );
};

SearchField.displayName = 'SearchField';
