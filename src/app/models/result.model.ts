export interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect?: boolean;
  marksObtained?: number;
}

export interface Result {
  _id?: string;
  examId: string;
  studentId: string;
  answers: Answer[];
  totalMarksObtained: number;
  totalMarks: number;
  percentage: number;
  isPassed: boolean;
  submittedAt?: Date;
  timeTaken?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubmitExamRequest {
  examId: string;
  answers: Answer[];
  timeTaken: number;
}

export interface ExamStatistics {
  totalStudents: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  passPercentage: number;
  passedStudents?: number;
  failedStudents?: number;
}

export interface ResultResponse {
  success: boolean;
  count?: number;
  result?: Result;
  results?: Result[];
  statistics?: ExamStatistics;
  message?: string;
}
