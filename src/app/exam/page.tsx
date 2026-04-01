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
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 text-lg">Loading exams...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary via-secondary to-cyan-500 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-bold mb-2">📖 Available Exams</h1>
                        <p className="text-xl opacity-90">Choose an exam to begin your assessment</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {exams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exams.map((exam) => (
                                <div
                                    key={exam._id}
                                    className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${exam.isCompleted
                                            ? 'bg-gray-100 border-gray-300 opacity-75'
                                            : 'bg-white border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:border-primary'
                                        }`}
                                >
                                    {/* Gradient top border */}
                                    {!exam.isCompleted && (
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    )}

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-bold text-gray-900">{exam.title}</h3>
                                            {exam.isCompleted && (
                                                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                                                    ✅ Completed
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 font-medium mb-4">{exam.subject}</p>

                                        {/* Stats */}
                                        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">⏱️ Duration:</span>
                                                <span className="font-bold text-gray-900">{exam.duration} mins</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">📊 Total Marks:</span>
                                                <span className="font-bold text-gray-900">{exam.totalMarks}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">✅ Pass Marks:</span>
                                                <span className="font-bold text-gray-900">{exam.passingMarks}</span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        {exam.isCompleted ? (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded text-sm text-yellow-800 font-medium">
                                                    <span className="block font-bold mb-1">🔒 Already Completed</span>
                                                    This exam cannot be retaken. View your results instead.
                                                </div>
                                                <Link
                                                    href="/result"
                                                    className="block text-center py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-all duration-200 hover:-translate-y-0.5"
                                                >
                                                    📊 View Results
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/exam/${exam._id}`}
                                                className="block text-center py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                            >
                                                🚀 Start Exam
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-600 text-xl font-semibold mb-2">No Exams Available</p>
                            <p className="text-gray-500 mb-6">Come back later, or check with your admin</p>
                            <Link href="/dashboard" className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                ← Back to Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
