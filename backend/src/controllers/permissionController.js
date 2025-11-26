const BaseController = require("./baseController");
const { Permission } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

class PermissionController extends BaseController {
  constructor() {
    super(Permission, "Permission");
  }

  // Custom method without pagination
  getAllPermissions = asyncHandler(async (req, res) => {
    const { search = "", ...filters } = req.query;
    const whereClause = this.buildWhereClause(req, filters, search);

    const permissions = await this.model.findAll({
      where: whereClause,
      include: this.includes,
      // order: ["DESC"],
    });

    res.json({
      status: "success",
      data: {
        permissions,
      },
    });
  });
}

module.exports = new PermissionController();
