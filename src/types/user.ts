export interface User {
    _id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'student';
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'student';
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (fullName: string, email: string, password: string, confirmPassword: string, role: 'admin' | 'student') => Promise<void>;
    logout: () => void;
    isAdmin: () => boolean;
    isStudent: () => boolean;
}
