'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ExamCard } from '@/components/ExamCard';
import { examService } from '@/services/examService';
import { resultService } from '@/services/resultService';
import { Exam } from '@/types/exam';
import Link from 'next/link';

export default function AdminPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalExams: 0, draftExams: 0, publishedExams: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const examsData = await examService.getAllExams();
            setExams(examsData);
            setStats({
                totalExams: examsData.length,
                draftExams: examsData.filter((e) => !e.isPublished).length,
                publishedExams: examsData.filter((e) => e.isPublished).length,
            });
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id: string) => {
        try {
            await examService.publishExam(id);
            await loadData();
        } catch (err) {
            console.error('Failed to publish exam:', err);
            alert('Failed to publish exam');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await examService.deleteExam(id);
                await loadData();
            } catch (err) {
                console.error('Failed to delete exam:', err);
                alert('Failed to delete exam');
            }
        }
    };

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-10">
                    <Link href="/dashboard" className="text-primary hover:underline inline-block mb-4">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Exams', value: stats.totalExams, color: 'primary' },
                        { label: 'Draft Exams', value: stats.draftExams, color: 'yellow-500' },
                        { label: 'Published Exams', value: stats.publishedExams, color: 'green-500' },
                    ].map((stat, idx) => (
                        <div key={idx} className={`card bg-gradient-to-br from-${stat.color} to-${stat.color}/80 text-white`}>
                            <p className="text-sm font-semibold mb-2 opacity-90">{stat.label}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-8 flex gap-4 border-b border-gray-200">
                    <Link
                        href="/admin"
                        className="py-4 px-6 border-b-2 border-primary text-primary font-semibold"
                    >
                        Manage Exams
                    </Link>
                    <Link
                        href="/admin/manage-questions"
                        className="py-4 px-6 border-b-2 border-transparent text-gray-600 hover:text-gray-800"
                    >
                        Manage Questions
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="mb-8 flex gap-4 flex-wrap">
                    <Link href="/admin/create-exam" className="btn-primary bg-primary text-white hover:bg-primary/90">
                        + Create New Exam
                    </Link>
                </div>

                {/* Exams List */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600">Loading exams...</p>
                        </div>
                    </div>
                ) : exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <ExamCard
                                key={exam._id}
                                exam={exam}
                                onDelete={handleDelete}
                                onPublish={handlePublish}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 card">
                        <p className="text-gray-600 text-lg mb-4">No exams created yet.</p>
                        <Link href="/admin/create-exam" className="btn-primary bg-primary text-white hover:bg-primary/90 inline-block">
                            Create First Exam
                        </Link>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
