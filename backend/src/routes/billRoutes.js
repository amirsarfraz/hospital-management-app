const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Billing management APIs
 */

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: Get all bills
 *     tags:
 *       - Billing
 *     responses:
 *       200:
 *         description: List of all bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bills")
      .select(`
        bill_number,
        patient_id,
        total_amount,
        payment_status,
        date_issued,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        )
      `)
      .order("date_issued", {
        ascending: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get bills error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   get:
 *     summary: Get bill by bill number
 *     tags:
 *       - Billing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bill number
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Bill details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("bills")
      .select(`
        bill_number,
        patient_id,
        total_amount,
        payment_status,
        date_issued,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        )
      `)
      .eq("bill_number", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get bill error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/bills:
 *   post:
 *     summary: Create a new bill
 *     tags:
 *       - Billing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - total_amount
 *               - payment_status
 *               - date_issued
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               total_amount:
 *                 type: number
 *                 example: 8500
 *               payment_status:
 *                 type: string
 *                 enum:
 *                   - paid
 *                   - unpaid
 *                 example: unpaid
 *               date_issued:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *     responses:
 *       201:
 *         description: Bill created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      total_amount,
      payment_status,
      date_issued,
    } = req.body;

    if (
      !patient_id ||
      total_amount === undefined ||
      !payment_status ||
      !date_issued
    ) {
      return res.status(400).json({
        message:
          "Patient, total amount, payment status and date issued are required",
      });
    }

    if (Number(total_amount) < 0) {
      return res.status(400).json({
        message: "Total amount cannot be negative",
      });
    }

    const validStatuses = ["paid", "unpaid"];

    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const {
      data: patient,
      error: patientError,
    } = await supabase
      .from("patients")
      .select("patient_id")
      .eq("patient_id", patient_id)
      .maybeSingle();

    if (patientError) {
      return res.status(500).json({
        message: patientError.message,
      });
    }

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const { data, error } = await supabase
      .from("bills")
      .insert([
        {
          patient_id: Number(patient_id),
          total_amount: Number(total_amount),
          payment_status,
          date_issued,
        },
      ])
      .select(`
        bill_number,
        patient_id,
        total_amount,
        payment_status,
        date_issued,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Bill created successfully",
      bill: data,
    });
  } catch (error) {
    console.error("Create bill error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   put:
 *     summary: Update a bill
 *     tags:
 *       - Billing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - total_amount
 *               - payment_status
 *               - date_issued
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               total_amount:
 *                 type: number
 *                 example: 9500
 *               payment_status:
 *                 type: string
 *                 enum:
 *                   - paid
 *                   - unpaid
 *                 example: paid
 *               date_issued:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *     responses:
 *       200:
 *         description: Bill updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Bill or patient not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      total_amount,
      payment_status,
      date_issued,
    } = req.body;

    if (
      !patient_id ||
      total_amount === undefined ||
      !payment_status ||
      !date_issued
    ) {
      return res.status(400).json({
        message:
          "Patient, total amount, payment status and date issued are required",
      });
    }

    if (Number(total_amount) < 0) {
      return res.status(400).json({
        message: "Total amount cannot be negative",
      });
    }

    const validStatuses = ["paid", "unpaid"];

    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const {
      data: existingBill,
      error: billFindError,
    } = await supabase
      .from("bills")
      .select("bill_number")
      .eq("bill_number", id)
      .maybeSingle();

    if (billFindError) {
      return res.status(500).json({
        message: billFindError.message,
      });
    }

    if (!existingBill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    const {
      data: patient,
      error: patientError,
    } = await supabase
      .from("patients")
      .select("patient_id")
      .eq("patient_id", patient_id)
      .maybeSingle();

    if (patientError) {
      return res.status(500).json({
        message: patientError.message,
      });
    }

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const { data, error } = await supabase
      .from("bills")
      .update({
        patient_id: Number(patient_id),
        total_amount: Number(total_amount),
        payment_status,
        date_issued,
      })
      .eq("bill_number", id)
      .select(`
        bill_number,
        patient_id,
        total_amount,
        payment_status,
        date_issued,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Bill updated successfully",
      bill: data,
    });
  } catch (error) {
    console.error("Update bill error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   delete:
 *     summary: Delete a bill
 *     tags:
 *       - Billing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bill number
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Bill deleted successfully
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      data: bill,
      error: findError,
    } = await supabase
      .from("bills")
      .select("bill_number")
      .eq("bill_number", id)
      .maybeSingle();

    if (findError) {
      return res.status(500).json({
        message: findError.message,
      });
    }

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    const { error } = await supabase
      .from("bills")
      .delete()
      .eq("bill_number", id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Bill deleted successfully",
    });
  } catch (error) {
    console.error("Delete bill error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;