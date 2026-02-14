'use client';

import { Owner } from '@backoffice-kit/shared';
import { Button } from '@backoffice-kit/ui';
import styles from './OwnersTable.module.css';

interface OwnersTableProps {
  owners: Owner[];
  onEdit?: (owner: Owner) => void;
  onDelete?: (ownerId: string) => void;
}

export function OwnersTable({ owners, onEdit, onDelete }: OwnersTableProps) {
  if (owners.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>No owners yet</h3>
          <p className={styles.emptyStateDescription}>
            Get started by adding your first company owner.
          </p>
          <Button variant="primary">Add Owner</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Ownership %</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Created</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td className={styles.td}>
                <div className={styles.name}>{owner.name}</div>
              </td>
              <td className={styles.td}>
                <div className={styles.email}>{owner.email}</div>
              </td>
              <td className={styles.td}>
                <div className={styles.percentage}>{owner.ownershipPercentage}%</div>
              </td>
              <td className={styles.td}>
                <span className={styles.role}>{owner.role}</span>
              </td>
              <td className={styles.td}>
                <div className={styles.date}>{formatDate(owner.createdAt)}</div>
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => onEdit?.(owner)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => onDelete?.(owner.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
