'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [resetToken, setResetToken] = useState('');
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('resetToken');
        if (!token) {
            router.push('/forgot-password');
        } else {
            setResetToken(token);
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.newPassword.trim()) {
            setError('Please enter new password');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.confirmPassword.trim()) {
            setError('Please confirm password');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(resetToken, formData.newPassword, formData.confirmPassword);
            setSuccess('Password reset successfully! Redirecting to login...');
            localStorage.removeItem('resetToken');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to reset password';
            setError(errorMsg);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <Link href="/forgot-password" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
                    ← Back to Forgot Password
                </Link>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-block text-5xl mb-4">🔐</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Create New Password</h1>
                        <p className="text-gray-300">Enter your new password below</p>
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
                            <label className="block text-white font-semibold text-sm">🔑 New Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 pr-12"
                                    placeholder="Enter new password"
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
                            <p className="text-xs text-gray-400 mt-1">✓ At least 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white font-semibold text-sm">✅ Confirm Password *</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 pr-12"
                                    placeholder="Confirm password"
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

                        {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                            <div className="p-3 bg-yellow-500/20 border border-yellow-400/50 text-yellow-100 rounded-lg text-sm flex items-center gap-2">
                                <span>⚠️</span>
                                <span>Passwords do not match</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Resetting...
                                </span>
                            ) : (
                                '🚀 Reset Password'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
