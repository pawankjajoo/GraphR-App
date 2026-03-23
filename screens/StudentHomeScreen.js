/**
 * Student Home Screen Component
 *
 * Landing page for students after authentication.
 * Shows classroom overview, upcoming exams, and quick access to calculators.
 *
 * Features:
 * - Display enrolled classrooms
 * - Show available exams and assignments
 * - Quick access to calculator tools
 * - Performance summary
 * - Join classroom functionality
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useClassroom } from '../context/ClassroomContext';

const { width } = Dimensions.get('window');

const StudentHomeScreen = ({ navigation }) => {
  const { authState } = useAuth();
  const { classrooms, exams, loadClassrooms, loadExams } = useClassroom();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeScreen = async () => {
      setLoading(true);
      try {
        await loadClassrooms();
        await loadExams();
      } catch (error) {
        console.error('Error loading classroom data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeScreen();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading classrooms...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome, {authState.userName || 'Student'}!
        </Text>
        <Text style={styles.subtitleText}>
          Ready to enhance your mathematics learning
        </Text>
      </View>

      {/* Classrooms Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Classrooms</Text>
          <Text style={styles.sectionCount}>{classrooms.length}</Text>
        </View>

        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <TouchableOpacity
              key={classroom.id}
              style={styles.classroomCard}
              onPress={() =>
                navigation.navigate('Calculator', {
                  classroomId: classroom.id,
                })
              }
            >
              <View style={styles.classroomContent}>
                <Text style={styles.classroomName}>{classroom.name}</Text>
                <Text style={styles.teacherName}>
                  {classroom.teacherName}
                </Text>
                <Text style={styles.classroomCode}>
                  Code: {classroom.code}
                </Text>
              </View>
              <View style={styles.classroomBadge}>
                <Text style={styles.badgeText}>Active</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No classrooms yet</Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join a Classroom</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Upcoming Exams Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Exams</Text>
          <Text style={styles.sectionCount}>{exams.length}</Text>
        </View>

        {exams && exams.length > 0 ? (
          exams.map((exam) => (
            <View key={exam.id} style={styles.examCard}>
              <View style={styles.examHeader}>
                <Text style={styles.examTitle}>{exam.title}</Text>
                <Text style={styles.examDate}>
                  {new Date(exam.dueDate).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.examClass}>
                {exam.classroomName}
              </Text>
              <View style={styles.examMeta}>
                <Text style={styles.examMetaText}>
                  Duration: {exam.durationMinutes} minutes
                </Text>
                <Text style={styles.examMetaText}>
                  Questions: {exam.questionCount}
                </Text>
              </View>
              {exam.isAvailable && (
                <TouchableOpacity style={styles.startExamButton}>
                  <Text style={styles.startExamButtonText}>Start Exam</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No upcoming exams at this time
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Calculator')}
          >
            <Text style={styles.quickActionIcon}>calc</Text>
            <Text style={styles.quickActionLabel}>Calculator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Text style={styles.quickActionIcon}>chart</Text>
            <Text style={styles.quickActionLabel}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>graph</Text>
            <Text style={styles.quickActionLabel}>Graph Tools</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>help</Text>
            <Text style={styles.quickActionLabel}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Learning Tip */}
      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>Learning Tip</Text>
        <Text style={styles.tipText}>
          Use the calculator to practice step-by-step problem solving.
          Each calculation is logged to help you track your learning progress.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    color: '#7F8C8D',
    fontSize: 14,
  },
  welcomeSection: {
    backgroundColor: '#3498DB',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitleText: {
    color: '#ECF0F1',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  sectionCount: {
    backgroundColor: '#3498DB',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  classroomCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  classroomContent: {
    flex: 1,
  },
  classroomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  classroomCode: {
    fontSize: 12,
    color: '#95A5A6',
    fontFamily: 'monospace',
  },
  classroomBadge: {
    backgroundColor: '#D5F4E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    color: '#27AE60',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    color: '#7F8C8D',
    fontSize: 14,
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  examCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
  },
  examDate: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '600',
  },
  examClass: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  examMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  examMetaText: {
    fontSize: 12,
    color: '#95A5A6',
  },
  startExamButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  startExamButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionCard: {
    width: (width - 50) / 2,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  quickActionIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3498DB',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  tipSection: {
    margin: 15,
    backgroundColor: '#FEF9E7',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D68910',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#A6753D',
    lineHeight: 20,
  },
});

export default StudentHomeScreen;
