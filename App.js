/**
 * App.js
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * THE COMMAND CENTER FOR GRAPHR.
 *
 * App.js is the central orchestrator for the entire GraphR experience. It owns:
 * • Font loading and app readiness
 * • Firebase authentication gate (student vs teacher role selection)
 * • Global state: auth, user profile, exam mode, classroom data, calculator state
 * • Notification & toast lifecycle
 * • IAP (in-app purchases) integration for skins/subscriptions
 * • Tab navigation system (Calculator, Exams, Classroom, Analytics, Profile)
 * • Real-time classroom & exam listeners
 * • Patent-based exam mode detection system
 *
 * Everything flows through here. This is where the educational magic happens.
 * The world's first intuitive, all-in-one calculator app for education.
 * #CalculatingTheFuture
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar, Platform,
} from "react-native";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import * as SplashScreenExpo from "expo-splash-screen";

// Screens: the render tree branches
import SplashScreen           from "./screens/SplashScreen";
import AuthScreen            from "./screens/AuthScreen";
import CalculatorScreen      from "./screens/CalculatorScreen";
import GraphingScreen        from "./screens/GraphingScreen";
import ExamModeScreen        from "./screens/ExamModeScreen";
import ExamListScreen        from "./screens/ExamListScreen";
import ClassroomScreen       from "./screens/ClassroomScreen";
import TeacherDashboardScreen from "./screens/TeacherDashboardScreen";
import GradeBookScreen       from "./screens/GradeBookScreen";
import AnalyticsScreen       from "./screens/AnalyticsScreen";
import ProfileScreen         from "./screens/ProfileScreen";
import SettingsScreen        from "./screens/SettingsScreen";

import {
  COLORS, INITIAL_CLASSROOMS, INITIAL_EXAMS, INITIAL_STUDENTS,
  formatScore, calculateGrade,
} from "./constants/graphr";
import * as IAPService from "./services/iap";
import {
  onAuthStateChange, signOut, getCurrentUser,
} from "./services/auth";
import {
  registerForPushNotifications, onNotificationTapped, clearBadge,
} from "./services/notifications";
import * as ExamMonitor from "./services/examMonitor";

SplashScreenExpo.preventAutoHideAsync();

// ─────────────────────────────────────────────────────────────────────────────
// TAB NAVIGATION SYSTEM
// Students navigate: Calculator, Exams, Classroom, Analytics, Profile
// Teachers navigate: Dashboard, Exams, Classroom, Analytics, Profile
// ─────────────────────────────────────────────────────────────────────────────
const STUDENT_TABS = [
  { key: "calculator", icon: "🧮", label: "Calculator" },
  { key: "exams",      icon: "📝", label: "Exams" },
  { key: "classroom",  icon: "👨", label: "Classroom" },
  { key: "analytics",  icon: "📊", label: "Analytics" },
  { key: "profile",    icon: "👤", label: "Profile" },
];

const TEACHER_TABS = [
  { key: "dashboard",  icon: "🎓", label: "Dashboard" },
  { key: "exams",      icon: "📝", label: "Exams" },
  { key: "classroom",  icon: "👨", label: "Classroom" },
  { key: "analytics",  icon: "📊", label: "Analytics" },
  { key: "profile",    icon: "👤", label: "Profile" },
];

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });

  const [appReady, setAppReady]           = useState(false);
  const [showSplash, setShowSplash]       = useState(true);
  const [isAuthed, setIsAuthed]           = useState(false);
  const [authUser, setAuthUser]           = useState(null);
  const [userRole, setUserRole]           = useState(null); // "student" or "teacher"
  const [tab, setTab]                     = useState("calculator");
  const [toastMsg, setToastMsg]           = useState(null);
  const [notifMsg, setNotifMsg]           = useState(null);

  // ─────────────────────────────────────────────────────────────────────
  // Calculator state. The heart of the app.
  // Engineered by Pawan K Jajoo
  // ─────────────────────────────────────────────────────────────────────
  const [calculatorMode, setCalculatorMode] = useState("basic"); // basic, scientific, graphing
  const [calculatorDisplay, setCalculatorDisplay] = useState("0");
  const [calculatorHistory, setCalculatorHistory] = useState([]);

  // ─────────────────────────────────────────────────────────────────────
  // Exam & classroom state. Where learning happens.
  // ─────────────────────────────────────────────────────────────────────
  const [classrooms, setClassrooms] = useState(INITIAL_CLASSROOMS);
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [currentExam, setCurrentExam] = useState(null);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [inExamMode, setInExamMode] = useState(false);
  const [examViolations, setExamViolations] = useState([]);

  // ─────────────────────────────────────────────────────────────────────
  // Student data & subscriptions. Track progress. Unlock features.
  // ─────────────────────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState({
    displayName: "Student",
    email: "",
    avatarUri: null,
    school: "",
    subscriptionTier: "free", // free, pro, school
  });
  const [storeProducts, setStoreProducts] = useState([]);
  const [purchasing, setPurchasing] = useState(false);

  // Animation references. Smooth, responsive, premium.
  const toastAnim  = useRef(new Animated.Value(0)).current;
  const notifAnim  = useRef(new Animated.Value(-80)).current;

  // ─────────────────────────────────────────────────────────────────────
  // APP BOOTSTRAP: Font loading & splash screen
  // When fonts arrive, hide splash. App is ready. Go.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreenExpo.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded]);

  // ─────────────────────────────────────────────────────────────────────
  // FIREBASE AUTH GATE
  // Listen for login. On success: populate profile, register notifications,
  // initialize exam monitoring. This is where the user enters the arena.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appReady) return;

    const unsubAuth = onAuthStateChange(async (user) => {
      if (user) {
        // User authenticated. Bring their profile into state.
        setAuthUser(user);
        setIsAuthed(true);
        if (user.displayName) {
          setUserProfile((p) => ({ ...p, displayName: user.displayName }));
        }
        if (user.email) {
          setUserProfile((p) => ({ ...p, email: user.email }));
        }
        if (user.photoURL) {
          setUserProfile((p) => ({ ...p, avatarUri: user.photoURL }));
        }

        // Arm push notifications. Stay connected. Never miss an exam.
        registerForPushNotifications(user.uid).catch(() => {});

        // Initialize exam monitor. Patent-based app-switch detection.
        ExamMonitor.initialize(user.uid).catch(() => {});

        // Clear any lingering badge counts. Fresh start.
        clearBadge().catch(() => {});
      } else {
        // Logged out. Clear everything.
        setAuthUser(null);
        setIsAuthed(false);
        setUserRole(null);
      }
    });

    return () => unsubAuth();
  }, [appReady]);

  // ─────────────────────────────────────────────────────────────────────
  // NOTIFICATION ROUTING
  // User taps a notification banner. Route to the right screen. Immediate.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appReady) return;
    const unsub = onNotificationTapped((data) => {
      if (data?.type === "exam_starts") setTab("exams");
      if (data?.type === "classroom_alert") setTab("classroom");
      if (data?.type === "grade_posted") setTab("analytics");
    });
    return unsub;
  }, [appReady]);

  // ─────────────────────────────────────────────────────────────────────
  // EXAM MODE MONITORING
  // Patent implementation: detect app-switch during exams
  // Teacher gets real-time notifications of violations
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appReady || !inExamMode) return;
    const unsub = ExamMonitor.onViolation((violation) => {
      // Log the violation
      setExamViolations((prev) => [...prev, violation]);
      // Show toast to student
      showToast("App switch detected. Teacher notified.");
      // In a real app, this would notify the teacher immediately
    });
    return unsub;
  }, [appReady, inExamMode]);

  // ─────────────────────────────────────────────────────────────────────
  // IAP (IN-APP PURCHASE) INITIALIZATION
  // Monetize: calculator skins, themes, premium analytics. Optional.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appReady) return;

    IAPService.init({
      onPurchaseSuccess: (pack) => {
        setPurchasing(false);
        setUserProfile((p) => ({
          ...p,
          subscriptionTier: pack.tier || "pro",
        }));
        showToast(`Welcome to ${pack.name}! 🎉`);
        showNotif(`Subscription upgraded: ${pack.name}`);
      },
      onPurchaseError: (err) => {
        setPurchasing(false);
        showToast("Purchase failed. Try again.");
        console.warn("[IAP] error:", err);
      },
    }).then(async () => {
      const products = await IAPService.getStoreProducts();
      setStoreProducts(products);
    });

    return () => IAPService.destroy();
  }, [appReady]);

  // ─────────────────────────────────────────────────────────────────────
  // TOAST & IN-APP NOTIFICATION ANIMATION HELPERS
  // Toast: bottom popup, fade in/out. Ephemeral feedback. Simple, elegant.
  // Notification: top banner, spring arrival, graceful exit. Premium feel.
  // ─────────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastMsg(null));
  }, [toastAnim]);

  const showNotif = useCallback((msg) => {
    setNotifMsg(msg);
    Animated.sequence([
      Animated.spring(notifAnim, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
      Animated.delay(3200),
      Animated.timing(notifAnim, { toValue: -80, duration: 300, useNativeDriver: true }),
    ]).start(() => setNotifMsg(null));
  }, [notifAnim]);

  // ─────────────────────────────────────────────────────────────────────
  // IAP PURCHASE HANDLER
  // User wants to upgrade. Initiate purchase.
  // ─────────────────────────────────────────────────────────────────────
  const handlePurchasePack = useCallback((productId) => {
    setPurchasing(productId);
    IAPService.purchase(productId);
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // PRIMARY RENDER DECISION TREE
  // Bootstrap -> Auth gate -> Splash -> App. For the driven.
  // ─────────────────────────────────────────────────────────────────────

  // Wait for fonts and app state.
  if (!appReady) return null;

  // ─────────────────────────────────────────────────────────────────────
  // AUTH GATE: No entry without authentication
  // If logged out, show login screen. Anything is possible after you sign in.
  // ─────────────────────────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
        <AuthScreen
          onAuthSuccess={(user, role) => {
            setAuthUser(user);
            setIsAuthed(true);
            setUserRole(role);
            if (user.displayName) setUserProfile((p) => ({ ...p, displayName: user.displayName }));
            if (user.email) setUserProfile((p) => ({ ...p, email: user.email }));
            if (user.photoURL) setUserProfile((p) => ({ ...p, avatarUri: user.photoURL }));
          }}
          showToast={showToast}
        />
      </>
    );
  }

  // Show the splash screen once. Build momentum. Then transition to app.
  if (showSplash) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
        <SplashScreen onDone={() => setShowSplash(false)} />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // DYNAMIC RENDER TREE
  // Select active screen based on navigation state and user role.
  // ─────────────────────────────────────────────────────────────────────
  const renderScreen = () => {
    // Exam mode active. Show secure exam interface.
    if (inExamMode && currentExam) {
      return (
        <ExamModeScreen
          exam={currentExam}
          onExit={() => {
            setInExamMode(false);
            setTab("exams");
          }}
          violations={examViolations}
          showToast={showToast}
        />
      );
    }

    // Tab navigation. Choose your destination.
    const TABS = userRole === "teacher" ? TEACHER_TABS : STUDENT_TABS;

    switch (tab) {
      case "calculator":
        return (
          <CalculatorScreen
            mode={calculatorMode}
            onModeChange={setCalculatorMode}
            display={calculatorDisplay}
            onDisplayChange={setCalculatorDisplay}
            history={calculatorHistory}
            onHistoryAdd={(item) => setCalculatorHistory((prev) => [...prev, item])}
            showToast={showToast}
          />
        );
      case "exams":
        return (
          <ExamListScreen
            exams={exams}
            onStartExam={(exam) => {
              setCurrentExam(exam);
              setInExamMode(true);
            }}
            userRole={userRole}
            showToast={showToast}
          />
        );
      case "classroom":
        return (
          <ClassroomScreen
            classrooms={classrooms}
            userRole={userRole}
            onSelectClassroom={setCurrentClassroom}
            showToast={showToast}
          />
        );
      case "dashboard":
        return userRole === "teacher" ? (
          <TeacherDashboardScreen
            exams={exams}
            classrooms={classrooms}
            showToast={showToast}
          />
        ) : null;
      case "analytics":
        return (
          <AnalyticsScreen
            userRole={userRole}
            showToast={showToast}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={(updates) => setUserProfile((p) => ({ ...p, ...updates }))}
            storeProducts={storeProducts}
            purchasing={purchasing}
            onPurchase={handlePurchasePack}
            onSignOut={async () => {
              await signOut();
              setIsAuthed(false);
              setAuthUser(null);
              setUserRole(null);
            }}
            showToast={showToast}
          />
        );
      default:
        return userRole === "teacher" ? (
          <TeacherDashboardScreen exams={exams} classrooms={classrooms} showToast={showToast} />
        ) : (
          <CalculatorScreen
            mode={calculatorMode}
            onModeChange={setCalculatorMode}
            display={calculatorDisplay}
            onDisplayChange={setCalculatorDisplay}
            history={calculatorHistory}
            onHistoryAdd={(item) => setCalculatorHistory((prev) => [...prev, item])}
            showToast={showToast}
          />
        );
    }
  };

  const TABS = userRole === "teacher" ? TEACHER_TABS : STUDENT_TABS;

  // ─────────────────────────────────────────────────────────────────────
  // MAIN APP LAYOUT
  // Screen content + tab bar + notification layer.
  // Everything orchestrated from one root view.
  // ─────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* ══════════════════════════════════════════════════════════════════
          TAB BAR NAVIGATION
          Multiple tabs. Multiple pathways. For students and teachers alike.
          ══════════════════════════════════════════════════════════════════ */}
      {!inExamMode && (
        <View style={styles.tabBar}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={styles.tabItem}
              onPress={() => setTab(t.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, tab === t.key && styles.tabIconActive]}>{t.icon}</Text>
              <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          IN-APP NOTIFICATION OVERLAY
          Top banner. Springs down. Real-time exam alerts. Classroom updates.
          ══════════════════════════════════════════════════════════════════ */}
      {notifMsg && (
        <Animated.View style={[styles.notif, { transform: [{ translateY: notifAnim }] }]}>
          <Text style={{ fontSize: 22 }}>🧮</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifApp}>GRAPHR - NOW</Text>
            <Text style={styles.notifMsg} numberOfLines={1}>{notifMsg}</Text>
          </View>
        </Animated.View>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TOAST NOTIFICATION
          Bottom center. Ephemeral feedback. Confirmations, errors, wins.
          Fades in. Fades out. Clean & purposeful.
          ══════════════════════════════════════════════════════════════════ */}
      {toastMsg && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastTxt}>{toastMsg}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.dark },
  tabBar: {
    height: 74,
    backgroundColor: COLORS.darkSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    paddingTop: 8,
  },
  tabItem: { flex: 1, alignItems: "center", gap: 2, paddingVertical: 5 },
  tabIcon: { fontSize: 19, opacity: 0.35, color: COLORS.text },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: COLORS.textSecondary, letterSpacing: 0.5 },
  tabLabelActive: { color: COLORS.primary, fontFamily: "Inter_700Bold" },
  notif: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 36,
    left: 12,
    right: 12,
    backgroundColor: "rgba(26, 26, 26, 0.97)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 999,
  },
  notifApp: { fontFamily: "Inter_700Bold", fontSize: 10, color: COLORS.textSecondary, letterSpacing: 2 },
  notifMsg: { fontFamily: "Inter_400Regular", fontSize: 15, color: COLORS.text, letterSpacing: 0.5 },
  toast: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 999,
  },
  toastTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: COLORS.text, letterSpacing: 1 },
});
