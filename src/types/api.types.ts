// Standard API response types
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    code?: string;
    errors?: Array<{ field: string; message: string }>;
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
