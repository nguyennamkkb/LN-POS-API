export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}