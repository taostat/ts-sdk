// Common API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common account information structure used across modules
export interface AddressType {
  ss58: string;
  hex: string;
}

// Common query parameters
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface QueryParams extends BaseQueryParams {
  [key: string]: any;
}

export interface TaoStatsPagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: string | null;
}

// Base order options used by endpoints
export type BaseOrderOptions = 'block_number_asc' | 'block_number_desc' | 'timestamp_asc' | 'timestamp_desc';