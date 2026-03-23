/**
 * constants/graphr.js
 * ═══════════════════════════════════════════════════════════════════════════════
 * GraphR App Constants & Configuration
 * Central location for all app-wide constants:
 * • Color palette (education blue, success green, dark mode)
 * • Calculator layouts & modes
 * • Demo data (classrooms, exams, students)
 * • Utility functions for grading, formatting
 * • Subscription tier definitions
 * • Calculator button configurations
 * Keep everything synchronized. One source of truth.
 * Designed by Pawan K Jajoo
 */

// COLOR PALETTE
// Education-focused design: blue (), green (), dark backgrounds
export const COLORS = {
  // Primary branding
  primary: "",           // Education blue - primary CTA, highlights
  success: "",           // Success green - grades, achievements
  warning: "",           // Warning yellow
  error: "",             // Error red

  // Backgrounds
  dark: "",              // Dark background
  darkSecondary: "",     // Secondary dark surface
  darkTertiary: "",      // Tertiary dark surface

  // Text
  text: "",              // Primary text
  textSecondary: "",     // Secondary text
  textMuted: "",         // Muted text

  // UI elements
  border: "",            // Border color
  input: "",             // Input background
  shadow: "rgba(0, 0, 0, 0.3)", // Shadow color
};

// SUBSCRIPTION TIERS
// Free, Pro, School (district-level)
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    features: ["Basic Calculator", "Limited Exams"],
    price: "Free",
  },
  pro: {
    name: "GraphR Pro",
    features: [
      "All Calculator Modes",
      "Graphing",
      "Unlimited Exams",
      "Advanced Analytics",
      "Custom Skins",
    ],
    price: "$4.99/month",
  },
  school: {
    name: "School District",
    features: [
      "Unlimited Students",
      "Teacher Dashboard",
      "Real-time Proctoring",
      "Custom Assessments",
      "District Analytics",
    ],
    price: "Custom Pricing",
  },
};

// CALCULATOR LAYOUTS
// Basic: 12 buttons, Scientific: 20+ buttons, Graphing: equation input + graph
export const CALCULATOR_BUTTONS = {
  basic: [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ],
  scientific: [
    ["sin", "cos", "tan", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "=", "C"],
    ["x^2", "sqrt", "log", "ln"],
    ["(", ")", "pi", "e"],
  ],
};

// DEMO CLASSROOMS
// Sample data for development and demos
export const INITIAL_CLASSROOMS = [
  {
    id: "class_001",
    name: "Algebra I",
    teacher: "Mr. Johnson",
    school: "Lincoln High School",
    students: 28,
    code: "ALG001",
    description: "Introduction to algebraic concepts and problem-solving",
  },
  {
    id: "class_002",
    name: "Geometry",
    teacher: "Ms. Chen",
    school: "Lincoln High School",
    students: 24,
    code: "GEO002",
    description: "Geometric proofs and spatial reasoning",
  },
  {
    id: "class_003",
    name: "Calculus AB",
    teacher: "Dr. Williams",
    school: "Lincoln High School",
    students: 18,
    code: "CAL003",
    description: "Introduction to derivatives and integrals",
  },
];

// DEMO EXAMS
// Sample exams for classrooms
export const INITIAL_EXAMS = [
  {
    id: "exam_001",
    classroomId: "class_001",
    title: "Algebra Midterm",
    description: "Midterm examination covering chapters 1-5",
    duration: 60,
    totalPoints: 100,
    dueDate: "2026-04-15",
    createdDate: "2026-03-23",
    restrictions: {
      restrictGraphing: true,
      restrictScientific: false,
      allowedCalculatorMode: "basic",
    },
    questions: [
      { id: 1, text: "Solve for x: 2x + 5 = 15", points: 10 },
      { id: 2, text: "Factor: x^2 + 5x + 6", points: 10 },
      { id: 3, text: "Simplify: (3x^2 + 2x) / x", points: 10 },
    ],
  },
  {
    id: "exam_002",
    classroomId: "class_002",
    title: "Geometry Quiz 1",
    description: "Quick assessment on angle relationships",
    duration: 30,
    totalPoints: 50,
    dueDate: "2026-03-30",
    createdDate: "2026-03-23",
    restrictions: {
      restrictGraphing: true,
      restrictScientific: false,
      allowedCalculatorMode: "basic",
    },
    questions: [
      { id: 1, text: "Find the area of a triangle with base 10 and height 8", points: 10 },
    ],
  },
];

// DEMO STUDENTS
// Sample student data
export const INITIAL_STUDENTS = [
  {
    id: "student_001",
    name: "Alex Martinez",
    email: "alex@school.edu",
    classroomId: "class_001",
    examResults: [
      { examId: "exam_001", score: 85, date: "2026-03-23" },
    ],
  },
  {
    id: "student_002",
    name: "Jordan Lee",
    email: "jordan@school.edu",
    classroomId: "class_001",
    examResults: [
      { examId: "exam_001", score: 92, date: "2026-03-23" },
    ],
  },
];

