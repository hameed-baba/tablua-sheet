// studentsData.js
export const generateStudents = (numStudents = 2) => {
  return Array.from({ length: numStudents }, (_, i) => {
    const fullName = `Student ${i + 1}`;
    const admissionNumber = `AGP/SS/2022/${String(i + 1).padStart(3, "0")}`;
    const gender = i % 2 === 0 ? "Male" : "Female";
    const dob = `201${i % 10}-0${(i % 9) + 1}-0${(i % 28) + 1}`;
    const position = i + 1;
    const academicSession = "2023/2024";
    const className = `Primary ${String.fromCharCode(65 + (i % 5))}`;
    const term = ["First Term", "Second Term", "Third Term"][i % 3];

    const subjects = Array.from({ length: 20 }, (_, j) => {
      const caScore = Math.floor(Math.random() * 21);
      const examScore = Math.floor(Math.random() * 81);
      const totalMark = caScore + examScore;
      const markObtained = totalMark;
      const markObtainable = 100;
      const averageMark = totalMark;
      const totalSubjects = 20;

      let grade = "";
      let remark = "";

      if (totalMark >= 75) {
        grade = "A";
        remark = "Excellent";
      } else if (totalMark >= 60) {
        grade = "B";
        remark = "Very Good";
      } else if (totalMark >= 50) {
        grade = "C";
        remark = "Good";
      } else if (totalMark >= 40) {
        grade = "D";
        remark = "Pass";
      } else {
        grade = "F";
        remark = "Fail";
      }

      return {
        sn: j + 1,
        subjectName: `Subject ${j + 1}`,
        caScore,
        examScore,
        totalMark,
        grade,
        remark,
        markObtained,
        markObtainable,
        averageMark,
        totalSubjects,
      };
    });

    return {
      fullName,
      admissionNumber,
      gender,
      dob,
      position,
      academicSession,
      className,
      term,
      subjects,
    };
  });
};
