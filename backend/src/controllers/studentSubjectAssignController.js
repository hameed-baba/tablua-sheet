const { asyncHandler } = require("../middleware/errorHandler");
const { StudentSubjectAssign } = require("../models");
const BaseController = require("./baseController");

class StudentSubjectAssignController extends BaseController {
  constructor() {
    super(StudentSubjectAssign, "StudentSubjectAssign", [
      { model: require("../models").SchoolStudent, as: "Student" },
      { model: require("../models").SchoolClass, as: "Class" },
      { model: require("../models").SchoolSubject, as: "Subject" },
      { model: require("../models").SchoolSession, as: "Session" },
      { model: require("../models").SchoolTerm, as: "Term" },
    ]);
  }

  // Update CA1 score for a student's subject assignment (supports both single object and array)
  updateCA1Score = asyncHandler(async (req, res) => {
    const requestData = req.body;
    console.log("Received CA1 request data:", JSON.stringify(requestData, null, 2));

    // Check if it's an array or single object
    const isArray = Array.isArray(requestData);
    const dataArray = isArray ? requestData : [requestData];

    const results = [];
    const errors = [];

    // Process each item in the array
    for (const data of dataArray) {
      const {
        student_id,
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
        ca_1_score,
      } = data;

      console.log(`Processing student ${student_id}:`, {
        student_id,
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
        ca_1_score,
      });

      // Validate required fields for each item
      if (
        !student_id ||
        !current_class_id ||
        !school_subject_id ||
        !current_session_id ||
        !current_term_id ||
        ca_1_score === undefined
      ) {
        const error = "All fields are required: student_id, current_class_id, school_subject_id, current_session_id, current_term_id, ca_1_score";
        console.log(`Validation failed for student ${student_id}:`, error);
        errors.push({
          student_id,
          error,
        });
        continue;
      }

      try {
        // Find the student subject assignment
        console.log(`Looking for CA1 assignment with:`, {
          student_id,
          current_class_id,
          school_subject_id,
          current_session_id,
          current_term_id,
        });

        const assignment = await StudentSubjectAssign.findOne({
          where: {
            student_id,
            current_class_id,
            school_subject_id,
            current_session_id,
            current_term_id,
          },
          include: this.includes,
        });

        console.log(`CA1 Assignment found for student ${student_id}:`, assignment ? 'YES' : 'NO');

        if (!assignment) {
          const error = "Student subject assignment not found";
          console.log(`CA1 Assignment not found for student ${student_id}`);
          errors.push({
            student_id,
            error,
          });
          continue;
        }

        // Update the CA1 score
        console.log(`Updating CA1 score for student ${student_id} to:`, ca_1_score);
        await assignment.update({ ca_1_score });

        // Fetch the updated record with includes
        const updatedAssignment = await StudentSubjectAssign.findByPk(assignment.id, {
          include: this.includes,
        });

        results.push(updatedAssignment);
      } catch (error) {
        errors.push({
          student_id,
          error: error.message,
        });
      }
    }

    // Return appropriate response
    if (errors.length === 0) {
      res.json({
        status: "success",
        message: `CA1 score${isArray && dataArray.length > 1 ? 's' : ''} updated successfully`,
        data: isArray ? results : results[0],
        count: results.length,
      });
    } else if (results.length > 0) {
      res.status(207).json({
        status: "partial_success",
        message: `${results.length} CA1 scores updated successfully, ${errors.length} failed`,
        data: isArray ? results : results[0],
        errors: errors,
        successful_count: results.length,
        error_count: errors.length,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Failed to update any CA1 scores",
        errors: errors,
      });
    }
  });

