import apiClient from './api';
import { Exam, CreateExamRequest, Question, CreateQuestionRequest } from '@/types/exam';

export const examService = {
    async getAllExams(): Promise<Exam[]> {
        const response = await apiClient.get<{ success: boolean; exams: Exam[] }>('/exams');
        return response.data.exams;
    },

    async getExamById(id: string): Promise<Exam> {
        const response = await apiClient.get<{ success: boolean; exam: Exam }>(`/exams/${id}`);
        return response.data.exam;
    },

    async createExam(data: CreateExamRequest): Promise<Exam> {
        const response = await apiClient.post<{ success: boolean; exam: Exam }>('/exams', data);
        return response.data.exam;
    },

    async updateExam(id: string, data: CreateExamRequest): Promise<Exam> {
        const response = await apiClient.put<{ success: boolean; exam: Exam }>(`/exams/${id}`, data);
        return response.data.exam;
    },

    async deleteExam(id: string): Promise<void> {
        await apiClient.delete(`/exams/${id}`);
    },

    async publishExam(id: string): Promise<Exam> {
        const response = await apiClient.put<{ success: boolean; exam: Exam }>(`/exams/${id}/publish`, {});
        return response.data.exam;
    },

    async getExamQuestions(examId: string): Promise<Question[]> {
        const response = await apiClient.get<{ success: boolean; questions: Question[] }>(`/questions/exam/${examId}`);
        return response.data.questions;
    },

    async createQuestion(data: CreateQuestionRequest): Promise<Question> {
        const response = await apiClient.post<{ success: boolean; question: Question }>('/questions', data);
        return response.data.question;
    },

    async deleteQuestion(id: string): Promise<void> {
        await apiClient.delete(`/questions/${id}`);
    },

    async checkExamCompletion(examId: string): Promise<{ isCompleted: boolean; result?: any }> {
        const response = await apiClient.get<{ success: boolean; isCompleted: boolean; result?: any }>(`/exams/${examId}/check-completion`);
        return {
            isCompleted: response.data.isCompleted,
            result: response.data.result,
        };
    },
};
