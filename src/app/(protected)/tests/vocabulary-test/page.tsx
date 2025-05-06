"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  SkipForward,
  Brain,
  Book,
  ChevronLeft,
  ListChecks,
  MessageCircleQuestion,
  BadgeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { vocabularyService } from "@/services/ai/test";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TestResultSummary } from "@/components/tests/TestResultSummary";
import { TestResultDetails } from "@/components/tests/TestResultDetails";
import { QuestionReviewPanel } from "@/components/tests/QuestionReviewPanel";
import { QuestionRenderer } from "@/components/tests/QuestionRenderer";
import { Question } from "@/types/tests";
import {
  getVocabularyTestState,
  initVocabularyTestState,
  updateVocabularyTestState,
  clearVocabularyTestState,
} from "@/utils/test-storage";

interface VocabularyItem {
  id: number;
  russian: string;
  vietnamese: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export default function VocabularyTestPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [textInputs, setTextInputs] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Kiểm tra nếu đã có bài kiểm tra trong localStorage
  useEffect(() => {
    const existingTest = getVocabularyTestState();

    if (existingTest) {
      // Nếu bài kiểm tra đã hoàn thành, chuyển hướng đến trang kết quả
      if (existingTest.testCompleted) {
        router.push("/tests/vocabulary-test/results");
        return;
      }

      // Tiếp tục bài kiểm tra đang làm dở
      setQuestions(existingTest.questions);
      setCurrentItemIndex(existingTest.currentQuestionIndex);
      setAnswers(existingTest.answers);
      setTextInputs(existingTest.textInputs);
      setIsLoading(false);

      // Chuyển đổi ngược lại từ questions sang vocabularyItems (để duy trì khả năng tương thích)
      const items: VocabularyItem[] = existingTest.questions.map((q) => ({
        id: q.id,
        russian: q.question,
        vietnamese: q.correct_answer as string,
        options: q.options || [],
        correct_answer: q.correct_answer as string,
      }));
      setVocabularyItems(items);
    } else {
      // Tạo bài kiểm tra mới
      generateVocabularyTest();
    }
  }, []);

  // Cập nhật localStorage khi state thay đổi
  useEffect(() => {
    if (isLoading || !questions.length) return;

    updateVocabularyTestState({
      questions,
      currentQuestionIndex: currentItemIndex,
      answers,
      textInputs,
    });
  }, [questions, currentItemIndex, answers, textInputs]);