  // Update exam score for a student's subject assignment (supports both single object and array)
  updateExamScore = asyncHandler(async (req, res) => {
    const requestData = req.body;

    // Check if it's an array or single object
    const isArray = Array.isArray(requestData);
    const dataArray = isArray ? requestData : [requestData];

    const results = [];
    const errors = [];

    // Process each item in the array
    for (const data of dataArray) {
      const {
        student_id,
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
        exam_score,
      } = data;

      // Validate required fields for each item
      if (
        !student_id ||
        !current_class_id ||
        !school_subject_id ||
        !current_session_id ||
        !current_term_id ||
        exam_score === undefined
      ) {
        errors.push({
          student_id,
          error: "All fields are required: student_id, current_class_id, school_subject_id, current_session_id, current_term_id, exam_score",
        });
        continue;
      }

      try {
        // Find the student subject assignment
        const assignment = await StudentSubjectAssign.findOne({
          where: {
            student_id,
            current_class_id,
            school_subject_id,
            current_session_id,
            current_term_id,
          },
          include: this.includes,
        });

        if (!assignment) {
          errors.push({
            student_id,
            error: "Student subject assignment not found",
          });
          continue;
        }

        // Update the exam score
        await assignment.update({ exam_score });

        // Fetch the updated record with includes
        const updatedAssignment = await StudentSubjectAssign.findByPk(assignment.id, {
          include: this.includes,
        });

        results.push(updatedAssignment);
      } catch (error) {
        errors.push({
          student_id,
          error: error.message,
        });
      }
    }

    // Return appropriate response
    if (errors.length === 0) {
      res.json({
        status: "success",
        message: `Exam score${isArray && dataArray.length > 1 ? 's' : ''} updated successfully`,
        data: isArray ? results : results[0],
        count: results.length,
      });
    } else if (results.length > 0) {
      res.status(207).json({
        status: "partial_success",
        message: `${results.length} exam scores updated successfully, ${errors.length} failed`,
        data: isArray ? results : results[0],
        errors: errors,
        successful_count: results.length,
        error_count: errors.length,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Failed to update any exam scores",
        errors: errors,
      });
    }
  });

  // Update both CA1 and exam scores in a single request
  updateScores = asyncHandler(async (req, res) => {
    const {
      student_id,
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
      ca_1_score,
      exam_score,
    } = req.body;

    // Validate required fields
    if (
      !student_id ||
      !current_class_id ||
      !school_subject_id ||
      !current_session_id ||
      !current_term_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "Required fields: student_id, current_class_id, school_subject_id, current_session_id, current_term_id",
      });
    }

    // At least one score should be provided
    if (ca_1_score === undefined && exam_score === undefined) {
      return res.status(400).json({
        status: "error",
        message: "At least one score (ca_1_score or exam_score) must be provided",
      });
    }

    // Find the student subject assignment
    const assignment = await StudentSubjectAssign.findOne({
      where: {
        student_id,
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
      },
      include: this.includes,
    });

    if (!assignment) {
      return res.status(404).json({
        status: "error",
        message: "Student subject assignment not found",
      });
    }

    // Prepare update data
    const updateData = {};
    if (ca_1_score !== undefined) updateData.ca_1_score = ca_1_score;
    if (exam_score !== undefined) updateData.exam_score = exam_score;

    // Update the scores
    await assignment.update(updateData);

    // Fetch the updated record with includes
    const updatedAssignment = await StudentSubjectAssign.findByPk(assignment.id, {
      include: this.includes,
    });

