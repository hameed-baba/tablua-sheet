const {
  SchoolStudent,
  SchoolSession,
  SchoolTerm,
  SchoolInvoice,
} = require("../models");

// ============================
// CREATE INVOICE
// ============================
const createSchoolInvoice = async (req, res) => {
  try {
    const { school_session_id, school_term_id } = req.body;

    if (!school_session_id || !school_term_id) {
      return res.status(400).json({
        success: false,
        message: "school_session_id and school_term_id are required",
      });
    }

    const session = await SchoolSession.findByPk(school_session_id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "School session not found",
      });
    }

    const term = await SchoolTerm.findByPk(school_term_id);
    if (!term) {
      return res.status(404).json({
        success: false,
        message: "School term not found",
      });
    }

    const existingInvoice = await SchoolInvoice.findOne({
      where: { school_session_id, school_term_id },
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists for this session and term",
      });
    }

    const totalActiveStudents = await SchoolStudent.count({
      where: { student_status: "active" },
    });

    const amountToPay = totalActiveStudents * 200;

    const invoice = await SchoolInvoice.create({
      school_session_id,
      school_term_id,
      total_students: totalActiveStudents,
      amount_to_pay: amountToPay,
      amount_to_paid: 0,
      status: "unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "School invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================
// GET ALL INVOICES
// ============================
const getAllSchoolInvoices = async (req, res) => {
  try {
    const invoices = await SchoolInvoice.findAll({
      include: [
        {
          model: SchoolSession,
          as: "Session",
          attributes: ["id", "session_name"],
        },
        { model: SchoolTerm, as: "Term", attributes: ["id", "term_name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Invoices retrieved successfully",
      data: invoices,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// ============================
// GET INVOICE BY ID
// ============================
const getSchoolInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await SchoolInvoice.findByPk(id, {
      include: [
        { model: SchoolSession, attributes: ["id", "session_name"] },
        { model: SchoolTerm, attributes: ["id", "term_name"] },
      ],
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice retrieved successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================
// UPDATE INVOICE

const updateSchoolInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find invoice
    const invoice = await SchoolInvoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // 2. Count active students
    const totalActiveStudents = await SchoolStudent.count({
      where: {
        student_status: "active",
      },
    });

    // 3. Recalculate amount
    const newAmountToPay = totalActiveStudents * 200;

    // 4. Update invoice (status untouched)
    await invoice.update({
      total_students: totalActiveStudents,
      amount_to_pay: newAmountToPay,
    });

    // 5. Return response
    return res.status(200).json({
      success: true,
      message: "Invoice recalculated successfully",
      data: {
        id: invoice.id,
        school_session_id: invoice.school_session_id,
        school_term_id: invoice.school_term_id,
        total_students: invoice.total_students,
        amount_to_pay: invoice.amount_to_pay,
        amount_to_paid: invoice.amount_to_paid,
        status: invoice.status, // remains unchanged
      },
    });
  } catch (error) {
    console.error("Update invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================
// DELETE INVOICE
// ============================
const deleteSchoolInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await SchoolInvoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    await invoice.destroy();

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createSchoolInvoice,
  getAllSchoolInvoices,
  getSchoolInvoiceById,
  updateSchoolInvoice,
  deleteSchoolInvoice,
};
