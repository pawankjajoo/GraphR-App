/**
 * GraphR App Main Entry Point
 *
 * This is the root component of the GraphR application. It manages navigation,
 * authentication, and overall app state. The app follows a modular architecture
 * with clear separation between screens, services, and utilities.
 *
 * Architecture:
 * - Navigation: React Navigation with bottom tab structure
 * - Auth: Session management with exam/test mode support
 * - State: Context API for user and classroom data
 * - Services: Networking, database, and real-time updates
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

// Import screens
import StudentHomeScreen from './screens/StudentHomeScreen';
import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import ExamModeScreen from './screens/ExamModeScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthScreen from './screens/AuthScreen';

// Import context providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClassroomProvider } from './context/ClassroomContext';
import { ExamModeProvider } from './context/ExamModeContext';

// Import utilities
import { initializeDatabase } from './services/DatabaseService';
import { registerNetworkListener } from './services/NetworkService';

const Tab = createBottomTabNavigator();

/**
 * Main App Navigation Structure
 * Routes are conditional based on authentication and user role
 */
function AppNavigator() {
  const { authState, isLoading } = useAuth();

  if (isLoading) {
    return <AuthScreen isLoading={true} />;
  }

  // If not authenticated, show auth screen
  if (!authState.isSignedIn) {
    return <AuthScreen />;
  }

  // If in exam mode, show exam-specific interface
  if (authState.isInExamMode) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#2C3E50',
          tabBarInactiveTintColor: '#95A5A6',
        }}
      >
        <Tab.Screen
          name="Exam"
          component={ExamModeScreen}
          options={{
            tabBarLabel: 'Exam Mode',
            headerTitle: 'GraphR Exam',
          }}
        />
        <Tab.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{
            tabBarLabel: 'Calculator',
            headerTitle: 'Interactive Calculator',
          }}
        />
      </Tab.Navigator>
    );
  }

  // Standard navigation based on user role
  const studentTabs = (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3498DB',
        tabBarInactiveTintColor: '#95A5A6',
      }}
    >
      <Tab.Screen
        name="Home"
        component={StudentHomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerTitle: 'GraphR Student',
        }}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          tabBarLabel: 'Calculator',
          headerTitle: 'Interactive Calculator',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Progress',
          headerTitle: 'Your Analytics',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerTitle: 'Settings',
        }}
      />
    </Tab.Navigator>
  );

  const teacherTabs = (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#27AE60',
        tabBarInactiveTintColor: '#95A5A6',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={TeacherDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          headerTitle: 'GraphR Teacher Dashboard',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Class Analytics',
          headerTitle: 'Class Performance',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerTitle: 'Settings',
        }}
      />
    </Tab.Navigator>
  );

  return authState.userRole === 'teacher' ? teacherTabs : studentTabs;
}

/**
 * Root App Component
 *
 * Wraps all providers and initializes services on app startup
 */
export default function App() {
  useEffect(() => {
    // Initialize database when app starts
    initializeDatabase();

    // Register network connectivity listener for offline support
    const unsubscribe = registerNetworkListener();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthProvider>
      <ClassroomProvider>
        <ExamModeProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar barStyle="dark-content" />
          </NavigationContainer>
        </ExamModeProvider>
      </ClassroomProvider>
    </AuthProvider>
  );
}
