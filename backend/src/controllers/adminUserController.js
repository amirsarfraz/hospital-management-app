const supabase = require("../config/supabase");

const getUsers = async (req, res) => {
  try {
    const { search = "", role = "" } = req.query;

    let query = supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .order("created_at", {
        ascending: false,
      });

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({
      users: data,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "admin",
      "manager",
      "user",
      "guest",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (req.user.id === id && role !== "admin") {
      return res.status(400).json({
        message: "You cannot remove your own admin role",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        role,
      })
      .eq("id", id)
      .select("id, name, email, role")
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: "User role updated successfully",
      user: data,
    });
  } catch (error) {
    console.error("Update role error:", error);

    return res.status(500).json({
      message: "Failed to update role",
    });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
};