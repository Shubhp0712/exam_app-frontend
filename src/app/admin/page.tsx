'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();

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
        } catch (err: any) {
            console.error('Failed to publish exam:', err);
            const errorMsg = err.response?.data?.message || 'Failed to publish exam';
            alert(errorMsg);
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

    const handleEdit = (exam: Exam) => {
        // Store exam data in localStorage for the edit page
        localStorage.setItem('editExamData', JSON.stringify(exam));
        router.push(`/admin/edit-exam/${exam._id}`);
    };

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary via-secondary to-cyan-500 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-bold mb-2">⚙️ Admin Control Center</h1>
                        <p className="text-xl opacity-90">Manage exams, questions, and view analytics</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'Total Exams', value: stats.totalExams, icon: '📋', color: 'from-blue-500 to-blue-600' },
                            { label: 'Draft Exams', value: stats.draftExams, icon: '🔒', color: 'from-yellow-500 to-yellow-600' },
                            { label: 'Published Exams', value: stats.publishedExams, icon: '✅', color: 'from-green-500 to-green-600' },
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold opacity-90">{stat.label}</p>
                                        <p className="text-4xl font-bold mt-2">{stat.value}</p>
                                    </div>
                                    <div className="text-5xl opacity-30">{stat.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mb-8 bg-white rounded-xl border border-gray-200 p-1 flex gap-1 overflow-x-auto">
                        {[
                            { label: '📋 Exams', href: '/admin', active: true },
                            { label: '❓ Questions', href: '/admin/manage-questions', active: false },
                            { label: '📊 Results', href: '/admin/results', active: false },
                        ].map((tab, idx) => (
                            <Link
                                key={idx}
                                href={tab.href}
                                className={`rx-lg whitespace-nowrap px-6 py-3 font-bold transition-all duration-200 ${tab.active
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-lg'
                                        : 'text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="mb-8">
                        <Link
                            href="/admin/create-exam"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                        >
                            ✍️ Create New Exam
                        </Link>
                    </div>

                    {/* Publishing Workflow Info */}
                    <div className="mb-12 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 rounded-r-xl">
                        <h3 className="font-bold text-cyan-900 mb-3 text-lg flex items-center gap-2">
                            📖 Publishing Workflow
                        </h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            {[
                                { step: 1, icon: '✍️', title: 'Create Exam', desc: 'Set title, duration, marks' },
                                { step: 2, icon: '❓', title: 'Add Questions', desc: 'Create questions with marks' },
                                { step: 3, icon: '🚀', title: 'Publish', desc: 'Make available to students' },
                            ].map((item) => (
                                <div key={item.step} className="flex-1 flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500 text-white font-bold">
                                            {item.step}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-cyan-900">{item.icon} {item.title}</h4>
                                        <p className="text-sm text-cyan-700">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exams List */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">📚 All Exams</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-600 text-lg">Loading exams...</p>
                            </div>
                        </div>
                    ) : exams.length > 0 ? (
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
                    ) : (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-600 text-xl font-semibold mb-6">No Exams Created Yet</p>
                            <Link
                                href="/admin/create-exam"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                            >
                                🚀 Create Your First Exam
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
