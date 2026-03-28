'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { Exam, Question } from '@/types/exam';
import Link from 'next/link';

export default function ManageQuestionsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        questionText: '',
        options: ['', '', '', ''] as [string, string, string, string],
        correctAnswer: 0,
        marks: 1,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadExams();
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            loadQuestions();
        }
    }, [selectedExamId]);

    const loadExams = async () => {
        try {
            const data = await examService.getAllExams();
            setExams(data);
        } catch (err) {
            console.error('Failed to load exams:', err);
        }
    };

    const loadQuestions = async () => {
        if (!selectedExamId) return;
        try {
            setLoading(true);
            const data = await examService.getExamQuestions(selectedExamId);
            setQuestions(data);
        } catch (err) {
            console.error('Failed to load questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(formData.options as string[])];
        newOptions[index] = value;
        setFormData((prev) => ({
            ...prev,
            options: newOptions as [string, string, string, string],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedExamId) {
            setError('Please select an exam');
            return;
        }
        if (!formData.questionText.trim()) {
            setError('Question text is required');
            return;
        }
        if (formData.options.some((opt) => !opt.trim())) {
            setError('All options are required');
            return;
        }

        setSubmitting(true);

        try {
            await examService.createQuestion({
                examId: selectedExamId,
                questionText: formData.questionText,
                options: formData.options as [string, string, string, string],
                correctAnswer: formData.correctAnswer,
                marks: formData.marks,
            });

            setSuccess('Question added successfully!');
            setFormData({
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                marks: 1,
            });
            await loadQuestions();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add question');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await examService.deleteQuestion(questionId);
                await loadQuestions();
            } catch (err) {
                console.error('Failed to delete question:', err);
                alert('Failed to delete question');
            }
        }
    };

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Link href="/admin" className="text-primary hover:underline mb-8 inline-block">
                    ← Back to Admin Panel
                </Link>

                <h1 className="text-4xl font-bold text-gray-800 mb-8">Manage Questions</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Question</h2>

                            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}
                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">{success}</div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="label text-sm">Select Exam *</label>
                                    <select
                                        value={selectedExamId}
                                        onChange={(e) => setSelectedExamId(e.target.value)}
                                        className="input-field text-sm"
                                    >
                                        <option value="">Choose an exam...</option>
                                        {exams.map((exam) => (
                                            <option key={exam._id} value={exam._id}>
                                                {exam.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label text-sm">Question Text *</label>
                                    <textarea
                                        value={formData.questionText}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, questionText: e.target.value }))}
                                        className="input-field text-sm resize-none"
                                        rows={3}
                                        placeholder="Enter question..."
                                        required
                                    />
                                </div>

                                {[0, 1, 2, 3].map((idx) => (
                                    <div key={idx}>
                                        <label className="label text-sm">Option {idx + 1} *</label>
                                        <input
                                            type="text"
                                            value={formData.options[idx]}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            className="input-field text-sm"
                                            placeholder={`Option ${idx + 1}`}
                                            required
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="label text-sm">Correct Answer *</label>
                                    <select
                                        value={formData.correctAnswer}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                                        className="input-field text-sm"
                                    >
                                        {[0, 1, 2, 3].map((idx) => (
                                            <option key={idx} value={idx}>
                                                Option {idx + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label text-sm">Marks *</label>
                                    <input
                                        type="number"
                                        value={formData.marks}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, marks: parseInt(e.target.value) }))}
                                        className="input-field text-sm"
                                        min="1"
                                        required
                                    />
                                </div>

                                <button type="submit" disabled={submitting || !selectedExamId} className="btn-primary w-full text-sm">
                                    {submitting ? 'Adding...' : 'Add Question'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="lg:col-span-2">
                        {selectedExamId ? (
                            loading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : questions.length > 0 ? (
                                <div className="space-y-4">
                                    {questions.map((question, idx) => (
                                        <div key={question._id} className="card">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-semibold text-gray-800">
                                                    Question {idx + 1}
                                                </h3>
                                                <span className="text-xs bg-primary text-white px-2 py-1 rounded">{question.marks} mark</span>
                                            </div>

                                            <p className="text-gray-700 mb-3">{question.questionText}</p>

                                            <div className="space-y-2 mb-4">
                                                {question.options.map((option, optIdx) => (
                                                    <div
                                                        key={optIdx}
                                                        className={`p-2 rounded text-sm ${optIdx === question.correctAnswer
                                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                                : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {String.fromCharCode(65 + optIdx)}) {option}
                                                        {optIdx === question.correctAnswer && <span className="ml-2 font-bold">✓</span>}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handleDeleteQuestion(question._id)}
                                                className="btn-danger text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 card">
                                    <p className="text-gray-600">No questions yet. Add your first question!</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Select an exam to view or add questions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
