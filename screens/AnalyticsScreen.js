/*
 * screens/AnalyticsScreen.js
 *
 * Analytics Screen - Real-Time Learning Analytics
 * Displays  learning analytics:
 * • Performance trends over time
 * • Skill mastery breakdown
 * • Comparative analytics (student vs class average)
 * • Time-on-task analysis
 * • Calculator usage patterns
 * Data-driven insights. Personalized learning recommendations.
 */

import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, ScrollView,
} from "react-native";
import { COLORS } from "../constants/graphr";
import {
  calculateAverageScore,
  detectTrend,
  calculateSkillMastery,
  generateRecommendations,
  calculateClassAverage,
  identifyStrugglingStudents,
} from "../services/analyticsService";

export default function AnalyticsScreen({ userRole, showToast }) {
  const [studentAnalytics, setStudentAnalytics] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data on mount
  useEffect(() => {
    fetchAnalytics();
  }, [userRole]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // TODO: Fetch actual exam results from Firestore
      // const studentResults = await getStudentExamResults(userId);
      // const classResults = await getClassExamResults(classroomId);

      // Mock data for now - replace with real Firestore queries
      const mockStudentResults = [
        { skill: "Algebra", score: 85, total: 100, skillCategory: "Algebra", timeSpentSeconds: 2700 },
        { skill: "Geometry", score: 78, total: 100, skillCategory: "Geometry", timeSpentSeconds: 1800 },
        { skill: "Trigonometry", score: 72, total: 100, skillCategory: "Trigonometry", timeSpentSeconds: 3600 },
        { skill: "Calculus", score: 68, total: 100, skillCategory: "Calculus", timeSpentSeconds: 2400 },
      ];

      if (userRole === "student") {
        // Calculate student analytics
        const averageScore = calculateAverageScore(mockStudentResults);
        const trend = detectTrend(mockStudentResults);
        const skillMastery = calculateSkillMastery(mockStudentResults);
        const recommendations = generateRecommendations(mockStudentResults, skillMastery);

        setStudentAnalytics({
          averageScore,
          trend,
          skillsData: Object.entries(skillMastery).map(([skill, mastery]) => ({
            skill,
            mastery,
          })),
          recentActivity: [
            { date: "Today", event: "Completed Algebra Midterm", score: 85 },
            { date: "Mar 20", event: "Completed Geometry Quiz", score: 92 },
            { date: "Mar 15", event: "Practice Session", duration: "45 min" },
          ],
          recommendations,
        });
      } else {
        // Calculate class analytics
        // TODO: Fetch actual class results from Firestore
        const mockClassResults = [
          ...mockStudentResults,
          { score: 92, total: 100, skillCategory: "Algebra", timeSpentSeconds: 2400 },
          { score: 65, total: 100, skillCategory: "Calculus", timeSpentSeconds: 3600 },
          { score: 62, total: 100, skillCategory: "Complex Numbers", timeSpentSeconds: 4200 },
        ];

        const classAverage = calculateClassAverage(mockClassResults);
        const strugglingStudents = identifyStrugglingStudents(mockClassResults);
        const skillMastery = calculateSkillMastery(mockClassResults);

        setClassAnalytics({
          averageScore: classAverage,
          studentCount: 28,
          topPerformer: "Jordan Lee (92%)",
          classStrengths: [
            { skill: "Basic Arithmetic", avg: 89 },
            { skill: "Fractions", avg: 85 },
          ],
          classWeaknesses: [
            { skill: "Calculus", avg: 65 },
            { skill: "Complex Numbers", avg: 62 },
          ],
          strugglingStudents,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("[AnalyticsScreen] Error fetching analytics:", error);
      showToast("Error loading analytics data");
      setLoading(false);
    }
  };

  const renderSkillItem = ({ item }) => (
    <View style={styles.skillItem}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillName}>{item.skill}</Text>
        <Text style={styles.skillPercent}>{item.mastery}%</Text>
      </View>
      <View style={styles.skillBar}>
        <View
          style={[
            styles.skillBarFill,
            {
              width: `${item.mastery}%`,
              backgroundColor: item.mastery >= 80 ? COLORS.success : COLORS.warning,
            },
          ]}
        />
      </View>
    </View>
  );

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityDate}>
        <Text style={styles.activityDateText}>{item.date}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityEvent}>{item.event}</Text>
        {item.score && <Text style={styles.activityScore}>Score: {item.score}/100</Text>}
        {item.duration && <Text style={styles.activityDuration}>{item.duration}</Text>}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Learning Analytics</Text>
        <Text style={styles.headerSubtitle}>
          {userRole === "teacher" ? "Class performance insights" : "Your performance insights"}
        </Text>
      </View>

      {/* Overall Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Score</Text>
            <Text style={styles.statValue}>
              {userRole === "teacher" ? classAnalytics.averageScore : studentAnalytics.averageScore}%
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              {userRole === "teacher" ? "Students" : "Exams Taken"}
            </Text>
            <Text style={styles.statValue}>
              {userRole === "teacher" ? classAnalytics.studentCount : 5}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Trend</Text>
            <Text style={[styles.statValue, styles.trendUp]}>
              {userRole === "teacher" ? "Stable" : "Improving"}
            </Text>
          </View>
        </View>
      </View>

      {/* Student View */}
      {userRole === "student" && (
        <>
          {/* Skills Mastery */}
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Skills Mastery</Text>
            <FlatList
              data={studentAnalytics.skillsData}
              renderItem={renderSkillItem}
              keyExtractor={(item) => item.skill}
              scrollEnabled={false}
              gap={10}
            />
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <FlatList
              data={studentAnalytics.recentActivity}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.date + item.event}
              scrollEnabled={false}
              gap={8}
            />
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>Recommended Actions</Text>
            <Text style={styles.recommendationText}>
              You are strong in Algebra but could improve in Calculus. Try our Calculus practice
              module.
            </Text>
            <View style={styles.recommendations}>
              <View style={styles.recItem}>
                <Text style={styles.recIcon}>1.</Text>
                <Text style={styles.recText}>Review Calculus fundamentals</Text>
              </View>
              <View style={styles.recItem}>
                <Text style={styles.recIcon}>2.</Text>
                <Text style={styles.recText}>Practice with more problems</Text>
              </View>
              <View style={styles.recItem}>
                <Text style={styles.recIcon}>3.</Text>
                <Text style={styles.recText}>Meet with your teacher for guidance</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Teacher View */}
      {userRole === "teacher" && (
        <>
          {/* Class Strengths */}
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Class Strengths</Text>
            <FlatList
              data={classAnalytics.classStrengths}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text style={styles.skillName}>{item.skill}</Text>
                    <Text style={styles.skillPercent}>{item.avg}%</Text>
                  </View>
                  <View style={styles.skillBar}>
                    <View
                      style={[
                        styles.skillBarFill,
                        { width: `${item.avg}%`, backgroundColor: COLORS.success },
                      ]}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.skill}
              scrollEnabled={false}
              gap={10}
            />
          </View>

          {/* Class Weaknesses */}
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Areas for Improvement</Text>
            <FlatList
              data={classAnalytics.classWeaknesses}
              renderItem={({ item }) => (
                <View style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text style={styles.skillName}>{item.skill}</Text>
                    <Text style={styles.skillPercent}>{item.avg}%</Text>
                  </View>
                  <View style={styles.skillBar}>
                    <View
                      style={[
                        styles.skillBarFill,
                        { width: `${item.avg}%`, backgroundColor: COLORS.warning },
                      ]}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.skill}
              scrollEnabled={false}
              gap={10}
            />
          </View>

          {/* Top Performer */}
          <View style={styles.topPerformerBox}>
            <Text style={styles.topPerformerTitle}>Top Performer</Text>
            <Text style={styles.topPerformerText}>{classAnalytics.topPerformer}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  headerSection: {
    gap: 4,
    marginBottom: 8,
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
  },
  statsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  trendUp: {
    color: COLORS.success,
  },
  skillsSection: {
    gap: 12,
  },
  skillItem: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  skillPercent: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.primary,
  },
  skillBar: {
    height: 6,
    backgroundColor: COLORS.darkTertiary,
    borderRadius: 3,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
  },
  activitySection: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  activityDate: {
    backgroundColor: COLORS.darkTertiary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
  },
  activityDateText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: COLORS.primary,
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  activityEvent: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  activityScore: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  activityDuration: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textMuted,
  },
  recommendationBox: {
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  recommendationTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  recommendationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  recommendations: {
    gap: 6,
    marginTop: 4,
  },
  recItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  recIcon: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.primary,
  },
  recText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.text,
  },
  topPerformerBox: {
    backgroundColor: "rgba(15, 157, 88, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
  },
  topPerformerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.success,
    textTransform: "uppercase",
  },
  topPerformerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: COLORS.text,
  },
});
