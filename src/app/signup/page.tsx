'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'student' | 'admin'>('student');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!fullName.trim()) {
            setError('Full name is required');
            return;
        }

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Send OTP
            const response = await authService.sendOTP({
                fullName,
                email,
                password,
                confirmPassword,
                role,
            });

            // Store signup data in localStorage for resend OTP
            localStorage.setItem('signupData', JSON.stringify({
                fullName,
                email,
                password,
                confirmPassword,
                role,
            }));

            // Redirect to OTP verification page
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
                    ← Back to Home
                </Link>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-block text-4xl mb-4">✨</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-300">Join thousands on ExamHub today</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-100 rounded-lg text-sm flex items-center gap-2 animate-bounce">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">👤 Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">📧 Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">👥 Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                            >
                                <option value="student" className="bg-gray-900">👨‍🎓 Student</option>
                                <option value="admin" className="bg-gray-900">👨‍🏫 Admin</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">🔑 Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors text-xl"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">✅ Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors text-xl"
                                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending OTP...
                                </span>
                            ) : (
                                '🚀 Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-gray-300 mb-3">
                            Already have an account?
                        </p>
                        <Link href="/login" className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
