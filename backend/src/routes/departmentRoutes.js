const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*");

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        message: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("CAUSE:", error.cause);

    res.status(500).json({
      message: error.message,
      cause: error.cause?.message || "Unknown error",
    });
  }
});

module.exports = router;