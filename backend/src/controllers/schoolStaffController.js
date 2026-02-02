const { Op } = require("sequelize");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  SchoolStaff,
  Role,
  SchoolSection,
  ClassSubjectAssign,
  SchoolSubject,
  SchoolClass,
} = require("../models");

/**
 * @desc Register new staff
 * @route POST /api/staff
 */
const register = asyncHandler(async (req, res) => {
  const existingEmail = await SchoolStaff.findOne({
    where: { email: req.body.email },
  });

  if (existingEmail) {
    return res.status(400).json({
      status: "error",
      message: "Staff with this email already exists",
    });
  }

  const existingPhone = await SchoolStaff.findOne({
    where: { phone_number: req.body.phone_number },
  });

  if (existingPhone) {
    return res.status(400).json({
      status: "error",
      message: "Staff with this phone number already exists",
    });
  }

  const staff = await SchoolStaff.create(req.body);

  const newStaff = await SchoolStaff.findByPk(staff.id, {
    include: [
      {
        model: Role,
        as: "Role",
      },
    ],
    attributes: { exclude: ["password"] },
  });

  res.status(201).json({
    status: "success",
    message: "Staff registered successfully",
    data: newStaff,
  });
});

/**
 * @desc Get all staff
 * @route GET /api/staff
 */
const getAll = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 25; // <-- hard-coded default, cannot be overridden
  const search = req.query.search?.trim() || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = (req.query.sortOrder || "DESC").toUpperCase();

  const offset = (page - 1) * limit;

  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone_number: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await SchoolStaff.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Role,
        as: "Role",
        attributes: ["id", "role_name"],
      },
    ],
    attributes: { exclude: ["password"] },
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  res.json({
    status: "success",
    data: {
      staff: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        limit, // always 25
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
});

/**
 * @desc Get staff by ID
 * @route GET /api/staff/:id
 */
const getById = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Role,
        as: "Role",
      },
    ],
    attributes: { exclude: ["password"] },
  });

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  res.json({
    status: "success",
    data: staff,
  });
});

const getStaffProfile = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Role,
        as: "Role",
      },
    ],
    attributes: { exclude: ["password"] },
  });

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  // Get section IDs as array
  let sectionIds = [];
  if (staff.section_ids) {
    sectionIds = staff.section_ids
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
  }

  // Fetch sections using those IDs
  let sections = [];
  if (sectionIds.length > 0) {
    sections = await SchoolSection.findAll({
      where: { id: sectionIds },
    });
  }

  res.json({
    status: "success",
    data: {
      ...staff.toJSON(),
      sections, // attach the fetched section details
    },
  });
});

/**
 * @desc Update staff
 * @route PUT /api/staff/:id
 */
const update = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findOne({
    where: { id: req.params.id },
  });

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  // Remove password from update if not provided
  const updateData = { ...req.body };
  if (!updateData.password) {
    delete updateData.password;
  }

  await staff.update(updateData);

  const updatedStaff = await SchoolStaff.findByPk(staff.id, {
    include: [
      {
        model: Role,
        as: "Role",
      },
    ],
    attributes: { exclude: ["password"] },
  });

  res.json({
    status: "success",
    message: "Staff updated successfully",
    data: updatedStaff,
  });
});

/**
 * @desc Delete staff (soft delete)
 * @route DELETE /api/staff/:id
 */
const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findOne({
    where: { id: req.params.id },
  });

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  await staff.destroy();

  res.json({
    status: "success",
    message: "Staff deleted successfully",
  });
});

/**
 * @desc Toggle staff school access (block or release)
 * @route PATCH /api/staff/:id/toggle-access
 */
const toggleSchoolAccess = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findByPk(req.params.id);

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  // Toggle boolean
  staff.has_school_access = !staff.has_school_access;
  await staff.save();

  res.json({
    status: "success",
    message: `Staff account has been ${
      staff.has_school_access ? "released" : "blocked"
    } successfully`,
    data: {
      id: staff.id,
      full_name: staff.full_name,
      has_school_access: staff.has_school_access,
    },
  });
});

const toggleStaffStatus = asyncHandler(async (req, res) => {
  const staff = await SchoolStaff.findByPk(req.params.id);

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  // Toggle boolean
  staff.status = !staff.status;
  if (staff.status === true) {
    staff.has_school_access = true;
  } else {
    staff.has_school_access = false;
  }
  // staff.has_school_access = !staff.has_school_access;

  await staff.save();

  res.json({
    status: "success",
    message: `Staff status has been set to ${
      staff.status ? "Active" : "Inactive"
    } successfully`,
    data: {
      id: staff.id,
      full_name: staff.full_name,
      status: staff.status,
      has_school_access: staff.has_school_access,
    },
  });
});

const getAllStaffBySection = asyncHandler(async (req, res) => {
  const section_id = parseInt(req.params.id, 10);

  if (isNaN(section_id)) {
    return res.status(400).json({ message: "Invalid section id" });
  }

  const staffs = await SchoolStaff.findAll({
    attributes: ["id", "full_name", "section_ids"], // fetch only what you need
  });

  if (!staffs || staffs.length === 0) {
    return res.status(404).json({ message: "No staff found" });
  }

  // Filter based on section_ids column in the DB
  const filteredStaffs = staffs.filter((staff) => {
    if (!staff.section_ids) return false;

    // Convert "1,3,4,6" → [1, 3, 4, 6]
    const sectionsArray = staff.section_ids
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    return sectionsArray.includes(section_id);
  });

  return res.json({
    message: "Staff Information",
    data: filteredStaffs,
  });
});

/**
 * @desc Get staff assigned classes & subjects
 * @route GET /api/staff/:id/assignments
 */
const getStaffAssigned = asyncHandler(async (req, res) => {
  const staffId = parseInt(req.params.id, 10);

  if (isNaN(staffId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid staff ID",
    });
  }

  const staff = await SchoolStaff.findByPk(staffId, {
    attributes: ["id", "full_name", "email"],
  });

  if (!staff) {
    return res.status(404).json({
      status: "error",
      message: "Staff not found",
    });
  }

  const assignments = await ClassSubjectAssign.findAll({
    where: { school_staff_id: staffId },
    include: [
      {
        model: SchoolClass,
        as: "Class",
        attributes: ["id", "class_name"],
      },
      {
        model: SchoolSubject,
        as: "Subject",
        attributes: ["id", "subject_name"],
      },
    ],
  });

  // ✅ GROUP BY CLASS
  const groupedAssignments = assignments.reduce((acc, item) => {
    const classId = item.school_class_id;

    if (!acc[classId]) {
      acc[classId] = {
        class_id: item.Class.id,
        class_name: item.Class.class_name,
        subjects: [],
      };
    }

    acc[classId].subjects.push({
      id: item.Subject.id,
      subject_name: item.Subject.subject_name,
    });

    return acc;
  }, {});

  const groupedArray = Object.values(groupedAssignments);

  // ✅ SUMMARY
  const summary = {
    myClasses: groupedArray.length,
    myTotalSubjects: groupedArray.reduce(
      (total, cls) => total + cls.subjects.length,
      0,
    ),
  };

  return res.json({
    status: "success",
    data: {
      staff,
      summary,
      assignments: Object.values(groupedAssignments),
    },
  });
});

module.exports = {
  register,
  getAll,
  getById,
  update,
  delete: deleteStaff,
  getStaffProfile,
  toggleSchoolAccess,
  toggleStaffStatus,
  getAllStaffBySection,
  getStaffAssigned,
};
