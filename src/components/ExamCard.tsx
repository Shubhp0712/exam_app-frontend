'use client';

import { Exam } from '@/types/exam';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface ExamCardProps {
    exam: Exam;
    onEdit?: (exam: Exam) => void;
    onDelete?: (id: string) => void;
    onPublish?: (id: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onEdit, onDelete, onPublish }) => {
    const { isAdmin } = useAuth();
    const hasQuestions = exam.questions && exam.questions.length > 0;
    const totalMarksFromQuestions = exam.questions?.reduce((sum, q: any) => sum + (q.marks || 0), 0) || 0;
    const marksMatch = totalMarksFromQuestions === exam.totalMarks;
    const canPublish = hasQuestions && marksMatch;

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="p-6">
                {/* Title and Subject */}
                <div className="mb-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all">
                            📚 {exam.title}
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 font-medium">{exam.subject}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">⏱️</span>
                            <div>
                                <p className="text-gray-600">Duration</p>
                                <p className="font-bold text-gray-900">{exam.duration} min</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📊</span>
                            <div>
                                <p className="text-gray-600">Marks</p>
                                <p className="font-bold text-gray-900">{exam.totalMarks}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            <div>
                                <p className="text-gray-600">Pass</p>
                                <p className="font-bold text-gray-900">{exam.passingMarks}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">❓</span>
                            <div>
                                <p className="text-gray-600">Questions</p>
                                <p className={`font-bold ${hasQuestions ? 'text-green-600' : 'text-red-600'}`}>
                                    {exam.questions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status and Warnings */}
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${exam.isPublished
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {exam.isPublished ? '✓ Published' : '🔒 Draft'}
                        </span>
                        {!hasQuestions && !exam.isPublished && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
                                ⚠️ No Questions
                            </span>
                        )}
                        {hasQuestions && !marksMatch && !exam.isPublished && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
                                ⚠️ Marks: {totalMarksFromQuestions}/{exam.totalMarks}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap pt-4 border-t border-gray-100">
                    {isAdmin() ? (
                        <>
                            {!exam.isPublished && (
                                <button
                                    onClick={() => onPublish?.(exam._id)}
                                    disabled={!canPublish}
                                    className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1 ${!canPublish
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                                        }`}
                                    title={
                                        !hasQuestions
                                            ? 'Add questions before publishing'
                                            : !marksMatch
                                                ? `Total marks mismatch: ${totalMarksFromQuestions}/${exam.totalMarks}`
                                                : ''
                                    }
                                >
                                    🚀 Publish
                                </button>
                            )}
                            <button
                                onClick={() => onEdit?.(exam)}
                                className="flex-1 py-2 px-3 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => onDelete?.(exam._id)}
                                className="flex-1 py-2 px-3 rounded-lg font-bold text-sm bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1"
                            >
                                🗑️ Delete
                            </button>
                        </>
                    ) : (
                        exam.isPublished && (
                            <Link
                                href={`/exam/${exam._id}`}
                                className="w-full py-2 px-3 rounded-lg font-bold text-sm text-center bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1"
                            >
                                ▶️ Start Exam
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
