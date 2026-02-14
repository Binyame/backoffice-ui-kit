import {
  Owner,
  OwnerCreateDto,
  OwnerUpdateDto,
  PaginationResponse,
} from '@backoffice-kit/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any,
  ) {
    super(`API Error: ${status} ${statusText}`);
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, response.statusText, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const ownersApi = {
  /**
   * Get all owners with pagination and search
   */
  getOwners: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PaginationResponse<Owner>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/owners?${queryString}` : '/owners';

    return fetchApi<PaginationResponse<Owner>>(endpoint);
  },

  /**
   * Get a single owner by ID
   */
  getOwner: async (id: string): Promise<Owner> => {
    return fetchApi<Owner>(`/owners/${id}`);
  },

  /**
   * Create a new owner
   */
  createOwner: async (data: OwnerCreateDto): Promise<Owner> => {
    return fetchApi<Owner>('/owners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing owner
   */
  updateOwner: async (id: string, data: OwnerUpdateDto): Promise<Owner> => {
    return fetchApi<Owner>(`/owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an owner
   */
  deleteOwner: async (id: string): Promise<void> => {
    return fetchApi<void>(`/owners/${id}`, {
      method: 'DELETE',
    });
  },
};
