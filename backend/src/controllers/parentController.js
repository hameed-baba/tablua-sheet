const BaseController = require("./baseController");
const { Parent } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

class ParentController extends BaseController {
  constructor() {
    super(Parent, "Parent", []);
  }

  createParent = asyncHandler(async (req, res) => {
    const {
      full_name,
      phone_number,
      gender,
      religion,
      address,
      state,
      local_gov,
    } = req.body;

    // Optional: check if phone number already exists
    const existingParent = await Parent.findOne({
      where: { phone_number },
    });

    if (existingParent) {
      return res.status(400).json({
        message: "Parent with this phone number already exists",
      });
    }

    const newParent = await Parent.create({
      full_name,
      phone_number,
      gender,
      religion,
      address,
      state,
      local_gov,
    });

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      data: newParent,
    });
  });

  updateParent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
      full_name,
      phone_number,
      gender,
      religion,
      address,
      state,
      local_gov,
    } = req.body;

    const parent = await Parent.findByPk(id);

    if (!parent) {
      return res.status(404).json({
        message: "Parent not found",
      });
    }

    // Optional: Check if new phone number belongs to someone else
    if (phone_number) {
      const phoneExists = await Parent.findOne({
        where: {
          phone_number,
          id: { [Op.ne]: id }, // exclude current record
        },
      });

      if (phoneExists) {
        return res.status(400).json({
          message: "Another parent already uses this phone number",
        });
      }
    }

    await parent.update({
      full_name,
      phone_number,
      gender,
      religion,
      address,
      state,
      local_gov,
    });

    res.status(200).json({
      success: true,
      message: "Parent updated successfully",
      data: parent,
    });
  });

  getSearchableFields() {
    return ["full_name", "phone_number", "address", "state", "local_gov"];
  }
}

module.exports = new ParentController();
