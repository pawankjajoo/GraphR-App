/**
 * GraphR Proctoring Module
 * Patent-based exam monitoring and violation detection
 * Detects app switching without locking the device (emergency calls always work)
 */

class ProctoringModule {
  constructor() {
    this.isMonitoring = false;
    this.examId = null;
    this.studentId = null;
    this.violationCount = 0;
    this.violations = [];
    this.windowFocusListener = null;
    this.tabVisibilityListener = null;
    this.startTime = null;
  }

  /**
   * Start monitoring an exam
   * Tracks app switching and logs violations
   */
  startMonitoring(examId, studentId) {
    this.examId = examId;
    this.studentId = studentId;
    this.violationCount = 0;
    this.violations = [];
    this.startTime = Date.now();
    this.isMonitoring = true;

    // Monitor window focus
    this.windowFocusListener = (event) => {
      if (event.type === 'blur') {
        this.logViolation('window_blur', 'Switched to another window');
      } else if (event.type === 'focus') {
        // Student returned - note this
      }
    };

    // Monitor tab visibility
    this.tabVisibilityListener = () => {
      if (document.hidden) {
        this.logViolation('tab_hidden', 'Tab became hidden');
      }
    };

    window.addEventListener('blur', this.windowFocusListener);
    window.addEventListener('focus', this.windowFocusListener);
    document.addEventListener('visibilitychange', this.tabVisibilityListener);

    // Prevent right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.logViolation('right_click', 'Attempted right-click');
    });

    // Detect copy/paste
    document.addEventListener('copy', (e) => {
      this.logViolation('copy_attempt', 'Attempted to copy');
    });

    document.addEventListener('paste', (e) => {
      this.logViolation('paste_attempt', 'Attempted to paste');
    });

    console.log('Exam proctoring started for exam:', examId);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.windowFocusListener) {
      window.removeEventListener('blur', this.windowFocusListener);
      window.removeEventListener('focus', this.windowFocusListener);
    }
    if (this.tabVisibilityListener) {
      document.removeEventListener('visibilitychange', this.tabVisibilityListener);
    }
    this.isMonitoring = false;
    console.log('Exam proctoring stopped. Total violations:', this.violationCount);
  }

  /**
   * Log a violation
   */
  logViolation(type, message) {
    if (!this.isMonitoring) return;

    this.violationCount++;

    const violation = {
      id: Date.now(),
      examId: this.examId,
      studentId: this.studentId,
      type,
      message,
      timestamp: new Date().toISOString(),
      elapsedTime: Date.now() - this.startTime,
    };

    this.violations.push(violation);

    // Notify teacher in real-time (in production)
    this.notifyTeacher(violation);

    // Show warning to student
    this.showViolationWarning(violation);

    console.warn('Violation detected:', violation);

    // If too many violations, auto-submit
    if (this.violationCount >= 5) {
      this.autoSubmitExam();
    }
  }

  /**
   * Show warning to student (non-blocking)
   */
  showViolationWarning(violation) {
    const statusEl = document.getElementById('examStatus');
    if (statusEl) {
      statusEl.innerHTML = `
        <div class="violation-alert" style="display: block;">
          <strong>⚠️ Violation Detected</strong>
          <div>${violation.message}</div>
          <div style="font-size: 11px; margin-top: 4px;">
            Violations: ${this.violationCount}/5
          </div>
        </div>
      `;

      setTimeout(() => {
        statusEl.innerHTML = '';
      }, 5000);
    }
  }

  /**
   * Notify teacher of violation (Firebase in production)
   */
  notifyTeacher(violation) {
    // In production, would send to Firebase
    // firebase.firestore().collection('examViolations').add(violation)
    console.log('Notifying teacher of violation:', violation);
  }

  /**
   * Auto-submit exam if violations exceed threshold
   */
  autoSubmitExam() {
    if (confirm(
      'Too many violations detected. Your exam will be automatically submitted. Continue?'
    )) {
      // Continue exam
      this.violationCount = 0;
    } else {
      // Submit exam
      if (app && app.submitExam) {
        app.submitExam();
      }
    }
  }

  /**
   * Get violation report
   */
  getReport() {
    return {
      examId: this.examId,
      studentId: this.studentId,
      totalViolations: this.violationCount,
      violations: this.violations,
      duration: Date.now() - this.startTime,
    };
  }
}

// Additional security checks
class ExamSecurity {
  static preventCheating() {
    // Disable F12 developer tools
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        console.warn('Developer tools disabled during exam');
      }
    });

    // Disable printing
    window.print = () => {
      console.warn('Printing disabled during exam');
    };

    // Warn about leaving page
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = '';
    });
  }

  static enableFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  static exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// Global instance
const Proctoring = new ProctoringModule();
