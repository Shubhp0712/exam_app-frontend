'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { resultService } from '@/services/resultService';
import { Result } from '@/types/result';
import Link from 'next/link';

export default function ResultPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            let data: Result[];

            if (isAdmin()) {
                data = await resultService.getAllResults();
            } else {
                data = await resultService.getStudentResults();
            }

            setResults(data);
        } catch (err: any) {
            console.error('Failed to load results:', err);
            setError('Failed to load results');
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
                        <p className="text-gray-600">Loading results...</p>
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

                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    {isAdmin() ? 'All Results' : 'Your Results'}
                </h1>

                {error && <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

                {results.length > 0 ? (
                    <div className="overflow-x-auto card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left p-4 font-semibold text-gray-700">Exam Name</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Marks</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Percentage</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Time Taken</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <tr key={result._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 text-gray-800 font-medium">Exam</td>
                                        <td className="p-4 text-gray-700">
                                            {result.marksObtained} / {result.totalMarks}
                                        </td>
                                        <td className="p-4 text-gray-700">{result.percentage.toFixed(2)}%</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${result.status === 'pass'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {result.status === 'pass' ? '✓ Passed' : '✗ Failed'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-700">{(result.timeTaken / 60).toFixed(1)} mins</td>
                                        <td className="p-4 text-gray-700">
                                            {new Date(result.submittedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 card">
                        <p className="text-gray-600 text-lg">No results available yet.</p>
                        <Link href="/exam" className="btn-primary mt-6 inline-block">
                            Take an Exam
                        </Link>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
