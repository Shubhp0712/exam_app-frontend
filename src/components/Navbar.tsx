'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export const Navbar: React.FC = () => {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    // Don't show navbar on auth pages
    if (['/login', '/signup', '/verify-otp', '/forgot-password', '/forgot-password/verify-otp', '/forgot-password/reset-password'].includes(pathname)) {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-primary via-secondary to-cyan-500 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">📚</span>
                        </div>
                        <span className="text-white font-bold text-2xl hidden sm:inline">ExamHub</span>
                    </Link>

                    {/* Desktop Menu */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/dashboard"
                                className="text-white hover:text-gray-100 font-semibold transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                            >
                                🏠 Dashboard
                            </Link>

                            {isAdmin() && (
                                <Link
                                    href="/admin"
                                    className="text-white hover:text-gray-100 font-semibold transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                                >
                                    ⚙️ Admin
                                </Link>
                            )}

                            {!isAdmin() && (
                                <Link
                                    href="/result"
                                    className="text-white hover:text-gray-100 font-semibold transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                                >
                                    📊 Results
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Right Side */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            {/* User Info - Desktop */}
                            <div className="hidden sm:block text-white">
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-bold text-sm">{user?.fullName}</p>
                                        <p className="text-xs opacity-90 capitalize">{user?.role} 👤</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                                        <span className="text-lg font-bold">{user?.fullName?.charAt(0) || 'U'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                🚪 Logout
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <span className="w-5 h-0.5 bg-white rounded-full transition-all"></span>
                                <span className="w-5 h-0.5 bg-white rounded-full transition-all"></span>
                                <span className="w-5 h-0.5 bg-white rounded-full transition-all"></span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isAuthenticated && mobileMenuOpen && (
                    <div className="md:hidden mt-4 space-y-2 pb-4">
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-semibold flex items-center gap-2"
                        >
                            🏠 Dashboard
                        </Link>

                        {isAdmin() && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-semibold flex items-center gap-2"
                            >
                                ⚙️ Admin Panel
                            </Link>
                        )}

                        {!isAdmin() && (
                            <Link
                                href="/result"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-semibold flex items-center gap-2"
                            >
                                📊 My Results
                            </Link>
                        )}

                        <div className="px-4 py-2 pt-4 border-t border-white/20">
                            <p className="text-white font-bold">{user?.fullName}</p>
                            <p className="text-xs opacity-90 capitalize">{user?.role}</p>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
