export function getRemark(allGrades, score) {
    let gradeSystem = allGrades.Grade_Systems;

    if (score == null || typeof score !== 'number') {
        return { grade: null, remark: 'Invalid score provided.' };
    }

    const grade = gradeSystem.find(
        (g) => score >= g.from_mark && score <= g.to_mark
    );

    return grade
        ? { grade: grade.grade, remark: grade.remark }
        : { grade: 'N/A', remark: 'N/A' };
}