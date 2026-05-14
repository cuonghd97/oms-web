export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  traceId?: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
  traceId?: string;
}
