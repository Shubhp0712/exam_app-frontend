import apiClient from './api';
import { Result, ExamStatistics } from '@/types/result';

export interface SubmitExamRequest {
    examId: string;
    answers: Array<{
        questionId: string;
        selectedOption: number;
    }>;
    timeTaken: number;
}

export const resultService = {
    async submitExam(data: SubmitExamRequest): Promise<Result> {
        const response = await apiClient.post<{ success: boolean; result: any }>('/results/submit', data);
        return this.normalizeResult(response.data.result);
    },

    async getStudentResults(): Promise<Result[]> {
        const response = await apiClient.get<{ success: boolean; results: any[] }>('/results/student/me');
        return response.data.results.map((r) => this.normalizeResult(r));
    },

    async getExamStats(examId: string): Promise<ExamStatistics> {
        const response = await apiClient.get<{ success: boolean; statistics: ExamStatistics }>(`/results/exam/${examId}/statistics`);
        return response.data.statistics;
    },

    async getExamResults(examId: string): Promise<any[]> {
        const response = await apiClient.get<{ success: boolean; results: any[] }>(`/results/exam/${examId}`);
        return response.data.results;
    },

    async getAllResults(): Promise<Result[]> {
        const response = await apiClient.get<{ success: boolean; results: any[] }>('/results');
        return response.data.results.map((r) => this.normalizeResult(r));
    },

    normalizeResult(result: any): Result {
        return {
            _id: result._id,
            examId: result.examId,
            studentId: result.studentId,
            answers: result.answers || [],
            marksObtained: result.totalMarksObtained || 0,
            totalMarks: result.totalMarks,
            percentage: result.percentage,
            status: result.isPassed ? 'pass' : 'fail',
            timeTaken: result.timeTaken || 0,
            submittedAt: result.submittedAt,
        };
    },
};
