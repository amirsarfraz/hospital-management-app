const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();


// ======================================================
// 1. GET ALL DOCTORS
// GET /api/doctors
// ======================================================

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


// ======================================================
// 2. GET SINGLE DOCTOR
// GET /api/doctors/:id
// Example: GET /api/doctors/1
// ======================================================

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


// ======================================================
// 3. CREATE DOCTOR
// POST /api/doctors
// ======================================================

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

    // Basic validation
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


// ======================================================
// 4. UPDATE DOCTOR
// PUT /api/doctors/:id
// Example: PUT /api/doctors/1
// ======================================================

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


// ======================================================
// 5. DELETE DOCTOR
// DELETE /api/doctors/:id
// Example: DELETE /api/doctors/1
// ======================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First check whether doctor exists
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