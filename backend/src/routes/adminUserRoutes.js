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
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
} = require(
  "../controllers/adminUserController"
);

// Every route requires authentication
router.use(requireAuth);

// Every route requires admin role
router.use(
  authorizeRoles("admin")
);

// GET /api/admin/users
router.get(
  "/",
  getUsers
);

// GET /api/admin/users/:id
router.get(
  "/:id",
  getUserById
);

// POST /api/admin/users
router.post(
  "/",
  createUser
);

// PATCH /api/admin/users/:id/role
// Keep this BEFORE /:id for clarity.
router.patch(
  "/:id/role",
  updateUserRole
);

// PATCH /api/admin/users/:id
router.patch(
  "/:id",
  updateUser
);

// DELETE /api/admin/users/:id
router.delete(
  "/:id",
  deleteUser
);

module.exports = router;