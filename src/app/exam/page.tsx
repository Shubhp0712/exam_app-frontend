'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { Exam } from '@/types/exam';
import Link from 'next/link';

interface ExamWithStatus extends Exam {
    isCompleted?: boolean;
}

export default function ExamPage() {
    const [exams, setExams] = useState<ExamWithStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const data = await examService.getAllExams();
            const publishedExams = isAdmin() ? data : data.filter((exam) => exam.isPublished);

            // Check completion status for each exam (only for students)
            if (!isAdmin()) {
                const examsWithStatus: ExamWithStatus[] = await Promise.all(
                    publishedExams.map(async (exam) => {
                        try {
                            const completion = await examService.checkExamCompletion(exam._id);
                            return { ...exam, isCompleted: completion.isCompleted };
                        } catch (err) {
                            return { ...exam, isCompleted: false };
                        }
                    })
                );
                setExams(examsWithStatus);
            } else {
                setExams(publishedExams);
            }
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
                            <div
                                key={exam._id}
                                className={`card hover:shadow-lg transition-all ${exam.isCompleted ? 'opacity-75 border-2 border-gray-300' : 'cursor-pointer'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{exam.title}</h3>
                                    {exam.isCompleted && (
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                            ✓ Completed
                                        </span>
                                    )}
                                </div>

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

                                {exam.isCompleted ? (
                                    <div className="space-y-2">
                                        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                                            This exam has already been completed. Retaking is not allowed.
                                        </div>
                                        <Link
                                            href="/result"
                                            className="block text-center py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                        >
                                            View Results
                                        </Link>
                                    </div>
                                ) : (
                                    <Link
                                        href={`/exam/${exam._id}`}
                                        className="btn-primary text-center block"
                                    >
                                        Start Exam →
                                    </Link>
                                )}
                            </div>
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
