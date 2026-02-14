import { Owner, OwnerRole } from '@backoffice-kit/shared';

/**
 * Mock data for owners - will be replaced with API calls in M4
 */
export const mockOwners: Owner[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    ownershipPercentage: 45,
    role: OwnerRole.CEO,
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    ownershipPercentage: 30,
    role: OwnerRole.CTO,
    createdAt: new Date('2023-02-20').toISOString(),
    updatedAt: new Date('2023-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    ownershipPercentage: 15,
    role: OwnerRole.CFO,
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-03-10').toISOString(),
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    ownershipPercentage: 10,
    role: OwnerRole.Shareholder,
    createdAt: new Date('2023-04-05').toISOString(),
    updatedAt: new Date('2023-04-05').toISOString(),
  },
];
