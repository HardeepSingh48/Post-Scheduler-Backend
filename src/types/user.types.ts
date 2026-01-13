// User-related types
export interface UserPayload {
    id: string;
    email: string;
    username: string;
    timezone: string;
}

export interface RegisterInput {
    email: string;
    username: string;
    password: string;
    timezone: string;
    name?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: UserPayload;
    token: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    name: string | null;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
}
