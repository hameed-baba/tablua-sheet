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
    const classes = await SchoolClass.findAll();

    if (!classes) {
      res.json({
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
