const BaseController = require("./baseController");
const { SchoolTerm, SchoolSession } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");
const { where, Op } = require("sequelize");

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
        session_id: session.id,
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
    const termId = Number(req.params.id);

    // 🔒 Only allow fixed term IDs
    const VALID_TERMS = [1, 2, 3];
    if (!VALID_TERMS.includes(termId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid school term",
      });
    }

    // 1️⃣ Get the term
    const term = await SchoolTerm.findByPk(termId);
    if (!term) {
      return res.status(404).json({
        success: false,
        message: "School Term not found",
      });
    }

    // 2️⃣ Count sessions
    const sessionCount = await SchoolSession.count();
    if (sessionCount === 0) {
      return res.status(400).json({
        success: false,
        message: "No school session found",
      });
    }

    // 3️⃣ Get current (active) session
    const currentSession = await SchoolSession.findOne({
      where: { status: "active" },
      order: [["createdAt", "DESC"]],
    });

    if (!currentSession) {
      return res.status(400).json({
        success: false,
        message: "No active school session found",
      });
    }

    // 4️⃣ Get previous session (the one before current active session)
    const previousSession = await SchoolSession.findOne({
      where: {
        id: { [Op.ne]: currentSession.id }, // Exclude current session
      },
      order: [["createdAt", "DESC"]],
    });

    // 5️⃣ Enforce payment rules
    switch (termId) {
      case 1:
        // Check current session's first term payment mode
        if (currentSession.first_term_payment_mode === "free") {
          // Free mode - allow activation
          break;
        }

        // Paid mode - check if previous session's third term was paid
        if (
          sessionCount > 1 &&
          previousSession &&
          previousSession.third_term_payment_mode === "paid" &&
          !previousSession.third_term_was_paid
        ) {
          return res.status(400).json({
            success: false,
            message:
              "You must pay the previous session's third term before activating the first term.",
          });
        }
        break;

      case 2:
        // Check current session's second term payment mode
        if (currentSession.second_term_payment_mode === "free") {
          // Free mode - allow activation
          break;
        }

        // Paid mode - check if first term was paid
        if (
          currentSession.first_term_payment_mode === "paid" &&
          !currentSession.first_term_was_paid
        ) {
          return res.status(400).json({
            success: false,
            message:
              "You must pay the current session's first term before activating the second term.",
          });
        }
        break;

      case 3:
        // Check current session's third term payment mode
        if (currentSession.third_term_payment_mode === "free") {
          // Free mode - allow activation
          break;
        }

        // Paid mode - check if second term was paid
        if (
          currentSession.second_term_payment_mode === "paid" &&
          !currentSession.second_term_was_paid
        ) {
          return res.status(400).json({
            success: false,
            message:
              "You must pay the current session's second term before activating the third term.",
          });
        }
        break;
    }

    // 6️⃣ Deactivate all terms
    await SchoolTerm.update({ status: "inactive" }, { where: {} });

    // 7️⃣ Activate selected term
    await term.update({ status: "active" });

    return res.status(200).json({
      success: true,
      message: "School Term activated successfully",
    });
  });

}

module.exports = new SchoolTermController();
