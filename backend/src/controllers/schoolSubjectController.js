const BaseController = require("./baseController");
const { SchoolSubject, SchoolSection } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

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
}

module.exports = new SchoolTermController();
