const BaseController = require("./baseController");
const { SchoolSession, SchoolTerm, sequelize } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { Op } = require("sequelize");

class SchoolSessionController extends BaseController {
  constructor() {
    super(SchoolSession, "SchoolSession", []);
  }

  cleanDate = (value) => {
    if (!value || value === "Invalid date") return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  getAllSession = asyncHandler(async (req, res) => {
    const allSession = await SchoolSession.findAll({
      attributes: ["id", "session_name"],
    });

    res.json({
      success: true,
      message: "Sessions retrieved successfully",
      data: allSession,
    });
  });

  createSession = asyncHandler(async (req, res) => {
    const {
      session_name,
      status = "inactive",
      payment_status = "unpaid",
      first_term_start,
      first_term_end,
      second_term_start,
      second_term_end,
      third_term_start,
      third_term_end,
    } = req.body;

    const existingSession = await SchoolSession.findOne({
      where: { session_name },
    });
    if (existingSession) {
      return res.status(400).json({
        message: "School Session already exist",
      });
    }

    const newSession = await SchoolSession.create({
      session_name,
      status,
      payment_status,
      first_term_start: this.cleanDate(first_term_start),
      first_term_end: this.cleanDate(first_term_end),
      second_term_start: this.cleanDate(second_term_start),
      second_term_end: this.cleanDate(second_term_end),
      third_term_start: this.cleanDate(third_term_start),
      third_term_end: this.cleanDate(third_term_end),
    });

    res.status(201).json({
      success: true,
      message: "School Session created successfully",
      data: { createdSession: newSession },
    });
  });

  activateSession = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const session = await SchoolSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ message: "School Session not found" });
    }

    // Optional: use transaction to ensure atomic update
    const updatedSession = await sequelize.transaction(async (t) => {
      await SchoolSession.update(
        { status: "inactive" },
        { where: { id: { [Op.not]: id } }, transaction: t }
      );

      return await session.update({ status: "active" }, { transaction: t });
    });

    res.json({
      success: true,
      message: "School Session activated successfully",
      data: updatedSession,
    });
  });

  getActiveSession = asyncHandler(async (req, res) => {
    const record = await SchoolSession.findOne({
      where: { id: req.user.id, status: "active" },
      // include: [{ model: SchoolTerm, as: "Terms" }],
    });

    if (!record) {
      return res.status(404).json({
        status: "error",
        message: "No active session found",
      });
    }

    res.json({ status: "success", data: record });
  });

  getSearchableFields() {
    return ["session_name"];
  }
}

module.exports = new SchoolSessionController();
