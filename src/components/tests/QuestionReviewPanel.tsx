import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, BadgeX, PackageCheck } from "lucide-react";
import { Question } from "@/types/tests";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface QuestionReviewPanelProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string | string[]>;
  onSelectQuestion: (index: number) => void;
  onSubmitTest: () => void;
  onShowSkipDialog: () => void;
}

export function QuestionReviewPanel({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
  onSubmitTest,
  onShowSkipDialog,
}: QuestionReviewPanelProps) {
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  // Tạo các nhóm câu hỏi, mỗi nhóm 5 câu
  const questionGroups = [];
  for (let i = 0; i < questions.length; i += 5) {
    questionGroups.push(questions.slice(i, i + 5));
  }

  return (
    <Card className="border border-blue-100 p-6 overflow-y-auto shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Danh sách câu hỏi
          </h3>
          <div className="text-sky-500 text-sm flex items-center gap-1">
            <PackageCheck className="h-4 w-4" />
            {answeredCount}/{totalQuestions} câu
          </div>
        </div>
      </div>

      <Separator className="bg-blue-100" />

      <div className="space-y-4">
        {questionGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex justify-between">
            {group.map((question, index) => {
              const questionIndex = groupIndex * 5 + index;
              const hasAnswer = answers[question.id] !== undefined;
              const isActive = questionIndex === currentIndex;

              return (
                <button
                  key={question.id}
                  onClick={() => onSelectQuestion(questionIndex)}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-sm transition-all
                    ${isActive ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                    ${
                      hasAnswer
                        ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white hover:opacity-90 font-medium"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }
                  `}
                >
                  {questionIndex + 1}
                </button>
              );
            })}
            {/* Thêm các button giả để giữ nguyên bố cục */}
            {Array(5 - group.length)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-12 h-12"></div>
              ))}
          </div>
        ))}
      </div>

      <Separator className="bg-blue-100" />

      <div className="space-y-4">
        <Button
          onClick={onSubmitTest}
          className="w-full bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500 flex items-center justify-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Nộp bài kiểm tra
        </Button>

        <Button
          variant="outline"
          onClick={onShowSkipDialog}
          className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2"
        >
          <BadgeX className="h-4 w-4" />
          Hủy bài kiểm tra
        </Button>
      </div>
    </Card>
  );
}
