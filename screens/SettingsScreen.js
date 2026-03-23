/**
 * Settings Screen Component
 *
 * User settings and preferences management.
 * Handles account settings, notifications, and app preferences.
 *
 * Features:
 * - Account management
 * - Notification preferences
 * - Privacy settings
 * - About and help
 * - Sign out functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const { authState, signOut } = useAuth();

  const [notifications, setNotifications] = useState({
    examReminders: true,
    classroomUpdates: true,
    performanceAlerts: true,
    pushNotifications: false,
  });

  const [privacy, setPrivacy] = useState({
    shareProgress: true,
    dataCollection: true,
  });

  /**
   * Toggle notification preference
   */
  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  /**
   * Toggle privacy preference
   */
  const togglePrivacy = (key) => {
    setPrivacy({
      ...privacy,
      [key]: !privacy[key],
    });
  };

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            await signOut();
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email</Text>
          <Text style={styles.settingValue}>{authState.userEmail}</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Name</Text>
          <Text style={styles.settingValue}>{authState.userName}</Text>
        </View>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.toggleSetting}>
          <Text style={styles.toggleLabel}>Exam Reminders</Text>
          <Switch
            value={notifications.examReminders}
            onValueChange={() => toggleNotification('examReminders')}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor={notifications.examReminders ? '#3498DB' : '#FFFFFF'}
          />
        </View>

        <View style={styles.toggleSetting}>
          <Text style={styles.toggleLabel}>Classroom Updates</Text>
          <Switch
            value={notifications.classroomUpdates}
            onValueChange={() => toggleNotification('classroomUpdates')}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor={notifications.classroomUpdates ? '#3498DB' : '#FFFFFF'}
          />
        </View>

        <View style={styles.toggleSetting}>
          <Text style={styles.toggleLabel}>Performance Alerts</Text>
          <Switch
            value={notifications.performanceAlerts}
            onValueChange={() => toggleNotification('performanceAlerts')}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor={notifications.performanceAlerts ? '#3498DB' : '#FFFFFF'}
          />
        </View>

        <View style={styles.toggleSetting}>
          <Text style={styles.toggleLabel}>Push Notifications</Text>
          <Switch
            value={notifications.pushNotifications}
            onValueChange={() => toggleNotification('pushNotifications')}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor={notifications.pushNotifications ? '#3498DB' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Data</Text>

        <View style={styles.toggleSetting}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.toggleLabel}>Share Learning Progress</Text>
            <Text style={styles.toggleDesc}>
              Allow teachers to view your progress
            </Text>
          </View>
          <Switch
            value={privacy.shareProgress}
            onValueChange={() => togglePrivacy('shareProgress')}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor={privacy.shareProgress ? '#3498DB' : '#FFFFFF'}
          />
        </View>

        <View style={styles.toggleSetting}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.toggleLabel}>Data Collection</Text>
            <Text style={styles.toggleDesc}>
              Help improve the app with usage analytics
            </Text>
          </View>
          <Switch
            value={privacy.dataCollection}
            onValueChange={() => togglePrivacy('dataCollection')}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor={privacy.dataCollection ? '#3498DB' : '#FFFFFF'}
          />
        </View>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

      {/* Display & Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>

        <View style={styles.toggleSetting}>
          <Text style={styles.toggleLabel}>Dark Mode</Text>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: '#ECF0F1', true: '#95A5A6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Build</Text>
          <Text style={styles.settingValue}>2026.03.001</Text>
        </View>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Send Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSetting}>
          <Text style={styles.buttonSettingText}>Check for Updates</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          GraphR v1.0 | Made with precision for education
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
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  settingLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  toggleSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 15,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  buttonSetting: {
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  buttonSettingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498DB',
  },
  signOutButton: {
    paddingVertical: 14,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default SettingsScreen;
