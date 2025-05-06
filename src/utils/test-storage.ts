import { ProficiencyTestState, VocabularyTestState } from "@/types/tests";

const PROFICIENCY_TEST_KEY = "proficiency_test_state";
const VOCABULARY_TEST_KEY = "vocabulary_test_state";

// ===== PROFICIENCY TEST FUNCTIONS =====

// Initialize proficiency test state in localStorage
export const initTestState = (
  initialState: Partial<ProficiencyTestState>
): ProficiencyTestState => {
  const defaultState: ProficiencyTestState = {
    questions: [],
    testMetadata: null,
    currentQuestionIndex: 0,
    answers: {},
    textInputs: {},
    testCompleted: false,
    score: 0,
    correctAnswers: [],
    incorrectAnswers: [],
    russianLevel: "",
    lastUpdated: Date.now(),
  };

  const newState = { ...defaultState, ...initialState };
  saveTestState(newState);
  return newState;
};

// Get proficiency test state from localStorage
export const getTestState = (): ProficiencyTestState | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedState = localStorage.getItem(PROFICIENCY_TEST_KEY);
    if (!storedState) return null;

    return JSON.parse(storedState) as ProficiencyTestState;
  } catch (error) {
    console.error("Error getting test state from localStorage:", error);
    return null;
  }
};

// Save proficiency test state to localStorage
export const saveTestState = (state: ProficiencyTestState): void => {
  if (typeof window === "undefined") return;

  try {
    const updatedState = { ...state, lastUpdated: Date.now() };
    localStorage.setItem(PROFICIENCY_TEST_KEY, JSON.stringify(updatedState));
  } catch (error) {
    console.error("Error saving test state to localStorage:", error);
  }
};

// Update proficiency test state in localStorage
export const updateTestState = (
  updates: Partial<ProficiencyTestState>
): ProficiencyTestState | null => {
  const currentState = getTestState();
  if (!currentState) return null;

  const updatedState = { ...currentState, ...updates, lastUpdated: Date.now() };
  saveTestState(updatedState);
  return updatedState;
};

// Clear proficiency test state from localStorage
export const clearTestState = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(PROFICIENCY_TEST_KEY);
  } catch (error) {
    console.error("Error clearing test state from localStorage:", error);
  }
};

// Check if proficiency test is still valid
export const isTestValid = (state: ProficiencyTestState): boolean => {
  // Bài kiểm tra luôn hợp lệ khi không còn giới hạn thời gian
  return true;
};

// ===== VOCABULARY TEST FUNCTIONS =====

// Initialize vocabulary test state in localStorage
export const initVocabularyTestState = (
  initialState: Partial<VocabularyTestState>
): VocabularyTestState => {
  const defaultState: VocabularyTestState = {
    questions: [],
    testMetadata: null,
    currentQuestionIndex: 0,
    answers: {},
    textInputs: {},
    testCompleted: false,
    score: 0,
    correctAnswers: [],
    incorrectAnswers: [],
    lastUpdated: Date.now(),
  };

  const newState = { ...defaultState, ...initialState };
  saveVocabularyTestState(newState);
  return newState;
};

// Get vocabulary test state from localStorage
export const getVocabularyTestState = (): VocabularyTestState | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedState = localStorage.getItem(VOCABULARY_TEST_KEY);
    if (!storedState) return null;

    return JSON.parse(storedState) as VocabularyTestState;
  } catch (error) {
    console.error(
      "Error getting vocabulary test state from localStorage:",
      error
    );
    return null;
  }
};

// Save vocabulary test state to localStorage
export const saveVocabularyTestState = (state: VocabularyTestState): void => {
  if (typeof window === "undefined") return;

  try {
    const updatedState = { ...state, lastUpdated: Date.now() };
    localStorage.setItem(VOCABULARY_TEST_KEY, JSON.stringify(updatedState));
  } catch (error) {
    console.error("Error saving vocabulary test state to localStorage:", error);
  }
};

// Update vocabulary test state in localStorage
export const updateVocabularyTestState = (
  updates: Partial<VocabularyTestState>
): VocabularyTestState | null => {
  const currentState = getVocabularyTestState();
  if (!currentState) return null;

  const updatedState = { ...currentState, ...updates, lastUpdated: Date.now() };
  saveVocabularyTestState(updatedState);
  return updatedState;
};

// Clear vocabulary test state from localStorage
export const clearVocabularyTestState = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(VOCABULARY_TEST_KEY);
  } catch (error) {
    console.error(
      "Error clearing vocabulary test state from localStorage:",
      error
    );
  }
};
