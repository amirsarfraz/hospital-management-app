const {
  supabase,
} = require("../config/supabase");

async function requireAuth(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Authorization token required",
      });
    }

    const [type, token] =
      authHeader.split(" ");

    if (
      type !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        message:
          "Invalid authorization format",
      });
    }

    // Verify Supabase access token
    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.getUser(
        token
      );

    if (
      authError ||
      !authData?.user
    ) {
      console.error(
        "Supabase auth error:",
        authError
      );

      return res.status(401).json({
        message:
          "Authentication failed",
      });
    }

    const authUser =
      authData.user;

    // Get application profile + role
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        `
        id,
        first_name,
        last_name,
        role,
        created_at,
        updated_at
        `
      )
      .eq("id", authUser.id)
      .single();

    if (
      profileError ||
      !profile
    ) {
      console.error(
        "Profile lookup error:",
        profileError
      );

      return res.status(404).json({
        message:
          "User profile not found",
      });
    }

    const fullName = [
      profile.first_name,
      profile.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    // This is YOUR application user
    req.user = {
      id: profile.id,
      name: fullName,
      first_name:
        profile.first_name,
      last_name:
        profile.last_name,
      email:
        authUser.email || "",
      role: profile.role,
      created_at:
        profile.created_at,
      updated_at:
        profile.updated_at,
    };

    next();
  } catch (error) {
    console.error(
      "Auth middleware error:",
      error
    );

    return res.status(500).json({
      message:
        "Authentication failed",
    });
  }
}

module.exports = {
  requireAuth,
};