import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TestResultSummary } from "../TestResultSummary";
import { Question } from "@/types/tests";

type VocabularySummaryContentProps = {
  score: number;
  questions: Question[];
  correctAnswers: number[];
  incorrectAnswers: number[];
  updating: boolean;
  onRetakeTest: () => void;
  onBackToTests: () => void;
};

export function VocabularySummaryContent({
  score,
  questions,
  correctAnswers,
  incorrectAnswers,
  updating,
  onRetakeTest,
  onBackToTests,
}: VocabularySummaryContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Main result summary card */}
      <Card className="border border-sky-200 rounded-xl overflow-hidden bg-white p-0">
        <div className="bg-gradient-to-r from-blue-600 to-sky-400 py-4 px-6">
          <div className="flex items-center justify-center">
            <h2 className="text-lg font-semibold text-center text-white uppercase">
              Thông tin chi tiết kết quả
            </h2>
          </div>
        </div>
        <CardContent className="p-6">
          <TestResultSummary
            score={score}
            questions={questions}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
            updating={updating}
            onRetakeTest={onRetakeTest}
            onBackToTests={onBackToTests}
          />

          {/* Vocabulary Tips */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border border-sky-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-600">
              <div className="p-1 rounded bg-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              Mẹo học từ vựng
            </h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                Để cải thiện kết quả, hãy thử các phương pháp học từ vựng sau:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Lặp lại các từ thường xuyên trong ngày</li>
                <li>Sử dụng thẻ ghi nhớ (flashcards) để học từ mới</li>
                <li>Thực hành sử dụng từ trong câu</li>
                <li>Nhóm từ theo chủ đề để dễ nhớ</li>
                <li>Tạo bản đồ tư duy (mind map) cho các từ cùng chủ đề</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
