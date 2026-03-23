/*
 * screens/TeacherDashboardScreen.js

 *
 * Teacher Dashboard Screen - Real-Time Classroom Management
 * Teacher control panel:
 * • Real-time exam monitoring (see which students are testing)
 * • App-switch violations (patent feature)
 * • Class performance analytics
 * • Quick exam creation
 * • Student management
 * Empower educators. Monitor assessments. Support students in real time.
 */

import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView,
} from "react-native";
import { COLORS } from "../constants/graphr";

export default function TeacherDashboardScreen({
  exams, classrooms, showToast,
}) {
  const [selectedClassroom, setSelectedClassroom] = useState(classrooms[0]?.id);

  const handleCreateExam = () => {
    showToast("Exam creation interface opening");
  };

  const handleMonitorExam = (exam) => {
    showToast(`Monitoring: ${exam.title}`);
  };

  const filteredExams = selectedClassroom
    ? exams.filter((e) => e.classroomId === selectedClassroom)
    : exams;

  const renderClassroomTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.classTab,
        selectedClassroom === item.id && styles.classTabActive,
      ]}
      onPress={() => setSelectedClassroom(item.id)}
    >
      <Text
        style={[
          styles.classTabText,
          selectedClassroom === item.id && styles.classTabTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderExamMonitor = ({ item }) => (
    <View style={styles.examMonitor}>
      <View style={styles.monitorHeader}>
        <View>
          <Text style={styles.monitorTitle}>{item.title}</Text>
          <Text style={styles.monitorSubtitle}>{item.questions.length} questions</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <View style={styles.monitorStats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>In Progress</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Violations</Text>
          <Text style={[styles.statValue, styles.violationValue]}>0</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.monitorButton}
        onPress={() => handleMonitorExam(item)}
      >
        <Text style={styles.monitorButtonText}>Open Monitor</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.headerTitle}>Teacher Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time classroom monitoring</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateExam}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        {/* Classroom Selector */}
        <View style={styles.classroomSection}>
          <Text style={styles.sectionTitle}>Select Classroom</Text>
          <FlatList
            data={classrooms}
            renderItem={renderClassroomTab}
            keyExtractor={(item) => item.id}
            horizontal
            scrollEnabled={true}
            contentContainerStyle={styles.classTabs}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Active Exams */}
        <View style={styles.examsSection}>
          <Text style={styles.sectionTitle}>Active Exams</Text>
          {filteredExams.length === 0 ? (
            <View style={styles.noExamsBox}>
              <Text style={styles.noExamsText}>No active exams in this classroom</Text>
            </View>
          ) : (
            <FlatList
              data={filteredExams}
              renderItem={renderExamMonitor}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              gap={12}
            />
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Class Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Total Students</Text>
              <Text style={styles.statCardValue}>
                {classrooms.find((c) => c.id === selectedClassroom)?.students || 0}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Avg Grade</Text>
              <Text style={styles.statCardValue}>B+</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>This Week</Text>
              <Text style={styles.statCardValue}>{filteredExams.length}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  createButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
    gap: 24,
  },
  classroomSection: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  classTabs: {
    gap: 8,
  },
  classTab: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  classTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  classTabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  classTabTextActive: {
    color: COLORS.text,
  },
  examsSection: {
    gap: 12,
  },
  examMonitor: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 12,
  },
  monitorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  monitorTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: COLORS.text,
  },
  monitorSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "rgba(15, 157, 88, 0.2)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: COLORS.success,
  },
  monitorStats: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
  violationValue: {
    color: COLORS.error,
  },
  monitorButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  monitorButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
  noExamsBox: {
    backgroundColor: COLORS.darkTertiary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  noExamsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsSection: {
    gap: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
  },
  statCardLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  statCardValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: COLORS.primary,
  },
});
