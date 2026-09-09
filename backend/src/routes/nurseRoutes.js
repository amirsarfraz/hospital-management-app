const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();


// ======================================================
// 1. GET ALL NURSES
// GET /api/nurses
// ======================================================

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


// ======================================================
// 2. GET SINGLE NURSE
// GET /api/nurses/:id
// ======================================================

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


// ======================================================
// 3. CREATE NURSE
// POST /api/nurses
// ======================================================

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


// ======================================================
// 4. UPDATE NURSE
// PUT /api/nurses/:id
// ======================================================

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


// ======================================================
// 5. DELETE NURSE
// DELETE /api/nurses/:id
// ======================================================

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