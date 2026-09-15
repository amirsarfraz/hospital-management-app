const supabase = require("../config/supabase");

// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

const requireAuth = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    // Expected:
    // Authorization: Bearer eyJhbGciOi...
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization format. Use Bearer token.",
      });
    }

    // Verify token with Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // Get profile + role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile error:", profileError);

      return res.status(500).json({
        message: "Unable to load user profile",
      });
    }

    if (!profile) {
      return res.status(403).json({
        message: "User profile not found",
      });
    }

    // Attach authenticated user to request
    req.user = {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      role: profile.role,
    };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

// ======================================================
// ROLE AUTHORIZATION MIDDLEWARE
// ======================================================

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};