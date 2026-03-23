/*
 * screens/AuthScreen.js
 *
 * Authentication Screen - Login & Role Selection
 * Handles user login with role selection:
 * • Login with email/password or Google SSO
 * • Choose role: Student, Teacher, or Admin
 * • Firebase authentication integration
 * • Sign up flow for new users
 * The gateway to GraphR. Security and accessibility in one screen.
 */

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from "react-native";
import { COLORS } from "../constants/graphr";
import * as Auth from "../services/auth";

export default function AuthScreen({ onAuthSuccess, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password || !selectedRole) {
      showToast("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = isSignUp
        ? await Auth.signUpWithEmail(email, password)
        : await Auth.signInWithEmail(email, password);

      if (user) {
        onAuthSuccess(user, selectedRole);
      }
    } catch (error) {
      showToast(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!selectedRole) {
      showToast("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const user = await Auth.signInWithGoogle();
      if (user) {
        onAuthSuccess(user, selectedRole);
      }
    } catch (error) {
      showToast(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>🧮</Text>
        <Text style={styles.title}>GraphR</Text>
        <Text style={styles.subtitle}></Text>
      </View>

      {/* Role Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I am a</Text>
        <View style={styles.roleButtons}>
          {[
            { role: "student", icon: "👨", label: "Student" },
            { role: "teacher", icon: "🎓", label: "Teacher" },
            { role: "admin", icon: "👑", label: "Admin" },
          ].map(({ role, icon, label }) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                selectedRole === role && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={styles.roleIcon}>{icon}</Text>
              <Text
                style={[
                  styles.roleLabel,
                  selectedRole === role && styles.roleLabelActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Email Login */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isSignUp ? "Create Account" : "Sign In"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Google Auth */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton, loading && styles.buttonDisabled]}
          onPress={handleGoogleAuth}
          disabled={loading}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Legal */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
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
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  roleButton: {
    flex: 1,
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  roleButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(26, 115, 232, 0.1)",
  },
  roleIcon: {
    fontSize: 28,
  },
  roleLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  roleLabelActive: {
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.darkSecondary,
  },
  buttonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  googleButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  toggleText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.primary,
    textAlign: "center",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
