const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management APIs
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("patient_id", { ascending: true });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get patients error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Patient details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get patient error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a new patient
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - date_of_birth
 *               - gender
 *               - phone_number
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Ali
 *               last_name:
 *                 type: string
 *                 example: Hassan
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1994-05-10"
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *                   - Other
 *                 example: Male
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: Lahore, Pakistan
 *               phone_number:
 *                 type: string
 *                 example: "03001234567"
 *     responses:
 *       201:
 *         description: Patient created successfully
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
      date_of_birth,
      gender,
      address,
      phone_number,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !date_of_birth ||
      !gender ||
      !phone_number
    ) {
      return res.status(400).json({
        message:
          "First name, last name, date of birth, gender and phone number are required",
      });
    }

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          date_of_birth,
          gender,
          address: address?.trim() || null,
          phone_number: phone_number.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Patient created successfully",
      patient: data,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update a patient
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
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
 *               - date_of_birth
 *               - gender
 *               - phone_number
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Ali
 *               last_name:
 *                 type: string
 *                 example: Hassan
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1994-05-10"
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *                   - Other
 *                 example: Male
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: Islamabad, Pakistan
 *               phone_number:
 *                 type: string
 *                 example: "03009999999"
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      address,
      phone_number,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !date_of_birth ||
      !gender ||
      !phone_number
    ) {
      return res.status(400).json({
        message:
          "First name, last name, date of birth, gender and phone number are required",
      });
    }

    const { data, error } = await supabase
      .from("patients")
      .update({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        date_of_birth,
        gender,
        address: address?.trim() || null,
        phone_number: phone_number.trim(),
      })
      .eq("patient_id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: error?.message || "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient: data,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: patient, error: findError } =
      await supabase
        .from("patients")
        .select("patient_id")
        .eq("patient_id", id)
        .maybeSingle();

    if (findError) {
      return res.status(500).json({
        message: findError.message,
      });
    }

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("patient_id", id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;