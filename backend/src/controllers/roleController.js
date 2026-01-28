const { Role } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

/**
 * @desc Get all roles
 * @route GET /api/roles
 */
const getAllRoles = asyncHandler(async (req, res) => {
  const allRoles = await Role.findAll({});

  res.json({
    success: true,
    message: "Roles retrieved successfully",
    data: allRoles,
  });
});

/**
 * @desc Get a single role by ID
 * @route GET /api/role/:id
 */
const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findByPk(id, {});

  if (!role) {
    return res.status(404).json({
      success: false,
      message: "Role not found",
      error: "ROLE_NOT_FOUND",
    });
  }

  res.json({
    success: true,
    message: "Role retrieved successfully",
    data: role,
  });
});

/**
 * @desc Create a role
 * @route POST /api/role
 */
const createRole = asyncHandler(async (req, res) => {
  const { role_name } = req.body;

  // Validate payload
  if (!role_name) {
    return res.status(400).json({
      success: false,
      message: "Role name is required",
      error: "ROLE_NAME_REQUIRED",
    });
  }

  // Check if role already exists
  const existingRole = await Role.findOne({ where: { role_name } });
  if (existingRole) {
    return res.status(400).json({
      success: false,
      message: "Role name already exists",
      error: "ROLE_EXISTS",
    });
  }

  // Create role
  const newRole = await Role.create({ role_name, description });

  // Return the newly created role
  const createdRole = await Role.findByPk(newRole.id);

  res.status(201).json({
    success: true,
    message: "Role created successfully",
    data: createdRole,
  });
});

/**
 * @desc Update a role
 * @route PUT /api/role/:id
 */
const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role_name, description } = req.body;

  const role = await Role.findByPk(id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: "Role not found",
      error: "ROLE_NOT_FOUND",
    });
  }

  // Check for duplicate role_name
  if (role_name && role_name !== role.role_name) {
    const existingRole = await Role.findOne({
      where: { role_name, id: { [Op.ne]: id } },
    });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role name already in use",
        error: "ROLE_EXISTS",
      });
    }
  }

  // Update role info
  await role.update({
    role_name: role_name || role.role_name,
    description: description || role.description,
  });

  // Update role permissions if provided - REMOVED
  // Permission functionality has been removed

  // Fetch updated role
  const updatedRole = await Role.findByPk(id);

  res.json({
    success: true,
    message: "Role updated successfully",
    data: updatedRole,
  });
});

/**
 * @desc Delete a role
 * @route DELETE /api/role/:id
 */
const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findByPk(id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: "Role not found",
      error: "ROLE_NOT_FOUND",
    });
  }

  await role.destroy();

  res.json({
    success: true,
    message: "Role deleted successfully",
  });
});

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
