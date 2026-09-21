const supabase = require("../config/supabase");

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "User is not authenticated",
        });
      }

      const { data: userProfile, error } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("id", req.user.id)
        .single();

      if (error || !userProfile) {
        return res.status(404).json({
          message: "User profile not found",
        });
      }

      if (!allowedRoles.includes(userProfile.role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource",
        });
      }

      req.userProfile = userProfile;

      next();
    } catch (error) {
      console.error("Role authorization error:", error);

      return res.status(500).json({
        message: "Authorization failed",
      });
    }
  };
};

module.exports = authorizeRoles;