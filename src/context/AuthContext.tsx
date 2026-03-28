'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { User, AuthContextType } from '@/types/user';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const storedToken = authService.getToken();
            const storedUser = authService.getUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);

                // Verify token is still valid by calling /auth/me
                authService
                    .getMe()
                    .then((currentUser) => {
                        setUser(currentUser);
                    })
                    .catch(() => {
                        // Token expired or invalid
                        authService.logout();
                        setToken(null);
                        setUser(null);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            setToken(response.token);
            setUser(response.user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (fullName: string, email: string, password: string, confirmPassword: string, role: 'admin' | 'student') => {
        try {
            const response = await authService.signup({ fullName, email, password, confirmPassword, role });
            setToken(response.token);
            setUser(response.user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    const isAdmin = () => user?.role === 'admin';
    const isStudent = () => user?.role === 'student';
    const isAuthenticated = !!token;

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        isStudent,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
