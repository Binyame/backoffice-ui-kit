import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SaveBar } from './SaveBar';
import { Button } from '../../atoms/Button';
import { TextInput } from '../../atoms/TextInput';

const meta = {
  title: 'Organisms/SaveBar',
  component: SaveBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SaveBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive demo with form
export const Interactive: Story = {
  render: () => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john@example.com');
    const [initialName] = useState('John Doe');
    const [initialEmail] = useState('john@example.com');
    const [saving, setSaving] = useState(false);

    const hasChanges = name !== initialName || email !== initialEmail;

    const handleSave = () => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        alert('Changes saved!');
      }, 1500);
    };

    const handleDiscard = () => {
      setName(initialName);
      setEmail(initialEmail);
    };

    return (
      <div style={{ minHeight: '400px', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Edit Profile</h2>
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Name
            </label>
            <TextInput
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Email
            </label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Make some changes to see the save bar appear at the bottom
          </p>
        </div>
        <SaveBar
          hasChanges={hasChanges}
          onSave={handleSave}
          onDiscard={handleDiscard}
          loading={saving}
        />
      </div>
    );
  },
};

// Bottom position (default)
export const BottomPosition: Story = {
  args: {
    hasChanges: true,
    onSave: () => alert('Saved!'),
    onDiscard: () => alert('Discarded!'),
    position: 'bottom',
  },
  decorators: [(Story) => <div style={{ minHeight: '300px', position: 'relative' }}><Story /></div>],
};

// Top position
export const TopPosition: Story = {
  args: {
    hasChanges: true,
    onSave: () => alert('Saved!'),
    onDiscard: () => alert('Discarded!'),
    position: 'top',
  },
  decorators: [(Story) => <div style={{ minHeight: '300px', position: 'relative' }}><Story /></div>],
};

// Custom messages
export const CustomMessage: Story = {
  args: {
    hasChanges: true,
    onSave: () => alert('Saved!'),
    onDiscard: () => alert('Discarded!'),
    message: 'You have 3 unsaved changes',
    saveText: 'Save Changes',
    discardText: 'Reset',
  },
  decorators: [(Story) => <div style={{ minHeight: '300px', position: 'relative' }}><Story /></div>],
};

// Loading state
export const Loading: Story = {
  args: {
    hasChanges: true,
    onSave: () => {},
    onDiscard: () => {},
    loading: true,
  },
  decorators: [(Story) => <div style={{ minHeight: '300px', position: 'relative' }}><Story /></div>],
};
