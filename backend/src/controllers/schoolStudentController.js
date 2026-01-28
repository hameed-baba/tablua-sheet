const { Op, Sequelize } = require("sequelize");
const {
  SchoolStudent,
  SchoolClass,
  SchoolSession,
  Parent,
  SchoolSection,
  GradeList,
  StudentSubjectAssign,
  sequelize,
  SchoolSubject,
  SchoolTerm,
  ClassSubjectAssign,
  SchoolStaff,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc Register new student with optional subject assignments
 * @route POST /api/students
 * @body {
 *   student: { full_name, dob, gender, ... },
 *   subjects: [{ school_subject_id, current_class_id, current_session_id }]
 * }
 */
const register = asyncHandler(async (req, res) => {
  const { student: studentData, subjects = [] } = req.body;

  // Use transaction to ensure atomicity
  const transaction = await sequelize.transaction();

  try {
    // 1. Create student record
    const student = await SchoolStudent.create(studentData, { transaction });

    // 2. Create subject assignments for all three terms if subjects provided
    if (subjects && subjects.length > 0) {
      const subjectAssignments = [];

      // For each subject, create 3 records (one for each term)
      for (const subject of subjects) {
        for (let termId = 1; termId <= 3; termId++) {
          subjectAssignments.push({
            student_id: student.id,
            school_subject_id: subject.school_subject_id,
            current_class_id: subject.current_class_id,
            current_session_id: subject.current_session_id,
            current_term_id: termId,
            ca_1_score: null,
            ca_2_score: null,
            exam_score: null,
          });
        }
      }

      // Bulk create all subject assignments
      await StudentSubjectAssign.bulkCreate(subjectAssignments, {
        transaction,
      });
    }

    // Commit transaction
    await transaction.commit();

    // 3. Fetch complete student data with includes
    const newStudent = await SchoolStudent.findByPk(student.id, {
      include: [
        {
          model: SchoolClass,
          as: "Class",
          include: [
            { model: SchoolSection, as: "Section" },
            { model: GradeList, as: "GradeList" },
          ],
        },
        {
          model: SchoolSession,
          as: "Session",
        },
        {
          model: Parent,
          as: "Parent",
        },
      ],
    });

    res.status(201).json({
      status: "success",
      message:
        subjects.length > 0
          ? "Student registered successfully with subject assignments"
          : "Student registered successfully",
      data: newStudent,
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw error;
  }
});

/**
 * @desc Get all students
 * @route GET /api/students
 */

const getAll = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    classId,
    sessionId,
    parentId,
    status,
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = req.query;

  const offset = (page - 1) * limit;

  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { admission_number: { [Op.like]: `%${search}%` } },
    ];
  }

  if (classId) whereClause.schoolClassId = classId;
  if (sessionId) whereClause.sessionId = sessionId;
  if (parentId) whereClause.parentId = parentId;
  if (status) whereClause.status = status;

  const { count, rows } = await SchoolStudent.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [
          { model: SchoolSection, as: "Section" },
          // { model: GradeList, as: 'GradeList' }
        ],
      },
      {
        model: SchoolSession,
        as: "Session",
      },
      {
        model: Parent,
        as: "Parent",
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, sortOrder]],
  });

  res.json({
    status: "success",
    data: {
      students: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    },
  });
});

const getAllStudentByActiveSession = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 25,
    search = "",
    current_class_id,
    gender,
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 25;
  const offset = (pageNumber - 1) * limitNumber;

  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { admission_number: { [Op.like]: `%${search}%` } },
    ];
  }

  // Add class filter
  if (current_class_id) {
    whereClause.current_class_id = parseInt(current_class_id);
  }

  // Add gender filter
  if (gender) {
    whereClause.gender = gender;
  }

  const activeSession = await SchoolSession.findOne({
    where: { status: "active" },
  });

  if (!activeSession) {
    return res.status(404).json({
      status: "error",
      message: "No active session found",
    });
  }

  whereClause.current_session_id = activeSession.id;

  const { count, rows } = await SchoolStudent.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [{ model: SchoolSection, as: "Section" }],
      },
      { model: SchoolSession, as: "Session" },
      { model: Parent, as: "Parent" },
    ],
    limit: limitNumber,
    offset: offset,
    order: [[sortBy, sortOrder]],
  });

  const totalPages = Math.ceil(count / limitNumber);

  res.json({
    status: "success",
    data: {
      students: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalCount: count,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
  });
});

/**
 * @desc Get student by ID
 * @route GET /api/students/:id
 */
const getById = asyncHandler(async (req, res) => {
  const student = await SchoolStudent.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [
          { model: SchoolSection, as: "Section" },
          { model: GradeList, as: "GradeList" },
        ],
      },
      {
        model: SchoolSession,
        as: "Session",
      },
      {
        model: Parent,
        as: "Parent",
      },
    ],
  });

  if (!student) {
    return res.status(404).json({
      status: "error",
      message: "Student not found",
    });
  }

  res.json({
    status: "success",
    data: student,
  });
});

