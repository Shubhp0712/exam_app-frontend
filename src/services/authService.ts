import apiClient from './api';
import { User, LoginRequest, SignupRequest, AuthResponse } from '@/types/user';

export const authService = {
    async signup(data: SignupRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async getMe(): Promise<User> {
        const response = await apiClient.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    getUser(): User | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    isAdmin(): boolean {
        const user = this.getUser();
        return user?.role === 'admin' || false;
    },

    isStudent(): boolean {
        const user = this.getUser();
        return user?.role === 'student' || false;
    },
};
