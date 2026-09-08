const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();


// 1. GET ALL DEPARTMENTS
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("department_id", { ascending: true });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


// 2. GET SINGLE DEPARTMENT
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("department_id", id)
      .single();

    if (error) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


// 3. CREATE DEPARTMENT
router.post("/", async (req, res) => {
  try {
    const { name, location, contact_phone } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Name and location are required",
      });
    }

    const { data, error } = await supabase
      .from("departments")
      .insert([
        {
          name,
          location,
          contact_phone,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


// 4. UPDATE DEPARTMENT
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, location, contact_phone } = req.body;

    const { data, error } = await supabase
      .from("departments")
      .update({
        name,
        location,
        contact_phone,
      })
      .eq("department_id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


// 5. DELETE DEPARTMENT
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("department_id", id);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;