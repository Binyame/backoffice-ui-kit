/**
 * Audit log item for tracking changes
 */
export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
}

/**
 * Audit action types
 */
export enum AuditAction {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
  View = 'VIEW',
}

/**
 * Audit log filter params
 */
export interface AuditFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  from?: string;
  to?: string;
  action?: AuditAction;
  entityType?: string;
}
