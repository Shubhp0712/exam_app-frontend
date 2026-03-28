export interface Exam {
    _id: string;
    title: string;
    subject: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: string[];
    createdBy: string;
    isPublished: boolean;
    createdAt: string;
}

export interface CreateExamRequest {
    title: string;
    subject: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
}

export interface Question {
    _id: string;
    examId: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
    marks: number;
    createdAt: string;
}

export interface CreateQuestionRequest {
    examId: string;
    questionText: string;
    options: [string, string, string, string];
    correctAnswer: number;
    marks: number;
}
