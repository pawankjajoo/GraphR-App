/**
 * GraphR Web App - Main Application Logic
 * The orchestrator for the entire GraphR experience
 * #CalculatingTheFuture
 */

class GraphRApp {
  constructor() {
    // Authentication state
    this.isAuthed = false;
    this.currentUser = null;
    this.userRole = 'student'; // 'student' or 'teacher'

    // Data storage (using localStorage for demo)
    this.users = this.loadUsers();
    this.classrooms = this.loadClassrooms();
    this.exams = this.loadExams();
    this.examResults = this.loadExamResults();
    this.examViolations = this.loadExamViolations();

    // UI state
    this.currentView = 'calculator';
    this.calculatorMode = 'basic';
    this.currentExam = null;
    this.currentExamStartTime = null;
    this.examTimer = null;

    this.initializeEventListeners();
    this.checkAuthStatus();
  }

  // ──────────────────────────────────────────────────────────────────
  // AUTHENTICATION
  // ──────────────────────────────────────────────────────────────────

  checkAuthStatus() {
    const authUser = localStorage.getItem('graphr_current_user');
    if (authUser) {
      this.currentUser = JSON.parse(authUser);
      this.isAuthed = true;
      this.userRole = this.currentUser.role;
      this.showMainApp();
    } else {
      this.showAuthView();
    }
  }

