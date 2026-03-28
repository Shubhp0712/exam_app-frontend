export interface Answer {
    questionId: string;
    selectedOption: number;
}

export interface Result {
    _id: string;
    examId: string;
    studentId: string;
    answers: Answer[];
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    status: 'pass' | 'fail';
    timeTaken: number;
    submittedAt: string;
}

export interface ExamStatistics {
    totalAttempts: number;
    passCount: number;
    failCount: number;
    averageMarks: number;
    averagePercentage: number;
}
