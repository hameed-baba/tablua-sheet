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
            ca_3_score: null,
            ca_4_score: null,
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
      message: subjects.length > 0 
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

  res.json({
    status: "success",
    data: {
      students: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
        itemsPerPage: limitNumber,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
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
 * @desc Update student
 * @route PUT /api/students/:id
 */
const update = asyncHandler(async (req, res) => {
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

  await student.update(req.body);

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

  res.json({
    status: "success",
    message: "Student updated successfully",
    data: updatedStudent,
  });
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

  // Add search filter if provided
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
  update,
  delete: deleteStudent,
  getAllStudentByActiveSession,
  getStudents,
  getStudentsByClassId,
};
