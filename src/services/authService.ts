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

    async sendOTP(data: SignupRequest): Promise<{ success: boolean; message: string; tempEmail: string }> {
        const response = await apiClient.post<{ success: boolean; message: string; tempEmail: string }>('/auth/send-otp', data);
        return response.data;
    },

    async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/verify-otp', { email, otp });
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

    async forgotPassword(email: string): Promise<{ success: boolean; message: string; tempEmail: string }> {
        const response = await apiClient.post<{ success: boolean; message: string; tempEmail: string }>('/auth/forgot-password', { email });
        return response.data;
    },

    async verifyForgotPasswordOTP(email: string, otp: string): Promise<{ success: boolean; message: string; resetToken: string }> {
        const response = await apiClient.post<{ success: boolean; message: string; resetToken: string }>('/auth/verify-forgot-password-otp', { email, otp });
        return response.data;
    },

    async resetPassword(resetToken: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', { resetToken, newPassword, confirmPassword });
        return response.data;
    },
};