    res.json({
      status: "success",
      message: "Scores updated successfully",
      data: updatedAssignment,
    });
  });

  // Get student subject assignment by identifiers
  getByIdentifiers = asyncHandler(async (req, res) => {
    const {
      student_id,
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
    } = req.query;

    // Validate required fields
    if (
      !student_id ||
      !current_class_id ||
      !school_subject_id ||
      !current_session_id ||
      !current_term_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "All query parameters are required: student_id, current_class_id, school_subject_id, current_session_id, current_term_id",
      });
    }

    // Find the student subject assignment
    const assignment = await StudentSubjectAssign.findOne({
      where: {
        student_id,
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
      },
      include: this.includes,
    });

    if (!assignment) {
      return res.status(404).json({
        status: "error",
        message: "Student subject assignment not found",
      });
    }

    res.json({
      status: "success",
      data: assignment,
    });
  });

  // Get CA and exam marks for a student's subject assignment
  getMarks = asyncHandler(async (req, res) => {
    const {
      student_id,
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
    } = req.query;

    // Validate required fields
    if (
      !student_id ||
      !current_class_id ||
      !school_subject_id ||
      !current_session_id ||
      !current_term_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "All query parameters are required: student_id, current_class_id, school_subject_id, current_session_id, current_term_id",
      });
    }

    // Find the student subject assignment
    const assignment = await StudentSubjectAssign.findOne({
      where: {
        student_id,
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
      },
      attributes: [
        'id',
        'student_id',
        'current_class_id',
        'school_subject_id',
        'current_session_id',
        'current_term_id',
        'ca_1_score',
        'exam_score'
      ],
      include: [
        { model: require("../models").SchoolStudent, as: "Student", attributes: ['id', 'full_name', 'admission_number'] },
        { model: require("../models").SchoolClass, as: "Class", attributes: ['id', 'class_name'] },
        { model: require("../models").SchoolSubject, as: "Subject", attributes: ['id', 'subject_name'] },
        { model: require("../models").SchoolSession, as: "Session", attributes: ['id', 'session_name'] },
        { model: require("../models").SchoolTerm, as: "Term", attributes: ['id', 'term_name'] },
      ],
    });

    if (!assignment) {
      return res.status(404).json({
        status: "error",
        message: "Student subject assignment not found",
      });
    }

    // Extract and format the marks data
    const marksData = {
      assignment_id: assignment.id,
      student: {
        id: assignment.Student.id,
        name: `${assignment.Student.full_name} ${assignment.Student.last_name}`,
        admission_number: assignment.Student.admission_number,
      },
      class: {
        id: assignment.Class.id,
        name: assignment.Class.class_name,
      },
      subject: {
        id: assignment.Subject.id,
        name: assignment.Subject.subject_name,
      },
      session: {
        id: assignment.Session.id,
        name: assignment.Session.session_name,
      },
      term: {
        id: assignment.Term.id,
        name: assignment.Term.term_name,
      },
      marks: {
        ca_1_score: assignment.ca_1_score || null,
        exam_score: assignment.exam_score || null,
        total_score: this.calculateTotal(assignment.ca_1_score, assignment.exam_score),
      },
    };

    res.json({
      status: "success",
      message: "Marks retrieved successfully",
      data: marksData,
    });
  });

  // Get CA scores for a class
  getClassCAScores = asyncHandler(async (req, res) => {
    const {
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
    } = req.query;

    // Validate required fields
    if (
      !current_class_id ||
      !school_subject_id ||
      !current_session_id ||
      !current_term_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "All query parameters are required: current_class_id, school_subject_id, current_session_id, current_term_id",
      });
    }

    // Find all CA assignments for the class/subject/session/term
    const assignments = await StudentSubjectAssign.findAll({
      where: {
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
      },
      attributes: [
        'id',
        'student_id',
        'current_class_id',
        'school_subject_id',
        'current_session_id',
        'current_term_id',
        'ca_1_score'
      ],
      include: [
        { model: require("../models").SchoolStudent, as: "Student", attributes: ['id', 'full_name', 'admission_number'] },
        { model: require("../models").SchoolClass, as: "Class", attributes: ['id', 'class_name'] },
        { model: require("../models").SchoolSubject, as: "Subject", attributes: ['id', 'subject_name'] },
        { model: require("../models").SchoolSession, as: "Session", attributes: ['id', 'session_name'] },
        { model: require("../models").SchoolTerm, as: "Term", attributes: ['id', 'term_name'] },
      ],
      order: [['student_id', 'ASC']],
    });

    // Format the response
    const caScores = assignments.map(assignment => ({
      assignment_id: assignment.id,
      student_id: assignment.student_id,
      student_name: `${assignment.Student.full_name}`,
      admission_number: assignment.Student.admission_number,
      ca_1_score: assignment.ca_1_score || null,
    }));

    res.json({
      status: "success",
      message: "CA scores retrieved successfully",
      data: {
        class: {
          id: assignments[0]?.Class.id,
          name: assignments[0]?.Class.class_name,
        },
        subject: {
          id: assignments[0]?.Subject.id,
          name: assignments[0]?.Subject.subject_name,
        },
        session: {
          id: assignments[0]?.Session.id,
          name: assignments[0]?.Session.session_name,
        },
        term: {
          id: assignments[0]?.Term.id,
          name: assignments[0]?.Term.term_name,
        },
        scores: caScores,
        summary: {
          total_students: assignments.length,
          students_with_ca: assignments.filter(a => a.ca_1_score).length,
        }
      },
    });
  });

  // Get exam scores (CA + Exam) for a class
  getClassExamScores = asyncHandler(async (req, res) => {
    const {
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
    } = req.query;

    // Validate required fields
    if (
      !current_class_id ||
      !school_subject_id ||
      !current_session_id ||
      !current_term_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "All query parameters are required: current_class_id, school_subject_id, current_session_id, current_term_id",
      });
    }

    // Find all assignments for the class/subject/session/term
    const assignments = await StudentSubjectAssign.findAll({
      where: {
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
      },
      attributes: [
        'id',
        'student_id',
        'current_class_id',
        'school_subject_id',
        'current_session_id',
        'current_term_id',
        'ca_1_score',
        'exam_score'
      ],
      include: [
        { model: require("../models").SchoolStudent, as: "Student", attributes: ['id', 'full_name', 'admission_number'] },
        { model: require("../models").SchoolClass, as: "Class", attributes: ['id', 'class_name'] },
        { model: require("../models").SchoolSubject, as: "Subject", attributes: ['id', 'subject_name'] },
        { model: require("../models").SchoolSession, as: "Session", attributes: ['id', 'session_name'] },
        { model: require("../models").SchoolTerm, as: "Term", attributes: ['id', 'term_name'] },
      ],
      order: [['student_id', 'ASC']],
    });

    // Format the response
    const examScores = assignments.map(assignment => ({
      assignment_id: assignment.id,
      student_id: assignment.student_id,
      student_name: `${assignment.Student.full_name} ${assignment.Student.last_name}`,
      admission_number: assignment.Student.admission_number,
      ca_1_score: assignment.ca_1_score || null,
      exam_score: assignment.exam_score || null,
      total_score: this.calculateTotal(assignment.ca_1_score, assignment.exam_score),
    }));

    res.json({
      status: "success",
      message: "Exam scores retrieved successfully",
      data: {
        class: {
          id: assignments[0]?.Class.id,
          name: assignments[0]?.Class.class_name,
        },
        subject: {
          id: assignments[0]?.Subject.id,
          name: assignments[0]?.Subject.subject_name,
        },
        session: {
          id: assignments[0]?.Session.id,
          name: assignments[0]?.Session.session_name,
        },
        term: {
          id: assignments[0]?.Term.id,
          name: assignments[0]?.Term.term_name,
        },
        scores: examScores,
        summary: {
          total_students: assignments.length,
          students_with_ca: assignments.filter(a => a.ca_1_score).length,
          students_with_exam: assignments.filter(a => a.exam_score).length,
          students_completed: assignments.filter(a => a.ca_1_score && a.exam_score).length,
        }
      },
    });
  });

  // Get all marks for a single student
  getStudentMarks = asyncHandler(async (req, res) => {
    const { student_id } = req.params;
    const {
      current_class_id,
      current_session_id,
      current_term_id,
    } = req.query;

    // Validate required fields
    if (!student_id) {
      return res.status(400).json({
        status: "error",
        message: "Student ID is required",
      });
    }

    // Build where clause
    const whereClause = { student_id };
    if (current_class_id) whereClause.current_class_id = current_class_id;
    if (current_session_id) whereClause.current_session_id = current_session_id;
    if (current_term_id) whereClause.current_term_id = current_term_id;

    // Find all assignments for the student
    const assignments = await StudentSubjectAssign.findAll({
      where: whereClause,
      attributes: [
        'id',
        'student_id',
        'current_class_id',
        'school_subject_id',
        'current_session_id',
        'current_term_id',
        'ca_1_score',
        'exam_score'
      ],
      include: [
        { model: require("../models").SchoolStudent, as: "Student", attributes: ['id', 'full_name', 'admission_number'] },
        { model: require("../models").SchoolClass, as: "Class", attributes: ['id', 'class_name'] },
        { model: require("../models").SchoolSubject, as: "Subject", attributes: ['id', 'subject_name'] },
        { model: require("../models").SchoolSession, as: "Session", attributes: ['id', 'session_name'] },
        { model: require("../models").SchoolTerm, as: "Term", attributes: ['id', 'term_name'] },
      ],
      order: [['school_subject_id', 'ASC']],
    });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No subject assignments found for this student",
      });
    }

    // Get student info from first assignment
    const studentInfo = assignments[0].Student;

    // Format the response
    const studentMarks = {
      student: {
        id: studentInfo.id,
        name: `${studentInfo.full_name}`,
        admission_number: studentInfo.admission_number,
      },
      subjects: assignments.map(assignment => ({
        assignment_id: assignment.id,
        subject: {
          id: assignment.Subject.id,
          name: assignment.Subject.subject_name,
        },
        class: {
          id: assignment.Class.id,
          name: assignment.Class.class_name,
        },
        session: {
          id: assignment.Session.id,
          name: assignment.Session.session_name,
        },
        term: {
          id: assignment.Term.id,
          name: assignment.Term.term_name,
        },
        marks: {
          ca_1_score: assignment.ca_1_score || null,
          exam_score: assignment.exam_score || null,
          total_score: this.calculateTotal(assignment.ca_1_score, assignment.exam_score),
        },
      })),
      summary: {
        total_subjects: assignments.length,
        subjects_with_ca1: assignments.filter(a => a.ca_1_score).length,
        subjects_with_exam: assignments.filter(a => a.exam_score).length,
        subjects_completed: assignments.filter(a => a.ca_1_score && a.exam_score).length,
      }
    };

    res.json({
      status: "success",
      message: "Student marks retrieved successfully",
      data: studentMarks,
    });
  });

  // Get student assigned subjects by class, subject, session, and term
  getStudentAssignedSubjects = asyncHandler(async (req, res) => {
    const {
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
    } = req.query;

    // Validate required fields
    if (
      !current_class_id ||
      !school_subject_id ||
      !current_session_id ||
      !current_term_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "All query parameters are required: current_class_id, school_subject_id, current_session_id, current_term_id",
      });
    }

    console.log("Getting student assigned subjects with:", {
      current_class_id,
      school_subject_id,
      current_session_id,
      current_term_id,
    });

    // Find all student subject assignments for the specified parameters
    const assignments = await StudentSubjectAssign.findAll({
      where: {
        current_class_id,
        school_subject_id,
        current_session_id,
        current_term_id,
      },
      attributes: [
        'id',
        'student_id',
        'current_class_id',
        'school_subject_id',
        'current_session_id',
        'current_term_id',
        'ca_1_score',
        'exam_score',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: require("../models").SchoolStudent,
          as: "Student",
          attributes: ['id', 'full_name', 'admission_number',]
        },
        {
          model: require("../models").SchoolClass,
          as: "Class",
          attributes: ['id', 'class_name']
        },
        {
          model: require("../models").SchoolSubject,
          as: "Subject",
          attributes: ['id', 'subject_name',]
        },
        {
          model: require("../models").SchoolSession,
          as: "Session",
          attributes: ['id', 'session_name']
        },
        {
          model: require("../models").SchoolTerm,
          as: "Term",
          attributes: ['id', 'term_name']
        },
      ],
      order: [['student_id', 'ASC']],
    });

    console.log(`Found ${assignments.length} student assignments`);

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No student subject assignments found for the specified parameters",
      });
    }

    // Format the response
    const studentAssignments = assignments.map(assignment => ({
      assignment_id: assignment.id,
      student: {
        id: assignment.Student.id,
        full_name: assignment.Student.full_name,
        admission_number: assignment.Student.admission_number,

      },
      class: {
        id: assignment.Class.id,
        name: assignment.Class.class_name,
      },
      subject: {
        id: assignment.Subject.id,
        name: assignment.Subject.subject_name,
      },
      session: {
        id: assignment.Session.id,
        name: assignment.Session.session_name,
      },
      term: {
        id: assignment.Term.id,
        name: assignment.Term.term_name,
      },
      marks: {
        ca_1_score: assignment.ca_1_score || null,
        exam_score: assignment.exam_score || null,
        total_score: this.calculateTotal(assignment.ca_1_score, assignment.exam_score),
      },
      timestamps: {
        created_at: assignment.createdAt,
        updated_at: assignment.updatedAt,
      }
    }));

    res.json({
      status: "success",
      message: "Student assigned subjects retrieved successfully",
      data: {
        class: {
          id: assignments[0]?.Class.id,
          name: assignments[0]?.Class.class_name,
        },
        subject: {
          id: assignments[0]?.Subject.id,
          name: assignments[0]?.Subject.subject_name,
        },
        session: {
          id: assignments[0]?.Session.id,
          name: assignments[0]?.Session.session_name,
        },
        term: {
          id: assignments[0]?.Term.id,
          name: assignments[0]?.Term.term_name,
        },
        assignments: studentAssignments,
        summary: {
          total_students: assignments.length,
          students_with_ca: assignments.filter(a => a.ca_1_score !== null).length,
          students_with_exam: assignments.filter(a => a.exam_score !== null).length,
          students_completed: assignments.filter(a => a.ca_1_score !== null && a.exam_score !== null).length,
          students_pending: assignments.filter(a => a.ca_1_score === null && a.exam_score === null).length,
        }
      },
    });
  });

  // Get all student assigned subjects with scores by session, term, and class
  getAllStudentSubjectsWithScores = asyncHandler(async (req, res) => {
    const {
      current_session_id,
      current_term_id,
      current_class_id,
    } = req.query;

    // Validate required fields
    if (
      !current_session_id ||
      !current_term_id ||
      !current_class_id
    ) {
      return res.status(400).json({
        status: "error",
        message: "All query parameters are required: current_session_id, current_term_id, current_class_id",
      });
    }

    console.log("Getting all student subjects with scores for:", {
      current_session_id,
      current_term_id,
      current_class_id,
    });

    try {
      // Find all student subject assignments for the specified parameters
      const assignments = await StudentSubjectAssign.findAll({
        where: {
          current_session_id,
          current_term_id,
          current_class_id,
        },
        attributes: [
          'id',
          'student_id',
          'current_class_id',
          'school_subject_id',
          'current_session_id',
          'current_term_id',
          'ca_1_score',
          'exam_score',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: require("../models").SchoolStudent,
            as: "Student",
            attributes: ['id', 'full_name', 'admission_number']
          },
          {
            model: require("../models").SchoolClass,
            as: "Class",
            attributes: ['id', 'class_name'],
            include: [
              {
                model: require("../models").GradeList,
                as: "GradeList",
                attributes: ['id', 'grade_name', 'grade_type'],
                include: [
                  {
                    model: require("../models").GradeSystem,
                    as: "gradeSystems",
                    attributes: ['id', 'from_mark', 'to_mark', 'grade', 'remark']
                  }
                ]
              }
            ]
          },
          {
            model: require("../models").SchoolSubject,
            as: "Subject",
            attributes: ['id', 'subject_name']
          },
          {
            model: require("../models").SchoolSession,
            as: "Session",
            attributes: ['id', 'session_name']
          },
          {
            model: require("../models").SchoolTerm,
            as: "Term",
            attributes: ['id', 'term_name']
          },
        ],
        order: [
          ['student_id', 'ASC'],
          ['school_subject_id', 'ASC']
        ],
      });

      console.log(`Found ${assignments.length} student subject assignments`);

      if (!assignments || assignments.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No student subject assignments found for the specified parameters",
        });
      }

      // Group assignments by student
      const studentsMap = new Map();

      assignments.forEach(assignment => {
        const studentId = assignment.student_id;

        if (!studentsMap.has(studentId)) {
          studentsMap.set(studentId, {
            student: {
              id: assignment.Student.id,
              full_name: assignment.Student.full_name,
              admission_number: assignment.Student.admission_number,

            },
            class: {
              id: assignment.Class.id,
              name: assignment.Class.class_name,
              gradeList: assignment.Class.GradeList ? {
                id: assignment.Class.GradeList.id,
                grade_name: assignment.Class.GradeList.grade_name,
                grade_type: assignment.Class.GradeList.grade_type,
                gradeSystems: assignment.Class.GradeList.gradeSystems ? assignment.Class.GradeList.gradeSystems.map(gradeSystem => ({
                  id: gradeSystem.id,
                  from_mark: gradeSystem.from_mark,
                  to_mark: gradeSystem.to_mark,
                  grade: gradeSystem.grade,
                  remark: gradeSystem.remark,
                })) : [],
              } : null,
            },
            session: {
              id: assignment.Session.id,
              name: assignment.Session.session_name,
            },
            term: {
              id: assignment.Term.id,
              name: assignment.Term.term_name,
            },
            subjects: []
          });
        }

        // Add subject with scores to student
        studentsMap.get(studentId).subjects.push({
          assignment_id: assignment.id,
          subject: {
            id: assignment.Subject.id,
            name: assignment.Subject.subject_name,
          },
          marks: {
            ca_1_score: assignment.ca_1_score || null,
            exam_score: assignment.exam_score || null,
            total_score: this.calculateTotal(assignment.ca_1_score, assignment.exam_score),
          },
          timestamps: {
            created_at: assignment.createdAt,
            updated_at: assignment.updatedAt,
          }
        });
      });

      // Convert map to array
      const studentsWithSubjects = Array.from(studentsMap.values());

      // Calculate summary statistics
      const totalAssignments = assignments.length;
      const assignmentsWithCA = assignments.filter(a => a.ca_1_score !== null).length;
      const assignmentsWithExam = assignments.filter(a => a.exam_score !== null).length;
      const assignmentsCompleted = assignments.filter(a => a.ca_1_score !== null && a.exam_score !== null).length;

      // Get unique subjects for summary
      const uniqueSubjects = [...new Set(assignments.map(a => a.school_subject_id))];
      const subjectsInfo = uniqueSubjects.map(subjectId => {
        const assignment = assignments.find(a => a.school_subject_id === subjectId);
        return {
          id: assignment.Subject.id,
          name: assignment.Subject.subject_name,
          code: assignment.Subject.subject_code,
        };
      });

      res.json({
        status: "success",
        message: "Student subjects with scores retrieved successfully",
        data: {
          class: {
            id: assignments[0]?.Class.id,
            name: assignments[0]?.Class.class_name,
            gradeList: assignments[0]?.Class.GradeList ? {
              id: assignments[0].Class.GradeList.id,
              grade_name: assignments[0].Class.GradeList.grade_name,
              grade_type: assignments[0].Class.GradeList.grade_type,
              gradeSystems: assignments[0].Class.GradeList.gradeSystems ? assignments[0].Class.GradeList.gradeSystems.map(gradeSystem => ({
                id: gradeSystem.id,
                from_mark: gradeSystem.from_mark,
                to_mark: gradeSystem.to_mark,
                grade: gradeSystem.grade,
                remark: gradeSystem.remark,
              })) : [],
            } : null,
          },
          session: {
            id: assignments[0]?.Session.id,
            name: assignments[0]?.Session.session_name,
          },
          term: {
            id: assignments[0]?.Term.id,
            name: assignments[0]?.Term.term_name,
          },
          subjects: subjectsInfo,
          students: studentsWithSubjects,
          summary: {
            total_students: studentsWithSubjects.length,
            total_subjects: uniqueSubjects.length,
            total_assignments: totalAssignments,
            assignments_with_ca: assignmentsWithCA,
            assignments_with_exam: assignmentsWithExam,
            assignments_completed: assignmentsCompleted,
            assignments_pending: totalAssignments - assignmentsCompleted,
            completion_percentage: totalAssignments > 0 ? Math.round((assignmentsCompleted / totalAssignments) * 100) : 0,
          }
        },
      });

    } catch (error) {
      console.error("Error fetching student subjects with scores:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while fetching student subjects with scores",
        error: error.message,
      });
    }
  });

  // Helper method to calculate total score
  calculateTotal(ca1Score, examScore) {
    const ca1 = parseFloat(ca1Score) || 0;
    const exam = parseFloat(examScore) || 0;

    // Only return total if both scores are available
    if (ca1Score && examScore) {
      return ca1 + exam;
    }

    return null;
  }
}

module.exports = new StudentSubjectAssignController();