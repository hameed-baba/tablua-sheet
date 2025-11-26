const { RolePermission, Role, Permission } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc Assign permission to role
 * @route POST /api/role-permissions
 */
const assignPermission = asyncHandler(async (req, res) => {
  const { role_id, permissionId } = req.body;

  const existing = await RolePermission.findOne({
    where: { role_id, permissionId }
  });

  if (existing) {
    return res.status(400).json({
      status: 'error',
      message: 'Permission already assigned to this role'
    });
  }

  const record = await RolePermission.create({
    role_id,
    permissionId,
  });

  res.status(201).json({
    status: 'success',
    message: 'Permission assigned to role successfully',
    data: record
  });
});

/**
 * @desc Get role permissions
 * @route GET /api/role-permissions/:role_id
 */
const getRolePermissions = asyncHandler(async (req, res) => {
  const records = await RolePermission.findAll({
    where: { role_id: req.params.role_id },
    include: [
      { model: Role, as: 'Role', attributes: ['id', 'role_name'] },
      { model: Permission, as: 'Permission', attributes: ['id', 'permission_name'] }
    ]
  });

  // if (!records.length) {
  //   return res.json({ status: 'success', data: null });
  // }

    if (!records.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Role not found'
    });
  }


  const role = {
    id: records[0].Role.id,
    role_name: records[0].Role.role_name,
    permissions: records.map(r => r.Permission)
  };

  res.json({
    status: 'success',
    data: role
  });
});


/**
 * @desc Remove permission from role
 * @route DELETE /api/role-permissions/:role_id/:permissionId
 */
const removePermission = asyncHandler(async (req, res) => {
  const { role_id, permissionId } = req.params;

  const record = await RolePermission.findOne({
    where: { role_id, permissionId }
  });

  if (!record) {
    return res.status(404).json({
      status: 'error',
      message: 'Role permission assignment not found'
    });
  }

  await record.destroy();

  res.json({
    status: 'success',
    message: 'Permission removed from role successfully'
  });
});

module.exports = {
  assignPermission,
  getRolePermissions,
  removePermission,
};