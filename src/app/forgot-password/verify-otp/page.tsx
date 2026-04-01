'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function VerifyForgotPasswordOTPPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const storedEmail = localStorage.getItem('forgotPasswordEmail');
        if (!storedEmail) {
            router.push('/forgot-password');
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp.trim()) {
            setError('Please enter OTP');
            return;
        }

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.verifyForgotPasswordOTP(email, otp);
            setSuccess('OTP verified! Redirecting to password reset...');
            localStorage.setItem('resetToken', response.resetToken);
            localStorage.removeItem('forgotPasswordEmail');
            setTimeout(() => {
                router.push('/forgot-password/reset-password');
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to verify OTP';
            setError(errorMsg);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        setError('');
        setSuccess('');

        try {
            await authService.forgotPassword(email);
            setSuccess('OTP sent again!');
            setCountdown(60);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to resend OTP';
            setError(errorMsg);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="card shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
                        <p className="text-gray-600">We've sent a 6-digit OTP to your email</p>
                        <p className="text-sm font-semibold text-primary mt-2">{email}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Enter OTP *</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="input-field text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                            <p className="text-xs text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="btn-primary w-full font-semibold py-3"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600 mb-4">Didn't receive the code?</p>
                        <button
                            onClick={handleResendOTP}
                            disabled={resending || countdown > 0}
                            className="w-full py-2 px-4 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline font-semibold">
                            ← Change email
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
