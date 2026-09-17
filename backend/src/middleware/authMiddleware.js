const supabase = require("../config/supabase");

// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

const requireAuth = async (req, res, next) => {
  try {
    // --------------------------------------------------
    // 1. Get Authorization header
    // --------------------------------------------------

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Expected:
    // Authorization: Bearer eyJhbGciOi...

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use Bearer token.",
      });
    }

    // --------------------------------------------------
    // 2. Verify token with Supabase
    // --------------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // --------------------------------------------------
    // 3. Get profile and role
    // --------------------------------------------------

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile error:", profileError);

      return res.status(500).json({
        success: false,
        message: "Unable to load user profile",
      });
    }

    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "User profile not found",
      });
    }

    // --------------------------------------------------
    // 4. Attach authenticated user to request
    // --------------------------------------------------

    req.user = {
      id: user.id,
      email: user.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
    };

    // --------------------------------------------------
    // 5. Continue request
    // --------------------------------------------------

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// ======================================================
// ROLE AUTHORIZATION MIDDLEWARE
// ======================================================

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // User must first pass requireAuth

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check whether user's role is allowed

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
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