/**
 * Get remark based on score and grade system
 * @param {Object} allGrades - The grade list object containing grade systems
 * @param {number} score - The score to evaluate
 * @returns {Object} - Object containing grade and remark
 */
export function getRemark(gradeSystem, score) {
  if (!gradeSystem) {
    return { grade: null, remark: "No grade system available." };
  }

  // let gradeSystem = allGrades.gradeSystems;

  if (score == null || typeof score !== "number") {
    return { grade: null, remark: "Invalid score provided." };
  }

  const grade = gradeSystem.find(
    (g) => score >= g.from_mark && score <= g.to_mark,
  );

  return grade
    ? { grade: grade.grade, remark: grade.remark }
    : { grade: "N/A", remark: "N/A" };
}

/**
 * Get grade letter based on score and grade system
 * @param {Object} allGrades - The grade list object containing grade systems
 * @param {number} score - The score to evaluate
 * @returns {string} - The grade letter or 'N/A'
 */
export function getGrade(allGrades, score) {
  if (!allGrades || !allGrades.gradeSystems) {
    return "N/A";
  }

  let gradeSystem = allGrades.gradeSystems;

  if (score == null || typeof score !== "number") {
    return "N/A";
  }

  const grade = gradeSystem.find(
    (g) => score >= g.from_mark && score <= g.to_mark,
  );

  return grade ? grade.grade : "N/A";
}

/**
 * Check if grade type is letter grade (shows grade column)
 * @param {string} gradeType - The grade type from grade list
 * @returns {boolean} - True if it's letter grade type
 */
export function isLetterGrade(gradeType) {
  return gradeType === "letter_grade";
}

/**
 * Check if grade type is remark grade (hides grade column)
 * @param {string} gradeType - The grade type from grade list
 * @returns {boolean} - True if it's remark grade type
 */
export function isRemarkGrade(gradeType) {
  return gradeType === "remark_grade";
}


export function displayPosition(gradeSystem, gradeType, average, position) {
  // If remark grade, return position
  if (gradeType === "remark_grade") {
    return position;
  }

  if (average == null || typeof average !== "number") {
    return null;
  }

  // 1️⃣ Round average to whole number
  const avg = Math.round(average);

  // 2️⃣ Convert grade range strings to numbers
  const grade = gradeSystem?.find((g) => {
    const from = Number(g.from_mark);
    const to = Number(g.to_mark);
    return avg >= from && avg <= to;
  });

  return grade ? grade.grade : null;
}
