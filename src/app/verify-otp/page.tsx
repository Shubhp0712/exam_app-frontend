'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [resendDisabled, setResendDisabled] = useState(false);

    const email = searchParams.get('email') || '';

    // Timer for OTP expiry countdown
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setError('OTP has expired. Please request a new one.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Timer for resend button
    useEffect(() => {
        if (resendDisabled) {
            const timer = setTimeout(() => setResendDisabled(false), 60000); // 60 seconds
            return () => clearTimeout(timer);
        }
    }, [resendDisabled]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp.trim()) {
            setError('Please enter the OTP');
            return;
        }

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.verifyOTP(email, otp);
            setSuccess('✓ Email verified successfully!');

            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to verify OTP';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        setResendDisabled(true);

        try {
            // Get signup data from localStorage
            const signupData = localStorage.getItem('signupData');
            if (!signupData) {
                setError('Signup data not found. Please try signing up again.');
                return;
            }

            const data = JSON.parse(signupData);
            await authService.sendOTP(data);

            setSuccess('New OTP sent to your email!');
            setOtp('');
            setTimeLeft(600);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to resend OTP';
            setError(errorMsg);
            setResendDisabled(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-4xl">📧</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Verify Email</h1>
                        <p className="text-gray-300">
                            We sent a 6-digit OTP to<br />
                            <span className="font-bold text-cyan-400">{email}</span>
                        </p>
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

                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* OTP Input */}
                        <div>
                            <label htmlFor="otp" className="block text-white font-semibold text-sm mb-3">
                                🔐 Enter 6-Digit OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                disabled={loading || timeLeft === 0}
                                className="w-full px-4 py-4 bg-white/10 border-2 border-white/20 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-center text-3xl font-bold tracking-widest text-white placeholder-gray-500 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200"
                            />
                        </div>

                        {/* Timer */}
                        <div className="flex justify-center items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-lg">⏱️</span>
                            <span className={`text-sm font-bold ${timeLeft > 60 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatTime(timeLeft)} remaining
                            </span>
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={loading || timeLeft === 0}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </span>
                            ) : (
                                '✅ Verify OTP'
                            )}
                        </button>
                    </form>

                    {/* Resend Option */}
                    <div className="mt-8 text-center space-y-4">
                        <p className="text-sm text-gray-300">
                            Didn't receive the OTP?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={resendDisabled || loading}
                            className="px-6 py-2 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendDisabled ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Resend in 60s
                                </span>
                            ) : (
                                '📮 Resend OTP'
                            )}
                        </button>
                    </div>

                    {/* Back to Signup */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-300">
                            Wrong email?{' '}
                            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                Go back to signup
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
