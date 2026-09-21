const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getUsers,
  updateUserRole,
} = require("../controllers/adminUserController");

router.use(requireAuth);
router.use(authorizeRoles("admin"));

router.get("/", getUsers);

router.patch("/:id/role", updateUserRole);

module.exports = router;