// UTILITY FUNCTIONS
// Formatting, grading, calculations

/**
 * Format a score with points and percentage
 * @param {number} score - The numeric score
 * @param {number} total - The total possible points
 * @returns {string} Formatted score string
 */
export const formatScore = (score, total = 100) => {
  const percentage = Math.round((score / total) * 100);
  return `${score}/${total} (${percentage}%)`;
};

/**
 * Calculate letter grade from percentage
 * Uses standard grading scale: A (90+), B (80-89), C (70-79), D (60-69), F (<60)
 * @param {number} percentage - Percentage score (0-100)
 * @returns {string} Letter grade (A, B, C, D, F)
 */
export const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

/**
 * Get grade color based on letter grade
 * @param {string} grade - Letter grade
 * @returns {string} Hex color code
 */
export const getGradeColor = (grade) => {
  switch (grade) {
    case "A":
      return COLORS.success;
    case "B":
      return "";
    case "C":
      return COLORS.warning;
    case "D":
      return "";
    case "F":
      return COLORS.error;
    default:
      return COLORS.textMuted;
  }
};

/**
 * Format time remaining (in seconds) to human-readable format
 * @param {number} seconds - Seconds remaining
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTimeRemaining = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Validate a mathematical expression
 * Basic validation: check for balanced parentheses, valid operators
 * @param {string} expression - Mathematical expression to validate
 * @returns {boolean} True if expression appears valid
 */
export const validateExpression = (expression) => {
  if (!expression) return false;

  // Count parentheses
  const openParen = (expression.match(/\(/g) || []).length;
  const closeParen = (expression.match(/\)/g) || []).length;

  if (openParen !== closeParen) return false;

  // Check for invalid characters
  const validChars = /^[0-9+\-*/.()^x\s]+$/;
  return validChars.test(expression);
};

/**
 * Calculate weighted score from multiple exam results
 * @param {array} results - Array of { score, weight } objects
 * @returns {number} Weighted average score
 */
export const calculateWeightedScore = (results) => {
  let totalWeight = 0;
  let weightedSum = 0;

  results.forEach(({ score, weight = 1 }) => {
    totalWeight += weight;
    weightedSum += score * weight;
  });

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
};

// CALCULATOR OPERATIONS
// Core mathematical functions

/**
 * Evaluate a basic mathematical expression
 * @param {string} expression - Math expression (e.g., "2+3*4")
 * @returns {number} Result of calculation
 */
export const evaluateExpression = (expression) => {
  try {
    // Remove spaces
    expression = expression.replace(/\s/g, "");

    // Replace x with * for multiplication
    expression = expression.replace(/x/g, "*");

    // Use Function constructor for safe evaluation
    // Note: In production, use a safer math parser library
    const result = Function('"use strict"; return (' + expression + ")")();
    return result;
  } catch (error) {
    return NaN;
  }
};

/**
 * Format a number with appropriate decimal places
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Round to 6 decimal places to avoid floating point errors
  return parseFloat(num.toFixed(6)).toString();
};

// APP CONFIGURATION

export const APP_CONFIG = {
  name: "GraphR",
  tagline: "",
  company: "GraphR",
  version: "1.0.0",
  copyrightYear: 2026,
  supportEmail: "support@graphr.app",
  privacyPolicyUrl: "https://graphr.app/privacy",
  termsUrl: "https://graphr.app/terms",
};

// EXAM MODE SETTINGS

export const EXAM_MODE_CONFIG = {
  // Detect if student exits exam (switches to different app)
  detectionEnabled: true,
  // Notify teacher of violations
  notifyTeacher: true,
  // Allow student to use phone for emergencies (calls only)
  allowEmergencyCalls: true,
  // Log all calculator inputs during exam
  logInputs: true,
  // Auto-save exam responses every 30 seconds
  autoSaveInterval: 30000,
  // Maximum violation count before auto-submit
  maxViolations: 5,
};

// IAP PRODUCT CONFIGURATION
// Must match App Store Connect & Google Play exactly
export const IAP_PRODUCT_IDS = [
  "com.graphrapp.graphr.pro_monthly",
  "com.graphrapp.graphr.pro_annual",
];

export const IAP_PRODUCTS = [
  {
    productId: "com.graphrapp.graphr.pro_monthly",
    name: "GraphR Pro",
    tier: "pro",
    duration: "monthly",
    price: "$4.99",
    displayPrice: "$4.99/month",
    features: ["All calculator modes", "Graphing", "Unlimited exams", "Advanced analytics"],
  },
  {
    productId: "com.graphrapp.graphr.pro_annual",
    name: "GraphR Pro (Annual)",
    tier: "pro",
    duration: "annual",
    price: "$49.99",
    displayPrice: "$49.99/year",
    features: ["All calculator modes", "Graphing", "Unlimited exams", "Advanced analytics"],
  },
];
