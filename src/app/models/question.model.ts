export interface Option {
  option: string;
  isCorrect?: boolean;
}

export interface Question {
  _id?: string;
  examId: string;
  questionText: string;
  questionType: 'mcq';
  options: Option[];
  correctAnswer: string;
  marks: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateQuestionRequest {
  examId: string;
  questionText: string;
  options: Option[];
  correctAnswer: string;
  marks?: number;
}

export interface QuestionResponse {
  success: boolean;
  count?: number;
  question?: Question;
  questions?: Question[];
  message?: string;
}
