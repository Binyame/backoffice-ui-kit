/**
 * Owner entity representing a company owner/shareholder
 */
export interface Owner {
  id: string;
  name: string;
  email: string;
  ownershipPercentage: number;
  role: OwnerRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Owner roles
 */
export enum OwnerRole {
  CEO = 'CEO',
  CFO = 'CFO',
  CTO = 'CTO',
  Shareholder = 'Shareholder',
  Advisor = 'Advisor',
}

/**
 * DTO for creating a new owner
 */
export interface OwnerCreateDto {
  name: string;
  email: string;
  ownershipPercentage: number;
  role: OwnerRole;
}

/**
 * DTO for updating an existing owner
 */
export interface OwnerUpdateDto {
  name?: string;
  email?: string;
  ownershipPercentage?: number;
  role?: OwnerRole;
}
