function getRemark(gradeSystem, score) {
  if (!Array.isArray(gradeSystem)) {
    return { grade: null, remark: "No grade system available." };
  }

  if (score == null || typeof score !== "number") {
    return { grade: null, remark: "Invalid score provided." };
  }

  // Round score (important for decimals)
  const avg = Math.round(score);

  const grade = gradeSystem.find((g) => {
    const from = Number(g.from_mark);
    const to = Number(g.to_mark);
    return avg >= from && avg <= to;
  });

  return grade
    ? { grade: grade.grade, remark: grade.remark }
    : { grade: "N/A", remark: "N/A" };
}

function getPrincipalAndTeacherRemark(gradeSystem, score) {
  if (!Array.isArray(gradeSystem)) {
    return {
      class_teacher_remark: "",
      principal_remark: "",
    };
  }

  if (score == null || typeof score !== "number") {
    return { principal_remark: "", principal_remark: "" };
  }

  // Round score (important for decimals)
  const avg = Math.round(score);

  const grade = gradeSystem.find((g) => {
    const from = Number(g.from_mark);
    const to = Number(g.to_mark);
    return avg >= from && avg <= to;
  });

  return grade
    ? {
        principal_remark: grade.principal_remark,
        class_teacher_remark: grade.class_teacher_remark,
      }
    : { principal_remark: "N/A", class_teacher_remark: "N/A" };
}

function displayPosition(gradeSystem, gradeType, average, position) {
  if (gradeType === "remark_grade") {
    return position;
  }

  if (average == null || typeof average !== "number") {
    return null;
  }

  const avg = Math.round(average);

  const grade = gradeSystem.find((g) => {
    const from = Number(g.from_mark);
    const to = Number(g.to_mark);
    return avg >= from && avg <= to;
  });

  return grade ? grade.grade : null;
}

module.exports = {
  getRemark,
  displayPosition,
  getPrincipalAndTeacherRemark
};
