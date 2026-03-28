'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { Exam } from '@/types/exam';
import Link from 'next/link';

export default function ExamPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const data = await examService.getAllExams();
            const publishedExams = isAdmin() ? data : data.filter((exam) => exam.isPublished);
            setExams(publishedExams);
        } catch (error) {
            console.error('Failed to load exams:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading exams...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Link href="/dashboard" className="text-primary hover:underline mb-8 inline-block">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold text-gray-800 mb-8">Available Exams</h1>

                {exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <Link key={exam._id} href={`/exam/${exam._id}`} className="card hover:shadow-lg transition-all cursor-pointer">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
                                <p className="text-gray-600 mb-4">{exam.subject}</p>

                                <div className="space-y-2 text-sm text-gray-700 mb-4">
                                    <p>
                                        <span className="font-semibold">Duration:</span> {exam.duration} mins
                                    </p>
                                    <p>
                                        <span className="font-semibold">Total Marks:</span> {exam.totalMarks}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Pass Marks:</span> {exam.passingMarks}
                                    </p>
                                </div>

                                <div className="btn-primary text-center">Start Exam →</div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg">No exams available at the moment.</p>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