/**
 * @desc Update student with optional subject assignments
 * @route PUT /api/students/:id
 * @body {
 *   student: { full_name, dob, gender, ... },
 *   subjects: [{ school_subject_id, current_class_id, current_session_id }] (optional)
 * }
 */

const updateStudent = asyncHandler(async (req, res) => {
  const { student: studentData, subjects = [] } = req.body;

  const student = await SchoolStudent.findByPk(req.params.id);
  if (!student) {
    return res.status(404).json({
      status: "error",
      message: "Student not found",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Update student info
    await student.update(studentData, { transaction });

    // Get unique subject IDs from existing assignments
    const existing = await StudentSubjectAssign.findAll({
      where: { student_id: student.id },
      attributes: ["school_subject_id"],
      group: ["school_subject_id"],
      transaction,
    });

    const existingSubjectIds = existing.map((s) => s.school_subject_id);
    const newSubjectIds = subjects.map((s) => s.school_subject_id);

    // Subjects to remove (all 3 terms for each subject)
    const subjectsToRemove = existingSubjectIds.filter(
      (id) => !newSubjectIds.includes(id),
    );

    // Subjects to add (all 3 terms for each subject)
    const subjectsToAdd = subjects.filter(
      (s) => !existingSubjectIds.includes(s.school_subject_id),
    );

    // REMOVE entire subjects (all 3 terms)
    if (subjectsToRemove.length > 0) {
      await StudentSubjectAssign.destroy({
        where: {
          student_id: student.id,
          school_subject_id: subjectsToRemove,
        },
        transaction,
      });
    }

    // ADD new subjects (all 3 terms)
    if (subjectsToAdd.length > 0) {
      const assignments = [];

      for (const subject of subjectsToAdd) {
        for (let termId = 1; termId <= 3; termId++) {
          assignments.push({
            student_id: student.id,
            school_subject_id: subject.school_subject_id,
            current_class_id: subject.current_class_id,
            current_session_id: subject.current_session_id,
            current_term_id: termId,
            ca_1_score: null,
            ca_2_score: null,
            exam_score: null,
          });
        }
      }

      await StudentSubjectAssign.bulkCreate(assignments, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Fetch updated student
    const updatedStudent = await SchoolStudent.findByPk(student.id, {
      include: [
        {
          model: SchoolClass,
          as: "Class",
          include: [
            { model: SchoolSection, as: "Section" },
            { model: GradeList, as: "GradeList" },
          ],
        },
        { model: SchoolSession, as: "Session" },
        { model: Parent, as: "Parent" },
      ],
    });

    res.json({
      status: "success",
      message: "Student and subject assignments updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/**
 * @desc Delete student
 * @route DELETE /api/students/:id
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await SchoolStudent.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!student) {
    return res.status(404).json({
      status: "error",
      message: "Student not found",
    });
  }

  await student.destroy();

  res.json({
    status: "success",
    message: "Student deleted successfully",
  });
});

/**
 * @desc Search students by multiple criteria
 * @route GET /api/students/search
 * @query admission_number, current_class_id, current_session_id, student_status, gender, page, limit
 */
const getStudents = asyncHandler(async (req, res) => {
  const {
    admission_number,
    current_class_id,
    current_session_id,
    student_status,
    gender,
    page = 1,
    limit = 25,
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 25;
  const offset = (pageNumber - 1) * limitNumber;

  // Build dynamic where clause based on provided parameters
  const whereClause = {};

  if (admission_number) {
    whereClause.admission_number = { [Op.like]: `%${admission_number}%` };
  }

  if (current_class_id) {
    whereClause.current_class_id = parseInt(current_class_id);
  }

  if (current_session_id) {
    whereClause.current_session_id = parseInt(current_session_id);
  }

  if (student_status) {
    whereClause.student_status = student_status;
  }

  if (gender) {
    whereClause.gender = gender;
  }

  // If no search parameters provided, return all students
  // whereClause will be empty object, which returns all records

  const { count, rows } = await SchoolStudent.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [{ model: SchoolSection, as: "Section" }],
      },
      { model: SchoolSession, as: "Session" },
      { model: Parent, as: "Parent" },
    ],
    limit: limitNumber,
    offset: offset,
    order: [[sortBy, sortOrder]],
  });

  const totalPages = Math.ceil(count / limitNumber);

  res.json({
    status: "success",
    data: {
      students: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalCount: count,
        limitNumber,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      searchCriteria: whereClause,
    },
  });
});

/**
 * @desc Get all students by class ID
 * @route GET /api/students/class/:classId
 */
// const getStudentsByClassId = asyncHandler(async (req, res) => {
//   const { classId } = req.params;
//   const {
//     page = 1,
//     limit = 25,
//     search = "",
//     sortBy = "full_name",
//     sortOrder = "ASC",
//   } = req.query;

//   if (!classId) {
//     return res.status(400).json({
//       status: "error",
//       message: "Class ID is required",
//     });
//   }

//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);
//   const offset = (pageNumber - 1) * limitNumber;

//   const whereClause = {
//     current_class_id: classId,
//   };

//   // Add search filter if provided
//   if (search) {
//     whereClause[Op.or] = [
//       { full_name: { [Op.like]: `%${search}%` } },
//       { admission_number: { [Op.like]: `%${search}%` } },
//     ];
//   }

//   const { count, rows } = await SchoolStudent.findAndCountAll({
//     where: whereClause,
//     include: [
//       {
//         model: SchoolClass,
//         as: "Class",
//         include: [{ model: SchoolSection, as: "Section" }],
//       },
//       { model: SchoolSession, as: "Session" },
//       { model: Parent, as: "Parent" },
//     ],
//     limit: limitNumber,
//     offset: offset,
//     order: [[sortBy, sortOrder]],
//   });

//   const totalPages = Math.ceil(count / limitNumber);

//   res.json({
//     status: "success",
//     data: {
//       students: rows,
//       pagination: {
//         currentPage: pageNumber,
//         totalPages,
//         totalCount: count,
//         limit: limitNumber,
//         hasNextPage: pageNumber < totalPages,
//         hasPrevPage: pageNumber > 1,
//       },
//     },
//   });
// });

const getStudentsByClassId = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const {
    page = 1,
    limit = 25,
    search = "",
    sortBy = "full_name",
    sortOrder = "ASC",
  } = req.query;

  if (!classId) {
    return res.status(400).json({
      status: "error",
      message: "Class ID is required",
    });
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const whereClause = {
    current_class_id: classId,
  };

  // Search filter
  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { admission_number: { [Op.like]: `%${search}%` } },
    ];
  }

  /**
   * =========================
   * COUNTS (TOTAL / MALE / FEMALE)
   * =========================
   */
  const [totalStudents, totalMale, totalFemale] = await Promise.all([
    SchoolStudent.count({
      where: { current_class_id: classId },
    }),
    SchoolStudent.count({
      where: {
        current_class_id: classId,
        gender: "male", // adjust if your DB uses "M"
      },
    }),
    SchoolStudent.count({
      where: {
        current_class_id: classId,
        gender: "female", // adjust if your DB uses "F"
      },
    }),
  ]);

  /**
   * =========================
   * PAGINATED STUDENTS
   * =========================
   */
  const { count, rows } = await SchoolStudent.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [
          { model: SchoolSection, as: "Section" },
          { model: SchoolStaff, as: "SchoolStaff" },
          { model: GradeList, as: "GradeList" },
        ],
      },
      { model: SchoolSession, as: "Session" },
      { model: Parent, as: "Parent" },
      
    ],
    limit: limitNumber,
    offset,
    order: [[sortBy, sortOrder]],
  });

  const totalPages = Math.ceil(count / limitNumber);

  res.json({
    status: "success",
    data: {
      summary: {
        totalStudents,
        totalMale,
        totalFemale,
      },
      students: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalCount: count,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
  });
});

