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
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                    <p className="text-gray-600 text-lg">
                        Welcome back, <span className="font-semibold">{user?.fullName}</span>!
                    </p>
                </div>

                {/* Admin Actions */}
                {isAdmin() && (
                    <div className="mb-8 flex gap-4 flex-wrap">
                        <Link href="/admin" className="btn-primary bg-primary text-white hover:bg-primary/90">
                            Go to Admin Panel
                        </Link>
                        <Link href="/admin/create-exam" className="btn-primary bg-secondary text-white hover:bg-secondary/90">
                            Create New Exam
                        </Link>
                    </div>
                )}

                {/* Error Message */}
                {error && <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600">Loading exams...</p>
                        </div>
                    </div>
                )}

                {/* Exams Grid */}
                {!loading && exams.length > 0 && (
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
                )}

                {/* No Exams */}
                {!loading && exams.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg mb-4">No exams available yet.</p>
                        {isAdmin() && (
                            <Link href="/admin/create-exam" className="btn-primary bg-primary text-white hover:bg-primary/90 inline-block">
                                Create First Exam
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
