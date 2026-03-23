/**
 * screens/ClassroomScreen.js
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Classroom Screen - Join & Manage Classrooms
 *
 * Classroom features:
 * • Browse available classrooms
 * • Join classroom with code
 * • View classroom members
 * • Send messages to teacher
 * • View class announcements
 *
 * Connect with your teachers and classmates. Build community.
 */

import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal,
} from "react-native";
import { COLORS } from "../constants/graphr";

export default function ClassroomScreen({
  classrooms, userRole, onSelectClassroom, showToast,
}) {
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [classCode, setClassCode] = useState("");

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      showToast("Please enter a class code");
      return;
    }
    showToast(`Joined class with code: ${classCode}`);
    setClassCode("");
    setJoinModalVisible(false);
  };

  const renderClassroomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => onSelectClassroom(item)}
    >
      <View style={styles.classHeader}>
        <View>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classTeacher}>{item.teacher}</Text>
        </View>
        <Text style={styles.studentCount}>{item.students}</Text>
      </View>

      <Text style={styles.classDescription}>{item.description}</Text>

      <View style={styles.classMeta}>
        <Text style={styles.metaLabel}>
          Code: <Text style={styles.metaValue}>{item.code}</Text>
        </Text>
        <Text style={styles.metaLabel}>
          Students: <Text style={styles.metaValue}>{item.students}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Class</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Classrooms</Text>
        {userRole === "student" && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => setJoinModalVisible(true)}
          >
            <Text style={styles.joinButtonText}>+ Join</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Classrooms List */}
      {classrooms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏫</Text>
          <Text style={styles.emptyTitle}>No Classrooms</Text>
          <Text style={styles.emptyText}>
            Join a classroom to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={classrooms}
          renderItem={renderClassroomItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Join Classroom Modal */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Classroom</Text>
            <Text style={styles.modalDescription}>
              Enter the class code provided by your teacher
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="Class Code"
              placeholderTextColor={COLORS.textMuted}
              value={classCode}
              onChangeText={setClassCode}
              autoCapitalize="characters"
              maxLength={6}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setJoinModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.joinConfirmButton]}
                onPress={handleJoinClass}
              >
                <Text style={styles.modalButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  joinButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  classCard: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  className: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  classTeacher: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  studentCount: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: COLORS.primary,
  },
  classDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  classMeta: {
    gap: 4,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metaLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  metaValue: {
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxWidth: 300,
    gap: 16,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.text,
  },
  modalDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  codeInput: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.darkTertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  joinConfirmButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
});
