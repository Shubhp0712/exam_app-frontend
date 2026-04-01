'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { Exam } from '@/types/exam';
import Link from 'next/link';

export default function EditExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = params.id as string;
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        duration: 60,
        totalMarks: 100,
        passingMarks: 40,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadExamData = async () => {
            try {
                // Try to get from localStorage first (from admin page)
                const storedData = localStorage.getItem('editExamData');
                if (storedData) {
                    const exam = JSON.parse(storedData);
                    setFormData({
                        title: exam.title,
                        subject: exam.subject,
                        duration: exam.duration,
                        totalMarks: exam.totalMarks,
                        passingMarks: exam.passingMarks,
                    });
                    localStorage.removeItem('editExamData');
                } else {
                    // If not in localStorage, fetch from API
                    const exam = await examService.getExamById(examId);
                    setFormData({
                        title: exam.title,
                        subject: exam.subject,
                        duration: exam.duration,
                        totalMarks: exam.totalMarks,
                        passingMarks: exam.passingMarks,
                    });
                }
            } catch (err: any) {
                const errorMsg = err.response?.data?.message || 'Failed to load exam data';
                setError(errorMsg);
                console.error('Error loading exam:', err);
            } finally {
                setLoading(false);
            }
        };

        loadExamData();
    }, [examId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'title' || name === 'subject'
                ? value
                : (value === '' ? 0 : parseInt(value, 10)),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }
        if (!formData.subject.trim()) {
            setError('Subject is required');
            return;
        }
        if (formData.duration <= 0) {
            setError('Duration must be greater than 0');
            return;
        }
        if (formData.totalMarks <= 0) {
            setError('Total marks must be greater than 0');
            return;
        }
        if (formData.passingMarks >= formData.totalMarks) {
            setError('Passing marks must be less than total marks');
            return;
        }

        setSaving(true);

        try {
            await examService.updateExam(examId, formData);
            setSuccess('Exam updated successfully! Redirecting...');
            setTimeout(() => {
                router.push(`/admin`);
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to update exam';
            setError(errorMsg);
            console.error('Error updating exam:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute requiredRole="admin">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading exam data...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-2xl mx-auto px-6 py-8">
                <Link href="/admin" className="text-primary hover:underline mb-8 inline-block">
                    ← Back to Admin Panel
                </Link>

                <div className="card shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Exam</h1>

                    {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
                    {success && <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Exam Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Java Fundamentals"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Subject *</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Programming"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="label">Duration (minutes) *</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Total Marks *</label>
                                <input
                                    type="number"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Passing Marks *</label>
                            <input
                                type="number"
                                name="passingMarks"
                                value={formData.passingMarks}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                max={formData.totalMarks - 1}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary flex-1 font-semibold py-3"
                            >
                                {saving ? 'Updating...' : 'Update Exam'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-secondary flex-1 font-semibold py-3"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
