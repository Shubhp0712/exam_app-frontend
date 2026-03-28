'use client';

import { Question } from '@/types/exam';

interface QuestionCardProps {
    question: Question;
    index: number;
    selectedAnswer?: number;
    onAnswerChange?: (questionId: string, selectedOption: number) => void;
    isReview?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    selectedAnswer,
    onAnswerChange,
    isReview,
}) => {
    return (
        <div className="card mb-6">
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Question {index + 1}
                    {isReview && (
                        <span className={`ml-2 text-sm font-normal ${selectedAnswer === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedAnswer === question.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    )}
                </h4>
                <p className="text-gray-700 mb-4">{question.questionText}</p>
                <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Marks:</span> {question.marks}
                </p>
            </div>

            <div className="space-y-3">
                {question.options.map((option, idx) => (
                    <label
                        key={idx}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedAnswer === idx
                                ? 'bg-primary/10 border-primary'
                                : isReview && idx === question.correctAnswer
                                    ? 'bg-green-50 border-green-300'
                                    : 'hover:bg-gray-50'
                            }`}
                    >
                        <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={idx}
                            checked={selectedAnswer === idx}
                            onChange={() => onAnswerChange?.(question._id, idx)}
                            disabled={isReview}
                            className="w-4 h-4 text-primary accent-primary"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
