const BaseController = require("./baseController");
const { SchoolTerm, SchoolSession } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { where } = require("sequelize");

class SchoolTermController extends BaseController {
  constructor() {
    super(SchoolTerm, "SchoolTerm", []);
  }

  toggleStatus = asyncHandler(async (req, res) => {
    const record = await SchoolTerm.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: "error",
        message: "School Term not found",
      });
    }

    const newStatus = record.status === "active" ? "inactive" : "active";
    await record.update({ status: newStatus });

    res.json({
      status: "success",
      message: `Term status changed to ${newStatus}`,
      data: record,
    });
  });

  getSessionTerm = asyncHandler(async (req, res) => {
    const session = await SchoolSession.findOne({
      where: { status: "active" },
    });
    if (!session) {
      return res.status(404).json({
        message: "School Session not found",
      });
    }

    const terms = await SchoolTerm.findAll({
      where: { session_id: session.id },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    res.json({
      success: true,
      message: "Terms retrieved successfully",
      data: { session_name: session.session_name, terms },
    });
  });

  getAllTerms = asyncHandler(async (req, res) => {
    const session = await SchoolSession.findOne({
      where: { status: "active" },
    });

    if (!session) {
      return res.status(404).json({
        message: "School Session not found",
      });
    }

    const terms = await SchoolTerm.findAll({
      // where: { session_id: session.id },
      attributes: { exclude: ["updatedAt", "createdAt", "deletedAt"] },
    });

    // 🔁 Mapping term names to session fields
    const termMetaMap = {
      "First Term": {
        payment_mode: session.first_term_payment_mode,
        was_paid: session.first_term_was_paid,
        start: session.first_term_start,
        end: session.first_term_end,
      },
      "Second Term": {
        payment_mode: session.second_term_payment_mode,
        was_paid: session.second_term_was_paid,
        start: session.second_term_start,
        end: session.second_term_end,
      },
      "Third Term": {
        payment_mode: session.third_term_payment_mode,
        was_paid: session.third_term_was_paid,
        start: session.third_term_start,
        end: session.third_term_end,
      },
    };

    const enrichedTerms = terms.map((term) => {
      const meta = termMetaMap[term.term_name] || {};

      return {
        ...term.toJSON(),
        payment_mode: meta.payment_mode ?? null,
        was_paid: meta.was_paid ?? null,
        start_date: meta.start ?? null,
        end_date: meta.end ?? null,
      };
    });

    res.json({
      success: true,
      message: "Terms retrieved successfully",
      data: {
        session_name: session.session_name,
        terms: enrichedTerms,
      },
    });
  });

  getTermAndSession = asyncHandler(async (req, res) => {
    const session = await SchoolSession.findOne({
      where: { status: "active" },
    });
    if (!session) {
      return res.status(404).json({
        message: "School Session not found",
      });
    }

    const terms = await SchoolTerm.findOne({
      where: { status: "active" },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    res.json({
      success: true,
      message: "Terms retrieved successfully",
      data: { term: terms, session: session },
    });
  });

  getSearchableFields() {
    return ["term_name"];
  }
  updateTerm = asyncHandler(async (req, res) => {
    const staff = await SchoolTerm.findOne({
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
    await staff.update(updateData);

    res.json({
      message: "successfully",
      data: updateData,
    });
  });

  activateTerm = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the term to activate
    const term = await SchoolTerm.findByPk(id);
    if (!term) {
      return res.status(404).json({ message: "School Term not found" });
    }

    // Deactivate all terms
    await SchoolTerm.update({ status: "inactive" }, { where: {} });

    // Activate the selected term
    await term.update({ status: "active" });

    res.json({ message: "School Term activated successfully" });
  });
}

module.exports = new SchoolTermController();
