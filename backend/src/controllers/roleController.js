const { Role, Permission } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * @desc Get all roles
 * @route GET /api/roles
 */
const getAllRoles = asyncHandler(async (req, res) => {
  const allRoles = await Role.findAll({
    include: [{
      model: Permission,
      as: "permissions",
      attributes: ["id", "permission_name"],
      through: { attributes: [] },
    }],
  });

  res.json({
    success: true,
    message: "Roles retrieved successfully",
    data: allRoles,
  });
});

/**
 * @desc Get a single role by ID (with permissions)
 * @route GET /api/role/:id
 */
const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findByPk(id, {
    include: [{
      model: Permission,
      as: "permissions",
      attributes: ["id", "permission_name"],
      through: { attributes: [] },
    }],
  });

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
 * @desc Create a role with permissions
 * @route POST /api/role
 */
const createRole = asyncHandler(async (req, res) => {
  const { role_name, description, permissions } = req.body;

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

  // Assign permissions if provided
  if (Array.isArray(permissions) && permissions.length > 0) {
    const validPermissions = await Permission.findAll({
      where: { id: permissions },
    });
    await newRole.setPermissions(validPermissions);
  }

  // Return the newly created role with permissions
  const createdRole = await Role.findByPk(newRole.id, {
    include: [{
      model: Permission,
      as: "permissions",
      attributes: ["id", "permission_name"],
      through: { attributes: [] },
    }],
  });

  res.status(201).json({
    success: true,
    message: "Role created successfully",
    data: createdRole,
  });
});

/**
 * @desc Update a role and its permissions
 * @route PUT /api/role/:id
 */
const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role_name, description, permissions } = req.body;

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

  // Update role permissions if provided
  if (Array.isArray(permissions)) {
    const validPermissions = await Permission.findAll({
      where: { id: permissions },
    });
    await role.setPermissions(validPermissions);
  }

  // Fetch updated role
  const updatedRole = await Role.findByPk(id, {
    include: [{
      model: Permission,
      as: "permissions",
      attributes: ["id", "permission_name"],
      through: { attributes: [] },
    }],
  });

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