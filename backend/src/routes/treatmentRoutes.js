const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Treatments
 *   description: Treatment management APIs
 */

/**
 * @swagger
 * /api/treatments:
 *   get:
 *     summary: Get all treatments
 *     tags:
 *       - Treatments
 *     responses:
 *       200:
 *         description: List of all treatments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Treatment'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("treatments")
      .select(`
        treatment_id,
        patient_id,
        doctor_id,
        treatment_date,
        diagnosis,
        medication,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        ),

        doctors (
          doctor_id,
          first_name,
          last_name,
          specialization,
          department_id,
          departments (
            department_id,
            name
          )
        )
      `)
      .order("treatment_date", {
        ascending: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get treatments error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/treatments/{id}:
 *   get:
 *     summary: Get treatment by ID
 *     tags:
 *       - Treatments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Treatment ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Treatment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Treatment'
 *       404:
 *         description: Treatment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("treatments")
      .select(`
        treatment_id,
        patient_id,
        doctor_id,
        treatment_date,
        diagnosis,
        medication,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        ),

        doctors (
          doctor_id,
          first_name,
          last_name,
          specialization,
          department_id,
          departments (
            department_id,
            name
          )
        )
      `)
      .eq("treatment_id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Treatment not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get treatment error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/treatments:
 *   post:
 *     summary: Create a new treatment
 *     tags:
 *       - Treatments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - treatment_date
 *               - diagnosis
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               doctor_id:
 *                 type: integer
 *                 example: 1
 *               treatment_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *               diagnosis:
 *                 type: string
 *                 example: High blood pressure
 *               medication:
 *                 type: string
 *                 nullable: true
 *                 example: Amlodipine 5mg once daily
 *     responses:
 *       201:
 *         description: Treatment created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient or doctor not found
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      treatment_date,
      diagnosis,
      medication,
    } = req.body;

    if (
      !patient_id ||
      !doctor_id ||
      !treatment_date ||
      !diagnosis
    ) {
      return res.status(400).json({
        message:
          "Patient, doctor, treatment date and diagnosis are required",
      });
    }

    // Check patient
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

    // Check doctor
    const {
      data: doctor,
      error: doctorError,
    } = await supabase
      .from("doctors")
      .select("doctor_id")
      .eq("doctor_id", doctor_id)
      .maybeSingle();

    if (doctorError) {
      return res.status(500).json({
        message: doctorError.message,
      });
    }

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const { data, error } = await supabase
      .from("treatments")
      .insert([
        {
          patient_id: Number(patient_id),
          doctor_id: Number(doctor_id),
          treatment_date,
          diagnosis: diagnosis.trim(),
          medication:
            medication?.trim() || null,
        },
      ])
      .select(`
        treatment_id,
        patient_id,
        doctor_id,
        treatment_date,
        diagnosis,
        medication,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        ),

        doctors (
          doctor_id,
          first_name,
          last_name,
          specialization,
          department_id,
          departments (
            department_id,
            name
          )
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Treatment created successfully",
      treatment: data,
    });
  } catch (error) {
    console.error(
      "Create treatment error:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/treatments/{id}:
 *   put:
 *     summary: Update a treatment
 *     tags:
 *       - Treatments
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
 *               - doctor_id
 *               - treatment_date
 *               - diagnosis
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               doctor_id:
 *                 type: integer
 *                 example: 2
 *               treatment_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *               diagnosis:
 *                 type: string
 *                 example: Hypertension
 *               medication:
 *                 type: string
 *                 nullable: true
 *                 example: Amlodipine 10mg
 *     responses:
 *       200:
 *         description: Treatment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Treatment, patient or doctor not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      doctor_id,
      treatment_date,
      diagnosis,
      medication,
    } = req.body;

    if (
      !patient_id ||
      !doctor_id ||
      !treatment_date ||
      !diagnosis
    ) {
      return res.status(400).json({
        message:
          "Patient, doctor, treatment date and diagnosis are required",
      });
    }

    const {
      data: existingTreatment,
      error: treatmentFindError,
    } = await supabase
      .from("treatments")
      .select("treatment_id")
      .eq("treatment_id", id)
      .maybeSingle();

    if (treatmentFindError) {
      return res.status(500).json({
        message: treatmentFindError.message,
      });
    }

    if (!existingTreatment) {
      return res.status(404).json({
        message: "Treatment not found",
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

    const {
      data: doctor,
      error: doctorError,
    } = await supabase
      .from("doctors")
      .select("doctor_id")
      .eq("doctor_id", doctor_id)
      .maybeSingle();

    if (doctorError) {
      return res.status(500).json({
        message: doctorError.message,
      });
    }

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const { data, error } = await supabase
      .from("treatments")
      .update({
        patient_id: Number(patient_id),
        doctor_id: Number(doctor_id),
        treatment_date,
        diagnosis: diagnosis.trim(),
        medication:
          medication?.trim() || null,
      })
      .eq("treatment_id", id)
      .select(`
        treatment_id,
        patient_id,
        doctor_id,
        treatment_date,
        diagnosis,
        medication,
        created_at,

        patients (
          patient_id,
          first_name,
          last_name,
          phone_number
        ),

        doctors (
          doctor_id,
          first_name,
          last_name,
          specialization,
          department_id,
          departments (
            department_id,
            name
          )
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Treatment updated successfully",
      treatment: data,
    });
  } catch (error) {
    console.error(
      "Update treatment error:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/treatments/{id}:
 *   delete:
 *     summary: Delete a treatment
 *     tags:
 *       - Treatments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Treatment ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Treatment deleted successfully
 *       404:
 *         description: Treatment not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      data: treatment,
      error: findError,
    } = await supabase
      .from("treatments")
      .select("treatment_id")
      .eq("treatment_id", id)
      .maybeSingle();

    if (findError) {
      return res.status(500).json({
        message: findError.message,
      });
    }

    if (!treatment) {
      return res.status(404).json({
        message: "Treatment not found",
      });
    }

    const { error } = await supabase
      .from("treatments")
      .delete()
      .eq("treatment_id", id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Treatment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete treatment error:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;