  const generateVocabularyTest = async () => {
    setIsGeneratingTest(true);
    setErrorMessage(null);

    try {
      // Get user's Russian level from session if available
      const userLevel = session?.user?.metadata?.russian_level || "A1";

      // Call Gemini AI service to generate vocabulary test
      const items = await vocabularyService.generateVocabularyTest({
        level: userLevel as any,
        count: 20,
        topic: "general",
      });

      setVocabularyItems(items);

      // Convert VocabularyItems to Questions format
      const convertedQuestions: Question[] = items.map((item) => ({
        id: item.id,
        question: item.russian,
        options: item.options,
        correct_answer: item.correct_answer,
        type: "single",
      }));

      setQuestions(convertedQuestions);

      // Khởi tạo state trong localStorage
      initVocabularyTestState({
        questions: convertedQuestions,
      });

      setIsLoading(false);
      setIsGeneratingTest(false);

      toast.success("Bài kiểm tra từ vựng đã được tạo thành công!", {
        description:
          "Sử dụng Gemini AI để tạo các câu hỏi phù hợp với trình độ của bạn.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error generating vocabulary test:", error);
      setErrorMessage("Không thể tạo bài kiểm tra. Vui lòng thử lại sau.");
      setIsLoading(false);
      setIsGeneratingTest(false);

      toast.error("Lỗi khi tạo bài kiểm tra", {
        description: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      });

      // Fallback to mock data if Gemini AI fails
      const mockItems: VocabularyItem[] = [
        {
          id: 1,
          russian: "Здравствуйте",
          vietnamese: "Xin chào",
          options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
          correct_answer: "Xin chào",
        },
        {
          id: 2,
          russian: "Спасибо",
          vietnamese: "Cảm ơn",
          options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
          correct_answer: "Cảm ơn",
        },
        {
          id: 3,
          russian: "До свидания",
          vietnamese: "Tạm biệt",
          options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
          correct_answer: "Tạm biệt",
        },
        {
          id: 4,
          russian: "Извините",
          vietnamese: "Xin lỗi",
          options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
          correct_answer: "Xin lỗi",
        },
        {
          id: 5,
          russian: "Да",
          vietnamese: "Có",
          options: ["Có", "Không", "Được", "Tốt"],
          correct_answer: "Có",
        },
        {
          id: 6,
          russian: "Нет",
          vietnamese: "Không",
          options: ["Có", "Không", "Được", "Tốt"],
          correct_answer: "Không",
        },
        {
          id: 7,
          russian: "Хорошо",
          vietnamese: "Tốt",
          options: ["Có", "Không", "Được", "Tốt"],
          correct_answer: "Tốt",
        },
        {
          id: 8,
          russian: "Пожалуйста",
          vietnamese: "Làm ơn",
          options: ["Làm ơn", "Cảm ơn", "Xin lỗi", "Tạm biệt"],
          correct_answer: "Làm ơn",
        },
        {
          id: 9,
          russian: "Как дела?",
          vietnamese: "Bạn khỏe không?",
          options: [
            "Bạn khỏe không?",
            "Tôi khỏe",
            "Bạn tên gì?",
            "Gặp lại sau",
          ],
          correct_answer: "Bạn khỏe không?",
        },
        {
          id: 10,
          russian: "Я не понимаю",
          vietnamese: "Tôi không hiểu",
          options: ["Tôi không hiểu", "Tôi hiểu", "Tôi không biết", "Tôi biết"],
          correct_answer: "Tôi không hiểu",
        },
        {
          id: 11,
          russian: "Меня зовут",
          vietnamese: "Tôi tên là",
          options: [
            "Tôi tên là",
            "Bạn tên là",
            "Anh ấy tên là",
            "Cô ấy tên là",
          ],
          correct_answer: "Tôi tên là",
        },
        {
          id: 12,
          russian: "Доброе утро",
          vietnamese: "Chào buổi sáng",
          options: [
            "Chào buổi sáng",
            "Chào buổi chiều",
            "Chào buổi tối",
            "Chúc ngủ ngon",
          ],
          correct_answer: "Chào buổi sáng",
        },
        {
          id: 13,
          russian: "Добрый вечер",
          vietnamese: "Chào buổi tối",
          options: [
            "Chào buổi sáng",
            "Chào buổi chiều",
            "Chào buổi tối",
            "Chúc ngủ ngon",
          ],
          correct_answer: "Chào buổi tối",
        },
        {
          id: 14,
          russian: "Один",
          vietnamese: "Một",
          options: ["Một", "Hai", "Ba", "Bốn"],
          correct_answer: "Một",
        },
        {
          id: 15,
          russian: "Два",
          vietnamese: "Hai",
          options: ["Một", "Hai", "Ba", "Bốn"],
          correct_answer: "Hai",
        },
        {
          id: 16,
          russian: "Три",
          vietnamese: "Ba",
          options: ["Một", "Hai", "Ba", "Bốn"],
          correct_answer: "Ba",
        },
        {
          id: 17,
          russian: "Вода",
          vietnamese: "Nước",
          options: ["Nước", "Lửa", "Đất", "Không khí"],
          correct_answer: "Nước",
        },
        {
          id: 18,
          russian: "Хлеб",
          vietnamese: "Bánh mì",
          options: ["Bánh mì", "Cơm", "Thịt", "Rau"],
          correct_answer: "Bánh mì",
        },
        {
          id: 19,
          russian: "Книга",
          vietnamese: "Sách",
          options: ["Sách", "Bút", "Bàn", "Ghế"],
          correct_answer: "Sách",
        },
        {
          id: 20,
          russian: "Дом",
          vietnamese: "Nhà",
          options: ["Nhà", "Trường học", "Công viên", "Bệnh viện"],
          correct_answer: "Nhà",
        },
      ];

      setVocabularyItems(mockItems);

      // Convert mock items to Questions format
      const convertedQuestions: Question[] = mockItems.map((item) => ({
        id: item.id,
        question: item.russian,
        options: item.options,
        correct_answer: item.correct_answer,
        type: "single",
      }));

      setQuestions(convertedQuestions);

      // Khởi tạo state trong localStorage
      initVocabularyTestState({
        questions: convertedQuestions,
      });

      setIsLoading(false);
      setIsGeneratingTest(false);

      toast.info("Đang sử dụng dữ liệu dự phòng", {
        description:
          "Không thể kết nối với Gemini AI. Đang sử dụng bài kiểm tra cơ bản.",
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentItemIndex];

    if (currentQuestion.type === "multiple") {
      // For multiple choice questions, handle selecting/deselecting options
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      let newAnswers: string[];

      if (currentAnswers.includes(answer)) {
        // If already selected, remove it
        newAnswers = currentAnswers.filter((item) => item !== answer);
      } else {
        // If not selected, add it
        newAnswers = [...currentAnswers, answer];
      }

      setAnswers({
        ...answers,
        [currentQuestion.id]: newAnswers,
      });
    } else {
      // For single choice questions
      setAnswers({
        ...answers,
        [currentQuestion.id]: answer,
      });
    }
  };

  const handleTextInputChange = (text: string) => {
    const currentQuestion = questions[currentItemIndex];
    setTextInputs({
      ...textInputs,
      [currentQuestion.id]: text,
    });

    // Also update answers for consistency in score calculation
    setAnswers({
      ...answers,
      [currentQuestion.id]: text,
    });
  };

  const handleNextQuestion = () => {
    if (currentItemIndex < questions.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    // Calculate score
    let correctCount = 0;
    const correct: number[] = [];
    const incorrect: number[] = [];

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correct_answer;

      if (question.type === "multiple") {
        // Handle multiple choice questions
        const userAnswerArray = (userAnswer as string[]) || [];
        const correctAnswerArray = correctAnswer as string[];

        // Check if arrays have the same items
        const isCorrect =
          userAnswerArray.length === correctAnswerArray.length &&
          userAnswerArray.every((item) => correctAnswerArray.includes(item));

        if (isCorrect) {
          correctCount++;
          correct.push(question.id);
        } else if (userAnswer) {
          incorrect.push(question.id);
        }
      } else {
        // Handle single choice questions
        if (userAnswer === correctAnswer) {
          correctCount++;
          correct.push(question.id);
        } else if (userAnswer) {
          incorrect.push(question.id);
        }
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);

    setScore(finalScore);
    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);
    setTestCompleted(true);

    // Cập nhật kết quả trong localStorage
    updateVocabularyTestState({
      testCompleted: true,
      score: finalScore,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
    });

    // Chuyển hướng đến trang kết quả
    router.push("/tests/vocabulary-test/results");

    toast.success(
      `Bạn đã hoàn thành bài kiểm tra với số điểm: ${finalScore}%`,
      {
        description: `Số câu đúng: ${correctCount}/${questions.length}`,
        duration: 5000,
      }
    );
  };

  // Helper to check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!questions[currentItemIndex]) return false;

    const currentQuestion = questions[currentItemIndex];

    if (currentQuestion.type === "multiple") {
      const ans = answers[currentQuestion.id] as string[] | undefined;
      return ans !== undefined && ans.length > 0;
    }

    return answers[currentQuestion.id] !== undefined;
  };

  const handleRetakeTest = async () => {
    clearVocabularyTestState();
    setAnswers({});
    setCurrentItemIndex(0);
    setTestCompleted(false);
    setCorrectAnswers([]);
    setIncorrectAnswers([]);
    setIsLoading(true);
    setTextInputs({});

    toast.info("Đang tạo bài kiểm tra mới", {
      description: "Gemini AI đang tạo bài kiểm tra mới cho bạn.",
    });

    // Generate a new test with Gemini AI
    generateVocabularyTest();
  };

  const handleBackToTests = () => {
    router.push("/tests");
  };

  const handleSkipTest = () => {
    clearVocabularyTestState();
    setShowSkipDialog(false);
    router.push("/tests");
    toast.info("Đã bỏ qua bài kiểm tra", {
      description: "Bạn có thể quay lại làm bài kiểm tra bất cứ lúc nào.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">
          {isGeneratingTest
            ? "Đang tạo bài kiểm tra từ vựng..."
            : "Đang tải bài kiểm tra..."}
        </p>
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 rounded-md text-red-500 max-w-md text-center">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2"
          onClick={handleBackToTests}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách bài kiểm tra
        </Button>

        {/* Title Section */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Kết Quả Bài Kiểm Tra Từ Vựng
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Cảm ơn bạn đã hoàn thành bài kiểm tra. Dưới đây là kết quả của bạn.
          </p>
        </div>

        {/* Blue decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"></div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8 overflow-x-auto">
            <div className="border-b-2 border-blue-500 pb-2 px-1">
              <span className="text-blue-600 font-medium">Tổng quan</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Results Summary */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
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
                    updating={false}
                    onRetakeTest={handleRetakeTest}
                    onBackToTests={handleBackToTests}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Questions Review */}
          <div className="lg:col-span-4">
            <Card className="border border-sky-200 rounded-xl overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-blue-600 to-sky-400 py-4 px-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>Các câu trả lời của bạn</span>
                </h2>
              </div>
              <CardContent className="p-6">
                <TestResultDetails
                  questions={questions}
                  answers={answers}
                  correctAnswers={correctAnswers}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main test view
  const currentQuestion = questions[currentItemIndex];
  const progress = ((currentItemIndex + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex items-start gap-4 justify-start">
        <div
          onClick={() => setShowSkipDialog(true)}
          className="h-10 w-10 text-blue-500 cursor-pointer"
        >
          <ChevronLeft className="h-9 w-9" />
        </div>
        {/* Title Section */}
        <div className="mb-6 text-start">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Kiểm tra từ vựng
          </h1>
          <p className="text-blue-900/60 max-w-2xl mt-2">
            Chọn nghĩa tiếng Việt cho từ tiếng Nga
          </p>
        </div>
      </div>

      {/* Skip Test Confirmation Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn dừng?</AlertDialogTitle>
            <AlertDialogDescription>
              Tiến trình làm bài kiểm tra của bạn sẽ bị mất. Bạn sẽ phải bắt đầu
              lại từ đầu vào lần sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkipTest}>
              Dừng bài kiểm tra
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Review Panel - Left Side */}
        <div className="lg:col-span-3">
          <QuestionReviewPanel
            questions={questions}
            currentIndex={currentItemIndex}
            answers={answers}
            onSelectQuestion={setCurrentItemIndex}
            onSubmitTest={handleSubmitTest}
            onShowSkipDialog={() => setShowSkipDialog(true)}
          />
        </div>

        {/* Main Question Area - Right Side */}
        <div className="lg:col-span-9">
          {currentQuestion ? (
            <Card className="border border-blue-100 mb-4 overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-sky-500 font-medium flex items-center gap-1">
                    <MessageCircleQuestion className="h-4 w-4" />
                    Câu hỏi {currentItemIndex + 1}/{questions.length}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItemIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                      {currentQuestion.question}
                    </h2>

                    {/* Sử dụng component QuestionRenderer */}
                    <QuestionRenderer
                      question={currentQuestion}
                      answers={answers}
                      textInputs={textInputs}
                      onSelectAnswer={handleAnswerSelect}
                      onTextInputChange={handleTextInputChange}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentItemIndex === 0}
                    className="px-6 text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                  >
                    Câu trước
                  </Button>

                  {currentItemIndex === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitTest}
                      disabled={!isCurrentQuestionAnswered()}
                      className="px-6 bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500"
                    >
                      Hoàn thành bài kiểm tra
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!isCurrentQuestionAnswered()}
                      className="px-6 bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500"
                    >
                      Câu tiếp theo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Không có câu hỏi nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
