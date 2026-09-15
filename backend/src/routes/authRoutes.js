const express = require("express");

const {
  requireAuth,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// GET CURRENT LOGGED-IN USER
// GET /api/auth/me
// ======================================================

router.get("/me", requireAuth, async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;