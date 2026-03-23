/**
 * Authentication Module
 * Handles user login, signup, and session management
 */

class AuthModule {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  login(email, password, role) {
    // In production, would use Firebase or backend API
    // For demo, using localStorage
    const user = app.users.find(u => u.email === email && u.password === password);
    if (user && user.role === role) {
      this.isLoggedIn = true;
      this.currentUser = user;
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  signup(email, password, firstName, lastName, role) {
    if (app.users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const user = {
      id: Date.now().toString(),
      email,
      password,
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString(),
    };

    app.users.push(user);
    app.saveUsers();
    return { success: true, user };
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('graphr_current_user');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  resetPassword(email) {
    // In production, would send reset email
    return { success: true, message: 'Password reset link sent to email' };
  }
}

const Auth = new AuthModule();
