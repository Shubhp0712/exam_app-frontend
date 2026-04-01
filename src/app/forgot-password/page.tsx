'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSuccess('OTP sent to your email! Redirecting...');
            setTimeout(() => {
                localStorage.setItem('forgotPasswordEmail', email);
                router.push('/forgot-password/verify-otp');
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to send OTP';
            setError(errorMsg);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
                    ← Back to Login
                </Link>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-block text-5xl mb-4">🔐</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Forgot Password?</h1>
                        <p className="text-gray-300">No worries! Enter your email and we'll send you an OTP to reset your password.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-100 rounded-lg text-sm flex items-center gap-2 animate-bounce">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-400/50 text-green-100 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                            <span>✅</span>
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">📧 Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending OTP...
                                </span>
                            ) : (
                                '📧 Send OTP'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
                        <p className="text-gray-300">
                            Remember your password?{' '}
                            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
