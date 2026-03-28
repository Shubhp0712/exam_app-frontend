export interface Exam {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  questions?: string[];
  createdBy?: string;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  subject: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ExamResponse {
  success: boolean;
  count?: number;
  exam?: Exam;
  exams?: Exam[];
  message?: string;
}
