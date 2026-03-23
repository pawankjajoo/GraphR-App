/**
 * Analytics Screen Component
 *
 * Displays learning analytics and performance metrics.
 * Different views for students (personal progress) and teachers (class performance).
 *
 * Features:
 * - Learning progress tracking
 * - Performance metrics
 * - Exam history and scores
 * - Skill assessment data
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <ScrollView style={styles.container}>
      {/* Time Range Selector */}
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'week' && styles.activeTimeRangeButton,
          ]}
          onPress={() => setTimeRange('week')}
        >
          <Text
            style={[
              styles.timeRangeText,
              timeRange === 'week' && styles.activeTimeRangeText,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'month' && styles.activeTimeRangeButton,
          ]}
          onPress={() => setTimeRange('month')}
        >
          <Text
            style={[
              styles.timeRangeText,
              timeRange === 'month' && styles.activeTimeRangeText,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'all' && styles.activeTimeRangeButton,
          ]}
          onPress={() => setTimeRange('all')}
        >
          <Text
            style={[
              styles.timeRangeText,
              timeRange === 'all' && styles.activeTimeRangeText,
            ]}
          >
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      {/* Performance Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Summary</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Calculations</Text>
            <Text style={styles.metricValue}>247</Text>
            <Text style={styles.metricSubtext}>Total Completed</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.metricValue}>94%</Text>
            <Text style={styles.metricSubtext}>Average Score</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Streak</Text>
            <Text style={styles.metricValue}>12</Text>
            <Text style={styles.metricSubtext}>Days Active</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Time</Text>
            <Text style={styles.metricValue}>18h</Text>
            <Text style={styles.metricSubtext}>Total Study Time</Text>
          </View>
        </View>
      </View>

      {/* Learning Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Progress</Text>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Arithmetic</Text>
            <Text style={styles.progressPercent}>85%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: '85%' }]}
            />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Algebra</Text>
            <Text style={styles.progressPercent}>72%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: '72%' }]}
            />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Geometry</Text>
            <Text style={styles.progressPercent}>68%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: '68%' }]}
            />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Trigonometry</Text>
            <Text style={styles.progressPercent}>54%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: '54%' }]}
            />
          </View>
        </View>
      </View>

      {/* Exam Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Exam Results</Text>

        <View style={styles.examResult}>
          <View style={styles.examInfo}>
            <Text style={styles.examTitle}>Algebra I Midterm</Text>
            <Text style={styles.examDate}>March 15, 2026</Text>
          </View>
          <View style={styles.examScore}>
            <Text style={styles.scoreValue}>92</Text>
            <Text style={styles.scoreMax}>/ 100</Text>
          </View>
        </View>

        <View style={styles.examResult}>
          <View style={styles.examInfo}>
            <Text style={styles.examTitle}>Geometry Quiz 1</Text>
            <Text style={styles.examDate}>March 12, 2026</Text>
          </View>
          <View style={styles.examScore}>
            <Text style={styles.scoreValue}>88</Text>
            <Text style={styles.scoreMax}>/ 100</Text>
          </View>
        </View>

        <View style={styles.examResult}>
          <View style={styles.examInfo}>
            <Text style={styles.examTitle}>Algebra I Quiz 5</Text>
            <Text style={styles.examDate}>March 10, 2026</Text>
          </View>
          <View style={styles.examScore}>
            <Text style={styles.scoreValue}>95</Text>
            <Text style={styles.scoreMax}>/ 100</Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>lightbulb</Text>
          <Text style={styles.insightText}>
            You improved by 12% in Algebra this week. Keep practicing quadratic equations!
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>star</Text>
          <Text style={styles.insightText}>
            You have a 12-day active streak. Don't break it!
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>target</Text>
          <Text style={styles.insightText}>
            Focus on Trigonometry next. You're 46% through the material.
          </Text>
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
  timeRangeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  activeTimeRangeButton: {
    backgroundColor: '#3498DB',
    borderColor: '#2980B9',
  },
  timeRangeText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeTimeRangeText: {
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  metricCard: {
    width: (width - 50) / 2,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498DB',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 11,
    color: '#95A5A6',
  },
  progressItem: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressPercent: {
    fontWeight: '700',
    color: '#3498DB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498DB',
  },
  examResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  examScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#27AE60',
  },
  scoreMax: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  insightCard: {
    backgroundColor: '#FEF9E7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  insightIcon: {
    fontSize: 16,
    marginBottom: 8,
  },
  insightText: {
    color: '#A6753D',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default AnalyticsScreen;
