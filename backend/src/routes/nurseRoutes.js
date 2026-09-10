const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Nurses
 *   description: Nurse management APIs
 */

/**
 * @swagger
 * /api/nurses:
 *   get:
 *     summary: Get all nurses
 *     tags:
 *       - Nurses
 *     responses:
 *       200:
 *         description: List of all nurses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nurse'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("nurses")
      .select(`
        nurse_id,
        first_name,
        last_name,
        shift_timing,
        contact_number,
        department_id,
        created_at,
        departments (
          department_id,
          name
        )
      `)
      .order("nurse_id", { ascending: true });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get nurses error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/nurses/{id}:
 *   get:
 *     summary: Get nurse by ID
 *     tags:
 *       - Nurses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Nurse ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Nurse details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nurse'
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("nurses")
      .select(`
        nurse_id,
        first_name,
        last_name,
        shift_timing,
        contact_number,
        department_id,
        created_at,
        departments (
          department_id,
          name
        )
      `)
      .eq("nurse_id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Nurse not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get nurse error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/nurses:
 *   post:
 *     summary: Create a new nurse
 *     tags:
 *       - Nurses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - shift_timing
 *               - department_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Fatima
 *               last_name:
 *                 type: string
 *                 example: Ali
 *               shift_timing:
 *                 type: string
 *                 enum:
 *                   - Morning
 *                   - Evening
 *                   - Night
 *                 example: Morning
 *               contact_number:
 *                 type: string
 *                 example: "03001234567"
 *               department_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Nurse created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      shift_timing,
      contact_number,
      department_id,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !shift_timing ||
      !department_id
    ) {
      return res.status(400).json({
        message:
          "First name, last name, shift timing and department are required",
      });
    }

    const { data, error } = await supabase
      .from("nurses")
      .insert([
        {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          shift_timing,
          contact_number: contact_number?.trim() || null,
          department_id: Number(department_id),
        },
      ])
      .select(`
        nurse_id,
        first_name,
        last_name,
        shift_timing,
        contact_number,
        department_id,
        created_at,
        departments (
          department_id,
          name
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Nurse created successfully",
      nurse: data,
    });
  } catch (error) {
    console.error("Create nurse error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/nurses/{id}:
 *   put:
 *     summary: Update a nurse
 *     tags:
 *       - Nurses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Nurse ID
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
 *               - first_name
 *               - last_name
 *               - shift_timing
 *               - department_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Fatima
 *               last_name:
 *                 type: string
 *                 example: Khan
 *               shift_timing:
 *                 type: string
 *                 enum:
 *                   - Morning
 *                   - Evening
 *                   - Night
 *                 example: Night
 *               contact_number:
 *                 type: string
 *                 example: "03009999999"
 *               department_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Nurse updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      first_name,
      last_name,
      shift_timing,
      contact_number,
      department_id,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !shift_timing ||
      !department_id
    ) {
      return res.status(400).json({
        message:
          "First name, last name, shift timing and department are required",
      });
    }

    const { data, error } = await supabase
      .from("nurses")
      .update({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        shift_timing,
        contact_number: contact_number?.trim() || null,
        department_id: Number(department_id),
      })
      .eq("nurse_id", id)
      .select(`
        nurse_id,
        first_name,
        last_name,
        shift_timing,
        contact_number,
        department_id,
        created_at,
        departments (
          department_id,
          name
        )
      `)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: error?.message || "Nurse not found",
      });
    }

    res.status(200).json({
      message: "Nurse updated successfully",
      nurse: data,
    });
  } catch (error) {
    console.error("Update nurse error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/nurses/{id}:
 *   delete:
 *     summary: Delete a nurse
 *     tags:
 *       - Nurses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Nurse ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Nurse deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nurse deleted successfully
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: nurse, error: findError } = await supabase
      .from("nurses")
      .select("nurse_id")
      .eq("nurse_id", id)
      .maybeSingle();

    if (findError) {
      return res.status(500).json({
        message: findError.message,
      });
    }

    if (!nurse) {
      return res.status(404).json({
        message: "Nurse not found",
      });
    }

    const { error } = await supabase
      .from("nurses")
      .delete()
      .eq("nurse_id", id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Nurse deleted successfully",
    });
  } catch (error) {
    console.error("Delete nurse error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;