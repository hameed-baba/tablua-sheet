const BaseController = require("./baseController");
const {
  SchoolClass,
  SchoolSection,
  SchoolStaff,
  GradeList,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

class SchoolClassController extends BaseController {
  constructor() {
    super(SchoolClass, "SchoolClass", [
      { model: GradeList, as: "GradeList" },
      { model: SchoolSection, as: "Section" },
      { model: SchoolStaff, as: "SchoolStaff" },
    ]);
  }

  // Override the base getAll method to sort classes alphabetically A-Z
  getAll = asyncHandler(async (req, res) => {
    // Parse page and limit, with defaults
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
      req.query.limit && parseInt(req.query.limit) > 0
        ? parseInt(req.query.limit)
        : 25;

    const search = req.query.search?.trim() || "";
    const offset = (page - 1) * limit;

    const whereClause = this.buildWhereClause(req, req.query, search);

    // Get all records first for proper sorting
    const allRecords = await this.model.findAll({
      where: whereClause,
      include: this.includes,
      distinct: true,
    });

    // Sort classes using natural alphabetical order (handles numbers properly)
    const sortedRecords = allRecords.sort((a, b) => {
      return a.class_name.localeCompare(b.class_name, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

    // Apply pagination to sorted results
    const count = sortedRecords.length;
    const rows = sortedRecords.slice(offset, offset + limit);

    if (count === 0) {
      return res.status(404).json({
        status: "not found",
        message: "No classes found",
      });
    }

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: "success",
      data: {
        schoolclasses: rows,
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

  // Custom method for getting all classes without pagination (sorted A-Z)
  getAllRowClases = asyncHandler(async (req, res) => {
    const classes = await SchoolClass.findAll({
      include: this.includes,
    });

    if (!classes || classes.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No class found",
      });
    }

    // Sort classes using natural alphabetical order (handles numbers properly)
    const sortedClasses = classes.sort((a, b) => {
      return a.class_name.localeCompare(b.class_name, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

    res.json({
      status: "success",
      data: sortedClasses,
    });
  });

  // Override searchable fields for class-specific search
  getSearchableFields() {
    return ['class_name'];
  }
}

module.exports = new SchoolClassController();


