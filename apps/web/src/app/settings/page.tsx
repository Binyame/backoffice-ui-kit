'use client';

import { useState, useEffect } from 'react';
import {
  FormField,
  Card,
  SaveBar,
  Button,
  Badge,
  Toast,
} from '@backoffice-kit/ui';
import { PageHeader } from '@/components/PageHeader';

interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  taxId: string;
  fiscalYearEnd: string;
  currency: string;
  timezone: string;
  emailNotifications: string;
  auditLogRetention: string;
}

const initialSettings: Settings = {
  companyName: 'Acme Corporation',
  companyEmail: 'contact@acme.com',
  companyPhone: '+1 (555) 123-4567',
  companyAddress: '123 Business St, Suite 100, San Francisco, CA 94105',
  taxId: '12-3456789',
  fiscalYearEnd: '12',
  currency: 'USD',
  timezone: 'America/Los_Angeles',
  emailNotifications: 'enabled',
  auditLogRetention: '90',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleFieldChange = (field: keyof Settings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSavedSettings(settings);
      showToast('Settings saved successfully', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings(savedSettings);
    showToast('Changes discarded', 'success');
  };

  const showToast = (message: string, variant: 'success' | 'error') => {
    setToast({ message, variant });
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure application settings and preferences"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Company Information */}
        <Card padding="large" shadow="medium">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Company Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField
              label="Company Name"
              id="companyName"
              required
              inputProps={{
                value: settings.companyName,
                onChange: (e) => handleFieldChange('companyName', e.target.value),
                placeholder: 'Enter company name',
              }}
              helperText="Legal name of your organization"
            />
            <FormField
              label="Company Email"
              id="companyEmail"
              required
              inputProps={{
                type: 'email',
                value: settings.companyEmail,
                onChange: (e) => handleFieldChange('companyEmail', e.target.value),
                placeholder: 'contact@company.com',
              }}
            />
            <FormField
              label="Phone Number"
              id="companyPhone"
              inputProps={{
                type: 'tel',
                value: settings.companyPhone,
                onChange: (e) => handleFieldChange('companyPhone', e.target.value),
                placeholder: '+1 (555) 000-0000',
              }}
            />
            <FormField
              label="Tax ID / EIN"
              id="taxId"
              required
              inputProps={{
                value: settings.taxId,
                onChange: (e) => handleFieldChange('taxId', e.target.value),
                placeholder: '12-3456789',
              }}
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <FormField
              label="Business Address"
              id="companyAddress"
              inputProps={{
                value: settings.companyAddress,
                onChange: (e) => handleFieldChange('companyAddress', e.target.value),
                placeholder: 'Street, City, State, ZIP',
              }}
            />
          </div>
        </Card>

        {/* Financial Settings */}
        <Card padding="large" shadow="medium">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Financial Settings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField
              label="Fiscal Year End"
              id="fiscalYearEnd"
              required
              fieldType="select"
              selectProps={{
                value: settings.fiscalYearEnd,
                onChange: (e) => handleFieldChange('fiscalYearEnd', e.target.value),
                options: [
                  { value: '1', label: 'January' },
                  { value: '2', label: 'February' },
                  { value: '3', label: 'March' },
                  { value: '6', label: 'June' },
                  { value: '9', label: 'September' },
                  { value: '12', label: 'December' },
                ],
              }}
              helperText="Month when your fiscal year ends"
            />
            <FormField
              label="Currency"
              id="currency"
              required
              fieldType="select"
              selectProps={{
                value: settings.currency,
                onChange: (e) => handleFieldChange('currency', e.target.value),
                options: [
                  { value: 'USD', label: 'USD - US Dollar' },
                  { value: 'EUR', label: 'EUR - Euro' },
                  { value: 'GBP', label: 'GBP - British Pound' },
                  { value: 'JPY', label: 'JPY - Japanese Yen' },
                  { value: 'CAD', label: 'CAD - Canadian Dollar' },
                ],
              }}
            />
          </div>
        </Card>

        {/* System Settings */}
        <Card padding="large" shadow="medium">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            System Settings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField
              label="Timezone"
              id="timezone"
              required
              fieldType="select"
              selectProps={{
                value: settings.timezone,
                onChange: (e) => handleFieldChange('timezone', e.target.value),
                options: [
                  { value: 'America/New_York', label: 'Eastern Time (ET)' },
                  { value: 'America/Chicago', label: 'Central Time (CT)' },
                  { value: 'America/Denver', label: 'Mountain Time (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  { value: 'UTC', label: 'UTC' },
                ],
              }}
            />
            <FormField
              label="Email Notifications"
              id="emailNotifications"
              fieldType="select"
              selectProps={{
                value: settings.emailNotifications,
                onChange: (e) => handleFieldChange('emailNotifications', e.target.value),
                options: [
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' },
                  { value: 'digest', label: 'Daily Digest Only' },
                ],
              }}
            />
            <FormField
              label="Audit Log Retention (days)"
              id="auditLogRetention"
              fieldType="select"
              selectProps={{
                value: settings.auditLogRetention,
                onChange: (e) => handleFieldChange('auditLogRetention', e.target.value),
                options: [
                  { value: '30', label: '30 days' },
                  { value: '90', label: '90 days' },
                  { value: '180', label: '180 days' },
                  { value: '365', label: '1 year' },
                  { value: 'unlimited', label: 'Unlimited' },
                ],
              }}
              helperText="How long to keep audit logs"
            />
          </div>
        </Card>

        {/* Status Information */}
        {hasChanges && (
          <Card padding="medium" shadow="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Badge variant="warning">Unsaved Changes</Badge>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                You have unsaved changes. Don&apos;t forget to save before leaving.
              </span>
            </div>
          </Card>
        )}
      </div>

      <SaveBar
        hasChanges={hasChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
        loading={saving}
      />

      <Toast
        message={toast?.message || ''}
        variant={toast?.variant || 'info'}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
        duration={3000}
      />
    </div>
  );
}
