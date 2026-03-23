/**
 * screens/SplashScreen.js
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Splash Screen - First impression
 *
 * Displays the GraphR brand with animated elements:
 * • Tagline: #CalculatingTheFuture
 * • Smooth fade-in effect
 * • Auto-dismiss after 3 seconds
 *
 * This is where the user first meets the app. Make it count.
 */

import React, { useEffect, useRef } from "react";
import {
  View, Text, Animated, StyleSheet, StatusBar,
} from "react-native";
import { COLORS } from "../constants/graphr";

export default function SplashScreen({ onDone }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the splash screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => onDone());
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onDone]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Calculator Icon / Logo Area */}
        <Text style={styles.icon}>🧮</Text>

        {/* Main Tagline */}
        <Text style={styles.tagline}>#CalculatingTheFuture</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          The world's first intuitive, all-in-one calculator app for education
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  tagline: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: COLORS.primary,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 280,
    marginTop: 20,
    lineHeight: 18,
  },
});
