/**
 * screens/SettingsScreen.js
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Settings Screen - App Configuration
 *
 * Settings management:
 * • Calculator preferences
 * • Notification settings
 * • Privacy & security
 * • Accessibility options
 * • About & legal
 *
 * Customize your GraphR experience. Your preferences, your way.
 */

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch,
} from "react-native";
import { COLORS } from "../constants/graphr";

export default function SettingsScreen({ showToast }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const renderSettingItem = ({ label, value, onToggle, isToggle = false }) => (
    <View style={styles.settingItem}>
      <View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {isToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          thumbColor={value ? COLORS.primary : COLORS.textMuted}
          trackColor={{ false: COLORS.darkTertiary, true: "rgba(26, 115, 232, 0.3)" }}
        />
      ) : (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* General */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>General</Text>
        {renderSettingItem({
          label: "Dark Mode",
          value: darkMode,
          onToggle: () => setDarkMode(!darkMode),
          isToggle: true,
        })}
        {renderSettingItem({
          label: "App Version",
          value: "1.0.0",
        })}
      </View>

      {/* Calculator */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Calculator</Text>
        {renderSettingItem({
          label: "Default Mode",
          value: "Basic",
        })}
        {renderSettingItem({
          label: "Decimal Places",
          value: "6",
        })}
        {renderSettingItem({
          label: "Angle Unit",
          value: "Degrees",
        })}
      </View>

      {/* Notifications */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Notifications</Text>
        {renderSettingItem({
          label: "Exam Reminders",
          value: notificationsEnabled,
          onToggle: () => setNotificationsEnabled(!notificationsEnabled),
          isToggle: true,
        })}
        {renderSettingItem({
          label: "Grade Notifications",
          value: notificationsEnabled,
          onToggle: () => setNotificationsEnabled(!notificationsEnabled),
          isToggle: true,
        })}
        {renderSettingItem({
          label: "Classroom Updates",
          value: notificationsEnabled,
          onToggle: () => setNotificationsEnabled(!notificationsEnabled),
          isToggle: true,
        })}
      </View>

      {/* Privacy & Security */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Privacy & Security</Text>
        {renderSettingItem({
          label: "Location Services",
          value: locationEnabled,
          onToggle: () => setLocationEnabled(!locationEnabled),
          isToggle: true,
        })}
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Change Password</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Manage Permissions</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Accessibility */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Accessibility</Text>
        {renderSettingItem({
          label: "Large Text",
          value: false,
          onToggle: () => {},
          isToggle: true,
        })}
        {renderSettingItem({
          label: "High Contrast",
          value: false,
          onToggle: () => {},
          isToggle: true,
        })}
      </View>

      {/* About */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>About</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Terms of Service</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Contact Support</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          GraphR v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Calculating the future of education
        </Text>
      </View>
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
  settingsGroup: {
    gap: 10,
  },
  groupTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  settingItem: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  settingValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 12,
  },
  footerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footerSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: "center",
    fontStyle: "italic",
  },
});
