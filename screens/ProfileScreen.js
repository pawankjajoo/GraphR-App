/**
 * screens/ProfileScreen.js
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Profile Screen - User Profile & Settings
 *
 * User profile management:
 * • Display user information
 * • Subscription status & upgrade
 * • Theme/skin selection
 * • Calculator preferences
 * • Sign out
 *
 * Your identity in GraphR. Customize your experience.
 */

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput,
} from "react-native";
import { COLORS, SUBSCRIPTION_TIERS } from "../constants/graphr";

export default function ProfileScreen({
  userProfile, onUpdateProfile, storeProducts, purchasing, onPurchase, onSignOut, showToast,
}) {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(userProfile.displayName);

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdateProfile({ displayName: editName });
      setEditMode(false);
      showToast("Profile updated");
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out?",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          onPress: onSignOut,
          style: "destructive",
        },
      ],
    );
  };

  const handlePurchaseSubscription = (productId) => {
    showToast("Opening purchase flow");
    onPurchase(productId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>

        <View style={styles.profileInfo}>
          {editMode ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSaveName}
                >
                  <Text style={styles.editButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{userProfile.displayName}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text style={styles.editLink}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Subscription Status */}
      <View style={styles.subscriptionSection}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.subscriptionCard}>
          <View>
            <Text style={styles.subscriptionName}>
              {SUBSCRIPTION_TIERS[userProfile.subscriptionTier]?.name || "Free"}
            </Text>
            <Text style={styles.subscriptionFeatures}>
              {SUBSCRIPTION_TIERS[userProfile.subscriptionTier]?.features[0] || "Limited features"}
            </Text>
          </View>
          {userProfile.subscriptionTier === "free" && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => handlePurchaseSubscription("com.insperion.graphr.pro_monthly")}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Upgrade Options */}
      {userProfile.subscriptionTier === "free" && (
        <View style={styles.upgradeSection}>
          <Text style={styles.sectionTitle}>Upgrade to Pro</Text>
          <View style={styles.upgradeGrid}>
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeCardTitle}>Monthly</Text>
              <Text style={styles.upgradeCardPrice}>$4.99</Text>
              <Text style={styles.upgradeCardFeature}>All features</Text>
              <TouchableOpacity
                style={styles.upgradeCardButton}
                onPress={() => handlePurchaseSubscription("com.insperion.graphr.pro_monthly")}
                disabled={purchasing}
              >
                <Text style={styles.upgradeCardButtonText}>
                  {purchasing ? "Processing..." : "Subscribe"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeCardTitle}>Annual</Text>
              <Text style={styles.upgradeCardPrice}>$49.99</Text>
              <Text style={styles.upgradeCardFeature}>Save 15%</Text>
              <TouchableOpacity
                style={styles.upgradeCardButton}
                onPress={() => handlePurchaseSubscription("com.insperion.graphr.pro_annual")}
                disabled={purchasing}
              >
                <Text style={styles.upgradeCardButtonText}>
                  {purchasing ? "Processing..." : "Subscribe"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Preferences */}
      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.prefItem}>
          <Text style={styles.prefLabel}>Calculator Theme</Text>
          <Text style={styles.prefValue}>Dark (Default)</Text>
        </View>
        <View style={styles.prefItem}>
          <Text style={styles.prefLabel}>Font Size</Text>
          <Text style={styles.prefValue}>Medium</Text>
        </View>
        <View style={styles.prefItem}>
          <Text style={styles.prefLabel}>Notifications</Text>
          <Text style={styles.prefValue}>Enabled</Text>
        </View>
      </View>

      {/* About */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
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
  profileSection: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.darkTertiary,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.text,
  },
  userEmail: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  editLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
  },
  editContainer: {
    gap: 8,
  },
  editInput: {
    backgroundColor: COLORS.input,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.darkTertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  editButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: COLORS.text,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subscriptionSection: {
    gap: 12,
  },
  subscriptionCard: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subscriptionName: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: COLORS.text,
  },
  subscriptionFeatures: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  upgradeButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: COLORS.text,
  },
  upgradeSection: {
    gap: 12,
  },
  upgradeGrid: {
    flexDirection: "row",
    gap: 12,
  },
  upgradeCard: {
    flex: 1,
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 6,
  },
  upgradeCardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.text,
  },
  upgradeCardPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.primary,
  },
  upgradeCardFeature: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  upgradeCardButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  upgradeCardButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: COLORS.text,
  },
  preferencesSection: {
    gap: 12,
  },
  prefItem: {
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
  prefLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  prefValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  aboutSection: {
    gap: 12,
  },
  aboutItem: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  aboutLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  aboutValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  linkText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.primary,
    paddingVertical: 10,
  },
  signOutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signOutButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
});
