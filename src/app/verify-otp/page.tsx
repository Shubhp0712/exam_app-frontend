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
        <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✉️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Email</h1>
                        <p className="text-gray-600">
                            We sent a 6-digit OTP to<br />
                            <span className="font-semibold">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* OTP Input */}
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                disabled={loading || timeLeft === 0}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-center text-2xl font-bold tracking-widest disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Timer */}
                        <div className="flex justify-center items-center space-x-2">
                            <span className={`text-sm font-semibold ${timeLeft > 60 ? 'text-gray-600' : 'text-red-600'}`}>
                                Time remaining: {formatTime(timeLeft)}
                            </span>
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={loading || timeLeft === 0}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>

                    {/* Resend Option */}
                    <div className="mt-8 text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Didn't receive the OTP?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={resendDisabled || loading}
                            className="text-primary hover:text-secondary font-semibold disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {resendDisabled ? 'Resend in 60s' : 'Resend OTP'}
                        </button>
                    </div>

                    {/* Back to Signup */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Wrong email?{' '}
                            <Link href="/signup" className="text-primary hover:text-secondary font-semibold">
                                Go back to signup
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
