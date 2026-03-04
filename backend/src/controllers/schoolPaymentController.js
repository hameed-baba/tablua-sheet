const {
  SchoolStudent,
  SchoolSession,
  SchoolTerm,
  SchoolInvoice,
  SchoolPayment,
  sequelize,
} = require("../models");
const { generateGatewayRef } = require("../utils/generateGatewayRef");

const createSchoolPayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      invoice_id,
      amount_paid: amount_paid_raw,
      payment_method = "offline",
      gateway = "offline",
      description,
      term_id,
    } = req.body;

    // Convert amount_paid to number
    const amount_paid = parseFloat(amount_paid_raw);

    if (!invoice_id || !amount_paid_raw) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "invoice_id and amount_paid are required",
      });
    }

    if (isNaN(amount_paid) || amount_paid <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "amount_paid must be a valid number greater than zero",
      });
    }

    const invoice = await SchoolInvoice.findByPk(invoice_id, { transaction });

    if (!invoice) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const remainingAmount = invoice.amount_to_pay - invoice.amount_to_paid;

    if (amount_paid > remainingAmount) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Payment exceeds remaining amount. Remaining: ${remainingAmount}`,
      });
    }

    // Create payment
    const payment = await SchoolPayment.create(
      {
        invoice_id,
        amount_paid,
        getway: gateway,
        getway_ref: generateGatewayRef(),
        payment_method,
        payment_status: "success",
        description,
      },
      { transaction },
    );

    // Update invoice amount_to_paid and status
    const updatedAmountPaid = parseFloat(invoice.amount_to_paid) + amount_paid;
    const remainingBalance = invoice.amount_to_pay - updatedAmountPaid;
    
    let status;
    if (remainingBalance === 0) {
      status = "paid";
    } else if (updatedAmountPaid > 0) {
      status = "overdue";
    } else {
      status = "unpaid";
    }
    
    await invoice.update(
      {
        amount_to_paid: updatedAmountPaid,
        status: status,
      },
      { transaction },
    );

    // If balance is 0, update SchoolSession term payment status
    if (remainingBalance === 0) {
      // Use term_id from request or fall back to invoice.school_term_id
      const termToUpdate = term_id || invoice.school_term_id;
      
      console.log('Checking session update:', {
        remainingBalance,
        termToUpdate,
        school_session_id: invoice.school_session_id
      });
      
      if (termToUpdate) {
        const session = await SchoolSession.findByPk(invoice.school_session_id, {
          transaction,
        });

        console.log('Session found:', session ? 'Yes' : 'No');

        if (session) {
          const updateData = {};
          const termIdNum = parseInt(termToUpdate);
          
          console.log('Term ID number:', termIdNum);
          
          if (termIdNum === 1) {
            updateData.first_term_was_paid = true;
          } else if (termIdNum === 2) {
            updateData.second_term_was_paid = true;
          } else if (termIdNum === 3) {
            updateData.third_term_was_paid = true;
          }

          console.log('Update data:', updateData);

          if (Object.keys(updateData).length > 0) {
            await session.update(updateData, { transaction });
            console.log('Session updated successfully');
          }
        }
      }
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: {
        payment,
        invoice,
        remaining_balance: remainingBalance,
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllSchoolPayments = async (req, res) => {
  try {
    const payments = await SchoolPayment.findAll({
      include: [
        {
          model: SchoolInvoice,
          attributes: [
            "id",
            "amount_to_pay",
            "amount_to_paid",
            "school_session_id",
            "school_term_id",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSchoolPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await SchoolPayment.findByPk(id, {
      include: [SchoolInvoice],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPaymentsByInvoiceId = async (req, res) => {
  try {
    const { invoice_id } = req.params;

    const payments = await SchoolPayment.findAll({
      where: { invoice_id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSchoolPayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const payment = await SchoolPayment.findByPk(id, { transaction });

    if (!payment) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const invoice = await SchoolInvoice.findByPk(payment.invoice_id, {
      transaction,
    });

    // rollback amount
    await invoice.update(
      {
        amount_to_paid: invoice.amount_to_paid - payment.amount_paid,
      },
      { transaction },
    );

    await payment.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  createSchoolPayment,
  getAllSchoolPayments,
  getSchoolPaymentById,
  getPaymentsByInvoiceId,
  deleteSchoolPayment,
};
