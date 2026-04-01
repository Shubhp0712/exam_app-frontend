'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { resultService } from '@/services/resultService';
import { QuestionCard } from '@/components/QuestionCard';
import { Exam, Question } from '@/types/exam';

export default function ExamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;

    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);

    useEffect(() => {
        loadExam();
    }, [examId]);

    // Timer countdown
    useEffect(() => {
        if (!exam || submitted || timeLeft === 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [exam, submitted, timeLeft]);

    const loadExam = async () => {
        try {
            setLoading(true);

            // Check if student has already completed this exam
            const completionCheck = await examService.checkExamCompletion(examId);
            if (completionCheck.isCompleted) {
                setAlreadyCompleted(true);
                setError('You have already completed this exam. Retaking is not allowed.');
                setLoading(false);
                return;
            }

            const examData = await examService.getExamById(examId);
            const questionsData = await examService.getExamQuestions(examId);

            setExam(examData);
            setQuestions(questionsData);
            setTimeLeft(examData.duration * 60);
        } catch (err: any) {
            setError('Failed to load exam');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, selectedOption: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmit = async () => {
        if (submitted) return;

        try {
            const examAnswers = questions.map((q) => ({
                questionId: q._id,
                selectedOption: answers[q._id] ?? -1,
            }));

            await resultService.submitExam({
                examId,
                answers: examAnswers,
                timeTaken: exam ? exam.duration * 60 - timeLeft : 0,
            });

            setSubmitted(true);
            router.push('/result');
        } catch (err: any) {
            setError('Failed to submit exam');
            console.error(err);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading exam...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (alreadyCompleted) {
        return (
            <ProtectedRoute>
                <div className="max-w-2xl mx-auto px-6 py-8 text-center">
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8">
                        <div className="text-6xl mb-4">❌</div>
                        <h1 className="text-3xl font-bold text-red-700 mb-4">Exam Already Completed</h1>
                        <p className="text-red-600 text-lg mb-6">
                            You have already completed this exam. Retaking is not allowed as per exam policy.
                        </p>
                        <p className="text-gray-600 mb-8">
                            To view your result, please go to your results page.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/result"
                                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors"
                            >
                                View Results
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!exam || questions.length === 0) {
        return (
            <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-6 py-8 text-center">
                    <p className="text-gray-600">Exam not found or has no questions.</p>
                </div>
            </ProtectedRoute>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <ProtectedRoute requiredRole="student">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">{exam.title}</h1>
                            <p className="text-gray-100">{exam.subject}</p>
                        </div>
                        <div className={`text-3xl font-bold px-6 py-3 rounded-lg ${timeLeft > 300 ? 'bg-white/20' : 'bg-red-500'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-100">Question</p>
                            <p className="font-bold text-lg">
                                {currentQuestionIndex + 1} / {questions.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-100">Answered</p>
                            <p className="font-bold text-lg">{Object.keys(answers).length}</p>
                        </div>
                        <div>
                            <p className="text-gray-100">Total Marks</p>
                            <p className="font-bold text-lg">{exam.totalMarks}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

                        <QuestionCard
                            question={currentQuestion}
                            index={currentQuestionIndex}
                            selectedAnswer={answers[currentQuestion._id]}
                            onAnswerChange={handleAnswerChange}
                        />

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="btn-secondary flex-1"
                            >
                                ← Previous
                            </button>

                            <button
                                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                                disabled={currentQuestionIndex === questions.length - 1}
                                className="btn-secondary flex-1"
                            >
                                Next →
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitted}
                            className="btn-primary w-full mt-6 py-3 font-bold text-lg"
                        >
                            {submitted ? 'Submitted' : 'Submit Exam'}
                        </button>
                    </div>

                    {/* Sidebar - Question List */}
                    <div className="card h-fit sticky top-20">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Questions</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => (
                                <button
                                    key={q._id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`aspect-square rounded-lg font-semibold transition-colors ${idx === currentQuestionIndex
                                        ? 'bg-primary text-white'
                                        : answers[q._id] !== undefined
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
