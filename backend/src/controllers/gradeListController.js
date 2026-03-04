const { Op } = require("sequelize");
const { asyncHandler } = require("../middleware/errorHandler");
const { GradeList, GradeSystem } = require("../models");

const createGradeList = asyncHandler(async (req, res) => {
  const {
    grade_name,
    grade_type,
    allow_grade,
    allow_remark,
    principal_remark,
    class_teacher_remark,
    gradeSystems,
  } = req.body;

  const existing = await GradeList.findOne({ where: { grade_name } });
  if (existing) {
    return res.status(400).json({
      status: "error",
      message: "Grade list with this name already exists",
    });
  }

  // Create the grade list with nested grade systems
  const gradeList = await GradeList.create(
    {
      grade_name,
      grade_type,
      allow_grade,
      allow_remark,
      principal_remark,
      class_teacher_remark,
      gradeSystems: gradeSystems || [], // Include grade systems from payload
    },
    {
      include: [{ model: GradeSystem, as: "gradeSystems" }],
    },
  );

  // Fetch the created grade list with all associations
  const createdGradeList = await GradeList.findByPk(gradeList.id, {
    include: [{ model: GradeSystem, as: "gradeSystems" }],
  });

  res.status(201).json({
    status: "success",
    message: "Grade list created with grade systems successfully",
    data: createdGradeList,
  });
});

const getAllGradeLists = asyncHandler(async (req, res) => {
  // Fetch all grade lists with their associated grade systems
  const gradeLists = await GradeList.findAll({
    include: [
      {
        model: GradeSystem,
        as: "gradeSystems", // make sure your association uses this alias
        attributes: [
          "id",
          "from_mark",
          "to_mark",
          "grade",
          "remark",
          "principal_remark",
          "class_teacher_remark",
        ],
      },
    ],
    order: [["id", "ASC"]],
  });

  res.json({
    status: "success",
    data: gradeLists,
  });
});
/**
 * @desc Get grade list by ID
 * @route GET /api/grade-lists/:id
 */
const getGradeListById = asyncHandler(async (req, res) => {
  const gradeList = await GradeList.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: GradeSystem,
        as: "gradeSystems",
      },
    ],
  });

  if (!gradeList) {
    return res.status(404).json({
      status: "error",
      message: "Grade list not found",
    });
  }

  res.json({
    status: "success",
    data: gradeList,
  });
});

const updateGradeList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { grade_name, grade_type, allow_grade, allow_remark, gradeSystems } =
    req.body;

  // Find existing grade list
  const gradeList = await GradeList.findByPk(id, {
    include: [{ model: GradeSystem, as: "gradeSystems" }],
  });
  if (!gradeList) {
    return res
      .status(404)
      .json({ status: "error", message: "Grade list not found" });
  }

  // Update main grade list fields
  await gradeList.update({ grade_name, grade_type, allow_grade, allow_remark });

  // Handle grade systems if provided
  if (gradeSystems && Array.isArray(gradeSystems)) {
    // Get existing grade system IDs
    const existingIds = gradeList.gradeSystems.map((gs) => gs.id);
    const incomingIds = gradeSystems.filter((gs) => gs.id).map((gs) => gs.id);

    // Delete grade systems that are not in the incoming payload
    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
      await GradeSystem.destroy({
        where: { id: idsToDelete, grade_list_id: id },
      });
    }

    // Update or create grade systems
    for (const gs of gradeSystems) {
      if (gs.id) {
        // Existing grade system → update
        await GradeSystem.update(
          {
            from_mark: gs.from_mark,
            to_mark: gs.to_mark,
            grade: gs.grade,
            remark: gs.remark,
            principal_remark:gs.principal_remark,
            class_teacher_remark:gs.class_teacher_remark
          },
          { where: { id: gs.id, grade_list_id: id } },
        );
      } else {
        // New grade system → create
        await GradeSystem.create({ ...gs, grade_list_id: id });
      }
    }
  }

  // Fetch updated grade list with grade systems
  const updatedGradeList = await GradeList.findByPk(id, {
    include: [{ model: GradeSystem, as: "gradeSystems" }],
  });

  res.json({
    status: "success",
    message: "Grade list updated successfully",
    data: updatedGradeList,
  });
});

/**
 * @desc Delete grade list
 * @route DELETE /api/grade-lists/:id
 */
const deleteGradeList = asyncHandler(async (req, res) => {
  const gradeList = await GradeList.findByPk(req.params.id);

  if (!gradeList) {
    return res.status(404).json({
      status: "error",
      message: "Grade list not found",
    });
  }

  await gradeList.destroy();

  res.json({
    status: "success",
    message: "Grade list deleted successfully",
  });
});

module.exports = {
  createGradeList,
  getAllGradeLists,
  getGradeListById,
  updateGradeList,
  deleteGradeList,
};
