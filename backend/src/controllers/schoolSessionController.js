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

  // createSession = asyncHandler(async (req, res) => {
  //   const {
  //     session_name,
  //     status = "inactive",
  //     // payment_status= "unpaind",
  //     first_term_start,
  //     first_term_end,
  //     second_term_start,
  //     second_term_end,
  //     third_term_start,
  //     third_term_end,
  //     first_term_payment_mode = "paid",
  //     second_term_payment_mode = "paid",
  //     third_term_payment_mode = "paid",
  //     first_term_was_paid = false,
  //     second_term_was_paid = false,
  //     third_term_was_paid = false,
  //   } = req.body;

  //   const existingSession = await SchoolSession.findOne({
  //     where: { session_name },
  //   });
  //   if (existingSession) {
  //     return res.status(400).json({
  //       message: "School Session already exist",
  //     });
  //   }

  //   const newSession = await SchoolSession.create({
  //     session_name,
  //     status,
  //     // payment_status,
  //     first_term_start: this.cleanDate(first_term_start),
  //     first_term_end: this.cleanDate(first_term_end),
  //     second_term_start: this.cleanDate(second_term_start),
  //     second_term_end: this.cleanDate(second_term_end),
  //     third_term_start: this.cleanDate(third_term_start),
  //     third_term_end: this.cleanDate(third_term_end),
  //     first_term_payment_mode,
  //     second_term_payment_mode,
  //     third_term_payment_mode,
  //     first_term_was_paid,
  //     second_term_was_paid,
  //     third_term_was_paid,
  //   });

  //   res.status(201).json({
  //     success: true,
  //     message: "School Session created successfully",
  //     data: { createdSession: newSession },
  //   });
  // });

  // Override the update method to handle date fields properly

  createSession = asyncHandler(async (req, res) => {
    const {
      session_name,
      status = "inactive",
      first_term_start,
      first_term_end,
      second_term_start,
      second_term_end,
      third_term_start,
      third_term_end,
      first_term_payment_mode = "paid",
      second_term_payment_mode = "paid",
      third_term_payment_mode = "paid",
      first_term_was_paid = false,
      second_term_was_paid = false,
      third_term_was_paid = false,
    } = req.body;

    // 🔒 Check last session payment status
    const lastSession = await SchoolSession.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (lastSession) {
      const hasUnpaidTerm =
        !lastSession.first_term_was_paid ||
        !lastSession.second_term_was_paid ||
        !lastSession.third_term_was_paid;

      if (hasUnpaidTerm) {
        return res.status(400).json({
          success: false,
          message:
            "You have an unpaid school session. Please complete all term payments before creating a new session.",
          data: {
            session_name: lastSession.session_name,
            unpaid_terms: {
              first_term: !lastSession.first_term_was_paid,
              second_term: !lastSession.second_term_was_paid,
              third_term: !lastSession.third_term_was_paid,
            },
          },
        });
      }
    }

    // 🔒 Prevent duplicate session names
    const existingSession = await SchoolSession.findOne({
      where: { session_name },
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "School Session already exists",
      });
    }

    // ✅ Create new session
    const newSession = await SchoolSession.create({
      session_name,
      status,
      first_term_start: this.cleanDate(first_term_start),
      first_term_end: this.cleanDate(first_term_end),
      second_term_start: this.cleanDate(second_term_start),
      second_term_end: this.cleanDate(second_term_end),
      third_term_start: this.cleanDate(third_term_start),
      third_term_end: this.cleanDate(third_term_end),
      first_term_payment_mode,
      second_term_payment_mode,
      third_term_payment_mode,
      first_term_was_paid,
      second_term_was_paid,
      third_term_was_paid,
    });

    res.status(201).json({
      success: true,
      message: "School Session created successfully",
      data: { createdSession: newSession },
    });
  });

  update = asyncHandler(async (req, res) => {
    const record = await SchoolSession.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: "error",
        message: "SchoolSession not found",
      });
    }

    // Validate required fields
    if (!req.body.session_name) {
      return res.status(400).json({
        status: "error",
        message: "Session name is required",
      });
    }

    // Check for duplicates (excluding current record)
    const duplicateCheck = await this.checkDuplicate(req.body, req.params.id);
    if (duplicateCheck) {
      return res.status(409).json({
        status: "error",
        message: "SchoolSession already exists",
        details: duplicateCheck,
      });
    }

    // Prepare update data with cleaned dates
    const updateData = {
      session_name: req.body.session_name,
      status: req.body.status || record.status,
      payment_status: req.body.payment_status || record.payment_status,
      first_term_start: this.cleanDate(req.body.first_term_start),
      first_term_end: this.cleanDate(req.body.first_term_end),
      second_term_start: this.cleanDate(req.body.second_term_start),
      second_term_end: this.cleanDate(req.body.second_term_end),
      third_term_start: this.cleanDate(req.body.third_term_start),
      third_term_end: this.cleanDate(req.body.third_term_end),
    };

    await record.update(updateData);

    const updatedRecord = await SchoolSession.findByPk(record.id, {
      include: this.includes,
    });

    res.json({
      status: "success",
      message: "SchoolSession updated successfully",
      data: updatedRecord,
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
        { where: { id: { [Op.not]: id } }, transaction: t },
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
