/**
 * Generic pagination response wrapper
 */
export interface PaginationResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Common filter params for list endpoints
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
