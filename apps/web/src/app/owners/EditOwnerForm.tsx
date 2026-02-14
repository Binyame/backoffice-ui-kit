'use client';

import { useState, useEffect } from 'react';
import { Owner, OwnerRole } from '@backoffice-kit/shared';
import { Button } from '@backoffice-kit/ui';
import styles from './AddOwnerForm.module.css';

interface EditOwnerFormProps {
  owner: Owner;
  onSubmit: (
    id: string,
    data: {
      name: string;
      email: string;
      ownershipPercentage: number;
      role: OwnerRole;
    }
  ) => Promise<void>;
  onCancel: () => void;
}

export function EditOwnerForm({ owner, onSubmit, onCancel }: EditOwnerFormProps) {
  const [formData, setFormData] = useState({
    name: owner.name,
    email: owner.email,
    ownershipPercentage: owner.ownershipPercentage.toString(),
    role: owner.role,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.ownershipPercentage) {
      newErrors.ownershipPercentage = 'Ownership percentage is required';
    } else {
      const percentage = parseFloat(formData.ownershipPercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.ownershipPercentage = 'Must be between 0 and 100';
      }
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(owner.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        ownershipPercentage: parseFloat(formData.ownershipPercentage),
        role: formData.role as OwnerRole,
      });
    } catch (error) {
      setGlobalError(
        error instanceof Error ? error.message : 'Failed to update owner'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !submitting) {
      onCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 id="dialog-title" className={styles.title}>
            Edit Owner
          </h2>
          <p className={styles.description}>
            Update information for {owner.name}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span id="name-error" className={styles.errorText}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className={styles.errorText}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Ownership Percentage Field */}
          <div className={styles.field}>
            <label htmlFor="ownership" className={styles.label}>
              Ownership Percentage <span className={styles.required}>*</span>
            </label>
            <input
              id="ownership"
              type="number"
              min="0"
              max="100"
              step="0.01"
              className={`${styles.input} ${
                errors.ownershipPercentage ? styles.error : ''
              }`}
              value={formData.ownershipPercentage}
              onChange={(e) =>
                handleChange('ownershipPercentage', e.target.value)
              }
              disabled={submitting}
              aria-invalid={!!errors.ownershipPercentage}
              aria-describedby={
                errors.ownershipPercentage ? 'ownership-error' : undefined
              }
            />
            {errors.ownershipPercentage && (
              <span id="ownership-error" className={styles.errorText}>
                {errors.ownershipPercentage}
              </span>
            )}
          </div>

          {/* Role Field */}
          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>
              Role <span className={styles.required}>*</span>
            </label>
            <select
              id="role"
              className={`${styles.select} ${errors.role ? styles.error : ''}`}
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? 'role-error' : undefined}
            >
              <option value="">Select a role...</option>
              <option value={OwnerRole.CEO}>CEO</option>
              <option value={OwnerRole.CFO}>CFO</option>
              <option value={OwnerRole.CTO}>CTO</option>
              <option value={OwnerRole.Shareholder}>Shareholder</option>
              <option value={OwnerRole.Advisor}>Advisor</option>
            </select>
            {errors.role && (
              <span id="role-error" className={styles.errorText}>
                {errors.role}
              </span>
            )}
          </div>

          {/* Global Error */}
          {globalError && (
            <div className={styles.globalError} role="alert">
              {globalError}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
