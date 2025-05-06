"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Import components
import { VocabularyHeader } from "@/components/tests/results/VocabularyHeader";
import { TabNavigation } from "@/components/tests/results/TabNavigation";
import { VocabularySummaryContent } from "@/components/tests/results/VocabularySummaryContent";
import { DetailsTabContent } from "@/components/tests/results/DetailsTabContent";
import { VocabularyTestState } from "@/types/tests";

// Import localStorage utilities
import {
  getVocabularyTestState,
  clearVocabularyTestState,
} from "@/utils/test-storage";

export default function VocabularyTestResultsPage() {
  const router = useRouter();
  const [testState, setTestState] = useState<VocabularyTestState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "details">("summary");

  // Load test state from localStorage
  useEffect(() => {
    const storedState = getVocabularyTestState();

    if (!storedState || !storedState.testCompleted) {
      // If no completed test found, redirect to test page
      router.push("/tests/vocabulary-test");
      return;
    }

    setTestState(storedState);
    setIsLoading(false);
  }, []);

  const handleRetakeTest = async () => {
    // Clear current test state
    clearVocabularyTestState();

    // Redirect to test page
    router.push("/tests/vocabulary-test");
  };

  const handleBackToTests = () => {
    router.push("/tests");
  };

  const handleTabChange = (tab: "summary" | "details") => {
    setActiveTab(tab);
  };

  // Show loading state
  if (isLoading || !testState) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute w-16 h-16 border-2 border-sky-100 rounded-full"></div>
          <div className="absolute w-16 h-16 border-2 border-transparent border-t-sky-500 rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-2 border-transparent border-b-blue-500 rounded-full animate-spin-slow"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          Đang tải kết quả bài kiểm tra...
        </p>
      </div>
    );
  }

  // Show results
  return (
    <motion.div
      className="container mx-auto px-4 py-6 md:py-10 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Blue decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"></div>

      {/* Header Section */}
      <VocabularyHeader
        onBackToTests={handleBackToTests}
        onRetakeTest={handleRetakeTest}
      />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content Area */}
      <div className="relative z-10 grid grid-cols-1 gap-6">
        {/* Summary Tab */}
        {activeTab === "summary" && (
          <VocabularySummaryContent
            score={testState.score}
            questions={testState.questions}
            correctAnswers={testState.correctAnswers}
            incorrectAnswers={testState.incorrectAnswers}
            updating={false}
            onRetakeTest={handleRetakeTest}
            onBackToTests={handleBackToTests}
          />
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <DetailsTabContent
            questions={testState.questions}
            answers={testState.answers}
            correctAnswers={testState.correctAnswers}
          />
        )}
      </div>
    </motion.div>
  );
}
