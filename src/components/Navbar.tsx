'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
    };

    // Don't show navbar on auth pages
    if (['/login', '/signup'].includes(pathname)) {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-primary to-secondary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">E</span>
                    </div>
                    <span className="text-white font-bold text-xl">ExamHub</span>
                </Link>

                {isAuthenticated && (
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/dashboard" className="text-white hover:text-gray-100 transition-colors">
                                Dashboard
                            </Link>

                            {isAdmin() && (
                                <Link href="/admin" className="text-white hover:text-gray-100 transition-colors">
                                    Admin Panel
                                </Link>
                            )}

                            {!isAdmin() && (
                                <Link href="/result" className="text-white hover:text-gray-100 transition-colors">
                                    My Results
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:block text-white text-sm">
                                <p className="font-semibold">{user?.fullName}</p>
                                <p className="text-gray-100 capitalize">{user?.role}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