/**
 * @desc Get student assigned subjects
 * @route GET /api/students/:id/subjects
 * @query sessionId, termId, classId (optional filters)
 */

const getStudentSubjects = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { sessionId, termId, classId } = req.query;

  // Check if student exists
  const student = await SchoolStudent.findByPk(id);
  if (!student) {
    return res.status(404).json({
      status: "error",
      message: "Student not found",
    });
  }

  // If termId is not provided, get the active term
  if (!termId) {
    const activeTerm = await SchoolTerm.findOne({
      where: { status: "active" },
    });

    if (activeTerm) {
      termId = activeTerm.id;
    }
  }

  // Build where clause for filtering
  const whereClause = {
    student_id: id,
  };

  if (sessionId) {
    whereClause.current_session_id = parseInt(sessionId);
  }

  if (termId) {
    whereClause.current_term_id = parseInt(termId);
  }

  if (classId) {
    whereClause.current_class_id = parseInt(classId);
  }

  console.log(
    `DEBUG getStudentSubjects: Fetching subjects for student ${id} with filters:`,
    whereClause,
  );

  // Fetch subject assignments with related data
  const subjectAssignments = await StudentSubjectAssign.findAll({
    where: whereClause,
    include: [
      {
        model: SchoolSubject,
        as: "Subject",
        attributes: ["id", "subject_name"],
      },
      {
        model: SchoolClass,
        as: "Class",
        attributes: ["id", "class_name"],
      },
      {
        model: SchoolSession,
        as: "Session",
        attributes: ["id", "session_name"],
      },
      {
        model: SchoolTerm,
        as: "Term",
        attributes: ["id", "term_name", "status"],
      },
    ],
    order: [
      ["current_term_id", "ASC"],
      [{ model: SchoolSubject, as: "Subject" }, "subject_name", "ASC"],
    ],
  });

  console.log(
    `DEBUG getStudentSubjects: Found ${subjectAssignments.length} subject assignments for student ${id}`,
  );

  // Get class and session info (they should be the same for all records)
  let classInfo = null;
  let sessionInfo = null;

  if (subjectAssignments.length > 0) {
    classInfo = {
      id: subjectAssignments[0].Class?.id,
      class_name: subjectAssignments[0].Class?.class_name,
    };
    sessionInfo = {
      id: subjectAssignments[0].Session?.id,
      session_name: subjectAssignments[0].Session?.session_name,
    };
  }

  // Group subjects by term
  const termGroups = {
    first_term: [],
    second_term: [],
    third_term: [],
  };

  subjectAssignments.forEach((assignment) => {
    const subjectData = {
      id: assignment.id,
      school_subject_id: assignment.school_subject_id,
      subject_name: assignment.Subject?.subject_name,
      subject_code: assignment.Subject?.subject_code,
      ca_1_score: assignment.ca_1_score,
      ca_2_score: assignment.ca_2_score,
      exam_score: assignment.exam_score,
      term_id: assignment.current_term_id,
      term_name: assignment.Term?.term_name,
      term_status: assignment.Term?.status,
    };

    // Add to appropriate term group
    if (assignment.current_term_id === 1) {
      termGroups.first_term.push(subjectData);
    } else if (assignment.current_term_id === 2) {
      termGroups.second_term.push(subjectData);
    } else if (assignment.current_term_id === 3) {
      termGroups.third_term.push(subjectData);
    }
  });

  res.json({
    status: "success",
    data: {
      student: {
        id: student.id,
        full_name: student.full_name,
        admission_number: student.admission_number,
        termId: termId ? parseInt(termId) : null,
      },
      class: classInfo,
      session: sessionInfo,
      terms: {
        first_term: {
          term_id: 1,
          term_name: "First Term",
          subjects: termGroups.first_term,
          total_subjects: termGroups.first_term.length,
        },
        second_term: {
          term_id: 2,
          term_name: "Second Term",
          subjects: termGroups.second_term,
          total_subjects: termGroups.second_term.length,
        },
        third_term: {
          term_id: 3,
          term_name: "Third Term",
          subjects: termGroups.third_term,
          total_subjects: termGroups.third_term.length,
        },
      },
      totalSubjects: subjectAssignments.length,
      uniqueSubjects:
        termGroups.first_term.length ||
        termGroups.second_term.length ||
        termGroups.third_term.length,
      filters: {
        termId: termId ? parseInt(termId) : null,
        sessionId: sessionId ? parseInt(sessionId) : null,
        classId: classId ? parseInt(classId) : null,
        usedActiveTerm: !req.query.termId && termId ? true : false,
      },
    },
  });
});

