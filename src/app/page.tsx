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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to ExamHub</h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-100">
                        A comprehensive online examination platform for seamless testing experiences
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link href="/login" className="btn-primary bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                            Login
                        </Link>
                        <Link href="/signup" className="btn-secondary bg-white/20 text-white hover:bg-white/30 px-8 py-3 text-lg border-2 border-white">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '📝',
                                title: 'Create Exams',
                                description: 'Easily create and manage exams with customizable questions and settings',
                            },
                            {
                                icon: '⏱️',
                                title: 'Timed Tests',
                                description: 'Built-in timer to ensure fair and controlled exam sessions',
                            },
                            {
                                icon: '📊',
                                title: 'Instant Results',
                                description: 'Get immediate feedback with detailed result analysis and statistics',
                            },
                        ].map((feature, idx) => (
                            <div key={idx} className="card text-center">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to get started?</h2>
                    <p className="text-lg text-gray-600 mb-8">Join ExamHub today and transform your examination experience</p>
                    <Link href="/signup" className="btn-primary bg-primary text-white hover:bg-primary/90 px-8 py-3 text-lg inline-block">
                        Create Account
                    </Link>
                </div>
            </section>
        </div>
    );
}
