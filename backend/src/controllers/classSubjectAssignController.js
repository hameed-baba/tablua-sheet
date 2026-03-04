const BaseController = require("./baseController");
const {
  ClassSubjectAssign,
  SchoolSubject,
  SchoolStaff,
  StudentSubjectAssign,
  SchoolSession,
  SchoolTerm,
  SchoolClass,
  SchoolStudent,
  sequelize,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op, Sequelize } = require("sequelize");
// const { Sequelize } = require("sequelize");

class ClassSubjectAssignController extends BaseController {
  constructor() {
    super(ClassSubjectAssign, "ClassSubjectAssign", [
      { model: require("../models").SchoolClass, as: "Class" },
      { model: require("../models").SchoolSubject, as: "Subject" },
      { model: require("../models").SchoolStaff, as: "Staff" },
    ]);
  }

  // Custom validation middleware for flexible assignment creation
  validateAssignmentRequest = (req, res, next) => {
    const { assignments } = req.body;

    // Determine if this is a bulk or single assignment request
    if (assignments && Array.isArray(assignments)) {
      // Validate bulk assignment
      const { validate, schemas } = require("../middleware/validation");
      return validate(schemas.classSubjectAssignBulkCreation)(req, res, next);
    } else {
      // Validate single assignment
      const { validate, schemas } = require("../middleware/validation");
      return validate(schemas.classSubjectAssignCreation)(req, res, next);
    }
  };

  createAssignment = asyncHandler(async (req, res) => {
    const { school_class_id, school_subject_id, school_staff_id, assignments } =
      req.body;

    // Check if this is a bulk assignment request
    if (assignments && Array.isArray(assignments)) {
      return this.handleBulkAssignment(req, res);
    }

    // Handle single assignment
    return this.handleSingleAssignment(req, res);
  });