  initializeEventListeners() {
    // Auth form
    const authForm = document.getElementById('authForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => this.handleAuth(e));
    }

    // Role selector
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchRole(e));
    });

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => this.switchView(e));
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.add('hidden');
      });
    });

    // Modal join classroom
    document.getElementById('joinClassBtn')?.addEventListener('click', () => {
      document.getElementById('joinClassModal').classList.remove('hidden');
    });

    document.getElementById('joinClassForm')?.addEventListener('submit', (e) => {
      this.joinClassroom(e);
    });

    // Modal create exam
    document.getElementById('createExamBtn')?.addEventListener('click', () => {
      document.getElementById('createExamModal').classList.remove('hidden');
    });

    document.getElementById('createExamForm')?.addEventListener('submit', (e) => {
      this.createExam(e);
    });
  }

  handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('authRole').value;

    // Find or create user
    let user = this.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: Date.now().toString(),
        email,
        password,
        role,
        firstName: email.split('@')[0],
        lastName: 'User',
        createdAt: new Date().toISOString(),
        examsCompleted: 0,
        averageScore: 0,
      };
      this.users.push(user);
      this.saveUsers();
    }

    // Authenticate
    this.currentUser = user;
    this.userRole = role;
    this.isAuthed = true;

    localStorage.setItem('graphr_current_user', JSON.stringify(user));
    this.showMainApp();
  }

  logout() {
    if (confirm('Are you sure you want to sign out?')) {
      this.isAuthed = false;
      this.currentUser = null;
      localStorage.removeItem('graphr_current_user');
      this.showAuthView();
    }
  }

  switchRole(e) {
    const role = e.target.dataset.role;
    this.userRole = role;

    // Update buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update sidebar
    this.updateSidebar();
    this.showView('calculator');
  }

  // ──────────────────────────────────────────────────────────────────
  // VIEW MANAGEMENT
  // ──────────────────────────────────────────────────────────────────

  showAuthView() {
    document.getElementById('mainView').innerHTML = document.getElementById('authView').innerHTML;
    this.initializeEventListeners();
  }

  showMainApp() {
    document.getElementById('authView').classList.add('hidden');
    document.getElementById('calculatorView').classList.remove('hidden');
    this.updateSidebar();
    this.showView('calculator');
  }

  updateSidebar() {
    const teacherOnly = document.querySelectorAll('.teacher-only');
    teacherOnly.forEach(section => {
      if (this.userRole === 'teacher') {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  }

  switchView(e) {
    const viewKey = e.currentTarget.dataset.view;
    this.showView(viewKey);
  }

  showView(viewKey) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
      v.classList.add('hidden');
    });

    // Remove active from sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });

    // Show selected view
    const viewMap = {
      'calculator': 'calculatorView',
      'graphing': 'graphingView',
      'exams': 'examsView',
      'classroom': 'classroomView',
      'analytics': 'analyticsView',
      'dashboard': 'dashboardView',
      'gradebook': 'gradebookView',
      'profile': 'profileView',
      'settings': 'settingsView',
    };

    const viewId = viewMap[viewKey];
    if (viewId) {
      document.getElementById(viewId).classList.remove('hidden');

      // Mark sidebar item as active
      document.querySelector(`[data-view="${viewKey}"]`)?.classList.add('active');

      // Initialize view content
      this.initializeView(viewKey);
    }

    this.currentView = viewKey;
  }

  initializeView(viewKey) {
    switch (viewKey) {
      case 'calculator':
        Calculator.initializeBasicMode();
        break;
      case 'graphing':
        Graphing.initialize();
        break;
      case 'exams':
        this.loadExamList();
        break;
      case 'classroom':
        this.loadClassroomList();
        break;
      case 'analytics':
        this.loadAnalytics();
        break;
      case 'dashboard':
        this.loadTeacherDashboard();
        break;
      case 'gradebook':
        this.loadGradeBook();
        break;
      case 'profile':
        this.loadProfile();
        break;
      case 'settings':
        this.loadSettings();
        break;
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // CLASSROOM MANAGEMENT
  // ──────────────────────────────────────────────────────────────────

  loadClassroomList() {
    const list = document.getElementById('classroomList');
    const userClassrooms = this.classrooms.filter(c => {
      if (this.userRole === 'teacher') {
        return c.teacherId === this.currentUser.id;
      } else {
        return c.students.includes(this.currentUser.id);
      }
    });

    list.innerHTML = userClassrooms.map(c => `
      <div class="classroom-card">
        <div class="classroom-card-header">
          <span class="classroom-code">${c.code}</span>
          <h3 class="classroom-card-title">${c.name}</h3>
          <p class="classroom-card-teacher">Teacher: ${c.teacherName}</p>
        </div>
        <div class="classroom-card-meta">
          <div class="classroom-card-meta-item">
            <span>📚 <strong>${c.students.length}</strong> students</span>
          </div>
          <div class="classroom-card-meta-item">
            <span>📝 <strong>${c.exams.length}</strong> exams</span>
          </div>
        </div>
        <p class="classroom-card-description">${c.description}</p>
        <div class="classroom-card-actions">
          <button class="btn btn-primary" onclick="app.viewClassroom('${c.id}')">View</button>
          ${this.userRole === 'teacher' ? `
            <button class="btn btn-secondary" onclick="app.editClassroom('${c.id}')">Edit</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  joinClassroom(e) {
    e.preventDefault();
    const code = document.getElementById('classroomCode').value;
    const classroom = this.classrooms.find(c => c.code === code);

    if (!classroom) {
      this.showToast('Classroom not found', 'error');
      return;
    }

    if (!classroom.students.includes(this.currentUser.id)) {
      classroom.students.push(this.currentUser.id);
      this.saveClassrooms();
      this.showToast(`Joined ${classroom.name}!`, 'success');
      document.getElementById('joinClassModal').classList.add('hidden');
      this.loadClassroomList();
    } else {
      this.showToast('You are already in this classroom', 'warning');
    }
  }

  viewClassroom(classroomId) {
    const classroom = this.classrooms.find(c => c.id === classroomId);
    if (classroom) {
      this.showToast(`Viewing ${classroom.name}`, 'success');
    }
  }

  editClassroom(classroomId) {
    this.showToast('Edit classroom feature coming soon', 'info');
  }

  // ──────────────────────────────────────────────────────────────────
  // EXAM MANAGEMENT
  // ──────────────────────────────────────────────────────────────────

  loadExamList() {
    const list = document.getElementById('examList');
    let userExams = [];

    if (this.userRole === 'teacher') {
      userExams = this.exams.filter(e => e.teacherId === this.currentUser.id);
    } else {
      // Show exams from classrooms student is in
      const studentClasses = this.classrooms.filter(c =>
        c.students.includes(this.currentUser.id)
      );
      userExams = this.exams.filter(e =>
        studentClasses.some(c => c.exams.includes(e.id))
      );
    }

    list.innerHTML = userExams.map(exam => {
      const result = this.examResults.find(r =>
        r.studentId === this.currentUser.id && r.examId === exam.id
      );
      const status = result ? 'completed' : 'available';

      return `
        <div class="exam-card">
          <div class="exam-card-header">
            <h3 class="exam-card-title">${exam.name}</h3>
            <span class="exam-card-status ${status}">${status}</span>
          </div>
          <div class="exam-card-meta">
            <div class="exam-card-meta-item">
              <span>⏱️ <strong>${exam.duration}</strong> min</span>
            </div>
            <div class="exam-card-meta-item">
              <span>❓ <strong>${exam.questions.length}</strong> questions</span>
            </div>
          </div>
          <p class="exam-card-description">${exam.description}</p>
          <div class="exam-card-footer">
            ${result ? `
              <button class="btn btn-secondary" onclick="app.viewExamResult('${exam.id}')">View Results</button>
            ` : `
              <button class="btn btn-primary" onclick="app.startExam('${exam.id}')">Start Exam</button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  startExam(examId) {
    this.currentExam = this.exams.find(e => e.id === examId);
    if (!this.currentExam) return;

    // Initialize exam
    this.currentExamStartTime = Date.now();
    this.showView('exam-mode');
    this.loadExamMode();
  }

  loadExamMode() {
    const exam = this.currentExam;
    document.getElementById('examTitle').textContent = exam.name;

    const content = document.getElementById('examContent');
    content.innerHTML = exam.questions.map((q, i) => `
      <div class="question-container" data-question="${i}">
        <div class="question-number">Question ${i + 1} of ${exam.questions.length}</div>
        <div class="question-text">${q.question}</div>
        <div class="question-options">
          ${q.type === 'multiple' ? `
            ${q.options.map((opt, j) => `
              <label class="question-option">
                <input type="radio" name="q${i}" value="${opt}" />
                ${opt}
              </label>
            `).join('')}
          ` : `
            <input type="text" class="question-answer-input" data-question="${i}" placeholder="Enter your answer">
          `}
        </div>
      </div>
    `).join('');

    this.startExamTimer(exam.duration * 60);

    // Handle violations (if app loses focus)
    Proctoring.startMonitoring(exam.id, this.currentUser.id);
  }

  startExamTimer(seconds) {
    let remaining = seconds;
    const timerEl = document.getElementById('examTimer');

    const update = () => {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      if (remaining <= 300) {
        timerEl.classList.add('warning');
      }
      if (remaining <= 60) {
        timerEl.classList.add('critical');
      }

      if (remaining <= 0) {
        this.submitExam();
        return;
      }

      remaining--;
      this.examTimer = setTimeout(update, 1000);
    };

    update();
  }

  submitExam() {
    if (this.examTimer) clearTimeout(this.examTimer);

    const exam = this.currentExam;
    let score = 0;

    // Calculate score (simple logic)
    exam.questions.forEach((q, i) => {
      const answer = document.querySelector(`[name="q${i}"]:checked`)?.value ||
                    document.querySelector(`[data-question="${i}"]`)?.value;
      if (answer === q.correctAnswer) {
        score += (100 / exam.questions.length);
      }
    });

    // Save result
    const result = {
      id: Date.now().toString(),
      examId: exam.id,
      studentId: this.currentUser.id,
      score: Math.round(score),
      submittedAt: new Date().toISOString(),
      violationCount: Proctoring.violationCount,
    };

    this.examResults.push(result);
    this.saveExamResults();

    // Show results
    this.showExamResults(result);
  }

  showExamResults(result) {
    const exam = this.currentExam;
    const grade = this.getGrade(result.score);

    document.getElementById('examContent').innerHTML = `
      <div class="exam-results-container">
        <h2>Exam Complete!</h2>
        <div class="score-display">${result.score}%</div>
        <div class="grade-display ${grade.toLowerCase()}">${grade}</div>

        <div class="exam-summary">
          <div class="summary-item">
            <div class="summary-item-label">Questions Answered</div>
            <div class="summary-item-value">${exam.questions.length}</div>
          </div>
          <div class="summary-item">
            <div class="summary-item-label">Time Taken</div>
            <div class="summary-item-value">${this.getTimeTaken()}</div>
          </div>
        </div>

        <button class="btn btn-primary" onclick="app.showView('exams')">Back to Exams</button>
      </div>
    `;

    // Disable exam controls
    document.getElementById('examTimer').textContent = 'Complete';
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getTimeTaken() {
    const elapsed = Date.now() - this.currentExamStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  viewExamResult(examId) {
    const result = this.examResults.find(r =>
      r.examId === examId && r.studentId === this.currentUser.id
    );
    if (result) {
      this.showToast(`Score: ${result.score}%`, 'success');
    }
  }

  createExam(e) {
    e.preventDefault();
    const name = document.getElementById('examName').value;
    const duration = parseInt(document.getElementById('examDuration').value);
    const questionCount = parseInt(document.getElementById('examQuestions').value);

    const exam = {
      id: Date.now().toString(),
      name,
      duration,
      description: 'New exam',
      teacherId: this.currentUser.id,
      questions: Array(questionCount).fill(null).map((_, i) => ({
        question: `Question ${i + 1}?`,
        type: 'multiple',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
      })),
      createdAt: new Date().toISOString(),
    };

    this.exams.push(exam);
    this.saveExams();
    this.showToast(`Exam "${name}" created!`, 'success');
    document.getElementById('createExamModal').classList.add('hidden');
    this.loadExamList();
  }

  // ──────────────────────────────────────────────────────────────────
  // ANALYTICS & DASHBOARD
  // ──────────────────────────────────────────────────────────────────

  loadAnalytics() {
    const results = this.examResults.filter(r => r.studentId === this.currentUser.id);
    const scores = results.map(r => r.score);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b) / scores.length)
      : 0;

    document.getElementById('avgScore').textContent = `${avgScore}%`;
    document.getElementById('examsCompleted').textContent = results.length;
    document.getElementById('currentStreak').textContent = '5 days';
  }

  loadTeacherDashboard() {
    // Show active exams
    const activeExams = this.exams.filter(e => e.teacherId === this.currentUser.id);
    document.getElementById('activeExamsList').innerHTML = activeExams.map(exam => `
      <div class="active-exam-item">
        <div class="active-exam-name">${exam.name}</div>
        <div class="active-exam-info">
          ${this.examResults.filter(r => r.examId === exam.id).length} submissions
        </div>
      </div>
    `).join('');

    // Show violations
    const violations = this.examViolations.filter(v =>
      v.teacherId === this.currentUser.id
    );
    document.getElementById('violationsList').innerHTML = violations.slice(0, 5).map(v => `
      <div class="violation-item">
        <div class="violation-student">${v.studentName}</div>
        <div class="violation-details">
          Exam: ${v.examName} | Violations: ${v.count}
        </div>
      </div>
    `).join('');
  }

  loadGradeBook() {
    const body = document.getElementById('gradebookBody');
    const teacherExams = this.exams.filter(e => e.teacherId === this.currentUser.id);
    const results = this.examResults.filter(r =>
      teacherExams.some(e => e.id === r.examId)
    );

    body.innerHTML = results.map(result => {
      const exam = this.exams.find(e => e.id === result.examId);
      const student = this.users.find(u => u.id === result.studentId);
      const grade = this.getGrade(result.score);

      return `
        <tr>
          <td>${student.firstName} ${student.lastName}</td>
          <td>${exam.name}</td>
          <td>${result.score}%</td>
          <td><span class="grade-badge ${grade.toLowerCase()}">${grade}</span></td>
          <td><span class="status-badge graded">Graded</span></td>
          <td>
            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;">Review</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  loadProfile() {
    const user = this.currentUser;
    document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileFirstName').value = user.firstName;
    document.getElementById('profileLastName').value = user.lastName;

    const results = this.examResults.filter(r => r.studentId === user.id);
    const avgScore = results.length > 0
      ? Math.round(results.map(r => r.score).reduce((a, b) => a + b) / results.length)
      : 0;

    document.getElementById('totalExams').textContent = results.length;
    document.getElementById('profileAvgScore').textContent = `${avgScore}%`;
    document.getElementById('memberSince').textContent = new Date(user.createdAt).toLocaleDateString();
  }

  loadSettings() {
    document.getElementById('darkModeToggle').checked = true;
    document.getElementById('notificationsToggle').checked = true;
  }

  // ──────────────────────────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────────────────────────

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }

  // ──────────────────────────────────────────────────────────────────
  // DATA PERSISTENCE
  // ──────────────────────────────────────────────────────────────────

  loadUsers() {
    const data = localStorage.getItem('graphr_users');
    return data ? JSON.parse(data) : this.getDefaultUsers();
  }

  saveUsers() {
    localStorage.setItem('graphr_users', JSON.stringify(this.users));
  }

  loadClassrooms() {
    const data = localStorage.getItem('graphr_classrooms');
    return data ? JSON.parse(data) : this.getDefaultClassrooms();
  }

  saveClassrooms() {
    localStorage.setItem('graphr_classrooms', JSON.stringify(this.classrooms));
  }

  loadExams() {
    const data = localStorage.getItem('graphr_exams');
    return data ? JSON.parse(data) : this.getDefaultExams();
  }

  saveExams() {
    localStorage.setItem('graphr_exams', JSON.stringify(this.exams));
  }

  loadExamResults() {
    const data = localStorage.getItem('graphr_exam_results');
    return data ? JSON.parse(data) : [];
  }

  saveExamResults() {
    localStorage.setItem('graphr_exam_results', JSON.stringify(this.examResults));
  }

  loadExamViolations() {
    const data = localStorage.getItem('graphr_violations');
    return data ? JSON.parse(data) : [];
  }

  saveExamViolations() {
    localStorage.setItem('graphr_violations', JSON.stringify(this.examViolations));
  }

  getDefaultUsers() {
    return [
      {
        id: '1',
        email: 'teacher@school.edu',
        password: 'password',
        role: 'teacher',
        firstName: 'Ms.',
        lastName: 'Johnson',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'student@school.edu',
        password: 'password',
        role: 'student',
        firstName: 'Alex',
        lastName: 'Smith',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getDefaultClassrooms() {
    return [
      {
        id: '1',
        code: 'MATH101',
        name: 'Algebra I',
        teacherId: '1',
        teacherName: 'Ms. Johnson',
        description: 'Introduction to Algebra',
        students: ['2'],
        exams: [],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getDefaultExams() {
    return [
      {
        id: '1',
        name: 'Algebra Pre-Test',
        duration: 30,
        description: 'Test your algebra knowledge',
        teacherId: '1',
        questions: [
          {
            question: 'What is 2 + 2?',
            type: 'multiple',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
          },
          {
            question: 'Solve: x + 5 = 10',
            type: 'text',
            options: [],
            correctAnswer: '5',
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

// Initialize the app
const app = new GraphRApp();
