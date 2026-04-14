/*
 * Exam Module
 * Handles exam creation, taking, and grading
 */

class ExamModule {
  constructor() {
    this.currentExam = null;
    this.timeRemaining = 0;
    this.timerInterval = null;
  }

  createExam(name, duration, questions) {
    const exam = {
      id: Date.now().toString(),
      name,
      duration,
      questions,
      createdAt: new Date().toISOString(),
      teacherId: app.currentUser.id,
    };
    return exam;
  }

  loadExam(examId) {
    this.currentExam = app.exams.find(e => e.id === examId);
    return this.currentExam;
  }

  startExam(examId) {
    this.currentExam = this.loadExam(examId);
    this.timeRemaining = this.currentExam.duration * 60;
    this.startTimer();
    return this.currentExam;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      if (this.timeRemaining <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById('examTimer');
    if (timerEl) {
      const mins = Math.floor(this.timeRemaining / 60);
      const secs = this.timeRemaining % 60;
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  submitExam() {
    this.stopTimer();
    // Handled by app.submitExam()
  }

  gradeExam(examId, studentId) {
    const result = app.examResults.find(r =>
      r.examId === examId && r.studentId === studentId
    );
    return result;
  }

  getAllResults(examId) {
    return app.examResults.filter(r => r.examId === examId);
  }
}

const Exam = new ExamModule();
