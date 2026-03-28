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

    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{exam.subject}</p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                    <div>
                        <span className="font-semibold">Duration:</span> {exam.duration} mins
                    </div>
                    <div>
                        <span className="font-semibold">Total Marks:</span> {exam.totalMarks}
                    </div>
                    <div>
                        <span className="font-semibold">Pass Marks:</span> {exam.passingMarks}
                    </div>
                    <div>
                        <span className="font-semibold">Questions:</span> {exam.questions.length}
                    </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${exam.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {exam.isPublished ? '✓ Published' : 'Draft'}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {isAdmin() ? (
                    <>
                        {!exam.isPublished && (
                            <button onClick={() => onPublish?.(exam._id)} className="btn-primary text-sm">
                                Publish
                            </button>
                        )}
                        <button onClick={() => onEdit?.(exam)} className="btn-secondary text-sm">
                            Edit
                        </button>
                        <button onClick={() => onDelete?.(exam._id)} className="btn-danger text-sm">
                            Delete
                        </button>
                    </>
                ) : (
                    exam.isPublished && (
                        <Link href={`/exam/${exam._id}`} className="btn-primary text-sm inline-block">
                            Start Exam
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};
