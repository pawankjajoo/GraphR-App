/*
 * services/analyticsService.js

 *
 * Learning Analytics Service
 * Processes student learning data:
 * • Performance trends
 * • Skill mastery calculation
 * • Comparative analytics (student vs class)
 * • Personalized recommendations
 * Data-driven education. Insights for growth.
 */

/*
 * Calculate student's average score
 * @param {array} results - Array of exam results
 * @returns {number} Average score percentage
 */
export const calculateAverageScore = (results) => {
  if (results.length === 0) return 0;

  const total = results.reduce((sum, result) => {
    const score = result.score || 0;
    const max = result.total || 100;
    return sum + (score / max) * 100;
  }, 0);

  return Math.round(total / results.length);
};

/*
 * Detect performance trend
 * @param {array} results - Chronologically ordered results
 * @returns {string} "up", "down", or "stable"
 */
export const detectTrend = (results) => {
  if (results.length < 2) return "neutral";

  const recentResults = results.slice(-5);
  const scores = recentResults.map((r) => (r.score / r.total) * 100);

  const firstHalf = scores.slice(0, Math.floor(scores.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(scores.length / 2);
  const secondHalf = scores.slice(Math.floor(scores.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(scores.length / 2);

  if (secondHalf > firstHalf + 5) return "up";
  if (secondHalf < firstHalf - 5) return "down";
  return "stable";
};

/*
 * Calculate skill mastery from results
 * Assumes results have a "skillCategory" field
 * @param {array} results
 * @returns {object} skill -> mastery percentage
 */
export const calculateSkillMastery = (results) => {
  const skillMap = {};

  results.forEach((result) => {
    const skill = result.skillCategory || "general";
    const scorePercent = (result.score / result.total) * 100;

    if (!skillMap[skill]) {
      skillMap[skill] = { scores: [], total: 0 };
    }

    skillMap[skill].scores.push(scorePercent);
    skillMap[skill].total += 1;
  });

  const mastery = {};
  Object.keys(skillMap).forEach((skill) => {
    const scores = skillMap[skill].scores;
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    mastery[skill] = Math.round(average);
  });

  return mastery;
};

/*
 * Generate personalized recommendations
 * @param {array} results
 * @param {object} skillMastery
 * @returns {array} Recommendations
 */
export const generateRecommendations = (results, skillMastery = {}) => {
  const recommendations = [];

  // Find weakest skill
  let weakestSkill = null;
  let weakestScore = 100;
  Object.keys(skillMastery).forEach((skill) => {
    if (skillMastery[skill] < weakestScore) {
      weakestScore = skillMastery[skill];
      weakestSkill = skill;
    }
  });

  if (weakestSkill && weakestScore < 70) {
    recommendations.push({
      priority: "high",
      text: `Focus on ${weakestSkill} - your current mastery is ${weakestScore}%`,
      action: "practice_skill",
      skill: weakestSkill,
    });
  }

  // Suggest practice if performance is declining
  const trend = detectTrend(results);
  if (trend === "down") {
    recommendations.push({
      priority: "high",
      text: "Your scores are trending down. Consider more practice problems.",
      action: "practice_module",
    });
  }

  let strongestSkill = null;
  let strongestScore = 0;
  Object.keys(skillMastery).forEach((skill) => {
    if (skillMastery[skill] > strongestScore) {
      strongestScore = skillMastery[skill];
      strongestSkill = skill;
    }
  });

  if (strongestSkill && strongestScore >= 80) {
    recommendations.push({
      priority: "low",
      text: `Excellent progress in ${strongestSkill}! Keep it up.`,
      action: "motivate",
    });
  }

  return recommendations;
};

/*
 * Calculate class average
 * @param {array} allResults
 * @returns {number}
 */
export const calculateClassAverage = (allResults) => {
  if (allResults.length === 0) return 0;

  const total = allResults.reduce((sum, result) => {
    const score = result.score || 0;
    const max = result.total || 100;
    return sum + (score / max) * 100;
  }, 0);

  return Math.round(total / allResults.length);
};

/*
 * Compare student to class
 * @param {array} studentResults
 * @param {array} classResults
 * @returns {object}
 */
export const compareToClass = (studentResults, classResults) => {
  const studentAvg = calculateAverageScore(studentResults);
  const classAvg = calculateClassAverage(classResults);
  const difference = studentAvg - classAvg;

  return {
    studentAverage: studentAvg,
    classAverage: classAvg,
    aboveClass: difference > 0,
    difference: Math.abs(difference),
    percentile: classResults.length > 0
      ? Math.round((studentResults.filter((r) => ((r.score / r.total) * 100) <= studentAvg).length / classResults.length) * 100)
      : 0,
  };
};

/*
 * Identify struggling students (for teachers)
 * @param {array} classResults
 * @param {number} threshold - Score below this is "struggling" (default 70)
 * @returns {array}
 */
export const identifyStrugglingStudents = (classResults, threshold = 70) => {
  const studentMap = {};

  classResults.forEach((result) => {
    const studentId = result.studentId;
    const scorePercent = (result.score / result.total) * 100;

    if (!studentMap[studentId]) {
      studentMap[studentId] = {
        studentId,
        scores: [],
        count: 0,
      };
    }

    studentMap[studentId].scores.push(scorePercent);
    studentMap[studentId].count += 1;
  });

  const struggling = [];
  Object.keys(studentMap).forEach((studentId) => {
    const avg = studentMap[studentId].scores.reduce((a, b) => a + b, 0) / studentMap[studentId].scores.length;
    if (avg < threshold) {
      struggling.push({
        studentId,
        averageScore: Math.round(avg),
        examCount: studentMap[studentId].count,
      });
    }
  });

  return struggling.sort((a, b) => a.averageScore - b.averageScore);
};

/*
 * Get time-on-task analytics
 * Assumes results have a "timeSpentSeconds" field
 * @param {array} results
 * @returns {object}
 */
export const getTimeOnTaskAnalytics = (results) => {
  if (results.length === 0) return { averageMinutes: 0, totalMinutes: 0 };

  const totalSeconds = results.reduce((sum, r) => sum + (r.timeSpentSeconds || 0), 0);
  const averageSeconds = totalSeconds / results.length;

  return {
    averageMinutes: Math.round(averageSeconds / 60),
    totalMinutes: Math.round(totalSeconds / 60),
    examCount: results.length,
  };
};
