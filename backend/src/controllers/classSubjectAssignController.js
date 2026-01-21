const BaseController = require("./baseController");
const {
  ClassSubjectAssign,
  SchoolSubject,
  SchoolStaff,
  StudentSubjectAssign,
  SchoolSession,
  SchoolTerm
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

  /**
   * Flexible assignment creation endpoint that handles both single and bulk assignments
   *
   * Single Assignment Request Body:
   * {
   *   "school_class_id": 1,
   *   "school_subject_id": 2,
   *   "school_staff_id": 3
   * }
   *
   * Bulk Assignment Request Body:
   * {
   *   "assignments": [
   *     {
   *       "school_class_id": 1,
   *       "school_subject_id": 2,
   *       "school_staff_id": 3
   *     },
   *     {
   *       "school_class_id": 1,
   *       "school_subject_id": 4,
   *       "school_staff_id": 5
   *     }
   *   ],
   *   "school_class_id": 1  // Optional: for reference
   * }
   */

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

  // getClassAssignedSubject = asyncHandler(async (req, res) => {
  //   const { classId } = req.params;

  //   const assignments = await ClassSubjectAssign.findAll({
  //     where: { school_class_id: classId },
  //     include: [
  //       {
  //         model: SchoolSubject,
  //         as: "Subject",
  //         attributes: ["id", "subject_name"],
  //       },
  //       {
  //         model: SchoolStaff,
  //         as: "Staff",
  //         attributes: ["id", "full_name"],
  //       },
  //     ],
  //   });

  //   res.status(200).json({
  //     success: true,
  //     data: assignments,
  //   });
  // });



  // getClassAssignedSubject = asyncHandler(async (req, res) => {
  //   const { classId } = req.params;

  //   // 1️⃣ Get active session
  //   const activeSession = await SchoolSession.findOne({
  //     where: { status: "active" }, // OR { status: "active" }
  //     attributes: ["id"],
  //   });

  //   if (!activeSession) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "No active session found",
  //     });
  //   }

  //   // 2️⃣ Get subjects + student count for active session
  //   const assignments = await ClassSubjectAssign.findAll({
  //     where: { school_class_id: classId },
  //     attributes: [
  //       "id",
  //       "school_subject_id",
  //       "school_staff_id",
  //       [
  //         Sequelize.fn("COUNT", Sequelize.col("StudentAssignments.id")),
  //         "total_students",
  //       ],
  //     ],
  //     include: [
  //       {
  //         model: SchoolSubject,
  //         as: "Subject",
  //         attributes: ["id", "subject_name"],
  //       },
  //       {
  //         model: SchoolStaff,
  //         as: "Staff",
  //         attributes: ["id", "full_name"],
  //       },
  //       {
  //         model: StudentSubjectAssign,
  //         as: "StudentAssignments",
  //         attributes: [],
  //         where: {
  //           current_class_id: classId,
  //           current_session_id: activeSession.id, // 🔥 ACTIVE SESSION FILTER
  //         },
  //         required: false,
  //       },
  //     ],
  //     group: ["ClassSubjectAssign.id", "Subject.id", "Staff.id"],
  //   });

  //   res.status(200).json({
  //     success: true,
  //     data: assignments,
  //     activeSessionId: activeSession.id,
  //   });
  // });

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
            Sequelize.col("StudentAssignments.student_id")
          )
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
            "ClassSubjectAssign.school_subject_id"
          ),
        },
      },
    ],
    group: [
      "ClassSubjectAssign.id",
      "Subject.id",
      "Staff.id",
    ],
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