/**
 * @desc Update student status
 * @route PUT /api/students/:id/status
 * @body { student_status: "active" | "graduated" | "transfer" | "expell" | "leave" }
 */
const updateStudentStatus = asyncHandler(async (req, res) => {
  const { student_status } = req.body;
  const { id } = req.params;

  // Validate status
  const validStatuses = ["active", "graduated", "transfer", "expell", "leave"];
  if (!validStatuses.includes(student_status)) {
    return res.status(400).json({
      status: "error",
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  const student = await SchoolStudent.findByPk(id);
  if (!student) {
    return res.status(404).json({
      status: "error",
      message: "Student not found",
    });
  }

  // Update student status
  await student.update({ student_status });

  // Fetch updated student with includes
  const updatedStudent = await SchoolStudent.findByPk(id, {
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [{ model: SchoolSection, as: "Section" }],
      },
      { model: SchoolSession, as: "Session" },
      { model: Parent, as: "Parent" },
    ],
  });

  res.json({
    status: "success",
    message: `Student status updated to ${student_status}`,
    data: updatedStudent,
  });
});

/**
 * @desc Promote student to new class
 * @route PUT /api/students/:id/promote
 * @body {
 *   new_class_id: number,
 *   new_session_id?: number
 * }
 */
const promoteStudent = asyncHandler(async (req, res) => {
  const { new_class_id, new_session_id } = req.body;
  const { id } = req.params;

  if (!new_class_id) {
    return res.status(400).json({
      status: "error",
      message: "New class ID is required",
    });
  }

  const student = await SchoolStudent.findByPk(id);
  if (!student) {
    return res.status(404).json({
      status: "error",
      message: "Student not found",
    });
  }

  console.log(
    `DEBUG promoteStudent: Student ${student.full_name} is currently in class ${student.current_class_id}, promoting to class ${new_class_id}`,
  );

  // Check if student is being promoted to the same class
  if (student.current_class_id == new_class_id) {
    console.log(
      `DEBUG promoteStudent: WARNING - Student is already in class ${new_class_id}!`,
    );
  }

  // Verify new class exists
  const newClass = await SchoolClass.findByPk(new_class_id);
  if (!newClass) {
    return res.status(404).json({
      status: "error",
      message: "New class not found",
    });
  }

  // If new_session_id provided, verify it exists
  let newSession = null;
  const sessionId = new_session_id || student.current_session_id;
  if (new_session_id) {
    newSession = await SchoolSession.findByPk(new_session_id);
    if (!newSession) {
      return res.status(404).json({
        status: "error",
        message: "New session not found",
      });
    }
  }

  const transaction = await sequelize.transaction();

  try {
    const updateData = {
      current_class_id: new_class_id,
    };

    if (new_session_id) {
      updateData.current_session_id = new_session_id;
    }

    // Update student class and session
    await student.update(updateData, { transaction });

    // Get all subjects assigned to the new class
    const classSubjects = await ClassSubjectAssign.findAll({
      where: { school_class_id: new_class_id },
      include: [
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
      ],
      transaction,
    });

    console.log(
      `DEBUG promoteStudent: Found ${classSubjects.length} subjects for class ${new_class_id}:`,
      classSubjects.map((cs) => ({
        id: cs.id,
        subject_id: cs.school_subject_id,
        subject_name: cs.Subject?.subject_name,
      })),
    );

    // Get existing subject assignments for this student for the NEW class only
    // We only want to avoid duplicates for the same subject in the same class and term
    const existingAssignments = await StudentSubjectAssign.findAll({
      where: {
        student_id: id,
        current_class_id: new_class_id, // Only check for existing assignments in the NEW class
      },
      attributes: ["school_subject_id", "current_term_id"],
      transaction,
    });

    console.log(
      `DEBUG promoteStudent: Student has ${existingAssignments.length} existing assignments for class ${new_class_id}:`,
      existingAssignments.map((ea) => ({
        subject_id: ea.school_subject_id,
        term_id: ea.current_term_id,
      })),
    );

    // Create a Set of existing subject-term combinations for the NEW class only
    const existingCombinations = new Set(
      existingAssignments.map(
        (assignment) =>
          `${assignment.school_subject_id}-${assignment.current_term_id}`,
      ),
    );

    console.log(
      `DEBUG promoteStudent: Existing combinations for new class:`,
      Array.from(existingCombinations),
    );

    // Create new subject assignments for all 3 terms (only if they don't already exist)
    let newAssignmentsCount = 0;
    if (classSubjects.length > 0) {
      const subjectAssignments = [];

      for (const classSubject of classSubjects) {
        for (let termId = 1; termId <= 3; termId++) {
          const combinationKey = `${classSubject.school_subject_id}-${termId}`;

          // Only add if this subject-term combination doesn't already exist for the NEW class
          if (!existingCombinations.has(combinationKey)) {
            console.log(
              `DEBUG promoteStudent: Adding new assignment - Subject: ${classSubject.Subject?.subject_name} (${classSubject.school_subject_id}), Term: ${termId}, Class: ${new_class_id}`,
            );
            subjectAssignments.push({
              student_id: id,
              school_subject_id: classSubject.school_subject_id,
              current_class_id: new_class_id,
              current_session_id: sessionId,
              current_term_id: termId,
              ca_1_score: null,
              ca_2_score: null,
              exam_score: null,
            });
          } else {
            console.log(
              `DEBUG promoteStudent: Skipping existing assignment - Subject: ${classSubject.Subject?.subject_name} (${classSubject.school_subject_id}), Term: ${termId} (already exists for class ${new_class_id})`,
            );
          }
        }
      }

      // Bulk create only new subject assignments
      if (subjectAssignments.length > 0) {
        console.log(
          `DEBUG promoteStudent: Creating ${subjectAssignments.length} new assignments:`,
          subjectAssignments.map((sa) => ({
            student_id: sa.student_id,
            subject_id: sa.school_subject_id,
            class_id: sa.current_class_id,
            term_id: sa.current_term_id,
          })),
        );
        await StudentSubjectAssign.bulkCreate(subjectAssignments, {
          transaction,
        });
        newAssignmentsCount = subjectAssignments.length;
        console.log(
          `DEBUG promoteStudent: Successfully created ${newAssignmentsCount} assignments`,
        );
      } else {
        console.log(
          `DEBUG promoteStudent: No new assignments to create (all subjects already exist)`,
        );
      }
    }

    await transaction.commit();

    // Fetch updated student with includes
    const updatedStudent = await SchoolStudent.findByPk(id, {
      include: [
        {
          model: SchoolClass,
          as: "Class",
          include: [{ model: SchoolSection, as: "Section" }],
        },
        { model: SchoolSession, as: "Session" },
        { model: Parent, as: "Parent" },
      ],
    });

    res.json({
      status: "success",
      message: `Student promoted to ${newClass.class_name}${
        newSession ? ` for ${newSession.session_name}` : ""
      }`,
      data: {
        student: updatedStudent,
        promotion_details: {
          old_class_id: student.current_class_id,
          new_class_id: new_class_id,
          old_session_id: student.current_session_id,
          new_session_id: sessionId,
          subjects_assigned: classSubjects.length,
          total_new_assignments_created: newAssignmentsCount,
        },
      },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/**
 * @desc Bulk promote students to new class
 * @route PUT /api/students/bulk-promote
 * @body {
 *   student_ids: number[],
 *   new_class_id: number,
 *   new_session_id?: number
 * }
 */
const bulkPromoteStudents = asyncHandler(async (req, res) => {
  const { student_ids, new_class_id, new_session_id } = req.body;

  if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Student IDs array is required",
    });
  }

  if (!new_class_id) {
    return res.status(400).json({
      status: "error",
      message: "New class ID is required",
    });
  }

  // Verify new class exists
  const newClass = await SchoolClass.findByPk(new_class_id);
  if (!newClass) {
    return res.status(404).json({
      status: "error",
      message: "New class not found",
    });
  }

  // If new_session_id provided, verify it exists
  let newSession = null;
  if (new_session_id) {
    newSession = await SchoolSession.findByPk(new_session_id);
    if (!newSession) {
      return res.status(404).json({
        status: "error",
        message: "New session not found",
      });
    }
  }

  // Verify all students exist and get their current session if new_session_id not provided
  const students = await SchoolStudent.findAll({
    where: { id: student_ids },
  });

  if (students.length !== student_ids.length) {
    return res.status(404).json({
      status: "error",
      message: "One or more students not found",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Get all subjects assigned to the new class
    const classSubjects = await ClassSubjectAssign.findAll({
      where: { school_class_id: new_class_id },
      include: [
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
      ],
      transaction,
    });

    console.log(
      `DEBUG bulkPromoteStudents: Found ${classSubjects.length} subjects for class ${new_class_id}:`,
      classSubjects.map((cs) => ({
        id: cs.id,
        subject_id: cs.school_subject_id,
        subject_name: cs.Subject?.subject_name,
      })),
    );

    // Get existing subject assignments for all students for the NEW class only
    const existingAssignments = await StudentSubjectAssign.findAll({
      where: {
        student_id: student_ids,
        current_class_id: new_class_id, // Only check for existing assignments in the NEW class
      },
      attributes: ["student_id", "school_subject_id", "current_term_id"],
      transaction,
    });

    // Create a Map of existing subject-term combinations for each student
    const existingCombinationsMap = new Map();
    existingAssignments.forEach((assignment) => {
      const studentId = assignment.student_id;
      const combinationKey = `${assignment.school_subject_id}-${assignment.current_term_id}`;

      if (!existingCombinationsMap.has(studentId)) {
        existingCombinationsMap.set(studentId, new Set());
      }
      existingCombinationsMap.get(studentId).add(combinationKey);
    });

    let totalNewAssignments = 0;

    // Update all students
    for (const student of students) {
      const sessionId = new_session_id || student.current_session_id;

      const updateData = {
        current_class_id: new_class_id,
      };

      if (new_session_id) {
        updateData.current_session_id = new_session_id;
      }

      // Update student class and session
      await student.update(updateData, { transaction });

      // Get existing combinations for this student
      const existingCombinations =
        existingCombinationsMap.get(student.id) || new Set();

      // Create new subject assignments for all 3 terms (only if they don't already exist)
      if (classSubjects.length > 0) {
        const subjectAssignments = [];

        for (const classSubject of classSubjects) {
          for (let termId = 1; termId <= 3; termId++) {
            const combinationKey = `${classSubject.school_subject_id}-${termId}`;

            // Only add if this subject-term combination doesn't already exist for this student
            if (!existingCombinations.has(combinationKey)) {
              subjectAssignments.push({
                student_id: student.id,
                school_subject_id: classSubject.school_subject_id,
                current_class_id: new_class_id,
                current_session_id: sessionId,
                current_term_id: termId,
                ca_1_score: null,
                ca_2_score: null,
                exam_score: null,
              });
            }
          }
        }

        // Bulk create only new subject assignments for this student
        if (subjectAssignments.length > 0) {
          await StudentSubjectAssign.bulkCreate(subjectAssignments, {
            transaction,
          });
          totalNewAssignments += subjectAssignments.length;
        }
      }
    }

    await transaction.commit();

    res.json({
      status: "success",
      message: `${students.length} students promoted to ${newClass.class_name}${
        newSession ? ` for ${newSession.session_name}` : ""
      }`,
      data: {
        promoted_count: students.length,
        new_class: newClass.class_name,
        new_session: newSession?.session_name || null,
        subjects_assigned: classSubjects.length,
        total_new_assignments_created: totalNewAssignments,
      },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/**
 * @desc Debug endpoint to check class subjects
 * @route GET /api/students/debug/class-subjects/:classId
 */
const debugClassSubjects = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  try {
    const classSubjects = await ClassSubjectAssign.findAll({
      where: { school_class_id: classId },
      include: [
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
        {
          model: SchoolClass,
          as: "Class",
          attributes: ["id", "class_name"],
        },
      ],
    });

    res.json({
      status: "success",
      data: {
        class_id: classId,
        subjects_count: classSubjects.length,
        subjects: classSubjects.map((cs) => ({
          id: cs.id,
          subject_id: cs.school_subject_id,
          subject_name: cs.Subject?.subject_name,
          class_name: cs.Class?.class_name,
        })),
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/**
 * @desc Create test class subject assignments
 * @route POST /api/students/debug/create-class-subjects
 */
const createTestClassSubjects = asyncHandler(async (req, res) => {
  try {
    // Get all classes and subjects
    const classes = await SchoolClass.findAll({
      attributes: ["id", "class_name"],
    });
    const subjects = await SchoolSubject.findAll({
      attributes: ["id", "subject_name"],
    });
    const staff = await SchoolStaff.findOne({ attributes: ["id"] });

    console.log("DEBUG: Found classes:", classes.length);
    console.log("DEBUG: Found subjects:", subjects.length);
    console.log("DEBUG: Found staff:", staff ? "Yes" : "No");

    if (classes.length === 0 || subjects.length === 0 || !staff) {
      return res.status(400).json({
        status: "error",
        message: "Missing required data: classes, subjects, or staff",
        debug: {
          classes_count: classes.length,
          subjects_count: subjects.length,
          staff_found: !!staff,
        },
      });
    }

    const classSubjectAssigns = [];

    // Assign first 3 subjects to each class (or all subjects if less than 3)
    for (const classItem of classes) {
      const subjectsToAssign = subjects.slice(0, Math.min(3, subjects.length));
      for (const subject of subjectsToAssign) {
        classSubjectAssigns.push({
          school_class_id: classItem.id,
          school_subject_id: subject.id,
          school_staff_id: staff.id,
        });
      }
    }

    if (classSubjectAssigns.length > 0) {
      await ClassSubjectAssign.bulkCreate(classSubjectAssigns);
      console.log(
        `DEBUG: Successfully created ${classSubjectAssigns.length} assignments`,
      );
    }

    res.json({
      status: "success",
      message: `Created ${classSubjectAssigns.length} class subject assignments`,
      data: {
        classes_count: classes.length,
        subjects_per_class: Math.min(3, subjects.length),
        total_assignments: classSubjectAssigns.length,
        classes: classes.map((c) => ({ id: c.id, name: c.class_name })),
        subjects: subjects.map((s) => ({ id: s.id, name: s.subject_name })),
      },
    });
  } catch (error) {
    console.error("Create test data error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

/**
 * @desc Debug all data needed for promotion
 * @route GET /api/students/debug/promotion-data
 */
const debugPromotionData = asyncHandler(async (req, res) => {
  try {
    const classes = await SchoolClass.findAll({
      attributes: ["id", "class_name"],
      limit: 10,
    });

    const subjects = await SchoolSubject.findAll({
      attributes: ["id", "subject_name"],
      limit: 10,
    });

    const staff = await SchoolStaff.findAll({
      attributes: ["id", "full_name"],
      limit: 5,
    });

    const classSubjectAssigns = await ClassSubjectAssign.findAll({
      include: [
        {
          model: SchoolClass,
          as: "Class",
          attributes: ["id", "class_name"],
        },
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
      ],
      limit: 20,
    });

    const students = await SchoolStudent.findAll({
      attributes: ["id", "full_name", "current_class_id"],
      limit: 5,
    });

    res.json({
      status: "success",
      data: {
        classes: {
          count: classes.length,
          data: classes,
        },
        subjects: {
          count: subjects.length,
          data: subjects,
        },
        staff: {
          count: staff.length,
          data: staff,
        },
        class_subject_assigns: {
          count: classSubjectAssigns.length,
          data: classSubjectAssigns.map((csa) => ({
            id: csa.id,
            class_id: csa.school_class_id,
            class_name: csa.Class?.class_name,
            subject_id: csa.school_subject_id,
            subject_name: csa.Subject?.subject_name,
            staff_id: csa.school_staff_id,
          })),
        },
        students: {
          count: students.length,
          data: students,
        },
      },
    });
  } catch (error) {
    console.error("Debug promotion data error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

/**
 * @desc Debug student assignments
 * @route GET /api/students/debug/assignments/:studentId
 */
const debugStudentAssignments = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await SchoolStudent.findByPk(studentId, {
      attributes: ["id", "full_name", "current_class_id", "current_session_id"],
    });

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Get ALL assignments for this student (no filters)
    const allAssignments = await StudentSubjectAssign.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
        {
          model: SchoolClass,
          as: "Class",
          attributes: ["id", "class_name"],
        },
        {
          model: SchoolSession,
          as: "Session",
          attributes: ["id", "session_name"],
        },
        {
          model: SchoolTerm,
          as: "Term",
          attributes: ["id", "term_name"],
        },
      ],
      order: [
        ["current_class_id", "ASC"],
        ["current_term_id", "ASC"],
        [{ model: SchoolSubject, as: "Subject" }, "subject_name", "ASC"],
      ],
    });

    // Group by class
    const assignmentsByClass = {};
    allAssignments.forEach((assignment) => {
      const classId = assignment.current_class_id;
      if (!assignmentsByClass[classId]) {
        assignmentsByClass[classId] = {
          class_id: classId,
          class_name: assignment.Class?.class_name || "Unknown",
          assignments: [],
        };
      }
      assignmentsByClass[classId].assignments.push({
        id: assignment.id,
        subject_id: assignment.school_subject_id,
        subject_name: assignment.Subject?.subject_name,
        term_id: assignment.current_term_id,
        term_name: assignment.Term?.term_name,
        session_id: assignment.current_session_id,
        session_name: assignment.Session?.session_name,
        ca_1_score: assignment.ca_1_score,
        ca_2_score: assignment.ca_2_score,
        exam_score: assignment.exam_score,
      });
    });

    res.json({
      status: "success",
      data: {
        student: {
          id: student.id,
          name: student.full_name,
          current_class_id: student.current_class_id,
          current_session_id: student.current_session_id,
        },
        total_assignments: allAssignments.length,
        assignments_by_class: assignmentsByClass,
      },
    });
  } catch (error) {
    console.error("Debug student assignments error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

/**
 * @desc Test promotion without auth (for debugging)
 * @route POST /api/students/debug/test-promote
 */
const testPromote = asyncHandler(async (req, res) => {
  const { student_id, new_class_id } = req.body;

  if (!student_id || !new_class_id) {
    return res.status(400).json({
      status: "error",
      message: "student_id and new_class_id are required",
    });
  }

  try {
    console.log(
      `DEBUG testPromote: Starting promotion for student ${student_id} to class ${new_class_id}`,
    );

    const student = await SchoolStudent.findByPk(student_id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    const newClass = await SchoolClass.findByPk(new_class_id);
    if (!newClass) {
      return res.status(404).json({
        status: "error",
        message: "New class not found",
      });
    }

    console.log(
      `DEBUG testPromote: Student found: ${student.full_name}, Class found: ${newClass.class_name}`,
    );

    // Get all subjects assigned to the new class
    const classSubjects = await ClassSubjectAssign.findAll({
      where: { school_class_id: new_class_id },
      include: [
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
      ],
    });

    console.log(
      `DEBUG testPromote: Found ${classSubjects.length} subjects for class ${new_class_id}:`,
      classSubjects.map((cs) => ({
        id: cs.id,
        subject_id: cs.school_subject_id,
        subject_name: cs.Subject?.subject_name,
      })),
    );

    if (classSubjects.length === 0) {
      return res.json({
        status: "warning",
        message:
          "No subjects found for this class. You need to assign subjects to the class first.",
        data: {
          student: { id: student.id, name: student.full_name },
          class: { id: newClass.id, name: newClass.class_name },
          subjects_found: 0,
        },
      });
    }

    // For testing, just return the data without actually promoting
    res.json({
      status: "success",
      message: "Test promotion data retrieved successfully",
      data: {
        student: {
          id: student.id,
          name: student.full_name,
          current_class: student.current_class_id,
        },
        new_class: { id: newClass.id, name: newClass.class_name },
        subjects_to_assign: classSubjects.map((cs) => ({
          id: cs.id,
          subject_id: cs.school_subject_id,
          subject_name: cs.Subject?.subject_name,
        })),
        would_create_assignments: classSubjects.length * 3, // 3 terms
      },
    });
  } catch (error) {
    console.error("Test promote error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

/**
 * @desc Get students by status
 * @route GET /api/students/status/:status
 */
const getStudentsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const {
    page = 1,
    limit = 25,
    search = "",
    sortBy = "full_name",
    sortOrder = "ASC",
  } = req.query;

  const validStatuses = ["active", "graduated", "transfer", "expell", "leave"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: "error",
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const whereClause = {
    student_status: status,
  };

  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { admission_number: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await SchoolStudent.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: SchoolClass,
        as: "Class",
        include: [{ model: SchoolSection, as: "Section" }],
      },
      { model: SchoolSession, as: "Session" },
      { model: Parent, as: "Parent" },
    ],
    limit: limitNumber,
    offset: offset,
    order: [[sortBy, sortOrder]],
  });

  const totalPages = Math.ceil(count / limitNumber);

  res.json({
    status: "success",
    data: {
      students: rows,
      status_filter: status,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalCount: count,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
  });
});

module.exports = {
  register,
  getAll,
  getById,
  updateStudent,
  delete: deleteStudent,
  getAllStudentByActiveSession,
  getStudents,
  getStudentsByClassId,
  getStudentSubjects,
  updateStudentStatus,
  promoteStudent,
  bulkPromoteStudents,
  getStudentsByStatus,
  debugClassSubjects,
  createTestClassSubjects,
  debugPromotionData,
  debugStudentAssignments,
  testPromote,
};
