/**
 * Authentication Context
 *
 * Manages user authentication state and session management.
 * Handles both student and teacher authentication flows.
 *
 * State includes:
 * - User information (ID, name, email, role)
 * - Authentication status
 * - Exam mode flag
 * - Session tokens
 */

import React, { useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

/**
 * Auth state reducer
 * Handles all authentication-related state changes
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        isSignedIn: !!action.payload.token,
        userToken: action.payload.token,
        authState: action.payload.authState || state.authState,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignedIn: true,
        userToken: action.payload.token,
        authState: {
          ...state.authState,
          isSignedIn: true,
          userId: action.payload.userId,
          userName: action.payload.userName,
          userEmail: action.payload.userEmail,
          userRole: action.payload.userRole, // 'student' or 'teacher'
        },
      };
    case 'SIGN_UP':
      return {
        ...state,
        isSignedIn: true,
        userToken: action.payload.token,
        authState: {
          ...state.authState,
          isSignedIn: true,
          userId: action.payload.userId,
          userName: action.payload.userName,
          userEmail: action.payload.userEmail,
          userRole: action.payload.userRole,
        },
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignedIn: false,
        userToken: null,
        authState: {
          isSignedIn: false,
          userId: null,
          userName: null,
          userEmail: null,
          userRole: null,
          isInExamMode: false,
        },
      };
    case 'ENTER_EXAM_MODE':
      return {
        ...state,
        authState: {
          ...state.authState,
          isInExamMode: true,
          currentExamId: action.payload.examId,
        },
      };
    case 'EXIT_EXAM_MODE':
      return {
        ...state,
        authState: {
          ...state.authState,
          isInExamMode: false,
          currentExamId: null,
        },
      };
    default:
      return state;
  }
};

/**
 * Auth Context Provider
 * Wraps app and provides auth state and methods to all components
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignedIn: false,
    userToken: null,
    authState: {
      isSignedIn: false,
      userId: null,
      userName: null,
      userEmail: null,
      userRole: null,
      isInExamMode: false,
      currentExamId: null,
    },
  });

  /**
   * Effect: Restore token from storage on app launch
   * Checks for persisted user session
   */
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const authState = await AsyncStorage.getItem('authState');

        dispatch({
          type: 'RESTORE_TOKEN',
          payload: {
            token: userToken,
            authState: authState ? JSON.parse(authState) : null,
          },
        });
      } catch (error) {
        console.error('Failed to restore token:', error);
      }
    };

    bootstrapAsync();
  }, []);

  /**
   * Sign in with email and password
   * Calls authentication service and updates state
   */
  const signIn = async (email, password, userRole = 'student') => {
    try {
      // In production, this would call an authentication API
      // For now, simulate successful login
      const userId = `user_${Date.now()}`;
      const token = `token_${Date.now()}`;

      const authData = {
        token,
        userId,
        userName: email.split('@')[0],
        userEmail: email,
        userRole,
      };

      // Persist token and auth state
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('authState', JSON.stringify(authData));

      dispatch({
        type: 'SIGN_IN',
        payload: authData,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Sign in failed',
      };
    }
  };

  /**
   * Sign up new user
   * Registers account and creates session
   */
  const signUp = async (email, password, name, userRole = 'student') => {
    try {
      // In production, this would call user registration API
      const userId = `user_${Date.now()}`;
      const token = `token_${Date.now()}`;

      const authData = {
        token,
        userId,
        userName: name,
        userEmail: email,
        userRole,
      };

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('authState', JSON.stringify(authData));

      dispatch({
        type: 'SIGN_UP',
        payload: authData,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Sign up failed',
      };
    }
  };

  /**
   * Sign out current user
   * Clears session and removes stored credentials
   */
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('authState');

      dispatch({ type: 'SIGN_OUT' });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    }
  };

  /**
   * Enter exam mode
   * Called when student joins an exam session
   */
  const enterExamMode = (examId) => {
    dispatch({
      type: 'ENTER_EXAM_MODE',
      payload: { examId },
    });
  };

  /**
   * Exit exam mode
   * Called when exam is completed or cancelled
   */
  const exitExamMode = () => {
    dispatch({ type: 'EXIT_EXAM_MODE' });
  };

  const value = {
    state,
    isLoading: state.isLoading,
    authState: state.authState,
    signIn,
    signUp,
    signOut,
    enterExamMode,
    exitExamMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook: useAuth
 * Provides convenient access to auth context from any component
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
