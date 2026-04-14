/*
 * Classroom Module
 * Handles classroom management for both students and teachers
 */

class ClassroomModule {
  constructor() {
    this.currentClassroom = null;
  }

  createClassroom(name, description, teacherId) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const classroom = {
      id: Date.now().toString(),
      name,
      description,
      code,
      teacherId,
      teacherName: app.users.find(u => u.id === teacherId).firstName,
      students: [],
      exams: [],
      materials: [],
      createdAt: new Date().toISOString(),
    };
    return classroom;
  }

  joinClassroom(classroomId, studentId) {
    const classroom = app.classrooms.find(c => c.id === classroomId);
    if (classroom && !classroom.students.includes(studentId)) {
      classroom.students.push(studentId);
      app.saveClassrooms();
      return { success: true };
    }
    return { success: false, error: 'Cannot join classroom' };
  }

  leaveClassroom(classroomId, studentId) {
    const classroom = app.classrooms.find(c => c.id === classroomId);
    if (classroom) {
      classroom.students = classroom.students.filter(id => id !== studentId);
      app.saveClassrooms();
      return { success: true };
    }
    return { success: false };
  }

  addExamToClassroom(classroomId, examId) {
    const classroom = app.classrooms.find(c => c.id === classroomId);
    if (classroom && !classroom.exams.includes(examId)) {
      classroom.exams.push(examId);
      app.saveClassrooms();
      return { success: true };
    }
    return { success: false };
  }

  getClassroomExams(classroomId) {
    const classroom = app.classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];
    return app.exams.filter(e => classroom.exams.includes(e.id));
  }

  getClassroomStudents(classroomId) {
    const classroom = app.classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];
    return app.users.filter(u => classroom.students.includes(u.id));
  }

  getClassroomStats(classroomId) {
    const classroom = app.classrooms.find(c => c.id === classroomId);
    if (!classroom) return null;

    const exams = this.getClassroomExams(classroomId);
    const students = this.getClassroomStudents(classroomId);

    const results = app.examResults.filter(r =>
      exams.some(e => e.id === r.examId) &&
      students.some(s => s.id === r.studentId)
    );

    const avgScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

    return {
      id: classroomId,
      name: classroom.name,
      studentCount: students.length,
      examCount: exams.length,
      submissionCount: results.length,
      averageScore: avgScore,
    };
  }
}

const ClassroomMgmt = new ClassroomModule();
