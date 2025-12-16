const BaseController = require("./baseController");
const {
  SchoolClass,
  SchoolSection,
  SchoolStaff,
  GradeList,
} = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

class SchoolTermController extends BaseController {
  constructor() {
    super(SchoolClass, "SchoolClass", [
      { model: GradeList, as: "GradeList" },
      { model: SchoolSection, as: "Section" },
      { model: SchoolStaff, as: "SchoolStaff" },
    ]);
  }

  getAllRowClases = asyncHandler(async (req, res) => {
    const classes = await SchoolClass.findAll({
      order: [['class_name', 'ASC']]
    });

    if (!classes || classes.length === 0) {
      return res.status(404).json({  // Use return to prevent double response
        status: "failed",
        message: "No class found",
      });
    }

    res.json({
      status: "success",
      data: classes,
    });
  });
}

module.exports = new SchoolTermController();


