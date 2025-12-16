const BaseController = require("./baseController");
const {
  SchoolSubject,
  SchoolSection,
  SchoolClass,
  SchoolStaff,
  ClassSubjectAssign,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op, Sequelize } = require("sequelize");
// const { Sequelize } = require("sequelize");

class SchoolTermController extends BaseController {
  constructor() {
    super(SchoolSubject, "SchoolSubject", []);
  }

  getAllSubjects = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 25;
    const search = req.query.search?.trim() || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = (req.query.sortOrder || "DESC").toUpperCase();

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [{ subject_name: { [Op.like]: `%${search}%` } }];
    }

    const { count, rows: subjects } = await SchoolSubject.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    // ✅ Loop through subjects to get related sections
    const subjectsWithSections = await Promise.all(
      subjects.map(async (subject) => {
        let sectionIds = [];

        if (subject.section_ids) {
          sectionIds = subject.section_ids
            .split(",")
            .map((id) => parseInt(id.trim()))
            .filter(Boolean);
        }

        // Fetch all matching sections
        const sections = await SchoolSection.findAll({
          where: { id: { [Op.in]: sectionIds } },
          attributes: ["id", "section_name"],
        });

        return {
          ...subject.toJSON(),
          sections, // Attach the full section data
        };
      })
    );

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: "success",
      data: {
        schoolsubjects: subjectsWithSections,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  });

  /**
   * @desc Get subjects by class ID
   * @route GET /api/subjects/class/:classId
   */
  //   getClassAssignedSubjects = asyncHandler(async (req, res) => {
  //     const { classId } = req.params;

  //     if (!classId) {
  //       return res.status(400).json({
  //         status: "error",
  //         message: "Class ID is required",
  //       });
  //     }

  //     // Find the class to get its section_id
  //     // const { SchoolClass } = require("../models");
  //     const schoolClass = await SchoolClass.findByPk(classId, {
  //       attributes: ["id", "class_name", "section_id"],
  //     });

  //     if (!schoolClass) {
  //       return res.status(404).json({
  //         status: "error",
  //         message: "Class not found",
  //       });
  //     }

  //     const sectionId = schoolClass.section_id;

  //     // Find all subjects where section_ids contains the class's section_id
  //     // Using Sequelize's literal to implement FIND_IN_SET functionality
  //     const subjects = await SchoolSubject.findAll({
  //       where: Sequelize.where(
  //         Sequelize.literal(`FIND_IN_SET(${sectionId}, section_ids)`),
  //         {
  //           [Op.gt]: 0,

  //         }
  //       ),
  //       order: [["subject_name", "ASC"]],
  //     });

  //     res.json({
  //       status: "success",
  //       data: {
  //         subjects,
  //         class: {
  //           id: schoolClass.id,
  //           class_name: schoolClass.class_name,
  //           section_id: schoolClass.section_id,
  //         },
  //       },
  //     });
  //   });
  getClassAssignedSubjects2 = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        status: "error",
        message: "Class ID is required",
      });
    }

    // Find the class to get its section_id
    const schoolClass = await SchoolClass.findByPk(classId, {
      attributes: ["id", "class_name", "section_id"],
    });

    if (!schoolClass) {
      return res.status(404).json({
        status: "error",
        message: "Class not found",
      });
    }

    const sectionId = schoolClass.section_id;

    // Find all subjects where section_ids contains the class's section_id
    const subjects = await SchoolSubject.findAll({
      where: {
        [Op.or]: [
          // Exact match for single section
          { section_ids: sectionId.toString() },
          // Section at the beginning of the list
          { section_ids: { [Op.like]: `${sectionId},%` } },
          // Section in the middle of the list
          { section_ids: { [Op.like]: `%,${sectionId},%` } },
          // Section at the end of the list
          { section_ids: { [Op.like]: `%,${sectionId}` } },
        ],
      },
      order: [["subject_name", "ASC"]],
    });

    res.json({
      status: "success",
      data: {
        subjects,
        class: {
          id: schoolClass.id,
          class_name: schoolClass.class_name,
          section_id: schoolClass.section_id,
        },
      },
    });
  });
  getStaffWithSubjectsByClassId = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        status: "error",
        message: "Class ID is required",
      });
    }

    // Find the class to get its section_id
    const schoolClass = await SchoolClass.findByPk(classId, {
      attributes: ["id", "class_name", "section_id"],
    });

    if (!schoolClass) {
      return res.status(404).json({
        status: "error",
        message: "Class not found",
      });
    }

    const sectionId = schoolClass.section_id;

    // Execute both queries in parallel using FIND_IN_SET
    const [subjects, staff] = await Promise.all([
      // Get all subjects for this section using FIND_IN_SET
      SchoolSubject.findAll({
        where: Sequelize.where(
          Sequelize.literal(`FIND_IN_SET('${sectionId}', section_ids)`),
          { [Op.gt]: 0 }
        ),
        attributes: ["id", "subject_name"],
        order: [["subject_name", "ASC"]],
      }),

      // Get all staff assigned to this section using FIND_IN_SET
      // FIX: Use status = 1 instead of 'active'
      SchoolStaff.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.literal(`FIND_IN_SET('${sectionId}', section_ids)`),
              { [Op.gt]: 0 }
            ),
            { status: 1 }, // FIXED: Use number 1 instead of string 'active'
          ],
        },
        attributes: [
          "id",
          "full_name",
          "email",
          "phone_number",
          "role_id",
          "gender",
        ],
        order: [["full_name", "ASC"]],
      }),
    ]);

    res.json({
      status: "success",
      data: {
        subjects,
        staff,
        class: {
          id: schoolClass.id,
          class_name: schoolClass.class_name,
          section_id: schoolClass.section_id,
        },
        summary: {
          total_subjects: subjects.length,
          total_staff: staff.length,
        },
      },
    });
  });

  getClassAssignedSubjects = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        status: "error",
        message: "Class ID is required",
      });
    }

    // Validate classId is a number
    const parsedClassId = parseInt(classId);
    if (isNaN(parsedClassId)) {
      return res.status(400).json({
        status: "error",
        message: "Class ID must be a valid number",
      });
    }

    // Option 1: Using ClassAssignSubject model directly
    const assignedSubjects = await ClassSubjectAssign.findAll({
      where: {
        school_class_id: parsedClassId,
      },
      include: [
        {
          model: SchoolSubject,
          as: "Subject", // or whatever alias you have
          attributes: [
            "id",
            "subject_name",
            "section_ids",
          ],
        },
      ],
      order: [
        // You can order by subject name through the include
        [{ model: SchoolSubject, as: "Subject" }, "subject_name", "ASC"],
      ],
    });

    // If no subjects are found
    if (!assignedSubjects || assignedSubjects.length === 0) {
      return res.status(404).json({
        status: "success", // or "failed" depending on your preference
        message: "No subjects assigned to this class",
        data: [],
      });
    }

    // Extract just the subjects from the result
    const subjects = assignedSubjects.map((assignment) => assignment.Subject);

    // Optionally, also get the class details
    const schoolClass = await SchoolClass.findByPk(parsedClassId, {
      attributes: ["id", "class_name", "section_id"],
      include: [
        {
          model: SchoolSection,
          as: "Section",
          attributes: ["id", "section_name"],
        },
      ],
    });

    res.json({
      status: "success",
      data: {
        subjects,
        class: schoolClass,
        totalSubjects: subjects.length,
      },
    });
  });
}

module.exports = new SchoolTermController();
