/*
 * screens/ExamListScreen.js

 *
 * Exam List Screen - Browse & Start Exams
 * Displays available exams:
 * • List of upcoming and recent exams
 * • Filter by classroom
 * • Start exam (student view)
 * • Create exam (teacher view)
 * • View results (student & teacher)
 * Gateway to assessment. See your challenges. Rise to the occasion.
 */

import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { COLORS } from "../constants/graphr";

export default function ExamListScreen({
  exams, onStartExam, userRole, showToast,
}) {
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const filteredExams = selectedClassroom
    ? exams.filter((e) => e.classroomId === selectedClassroom)
    : exams;

  const handleStartExam = (exam) => {
    Alert.alert(
      "Start Exam?",
      `${exam.title} (${exam.duration} minutes)`,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Start",
          onPress: () => {
            showToast("Exam started. No app switching allowed.");
            onStartExam(exam);
          },
          style: "default",
        },
      ],
    );
  };

  const handleCreateExam = () => {
    showToast("Exam creation not yet implemented");
  };

  const renderExamItem = ({ item }) => (
    <View style={styles.examCard}>
      <View style={styles.examHeader}>
        <View>
          <Text style={styles.examTitle}>{item.title}</Text>
          <Text style={styles.examClassroom}>{item.description}</Text>
        </View>
        <View style={styles.examMeta}>
          <Text style={styles.examDuration}>{item.duration} min</Text>
          <Text style={styles.examPoints}>{item.totalPoints} pts</Text>
        </View>
      </View>

      <View style={styles.examDetails}>
        <Text style={styles.detailLabel}>
          Questions: {item.questions.length}
        </Text>
        <Text style={styles.detailLabel}>
          Due: {item.dueDate}
        </Text>
      </View>

      {userRole === "student" && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => handleStartExam(item)}
        >
          <Text style={styles.startButtonText}>Start Exam</Text>
        </TouchableOpacity>
      )}

      {userRole === "teacher" && (
        <View style={styles.teacherActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>
          {userRole === "teacher" ? "Manage Exams" : "Available Exams"}
        </Text>

        {userRole === "teacher" && (
          <TouchableOpacity style={styles.createButton} onPress={handleCreateExam}>
            <Text style={styles.createButtonText}>+ Create Exam</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Exam List */}
      {exams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Exams Available</Text>
          <Text style={styles.emptyText}>
            {userRole === "teacher"
              ? "Create your first exam to get started"
              : "Wait for your teacher to assign an exam"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredExams}
          renderItem={renderExamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
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
    flex: 1,
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
  listContent: {
    padding: 12,
    gap: 12,
  },
  examCard: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  examTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  examClassroom: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  examMeta: {
    alignItems: "flex-end",
    gap: 3,
  },
  examDuration: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.primary,
  },
  examPoints: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  examDetails: {
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  startButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
  teacherActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.darkTertiary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.text,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 240,
  },
});
