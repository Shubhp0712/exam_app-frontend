'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-cyan-500 bg-clip-text text-transparent">
                        📚 ExamHub
                    </div>
                    <div className="flex gap-3">
                        <Link href="/login" className="px-6 py-2 rounded-lg text-primary font-semibold hover:bg-primary/10 transition-all duration-200">
                            Login
                        </Link>
                        <Link href="/signup" className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-cyan-500/5 opacity-50"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <span className="text-primary font-semibold">✨ Welcome to Excellence</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
                        Transform Your <span className="bg-gradient-to-r from-primary via-secondary to-cyan-500 bg-clip-text text-transparent">Testing Experience</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto">
                        The modern online examination platform trusted by educators and students worldwide
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link href="/signup" className="relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-2">
                                🚀 Get Started Free
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        <Link href="/login" className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-bold rounded-xl hover:border-primary hover:shadow-lg hover:bg-primary/5 transition-all duration-300">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 text-gray-900">🎯 Powerful Features</h2>
                        <p className="text-xl text-gray-600">Everything you need for seamless online examinations</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '📝',
                                title: 'Create & Manage Exams',
                                description: 'Effortlessly create exams with customizable questions, marks, and difficulty levels',
                                color: 'from-blue-500 to-blue-600',
                            },
                            {
                                icon: '⏱️',
                                title: 'Timed Tests',
                                description: 'Precise timing controls with real-time countdown for fair and controlled sessions',
                                color: 'from-purple-500 to-purple-600',
                            },
                            {
                                icon: '📊',
                                title: 'Instant Analytics',
                                description: 'Comprehensive results dashboard with detailed performance metrics and statistics',
                                color: 'from-green-500 to-green-600',
                            },
                            {
                                icon: '🔐',
                                title: 'Secure & Reliable',
                                description: 'Bank-level security with encrypted data storage and secure authentication',
                                color: 'from-red-500 to-red-600',
                            },
                            {
                                icon: '👥',
                                title: 'Multi-User Support',
                                description: 'Separate admin and student accounts with role-based access control',
                                color: 'from-cyan-500 to-cyan-600',
                            },
                            {
                                icon: '📧',
                                title: 'Email Verification',
                                description: 'OTP-based email verification for account security and authentication',
                                color: 'from-yellow-500 to-yellow-600',
                            },
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-xl border border-gray-100 p-8 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                <div className="relative z-10">
                                    <div className={`inline-block text-4xl mb-4 p-3 bg-gradient-to-br ${feature.color} bg-clip-text rounded-lg`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-primary via-secondary to-cyan-500 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-white">
                        {[
                            { icon: '👨‍🎓', label: 'Students', value: '10K+' },
                            { icon: '👨‍🏫', label: 'Educators', value: '500+' },
                            { icon: '📋', label: 'Exams', value: '5K+' },
                            { icon: '⭐', label: 'Rating', value: '4.9/5' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="text-white/80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-12 text-white text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4">Ready to Begin?</h2>
                        <p className="text-xl text-gray-300 mb-8">Join thousands of users for seamless online examinations</p>
                        <Link href="/signup" className="inline-block px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            Create Free Account Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-lg font-semibold mb-2 text-white">📚 ExamHub</p>
                    <p className="mb-4">The modern online examination platform for educational excellence</p>
                    <p className="text-sm">© 2024 ExamHub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
