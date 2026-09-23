const express =
  require("express");

const router =
  express.Router();

const {
  requireAuth,
} = require(
  "../middleware/authMiddleware"
);

const authorizeRoles =
  require(
    "../middleware/authorizeRoles"
  );

const {
  getUsers,
  updateUserRole,
} = require(
  "../controllers/adminUserController"
);

// Every admin user API requires login
router.use(requireAuth);

// Every admin user API requires admin role
router.use(
  authorizeRoles("admin")
);

// GET /api/admin/users
router.get(
  "/",
  getUsers
);

// PATCH /api/admin/users/:id/role
router.patch(
  "/:id/role",
  updateUserRole
);

module.exports = router;