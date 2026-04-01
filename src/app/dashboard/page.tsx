'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ExamCard } from '@/components/ExamCard';
import Link from 'next/link';
import { examService } from '@/services/examService';
import { Exam } from '@/types/exam';

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            setLoading(true);
            const data = await examService.getAllExams();
            setExams(data);
        } catch (err: any) {
            console.error('Failed to load exams:', err);
            setError('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id: string) => {
        try {
            await examService.publishExam(id);
            await loadExams();
        } catch (err: any) {
            console.error('Failed to publish exam:', err);
            alert('Failed to publish exam');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await examService.deleteExam(id);
                await loadExams();
            } catch (err: any) {
                console.error('Failed to delete exam:', err);
                alert('Failed to delete exam');
            }
        }
    };

    const handleEdit = (exam: Exam) => {
        // This would typically navigate to an edit page
        console.log('Edit exam:', exam);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary via-secondary to-cyan-500 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4">
                            <span className="text-sm font-semibold opacity-90">👋 Welcome, {user?.role?.toUpperCase()}</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-2">Hello, {user?.fullName}! 🎓</h1>
                        <p className="text-xl opacity-90">
                            {isAdmin() ? 'Manage your exams and student results' : 'Continue your learning journey'}
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Admin Quick Actions */}
                    {isAdmin() && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">⚡ Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link href="/admin" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-2">📋</div>
                                        <h3 className="font-bold text-lg">Admin Panel</h3>
                                        <p className="text-sm opacity-90">Manage all exams</p>
                                    </div>
                                </Link>
                                <Link href="/admin/create-exam" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-2">✍️</div>
                                        <h3 className="font-bold text-lg">Create Exam</h3>
                                        <p className="text-sm opacity-90">Start new exam</p>
                                    </div>
                                </Link>
                                <Link href="/admin/results" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-2">📊</div>
                                        <h3 className="font-bold text-lg">View Results</h3>
                                        <p className="text-sm opacity-90">Check analytics</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/20 border border-red-400/50 text-red-100 rounded-xl text-sm flex items-center gap-3 animate-bounce">
                            <span className="text-xl">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-600 text-lg">Loading exams...</p>
                            </div>
                        </div>
                    ) : exams.length > 0 ? (
                        <>
                            {/* Exams Section Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {isAdmin() ? '📚 All Exams' : '📖 Available Exams'}
                                </h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                            </div>

                            {/* Exams Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {exams.map((exam) => (
                                    <ExamCard
                                        key={exam._id}
                                        exam={exam}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onPublish={handlePublish}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-600 text-lg mb-6 font-semibold">No exams available yet</p>
                            {isAdmin() && (
                                <Link href="/admin/create-exam" className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                    🚀 Create Your First Exam
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