  handleSingleAssignment = asyncHandler(async (req, res) => {
    const { school_class_id, school_subject_id, school_staff_id } = req.body;

    // Validate required fields
    if (!school_class_id || !school_subject_id || !school_staff_id) {
      return res.status(400).json({
        success: false,
        message:
          "school_class_id, school_subject_id, and school_staff_id are required",
      });
    }

    // 1. Check for duplicate subject assignment
    const existingAssignment = await ClassSubjectAssign.findOne({
      where: {
        school_class_id,
        school_subject_id,
      },
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: "This subject is already assigned to this class",
      });
    }

    // 2. Create new assignment
    const newAssignment = await ClassSubjectAssign.create({
      school_class_id,
      school_subject_id,
      school_staff_id,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: newAssignment,
    });
  });

  handleBulkAssignment = asyncHandler(async (req, res) => {
    const { assignments, school_class_id } = req.body;

    // Validate bulk assignment data
    if (
      !assignments ||
      !Array.isArray(assignments) ||
      assignments.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "assignments array is required and must not be empty",
      });
    }

    // Validate each assignment in the array
    const validationErrors = [];
    assignments.forEach((assignment, index) => {
      const {
        school_class_id: classId,
        school_subject_id,
        school_staff_id,
      } = assignment;

      if (!classId || !school_subject_id || !school_staff_id) {
        validationErrors.push(
          `Assignment ${index + 1}: school_class_id, school_subject_id, and school_staff_id are required`,
        );
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors in assignments",
        errors: validationErrors,
      });
    }

    try {
      // 1. Check for existing assignments to prevent duplicates
      const assignmentChecks = assignments.map((assignment) => ({
        school_class_id: assignment.school_class_id,
        school_subject_id: assignment.school_subject_id,
      }));

      const existingAssignments = await ClassSubjectAssign.findAll({
        where: {
          [Op.or]: assignmentChecks,
        },
        attributes: ["school_class_id", "school_subject_id"],
      });

      // Filter out assignments that already exist
      const existingKeys = existingAssignments.map(
        (existing) =>
          `${existing.school_class_id}-${existing.school_subject_id}`,
      );

      const newAssignments = assignments.filter((assignment) => {
        const key = `${assignment.school_class_id}-${assignment.school_subject_id}`;
        return !existingKeys.includes(key);
      });

      const duplicateAssignments = assignments.filter((assignment) => {
        const key = `${assignment.school_class_id}-${assignment.school_subject_id}`;
        return existingKeys.includes(key);
      });

      // 2. Create new assignments in bulk
      let createdAssignments = [];
      if (newAssignments.length > 0) {
        createdAssignments = await ClassSubjectAssign.bulkCreate(
          newAssignments,
          {
            validate: true,
            returning: true,
          },
        );
      }

      // 3. Prepare response
      const response = {
        success: true,
        message: `Bulk assignment completed`,
        data: {
          created: createdAssignments,
          createdCount: createdAssignments.length,
          duplicateCount: duplicateAssignments.length,
          totalRequested: assignments.length,
        },
      };

      // Add details about duplicates if any
      if (duplicateAssignments.length > 0) {
        response.message += `. ${duplicateAssignments.length} assignments were skipped (already exist)`;
        response.data.duplicates = duplicateAssignments.map((dup) => ({
          school_class_id: dup.school_class_id,
          school_subject_id: dup.school_subject_id,
          school_staff_id: dup.school_staff_id,
        }));
      }

      return res.status(201).json(response);
    } catch (error) {
      console.error("Bulk assignment error:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating bulk assignments",
        error: error.message,
      });
    }
  });

  updateAssignment = asyncHandler(async (req, res) => {
    const id = Number(req.params.id); // ensure numeric ID
    const { school_class_id, school_subject_id, school_staff_id } = req.body;

    // 1. Find assignment
    const assignment = await ClassSubjectAssign.findByPk(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // 2. Duplicate check (EXCLUDE CURRENT RECORD)
    const duplicate = await ClassSubjectAssign.findOne({
      where: {
        school_class_id,
        school_subject_id,
        [Op.and]: [
          { id: { [Op.ne]: id } }, // ensure this works
        ],
      },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This subject is already assigned to this class",
      });
    }

    // 3. Update
    await assignment.update({
      school_class_id,
      school_subject_id,
      school_staff_id,
    });

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  });

  assignSubjectToClassStudents = asyncHandler(async (req, res) => {
    const { subject_id, current_class_id, current_session_id } = req.body;

    // Validate required fields
    if (!subject_id) {
      return res.status(400).json({
        status: "error",
        message: "Please provide subject_id",
      });
    }

    if (!current_class_id) {
      return res.status(400).json({
        status: "error",
        message: "Please provide current_class_id",
      });
    }

    if (!current_session_id) {
      return res.status(400).json({
        status: "error",
        message: "Please provide current_session_id",
      });
    }

    // Use transaction to ensure atomicity
    const transaction = await sequelize.transaction();

    try {
      // 1. Verify the class exists
      const schoolClass = await SchoolClass.findByPk(current_class_id, {
        transaction,
      });

      if (!schoolClass) {
        await transaction.rollback();
        return res.status(404).json({
          status: "error",
          message: "Class not found",
        });
      }

      // 2. Verify the session exists
      const schoolSession = await SchoolSession.findByPk(current_session_id, {
        transaction,
      });

      if (!schoolSession) {
        await transaction.rollback();
        return res.status(404).json({
          status: "error",
          message: "Session not found",
        });
      }

      // 3. Verify the subject exists
      const subject = await SchoolSubject.findByPk(subject_id, {
        attributes: ["id", "subject_name"],
        transaction,
      });

      if (!subject) {
        await transaction.rollback();
        return res.status(404).json({
          status: "error",
          message: "Subject not found",
        });
      }

      // 4. Get all students in this class and session
      const allStudents = await SchoolStudent.findAll({
        where: {
          current_class_id: current_class_id,
          current_session_id: current_session_id,
        },
        attributes: ["id", "admission_number", "full_name"],
        transaction,
      });

      if (allStudents.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          status: "error",
          message: "No students found in this class for the given session",
        });
      }

      const allStudentIds = allStudents.map((student) => student.id);

      // 5. Find students who already have this subject assigned (for any of the 3 terms)
      const existingAssignments = await StudentSubjectAssign.findAll({
        where: {
          student_id: allStudentIds,
          school_subject_id: subject_id,
          current_session_id: current_session_id,
          current_class_id: current_class_id,
          current_term_id: [1, 2, 3],
        },
        attributes: ["student_id"],
        group: ["student_id"], // Group by student to get unique students
        transaction,
      });

      // const existingAssignments = await StudentSubjectAssign.findAll({
      //   where: {
      //     student_id: {
      //       [Op.in]: allStudentIds,
      //     },
      //     school_subject_id: subject_id,
      //     current_session_id: current_session_id,
      //     current_class_id: current_class_id,
      //     current_term_id: {
      //       [Op.in]: [1, 2, 3],
      //     },
      //   },
      //   attributes: ["student_id"],
      //   group: ["student_id"],
      //   transaction,
      // });

      const alreadyAssignedStudentIds = existingAssignments.map(
        (assignment) => assignment.student_id,
      );

      // 6. Filter students to only those who don't have the subject assigned
      const studentsToAssign = allStudents.filter(
        (student) => !alreadyAssignedStudentIds.includes(student.id),
      );

      if (studentsToAssign.length === 0) {
        await transaction.commit();
        return res.status(500).json({
          status: "info",
          message: `Subject ${subject.subject_name} is already assigned to all ${allStudents.length} students in this class`,
          data: {
            totalStudents: allStudents.length,
            alreadyAssignedStudents: alreadyAssignedStudentIds.length,
            newAssignmentsCreated: 0,
            subject: {
              id: subject.id,
              name: subject.subject_name,
            },
          },
        });
      }

      const studentIdsToAssign = studentsToAssign.map((student) => student.id);

      // 7. Prepare subject assignments for students who don't have it yet (all 3 terms)
      const subjectAssignments = [];

      for (const student of studentsToAssign) {
        for (let termId = 1; termId <= 3; termId++) {
          subjectAssignments.push({
            student_id: student.id,
            school_subject_id: subject_id,
            current_class_id: current_class_id,
            current_session_id: current_session_id,
            current_term_id: termId,
            ca_1_score: null,
            ca_2_score: null,
            exam_score: null,
            created_at: new Date(),
            updated_at: new Date(),
            // Include any additional fields from request body
            ...(req.body.teacher_id && { teacher_id: req.body.teacher_id }),
            ...(req.body.elective !== undefined && {
              elective: req.body.elective,
            }),
            ...(req.body.section_id && { section_id: req.body.section_id }),
          });
        }
      }

      // 8. Bulk create all subject assignments
      await StudentSubjectAssign.bulkCreate(subjectAssignments, {
        transaction,
        validate: true,
      });

      // 9. Commit transaction
      await transaction.commit();

      // 10. Prepare response
      res.status(200).json({
        status: "success",
        message: `Subject ${subject.subject_name} assigned successfully to ${studentsToAssign.length} student(s) in class ${schoolClass.class_name} for 3 terms`,
        data: {
          class: {
            id: schoolClass.id,
            name: schoolClass.class_name,
            code: schoolClass.class_code,
          },
          session: {
            id: schoolSession.id,
            name: schoolSession.session_name,
          },
          subject: {
            id: subject.id,
            name: subject.subject_name,
          },
          summary: {
            totalStudentsInClass: allStudents.length,
            alreadyAssignedStudents: alreadyAssignedStudentIds.length,
            newlyAssignedStudents: studentsToAssign.length,
            assignmentsCreated: subjectAssignments.length,
            assignmentsPerStudent: 3,
            breakdownByTerm: {
              term1: studentsToAssign.length,
              term2: studentsToAssign.length,
              term3: studentsToAssign.length,
            },
          },
          newlyAssignedStudents: studentsToAssign.map((s) => ({
            id: s.id,
            admission_number: s.admission_number,
            name: s.full_name,
          })),
          alreadyAssignedStudents: allStudents
            .filter((s) => alreadyAssignedStudentIds.includes(s.id))
            .map((s) => ({
              id: s.id,
              admission_number: s.admission_number,
              name: `${s.full_name} `,
            })),
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();

      // Handle specific errors
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          status: "error",
          message: "Validation error",
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        });
      }

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "error",
          message:
            "Foreign key constraint failed. Please check if referenced IDs exist.",
          details: error.message,
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          status: "error",
          message:
            "Duplicate assignment detected. Some students may already have this subject assigned.",
          details: error.errors,
        });
      }

      // Handle other errors
      console.error("Error in assignSubjectToClassStudents:", error);
      throw error;
    }
  });

  removeSubjectFromClassStudents = asyncHandler(async (req, res) => {
    const {
      subject_id,
      current_class_id,
      current_session_id,
      class_subject_assign_id,
    } = req.body;

    const TERMS = [1, 2, 3];

    /* -------------------- Validation -------------------- */
    if (
      !subject_id ||
      !current_class_id ||
      !current_session_id ||
      !class_subject_assign_id
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "subject_id, current_class_id, current_session_id and class_subject_assign_id are required",
      });
    }

    const transaction = await sequelize.transaction();

    try {
      /* -------------------- Verify Subject -------------------- */
      const subject = await SchoolSubject.findByPk(subject_id, {
        attributes: ["id", "subject_name"],
        transaction,
      });

      if (!subject) {
        await transaction.rollback();
        return res.status(404).json({
          status: "error",
          message: "Subject not found",
        });
      }

      /* -------------------- Remove student assignments (optional) -------------------- */
      const removedStudentAssignments = await StudentSubjectAssign.destroy({
        where: {
          school_subject_id: subject_id,
          current_class_id,
          current_session_id,
          current_term_id: {
            [Op.in]: TERMS,
          },
        },
        transaction,
      });
      // 👉 If no students exist, this will simply be 0

      /* -------------------- Remove class-subject assignment -------------------- */
      const removedClassSubject = await ClassSubjectAssign.destroy({
        where: {
          id: class_subject_assign_id,
          school_subject_id: subject_id,
          school_class_id: current_class_id,
        },
        transaction,
      });

      await transaction.commit();

      return res.status(200).json({
        status: "success",
        message: `Subject ${subject.subject_name} removed from class`,
        data: {
          subject: {
            id: subject.id,
            name: subject.subject_name,
          },
          class_id: current_class_id,
          session_id: current_session_id,
          terms_checked: TERMS,
          summary: {
            students_found: removedStudentAssignments > 0,
            removed_student_assignments: removedStudentAssignments,
            removed_class_subject_assignment: removedClassSubject === 1,
          },
        },
      });
    } catch (error) {
      await transaction.rollback();

      console.error("Error removing subject completely:", error);

      return res.status(500).json({
        status: "error",
        message: "Failed to fully remove subject from class",
      });
    }
  });

  getClassAssignedSubject = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    // 1️⃣ Active session
    const activeSession = await SchoolSession.findOne({
      where: { status: "active" },
      attributes: ["id"],
    });

    if (!activeSession) {
      return res.status(404).json({
        success: false,
        message: "No active session found",
      });
    }

    // 2️⃣ Active term
    const activeTerm = await SchoolTerm.findOne({
      where: { status: "active" },
      attributes: ["id"],
    });

    if (!activeTerm) {
      return res.status(404).json({
        success: false,
        message: "No active term found",
      });
    }

    // 3️⃣ Query
    const assignments = await ClassSubjectAssign.findAll({
      where: {
        school_class_id: classId,
      },
      attributes: [
        "id",
        "school_subject_id",
        "school_staff_id",
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn(
              "DISTINCT",
              Sequelize.col("StudentAssignments.student_id"),
            ),
          ),
          "total_students",
        ],
      ],
      include: [
        {
          model: SchoolSubject,
          as: "Subject",
          attributes: ["id", "subject_name"],
        },
        {
          model: SchoolStaff,
          as: "Staff",
          attributes: ["id", "full_name"],
        },
        {
          model: StudentSubjectAssign,
          as: "StudentAssignments",
          attributes: [],
          required: false,
          where: {
            current_class_id: classId,
            current_session_id: activeSession.id,
            current_term_id: activeTerm.id, // 🔥 TERM FILTER
            school_subject_id: Sequelize.col(
              "ClassSubjectAssign.school_subject_id",
            ),
          },
        },
      ],
      group: ["ClassSubjectAssign.id", "Subject.id", "Staff.id"],
    });

    res.status(200).json({
      success: true,
      activeSessionId: activeSession.id,
      activeTermId: activeTerm.id,
      data: assignments,
    });
  });
}

module.exports = new ClassSubjectAssignController();
