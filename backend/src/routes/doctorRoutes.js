const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management APIs
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: List of all doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select(`
        doctor_id,
        first_name,
        last_name,
        specialization,
        years_experience,
        contact_number,
        department_id,
        departments (
          department_id,
          name
        )
      `)
      .order("doctor_id", { ascending: true });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get doctors error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags:
 *       - Doctors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Doctor ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Doctor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("doctors")
      .select(`
        doctor_id,
        first_name,
        last_name,
        specialization,
        years_experience,
        contact_number,
        department_id,
        departments (
          department_id,
          name
        )
      `)
      .eq("doctor_id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get doctor error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags:
 *       - Doctors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - specialization
 *               - department_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Ahmed
 *               last_name:
 *                 type: string
 *                 example: Khan
 *               specialization:
 *                 type: string
 *                 example: Cardiologist
 *               years_experience:
 *                 type: integer
 *                 example: 8
 *               contact_number:
 *                 type: string
 *                 example: "03001111111"
 *               department_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Doctor created successfully
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
      specialization,
      years_experience,
      contact_number,
      department_id,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !specialization ||
      !department_id
    ) {
      return res.status(400).json({
        message:
          "First name, last name, specialization and department are required",
      });
    }

    if (
      years_experience !== undefined &&
      Number(years_experience) < 0
    ) {
      return res.status(400).json({
        message: "Years of experience cannot be negative",
      });
    }

    const { data, error } = await supabase
      .from("doctors")
      .insert([
        {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          specialization: specialization.trim(),
          years_experience: Number(years_experience || 0),
          contact_number: contact_number?.trim() || null,
          department_id: Number(department_id),
        },
      ])
      .select(`
        doctor_id,
        first_name,
        last_name,
        specialization,
        years_experience,
        contact_number,
        department_id,
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
      message: "Doctor created successfully",
      doctor: data,
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Update a doctor
 *     tags:
 *       - Doctors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Doctor ID
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
 *               - specialization
 *               - department_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Ahmed
 *               last_name:
 *                 type: string
 *                 example: Khan
 *               specialization:
 *                 type: string
 *                 example: Senior Cardiologist
 *               years_experience:
 *                 type: integer
 *                 example: 10
 *               contact_number:
 *                 type: string
 *                 example: "03001111111"
 *               department_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      first_name,
      last_name,
      specialization,
      years_experience,
      contact_number,
      department_id,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !specialization ||
      !department_id
    ) {
      return res.status(400).json({
        message:
          "First name, last name, specialization and department are required",
      });
    }

    if (
      years_experience !== undefined &&
      Number(years_experience) < 0
    ) {
      return res.status(400).json({
        message: "Years of experience cannot be negative",
      });
    }

    const { data, error } = await supabase
      .from("doctors")
      .update({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        specialization: specialization.trim(),
        years_experience: Number(years_experience || 0),
        contact_number: contact_number?.trim() || null,
        department_id: Number(department_id),
      })
      .eq("doctor_id", id)
      .select(`
        doctor_id,
        first_name,
        last_name,
        specialization,
        years_experience,
        contact_number,
        department_id,
        departments (
          department_id,
          name
        )
      `)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: error?.message || "Doctor not found",
      });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: data,
    });
  } catch (error) {
    console.error("Update doctor error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     tags:
 *       - Doctors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Doctor ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: doctor, error: findError } = await supabase
      .from("doctors")
      .select("doctor_id")
      .eq("doctor_id", id)
      .maybeSingle();

    if (findError) {
      return res.status(500).json({
        message: findError.message,
      });
    }

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const { error } = await supabase
      .from("doctors")
      .delete()
      .eq("doctor_id", id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Delete doctor error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;