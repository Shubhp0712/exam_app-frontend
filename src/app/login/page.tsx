'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
                    ← Back to Home
                </Link>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-block text-4xl mb-4">👋</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back!</h1>
                        <p className="text-gray-300">Sign in to continue your learning journey</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-100 rounded-lg text-sm flex items-center gap-2 animate-bounce">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <div className="text-right pt-1">
                                <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                '🚀 Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-gray-300 mb-3">
                            Don't have an account?
                        </p>
                        <Link href="/signup" className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
