const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();


// ======================================================
// GET ALL PATIENTS
// GET /api/patients
// ======================================================

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


// ======================================================
// GET SINGLE PATIENT
// GET /api/patients/:id
// ======================================================

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


// ======================================================
// CREATE PATIENT
// POST /api/patients
// ======================================================

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


// ======================================================
// UPDATE PATIENT
// PUT /api/patients/:id
// ======================================================

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
        message:
          error?.message || "Patient not found",
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


// ======================================================
// DELETE PATIENT
// DELETE /api/patients/:id
// ======================================================

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