const BaseController = require("./baseController");
const { SchoolSubject, SchoolSection,SchoolClass } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op,Sequelize } = require("sequelize");
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
  getSubjectsByClassId = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        status: "error",
        message: "Class ID is required",
      });
    }

    // Find the class to get its section_id
    // const { SchoolClass } = require("../models");
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
    // Using Sequelize's literal to implement FIND_IN_SET functionality
    const subjects = await SchoolSubject.findAll({
      where: Sequelize.where(
        Sequelize.literal(`FIND_IN_SET(${sectionId}, section_ids)`),
        {
          [Op.gt]: 0,
        }
      ),
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
}

module.exports = new SchoolTermController();
