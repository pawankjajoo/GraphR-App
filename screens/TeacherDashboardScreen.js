/**
 * Teacher Dashboard Screen Component
 *
 * Central hub for teachers to manage classrooms, exams, and student progress.
 * Provides real-time insights into student performance and exam activities.
 *
 * Features:
 * - View all teaching classrooms
 * - Monitor active exams
 * - View student performance analytics
 * - Create and manage exams
 * - View exam activity logs and student activities
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useClassroom } from '../context/ClassroomContext';

const TeacherDashboardScreen = ({ navigation }) => {
  const { authState } = useAuth();
  const { classrooms, loadClassrooms, loadStudents } = useClassroom();
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [classroomStudents, setClassroomStudents] = useState([]);

  useEffect(() => {
    const initializeScreen = async () => {
      setLoading(true);
      try {
        await loadClassrooms();
      } catch (error) {
        console.error('Error loading classrooms:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeScreen();
  }, []);

  /**
   * Load students when classroom is selected
   */
  const handleSelectClassroom = async (classroom) => {
    setSelectedClassroom(classroom);
    const students = await loadStudents(classroom.id);
    setClassroomStudents(students);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>
          Welcome, {authState.userName}
        </Text>
        <Text style={styles.roleText}>Teacher</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{classrooms.length}</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{classroomStudents.length}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Active Exams</Text>
        </View>
      </View>

      {/* Classrooms Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Classes</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {classrooms.map((classroom) => (
          <TouchableOpacity
            key={classroom.id}
            style={[
              styles.classroomItem,
              selectedClassroom?.id === classroom.id && styles.selectedClassroom,
            ]}
            onPress={() => handleSelectClassroom(classroom)}
          >
            <View style={styles.classroomInfo}>
              <Text style={styles.classroomTitle}>{classroom.name}</Text>
              <Text style={styles.classroomDetails}>
                {classroom.period} | Code: {classroom.code}
              </Text>
            </View>
            <View style={styles.chevron}>
              <Text style={styles.chevronText}>></Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Student Roster */}
      {selectedClassroom && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Roster</Text>
          {classroomStudents.length > 0 ? (
            <FlatList
              data={classroomStudents}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.studentItem}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentEmail}>{item.email}</Text>
                  </View>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>No students enrolled</Text>
          )}
        </View>
      )}

      {/* Exam Management */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exam Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateExam')}
          >
            <Text style={styles.addButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionCardTitle}>Create Exam</Text>
            <Text style={styles.actionCardDesc}>
              Build a new test with custom questions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionCardTitle}>View Results</Text>
            <Text style={styles.actionCardDesc}>
              Review student exam submissions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionCardTitle}>Activity Log</Text>
            <Text style={styles.actionCardDesc}>
              Monitor exam activity and violations
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionCardTitle}>Settings</Text>
            <Text style={styles.actionCardDesc}>
              Configure exam restrictions
            </Text>
          </TouchableOpacity>
        </View>
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
  },
  loadingText: {
    marginTop: 12,
    color: '#7F8C8D',
  },
  headerSection: {
    backgroundColor: '#27AE60',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleText: {
    color: '#D5F4E6',
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginVertical: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#27AE60',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
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
  addButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  classroomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  selectedClassroom: {
    backgroundColor: '#E8F8F5',
    borderLeftColor: '#27AE60',
  },
  classroomInfo: {
    flex: 1,
  },
  classroomTitle: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  classroomDetails: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  chevron: {
    paddingLeft: 10,
  },
  chevronText: {
    fontSize: 20,
    color: '#BDC3C7',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3498DB',
  },
  viewButtonText: {
    color: '#3498DB',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyText: {
    color: '#7F8C8D',
    textAlign: 'center',
    paddingVertical: 20,
  },
  actionCards: {
    gap: 10,
  },
  actionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  actionCardTitle: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionCardDesc: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default TeacherDashboardScreen;
