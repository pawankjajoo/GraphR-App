/*
 * screens/GradeBookScreen.js
 *
 * Grade Book Screen - Instant Grading & Results
 * Displays exam results:
 * • Instant grading after exam submission
 * • Performance analysis
 * • Question-by-question breakdown
 * • Weighted/unweighted scoring
 * • Historical results tracking
 * See your progress. Understand your strengths. Identify areas for growth.
 */

import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView,
} from "react-native";
import { COLORS, formatScore, calculateGrade, getGradeColor } from "../constants/graphr";

export default function GradeBookScreen({ showToast }) {
  const [selectedResult, setSelectedResult] = useState(null);

  // Sample grade data
  const results = [
    {
      id: 1,
      examTitle: "Algebra Midterm",
      date: "2026-03-23",
      score: 85,
      total: 100,
      grade: "B",
      questions: [
        { num: 1, score: 10, total: 10, status: "correct" },
        { num: 2, score: 8, total: 10, status: "partial" },
        { num: 3, score: 10, total: 10, status: "correct" },
      ],
    },
    {
      id: 2,
      examTitle: "Geometry Quiz 1",
      date: "2026-03-20",
      score: 92,
      total: 100,
      grade: "A",
      questions: [
        { num: 1, score: 10, total: 10, status: "correct" },
      ],
    },
  ];

  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.resultCard,
        selectedResult?.id === item.id && styles.resultCardActive,
      ]}
      onPress={() => setSelectedResult(item)}
    >
      <View style={styles.resultHeader}>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.examTitle}</Text>
          <Text style={styles.resultDate}>{item.date}</Text>
        </View>
        <View style={styles.gradeContainer}>
          <Text
            style={[
              styles.gradeLetter,
              { color: getGradeColor(item.grade) },
            ]}
          >
            {item.grade}
          </Text>
          <Text style={styles.scoreText}>{item.score}/{item.total}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(item.score / item.total) * 100}%`, backgroundColor: getGradeColor(item.grade) },
          ]}
        />
      </View>

      {/* Percentage */}
      <Text style={styles.percentage}>{Math.round((item.score / item.total) * 100)}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Grade Book</Text>
        <Text style={styles.headerSubtitle}>Your exam results & performance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Results List */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Exam Results</Text>
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            gap={12}
          />
        </View>

        {/* Detailed Result View */}
        {selectedResult && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Details: {selectedResult.examTitle}</Text>

            {/* Overall Score */}
            <View style={styles.overallBox}>
              <View style={styles.overallScoreContainer}>
                <Text
                  style={[
                    styles.overallGrade,
                    { color: getGradeColor(selectedResult.grade) },
                  ]}
                >
                  {selectedResult.grade}
                </Text>
                <Text style={styles.overallScore}>
                  {selectedResult.score}/{selectedResult.total}
                </Text>
              </View>
              <View style={styles.overallStats}>
                <View>
                  <Text style={styles.overallStatLabel}>Percentage</Text>
                  <Text style={styles.overallStatValue}>
                    {Math.round((selectedResult.score / selectedResult.total) * 100)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Question Breakdown */}
            <View style={styles.questionsBox}>
              <Text style={styles.subSectionTitle}>Question Breakdown</Text>
              {selectedResult.questions.map((q) => (
                <View key={q.num} style={styles.questionResult}>
                  <View style={styles.questionLeft}>
                    <Text style={styles.questionNum}>Q{q.num}</Text>
                    <Text style={styles.questionStatus}>{q.status}</Text>
                  </View>
                  <View style={styles.questionRight}>
                    <Text style={styles.questionScore}>
                      {q.score}/{q.total}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Insights */}
            <View style={styles.insightsBox}>
              <Text style={styles.subSectionTitle}>Insights</Text>
              <Text style={styles.insightText}>
                Great job! You answered most questions correctly. Review question 2 to
                understand the concept better.
              </Text>
              <TouchableOpacity style={styles.reviewButton}>
                <Text style={styles.reviewButtonText}>Review Answers</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Summary Stats */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Exams Taken</Text>
              <Text style={styles.summaryValue}>{results.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Average</Text>
              <Text style={styles.summaryValue}>
                {Math.round(
                  results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / results.length,
                )}%
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Best Score</Text>
              <Text style={styles.summaryValue}>
                {Math.round(
                  (Math.max(...results.map((r) => (r.score / r.total) * 100))) || 0,
                )}%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  headerSection: {
    backgroundColor: COLORS.darkSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  resultsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  resultCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(26, 115, 232, 0.05)",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: COLORS.text,
  },
  resultDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gradeContainer: {
    alignItems: "center",
    gap: 2,
  },
  gradeLetter: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
  },
  scoreText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.darkTertiary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  percentage: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.primary,
  },
  detailSection: {
    gap: 16,
  },
  overallBox: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overallScoreContainer: {
    alignItems: "center",
  },
  overallGrade: {
    fontFamily: "Inter_700Bold",
    fontSize: 48,
    lineHeight: 48,
  },
  overallScore: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  overallStats: {
    gap: 12,
  },
  overallStatLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  overallStatValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
  questionsBox: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  subSectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 4,
  },
  questionResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  questionLeft: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  questionNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.primary,
  },
  questionStatus: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  questionRight: {
    alignItems: "flex-end",
  },
  questionScore: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  insightsBox: {
    backgroundColor: "rgba(15, 157, 88, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  insightText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  reviewButton: {
    backgroundColor: COLORS.success,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  reviewButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: COLORS.text,
  },
  summarySection: {
    gap: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
});
